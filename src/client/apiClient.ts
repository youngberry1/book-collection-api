import type { ConfigResponse } from "./types.js";

/**
 * Syncs the frontend with the backend environment.
 * @returns {Promise<ConfigResponse>}
 */
export async function initializeApi(): Promise<ConfigResponse> {
    try {
        const response = await fetch('/config');
        
        if (response.ok) {
            const data: ConfigResponse = await response.json();
            return data;
        }
        throw new Error(`Server returned status: ${response.status}`);
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[API Client] Sync failed: ${message}. Using fallback.`);
    }

    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    
    // Relative /api is used locally to support Vite's dev proxy
    const fallbackUrl = isLocal 
        ? '/api' 
        : `${window.location.origin}/api`;

    return {
        apiUrl: fallbackUrl,
        isDev: isLocal
    };
}
