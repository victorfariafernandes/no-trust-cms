import { apiFetch } from "./api";

export async function getPad(slug: string): Promise<string> {
  const res = await apiFetch(`/pads/${slug}`);
  if (res.status === 404) return "";
  if (!res.ok) throw new Error("failed to get pad");
  const { content } = (await res.json()) as { content: string };
  return content;
}

export async function setPad(slug: string, content: string): Promise<void> {
  const res = await apiFetch(`/pads/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (res.status === 429) throw new Error("rate limit exceeded");
  if (!res.ok) throw new Error("failed to save pad");
}
