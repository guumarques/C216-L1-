export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function emptyResponse(status = 204) {
  return new Response(null, { status });
}
