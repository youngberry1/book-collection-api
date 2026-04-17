/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";

/**
 * Global error handling middleware.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    // Mongoose Validation Errors
    if (typeof err === 'object' && err !== null && (err as any).name === 'ValidationError') {
        const error = err as any;
        const messages = Object.values(error.errors).map((val: any) => val.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            details: messages
        });
    }

    // Mongoose Cast Error (Invalid ID)
    if (typeof err === 'object' && err !== null && (err as any).name === 'CastError') {
        const error = err as any;
        return res.status(400).json({
            success: false,
            message: `Invalid ${error.path}: ${error.value}`
        });
    }

    // Default Error Handler
    const error = err as any;
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    console.error(`[Error] ${req.method} ${req.path}:`, err);

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
};

/**
 * 404 Route Not Found handler for API.
 */
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};
