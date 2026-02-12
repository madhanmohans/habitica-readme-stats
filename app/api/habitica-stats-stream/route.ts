import { getHabiticaStats } from "../../actions/habitica";

export const runtime = "nodejs";
// Prevent Next.js from statically optimizing this route
export const dynamic = "force-dynamic";

const POLL_INTERVAL_MS = 30_000; // Poll Habitica every 30 seconds

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const sendEvent = (event: string, data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          closed = true;
        }
      };

      const fetchAndSend = async () => {
        try {
          const stats = await getHabiticaStats();
          sendEvent("stats", stats);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          sendEvent("error", { message });
        }
      };

      // Send initial data immediately
      await fetchAndSend();

      // Then poll at regular intervals
      const interval = setInterval(async () => {
        if (closed) {
          clearInterval(interval);
          return;
        }
        await fetchAndSend();
      }, POLL_INTERVAL_MS);

      // Send a heartbeat every 15s to keep the connection alive
      const heartbeat = setInterval(() => {
        if (closed) {
          clearInterval(heartbeat);
          return;
        }
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          closed = true;
          clearInterval(heartbeat);
          clearInterval(interval);
        }
      }, 15_000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering in nginx/reverse proxies
    },
  });
}
