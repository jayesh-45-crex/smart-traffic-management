/* Shared API client. Uses same-origin endpoints when the bundled server is used. */
(function () {
  const configured = (localStorage.getItem("nagpurAI_apiBase") || "").replace(/\/$/, "");

  async function request(path, options = {}) {
    const response = await fetch(`${configured}${path}`, {
      ...options,
      headers: { "Accept": "application/json", ...(options.headers || {}) }
    });
    if (!response.ok) throw new Error(`API ${response.status}`);
    return response.json();
  }

  window.NagpurAPI = {
    base: configured,
    health: () => request("/api/health"),
    summary: () => request("/api/traffic/summary"),
    analyze: () => request("/api/ai/analyze"),
    junctions: () => request("/api/junctions")
  };
})();
