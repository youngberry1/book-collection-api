import { 
  deleteModal, confirmDelBtn, cancelDelBtn, modalMessage 
} from "./dom.ts";

let onConfirmCallback: (id: string) => Promise<void> = async () => {};
let currentDeleteId: string = "";

/**
 * Displays the delete confirmation modal.
 * @param {string} id - ID of the book to delete.
 * @param {string} title - Title of the book for the message.
 * @param {(id: string) => Promise<void>} onConfirm - Callback if confirmed.
 */
export function showDeleteModal(
  id: string, 
  title: string, 
  onConfirm: (id: string) => Promise<void>
): void {
  currentDeleteId = id;
  onConfirmCallback = onConfirm;
  
  modalMessage.textContent = `Are you sure you want to delete "${title}"?`;
  deleteModal.classList.remove("hidden");
}

/** Hides the delete modal. */
function hideModal(): void {
  deleteModal.classList.add("hidden");
}

// Event Listeners
cancelDelBtn.addEventListener("click", hideModal);

confirmDelBtn.addEventListener("click", async () => {
  await onConfirmCallback(currentDeleteId);
  hideModal();
});

// Close modal when clicking outside
deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) hideModal();
});
