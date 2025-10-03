const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
  console.log("API_URL:", API_URL);
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    // handle HTTP errors
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const errData = await res.json();
        if (errData?.message) message = errData.message;
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(message);
    }

    // handle empty responses
    if (res.status === 204) {
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`API error [${endpoint}]:`, err);
    throw err;
  }
}
