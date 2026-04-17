import { searchInput, searchForm, bookList } from "./dom.ts";
import { getBookById } from "./config.ts";
import { renderBookCard, showStatus, showError } from "./render.ts";
import { toast } from "./toast.ts";

/**
 * Initializes the book search behavior.
 */
export function initSearch(): void {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSearch();
  });
}

/**
 * Triggers the API call to find a book by its unique ID.
 */
async function handleSearch(): Promise<void> {
  const id = searchInput.value.trim();
  if (!id) {
    toast("Please paste a book ID", "error");
    return;
  }

  showStatus(true);
  try {
    const book = await getBookById(id);
    showStatus(false);
    
    if (book) {
      bookList.innerHTML = renderBookCard(book);
      toast("Book found! 🔍", "success");
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Book not found";
    showStatus(false);
    showError(message);
    toast("Book not found", "error");
  }
}
