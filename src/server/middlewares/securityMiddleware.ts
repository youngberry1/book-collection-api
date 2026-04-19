import { rateLimit } from 'express-rate-limit';

/**
 * General API Rate Limiter
 * Limits all requests to 100 per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per window
	standardHeaders: 'draft-7', // Use standard RateLimit headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
});

/**
 * Stricter Limiter for Destructive Operations
 * Limits DELETE and SEED requests to 5 per 15 minutes per IP.
 */
export const destructiveLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	message: {
        success: false,
        message: 'Calm down! You are deleting/resetting too many times. Please wait 15 minutes.'
    }
});
