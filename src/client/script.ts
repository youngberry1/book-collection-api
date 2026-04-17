import {
  bookList, btnViewAll, btnViewPaged, resetBtn,
  pagControls, pageInfo, pageNext, pagePrev,
} from "./dom.ts";

import { getAllBooks, getBooksWithPagination, deleteBook, seedBooks } from "./config.ts";
import { renderBookCard, showStatus, showEmpty, showError } from "./render.ts";
import { toast } from "./toast.ts";
import { showDeleteModal } from "./modal.ts";
import { initForm, enterEditMode, exitEditMode, getEditingId } from "./form.ts";
import { initSearch } from "./search.ts";
import type { PaginatedResponse } from "./types.ts";

// Dashboard State
let viewMode: "all" | "paginated" = "all";
let currentPage = 1;
const PAGE_LIMIT = 9;
let totalPages = 1;

/** 
 * Fetches and renders all books without pagination.
 */
async function loadAllBooks(): Promise<void> {
  showStatus(true);
  bookList.innerHTML = "";

  try {
    const books = await getAllBooks();
    showStatus(false);

    if (!books || books.length === 0) {
      showEmpty();
      return;
    }

    bookList.innerHTML = books.map(renderBookCard).join("");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    showStatus(false);
    showError(message);
    toast("Failed to load books", "error");
  }
}

/** 
 * Fetches and renders books for the current page.
 */
async function loadPaginatedBooks(): Promise<void> {
  showStatus(true);
  bookList.innerHTML = "";

  try {
    const res: PaginatedResponse = await getBooksWithPagination(currentPage, PAGE_LIMIT);
    showStatus(false);

    totalPages = res.totalPages || 1;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    pagePrev.disabled = currentPage <= 1;
    pageNext.disabled = currentPage >= totalPages;

    if (!res.data || res.data.length === 0) {
      showEmpty();
      return;
    }

    bookList.innerHTML = res.data.map(renderBookCard).join("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    showStatus(false);
    toast("Failed to load paginated books", "error");
  }
}

/** 
 * Re-fetches the current view's data.
 */
function refresh(): void {
  if (viewMode === "all") loadAllBooks();
  else loadPaginatedBooks();
}

// View Switching
btnViewAll.addEventListener("click", () => {
  viewMode = "all";
  btnViewAll.classList.add("active");
  btnViewPaged.classList.remove("active");
  pagControls.classList.add("hidden");
  loadAllBooks();
});

btnViewPaged.addEventListener("click", () => {
  viewMode = "paginated";
  currentPage = 1;
  btnViewPaged.classList.add("active");
  btnViewAll.classList.remove("active");
  pagControls.classList.remove("hidden");
  loadPaginatedBooks();
});

// Pagination Controls
pagePrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadPaginatedBooks();
  }
});

pageNext.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadPaginatedBooks();
  }
});

resetBtn.addEventListener("click", async () => {
  try {
    toast("Restoring original collection...", "success");
    await seedBooks();
    toast("Collection synchronized! ✨", "success");
    refresh();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    toast("Reset failed. Try again later.", "error");
  }
});

// Delegation: Edit & Delete
bookList.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;
  const editBtn = target.closest(".edit-btn") as HTMLElement | null;
  const deleteBtn = target.closest(".delete-btn") as HTMLElement | null;

  if (editBtn) {
    const id = editBtn.dataset.id;
    if (id) enterEditMode(id);
    return;
  }

  if (deleteBtn) {
    const card = deleteBtn.closest(".book-card") as HTMLElement | null;
    const title = card?.querySelector(".book-title")?.textContent || "this book";
    const id = deleteBtn.dataset.id;
    if (id) showDeleteModal(id, title, handleDelete);
  }
});

/** 
 * Orchestrates the deletion of a book and UI updates.
 */
async function handleDelete(id: string): Promise<void> {
  try {
    await deleteBook(id);
    toast("Book deleted 🗑️", "success");

    const card = document.querySelector(`.book-card[data-id="${id}"]`) as HTMLElement | null;
    if (card) {
      card.style.transition = "opacity 0.25s, transform 0.25s";
      card.style.opacity = "0";
      card.style.transform = "scale(0.9)";
      setTimeout(() => card.remove(), 280);
    }

    if (getEditingId() === id) exitEditMode();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    toast(`Delete failed: ${message}`, "error");
  }
}

// Global Boostrap
initForm(refresh);
initSearch();
loadAllBooks();