import { apiFetch } from "./apiFetch";

export async function apiFetchUser() {
  try {
    const data = await apiFetch("/auth/me");
    console.log("data", data);
    return { error: null, user: data.loggedIn ? data.user : null };
  } catch (err) {
    return { error: err.message, user: null };
  }
}
