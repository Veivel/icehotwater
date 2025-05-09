import { Request, Response, NextFunction } from 'express';
import { getCache, setCache } from '@src/shared/utils/redis';

export const cacheMiddleware = (duration = 3600) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Skip caching for non-GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Create a cache key based on the URL and any query parameters
        const cacheKey = `${req.originalUrl}`;

        try {
            // Try to get data from cache
            const cachedData = await getCache(cacheKey);

            if (cachedData) {
                // Return cached data if available
                const data = JSON.parse(cachedData);
                return res.status(200).json(data);
            }

            // Store the original send function
            const originalSend = res.send;

            // Override the send function to cache the response
            res.send = function(body): Response {
                // Only cache successful responses
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const responseBody = typeof body === 'string' ? body : JSON.stringify(body);
                    setCache(cacheKey, responseBody, duration);
                }
                // Call the original send function
                return originalSend.call(this, body);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

// Cache key generator utility function
export const generateCacheKey = (prefix: string, params: Record<string, any>): string => {
    const sortedParams = Object.keys(params)
        .sort()
        .reduce((result, key) => {
            result[key] = params[key];
            return result;
        }, {} as Record<string, any>);

    return `${prefix}:${JSON.stringify(sortedParams)}`;
};