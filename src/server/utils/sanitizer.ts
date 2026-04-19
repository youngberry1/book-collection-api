/**
 * Basic HTML/Script Sanitizer
 * Strips HTML tags to prevent XSS attacks.
 */
export const sanitize = (str: string): string => {
    if (!str || typeof str !== 'string') return str;
    return str.replace(/<[^>]*>?/gm, ''); // Remove all HTML tags
};

/**
 * Sanitizes an entire object recursively
 */
export const sanitizeObject = <T>(obj: T): T => {
    if (typeof obj !== 'object' || obj === null) return obj;

    const sanitizedObj = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
        const val = obj[key];
        if (typeof val === 'string') {
            (sanitizedObj as Record<string, unknown>)[key] = sanitize(val);
        } else if (typeof val === 'object' && val !== null) {
            (sanitizedObj as Record<string, unknown>)[key] = sanitizeObject(val);
        } else {
            (sanitizedObj as Record<string, unknown>)[key] = val;
        }
    }
    
    return sanitizedObj as T;
};
