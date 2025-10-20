import { apiFetch } from "./apiFetch";

export async function apiLogout() {
  await apiFetch("/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
