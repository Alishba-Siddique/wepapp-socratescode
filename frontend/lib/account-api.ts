export class AccountError extends Error {
  constructor(message: string, public retryAfter = 0, public code = "") { super(message); }
}
export async function accountRequest<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try { response = await fetch(`/api/${path}`, { method: body === undefined ? "GET" : "POST", credentials: "same-origin", headers: body === undefined ? undefined : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body), cache: "no-store", signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(18000)]) : AbortSignal.timeout(18000) }); }
  catch { throw new AccountError("Could not reach your account. Your current work remains open; try again when connected."); }
  const data = await response.json();
  if (!response.ok || data.errors?.length || data.error) {
    const retry = response.headers.get("retry-after");
    const seconds = retry ? (/^\d+$/.test(retry) ? Number(retry) : Math.max(0, Math.ceil((Date.parse(retry) - Date.now()) / 1000))) : 0;
    throw new AccountError(data.errors?.[0]?.message ?? data.message ?? data.error?.message ?? "Account request failed.", Number.isFinite(seconds) ? Math.min(seconds, 3600) : 0, data.errors?.[0]?.extensions?.code ?? "");
  }
  return data as T;
}
export type SavedProgress = { labSlug: string; labVersion: number; revision: number; state: string; updatedAt: string };
export const savedFields = "labSlug labVersion revision state updatedAt";
