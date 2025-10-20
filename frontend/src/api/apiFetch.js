const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_URL}/api/${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const errData = await res.json();
      if (errData?.message) message = errData.message;
    } catch {
      //ignore json errors
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  if (res.status === 204) {
    return { success: true, data: null };
  }
  return await res.json();
}
