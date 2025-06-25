export function isAdmin() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin-auth") === "true";
  }
  return false;
}
