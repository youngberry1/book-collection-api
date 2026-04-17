import type { Book } from "./types.ts";
import { bookList, statusMsg } from "./dom.ts";

/**
 * Generates the HTML string for a single book card.
 * @param {Book} book 
 * @returns {string}
 */
export function renderBookCard(book: Book, index: number = 0): string {
  const reviewsCount = book.reviews?.length || 0;
  const delay = (index * 0.05).toFixed(2);
  
  return `
    <div class="book-card" data-id="${book._id}" style="animation-delay: ${delay}s">
      <div class="card-header">
        <div>
          <h3 class="book-title">${book.title}</h3>
          <p class="tag" style="margin-top: 6px;">by ${book.author}</p>
        </div>
        <div class="card-actions">
          <button class="btn btn-sm btn-accent edit-btn" data-id="${book._id}" title="Edit book">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${book._id}" title="Delete book">🗑️</button>
        </div>
      </div>
      
      <div class="book-meta">
        <span class="tag">📄 ${book.pages} pages</span>
        <span class="tag">⭐ ${book.rating}/10</span>
        <span class="tag">💬 ${reviewsCount} ${reviewsCount === 1 ? 'review' : 'reviews'}</span>
      </div>
      
      <div class="genres">
        ${book.genres.map(g => `<span class="genre-chip">${g}</span>`).join("")}
      </div>
      
      <div class="book-id">ID: ${book._id}</div>
    </div>
  `;
}

/** Toggles the loading status message. */
export function showStatus(show: boolean): void {
  statusMsg.classList.toggle("hidden", !show);
}

/** Displays an empty state message. */
export function showEmpty(): void {
  bookList.innerHTML = '<div class="empty-state">No books found in your collection.</div>';
}

/** Displays an error message in the list area. */
export function showError(msg: string): void {
  bookList.innerHTML = `<div class="error-state">Error: ${msg}</div>`;
}
