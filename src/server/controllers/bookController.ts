import { Request, Response, NextFunction } from "express";
import * as bookService from "../services/bookServices.js";

/**
 * @description Triggers the database seeding process.
 */
export const seedBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await bookService.seedDatabase();
        res.status(200).json({
            success: true,
            message: "Database synchronized with seed data",
            result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Retrieves all books from the database.
 */
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await bookService.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Retrieves a paginated list of books.
 */
export const getPaginatedBooks = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const pageNum = Number(page);
        const limitNum = Number(limit);

        if (pageNum < 1 || limitNum < 1 || isNaN(pageNum) || isNaN(limitNum)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination params. Must be positive integers."
            });
        }

        const result = await bookService.getBooksWithPagination(pageNum, limitNum);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Retrieves a specific book by its ID.
 */
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await bookService.getSpecificBook(req.params.id as string);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Creates a new book entry.
 */
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await bookService.createBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Partially updates an existing book (PATCH).
 */
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await bookService.updateBook(req.params.id as string, req.body);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Replaces an entire book document (PUT).
 */
export const replaceBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await bookService.replaceBook(req.params.id as string, req.body);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Deletes a book from the database.
 */
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await bookService.deleteBook(req.params.id as string);
        if (!result) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.status(200).json({ 
            success: true, 
            message: "Book deleted successfully", 
            deletedBook: result 
        });
    } catch (error) {
        next(error);
    }
};
