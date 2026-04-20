// Diagnostic: if /debug-fn returns "fn-ok" with 200, Pages Functions
// are deploying. If 404, Functions are not being built/deployed at all.
export function onRequest(context) {
  const url = new URL(context.request.url);
  return new Response(JSON.stringify({
    ok: true,
    path: url.pathname,
    ts: Date.now(),
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Fn': 'debug-fn',
    },
  });
}
