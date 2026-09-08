export const dynamic = "force-dynamic";

export async function GET() {
  return new Response("fusepage placeholder", {
    headers: { "content-type": "text/plain" },
  });
}
