import fs from 'fs/promises';
import path from 'path';
import Book, { IBook } from "../models/Book.js";

/**
 * @description Synchronizes the database with the local seed data.
 * Overwrites existing books with original seed data and adds missing ones.
 */
export const seedDatabase = async () => {
    const seedPath = path.resolve('data/books-seed.json');
    const rawData = await fs.readFile(seedPath, 'utf8');
    const seedBooks = JSON.parse(rawData);

    // Prepare bulk operations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ops = seedBooks.map((book: any) => {
        // Handle MongoDB extended JSON format ($oid) if present
        const id = book._id?.$oid || book._id;

        // Clean up the object for Mongoose
        const updateData = { ...book };
        delete updateData._id;

        // Clean up nested $oid fields (like in reviews)
        if (Array.isArray(updateData.reviews)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updateData.reviews = updateData.reviews.map((review: any) => {
                const cleanReview = { ...review };
                if (cleanReview._id) delete cleanReview._id;
                return cleanReview;
            });
        }

        return {
            updateOne: {
                filter: { _id: id },
                update: { $set: updateData },
                upsert: true
            }
        };
    });

    return await Book.bulkWrite(ops);
};

/**
 * @description Fetch all books without filtering.
 */
export const getAllBooks = async () => {
    return await Book.find();
};

/**
 * @description Fetch a paginated slice of the book collection.
 * @param {number} page 
 * @param {number} limit 
 */
export const getBooksWithPagination = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [data, totalBooks] = await Promise.all([
        Book.find().skip(skip).limit(limit),
        Book.countDocuments()
    ]);

    return {
        data,
        totalBooks,
        totalPages: Math.ceil(totalBooks / limit),
        currentPage: page
    };
};

/**
 * @description Find a single book by ID.
 */
export const getSpecificBook = async (id: string) => {
    return await Book.findById(id);
};

/**
 * @description Persist a new book to MongoDB.
 */
export const createBook = async (bookData: Partial<IBook>) => {
    const book = new Book(bookData);
    return await book.save();
};

/**
 * @description Partially update a book using $set (PATCH).
 */
export const updateBook = async (id: string, bookData: Partial<IBook>) => {
    return await Book.findByIdAndUpdate(id, bookData, { new: true, runValidators: true });
};

/**
 * @description Replace a book document entirely (PUT).
 */
export const replaceBook = async (id: string, bookData: IBook) => {
    return await Book.findOneAndReplace({ _id: id }, bookData, { new: true, runValidators: true });
};

/**
 * @description Delete a book document by ID.
 */
export const deleteBook = async (id: string) => {
    return await Book.findByIdAndDelete(id);
};
