import { initializeApi } from "./apiClient.js";
import type { Book, PaginatedResponse } from "./types.js";

/** 
 * API Initialization Block 
 * Re-runs on module load to ensure up-to-date config.
 */
const { apiUrl: BASE_URL } = await initializeApi();

/**
 * Generic fetch wrapper for API calls.
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const safeBaseUrl = BASE_URL.replace(/\/$/, "");
    const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${safeBaseUrl}${safeEndpoint}`.replace(/([^:]\/)\/+/g, "$1"); // Collapse double slashes except after http://
    
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
}

/** Get all books (unpaginated) */
export const getAllBooks = () => apiFetch<Book[]>("/all");

/** Get books with pagination */
export const getBooksWithPagination = (page: number, limit: number) =>
    apiFetch<PaginatedResponse>(`/?page=${page}&limit=${limit}`);

/** Get a single book by its ID */
export const getBookById = (id: string) => apiFetch<Book>(`/${id}`);

/** Create a new book */
export const createBook = (book: Partial<Book>) =>
    apiFetch<Book>("/", { method: "POST", body: JSON.stringify(book) });

/** Partially update a book (PATCH) */
export const updateBook = (id: string, book: Partial<Book>) =>
    apiFetch<Book>(`/${id}`, { method: "PATCH", body: JSON.stringify(book) });

/** Replace a book entirely (PUT) */
export const replaceBook = (id: string, book: Book) =>
    apiFetch<Book>(`/${id}`, { method: "PUT", body: JSON.stringify(book) });

/** Delete a book */
export const deleteBook = (id: string) =>
    apiFetch<void>(`/${id}`, { method: "DELETE" });

/** Restore data from seed file */
export const seedBooks = () =>
    apiFetch<{ success: boolean; message: string }>("/seed", { method: "POST" });