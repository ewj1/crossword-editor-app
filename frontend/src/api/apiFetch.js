const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BACKEND_URL}/api${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (res.status === 204) {
    return { success: true, data: null };
  }

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data?.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}
