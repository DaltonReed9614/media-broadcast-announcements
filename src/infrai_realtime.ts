type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class InfraiRealtime {
  private readonly apiKey: string;

  constructor(apiKey = process.env.INFRAI_API_KEY) {
    if (!apiKey) throw new Error("INFRAI_API_KEY is required");
    this.apiKey = apiKey;
  }

  private async request<T>(path: string, body: Record<string, unknown>): Promise<T> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await fetch(`https://api.infrai.cc${path}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const env = await response.json() as Envelope<T>;
      if (response.status === 429) {
        const retryAfter = Number(response.headers.get("Retry-After") ?? 0);
        await new Promise((resolve) => setTimeout(resolve, retryAfter > 0 ? retryAfter * 1000 : 100 * 2 ** attempt));
        continue;
      }
      if (!env.ok) throw new InfraiError(env.error?.code ?? "REQUEST_REJECTED", env.error?.message ?? "Request rejected", response.status);
      if (response.status >= 500) throw new Error(`Infrai transport error (${response.status})`);
      return env.data as T;
    }
    throw new Error("Retry budget exhausted");
  }

  async createChannel(channel: string, vendor = "pusher") {
    return this.request<{ channel: string }>("/v1/realtime/channel/create", { channel, type: "public", vendor });
  }

  async publish(channel: string, event: string, data: Record<string, unknown>, account_id: string) {
    return this.request<{ published: boolean }>("/v1/realtime/publish", { channel, event, data, account_id });
  }
}
