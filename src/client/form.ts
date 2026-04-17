import {
  bookForm, btnFormSubmit, btnFormCancel, formTitle,
  formInputs
} from "./dom.ts";
import { createBook, updateBook, getBookById } from "./config.ts";
import { validateBook } from "./validation.ts";
import { toast } from "./toast.ts";
import type { Book } from "./types.ts";

let onFormSuccess: () => void = () => { };
let editingId: string | null = null;

/**
 * Initializes form events and behavior.
 * @param {() => void} successCallback - Callback on successful submission.
 */
export function initForm(successCallback: () => void): void {
  onFormSuccess = successCallback;

  bookForm.addEventListener("submit", handleFormSubmit);
  btnFormCancel.addEventListener("click", exitEditMode);
}

/**
 * Handles the logic for creating or updating a book based on form state.
 */
async function handleFormSubmit(e: Event): Promise<void> {
  e.preventDefault();

  const data = {
    title: formInputs.title.value.trim(),
    author: formInputs.author.value.trim(),
    pages: parseInt(formInputs.pages.value),
    rating: parseInt(formInputs.rating.value),
    genres: formInputs.genres.value.split(",").map(g => g.trim()).filter(g => g),
    reviews: formInputs.reviews.value.trim() ? JSON.parse(formInputs.reviews.value) : []
  };

  const validation = validateBook(data);
  if (!validation.valid) {
    toast(validation.message || "Invalid data", "error");
    return;
  }

  try {
    if (editingId) {
      await updateBook(editingId, data);
      toast("Book updated successfully ✨", "success");
    } else {
      await createBook(data);
      toast("Book added to collection 📚", "success");
    }

    exitEditMode();
    onFormSuccess();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    toast(`Error: ${message}`, "error");
  }
}

/**
 * Pre-fills the form with existing book data and switches to Edit Mode.
 */
export async function enterEditMode(id: string): Promise<void> {
  try {
    const book: Book = await getBookById(id);
    editingId = id;

    formTitle.textContent = "Edit Book";
    btnFormSubmit.textContent = "Update Book";
    btnFormCancel.classList.remove("hidden");

    formInputs.title.value = book.title;
    formInputs.author.value = book.author;
    formInputs.pages.value = String(book.pages);
    formInputs.rating.value = String(book.rating);
    formInputs.genres.value = book.genres.join(", ");
    formInputs.reviews.value = book.reviews ? JSON.stringify(book.reviews) : "";

    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    toast("Failed to load book data", "error");
  }
}

/**
 * Clears form inputs and resets to 'Create' mode.
 */
export function exitEditMode(): void {
  editingId = null;
  formTitle.textContent = "Add New Book";
  btnFormSubmit.textContent = "Add Book";
  btnFormCancel.classList.add("hidden");
  bookForm.reset();
}

/** Returns the ID of the book currently being edited (if any). */
export const getEditingId = () => editingId;
