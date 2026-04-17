import { Book } from "./types";
/**
 * Simple validation result interface.
 */
interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates book data before submission.
 * @param {Partial<Book>} data - The book data object.
 * @returns {ValidationResult}
 */
export function validateBook(data: Partial<Book>): ValidationResult {
  if (!data.title || data.title.length < 2) {
    return { valid: false, message: "Title must be at least 2 characters" };
  }

  if (!data.author || data.author.length < 2) {
    return { valid: false, message: "Author must be at least 2 characters" };
  }

  if (typeof data.pages !== 'number' || isNaN(data.pages) || data.pages <= 0) {
    return { valid: false, message: "Pages must be a positive number" };
  }

  if (typeof data.rating !== 'number' || isNaN(data.rating) || data.rating < 0 || data.rating > 10) {
    return { valid: false, message: "Rating must be between 0 and 10" };
  }

  if (!data.genres || data.genres.length === 0) {
    return { valid: false, message: "Add at least one genre" };
  }

  return { valid: true };
}
