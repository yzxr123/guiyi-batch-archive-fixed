import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const slug = (url.searchParams.get("slug") || "").trim();

  if (!slug) return json({ error: "missing slug" }, 400);

  // Site-wide store, persists across deploys when using Netlify Blobs.
  // Docs: https://docs.netlify.com/build/data-and-storage/netlify-blobs/
  const store = getStore({ name: "views", consistency: "strong" });

  const key = `p:${slug}`;
  const existing = await store.get(key);
  const current = Number(existing || 0);

  if (req.method === "POST") {
    const next = current + 1;
    await store.set(key, String(next));
    return json({ slug, views: next });
  }

  // GET: just read
  return json({ slug, views: current });
};
