import { toastContainer } from "./dom.ts";

/**
 * Displays a non-blocking toast notification.
 * @param {string} message 
 * @param {'success' | 'error'} type 
 */
export function toast(message: string, type: "success" | "error" = "success"): void {
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.textContent = message;

  toastContainer.appendChild(el);

  // Auto-remove after animation
  setTimeout(() => {
    el.classList.add("removing");
    setTimeout(() => el.remove(), 400);
  }, 3000);
}
