/**
 * Utility to retrieve and cast DOM elements safely.
 */
function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el as T;
}

// Layout Elements
export const bookList        = getEl<HTMLElement>("book-list");
export const statusMsg       = getEl<HTMLElement>("status");
export const formTitle       = getEl<HTMLElement>("form-heading");
export const btnFormSubmit   = getEl<HTMLButtonElement>("form-submit-btn");
export const btnFormCancel   = getEl<HTMLButtonElement>("form-cancel-btn");

// View Toggle & Pagination
export const btnViewAll      = getEl<HTMLButtonElement>("btn-view-all");
export const btnViewPaged    = getEl<HTMLButtonElement>("btn-view-paginated");
export const resetBtn        = getEl<HTMLButtonElement>("btn-reset-db");
export const pagControls     = getEl<HTMLElement>("pagination-controls");
export const pageInfo        = getEl<HTMLElement>("page-info");
export const pagePrev        = getEl<HTMLButtonElement>("page-prev");
export const pageNext        = getEl<HTMLButtonElement>("page-next");

// Form Inputs
export const bookForm = getEl<HTMLFormElement>("book-form");

// Accessing form inputs by their IDs in the actual HTML
export const formInputs = {
  title:   getEl<HTMLInputElement>("form-title"),
  author:  getEl<HTMLInputElement>("form-author"),
  pages:   getEl<HTMLInputElement>("form-pages"),
  rating:  getEl<HTMLInputElement>("form-rating"),
  genres:  getEl<HTMLInputElement>("form-genres"),
  reviews: getEl<HTMLTextAreaElement>("form-reviews"),
};

// Search Elements
export const searchForm  = getEl<HTMLFormElement>("search-form");
export const searchInput = getEl<HTMLInputElement>("search-id");

// Modal Elements
export const deleteModal   = getEl<HTMLElement>("modal-overlay");
export const confirmDelBtn = getEl<HTMLButtonElement>("modal-confirm");
export const cancelDelBtn  = getEl<HTMLButtonElement>("modal-cancel");
export const modalMessage  = getEl<HTMLElement>("modal-text");

// Toast Notification
export const toastContainer = getEl<HTMLElement>("toast-container");
