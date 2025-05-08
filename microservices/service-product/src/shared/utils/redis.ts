import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    retryStrategy: (times) => {
        // Retry connection with exponential backoff
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

// Log Redis connection status
redis.on('connect', () => {
    console.log('Redis client connected');
});

redis.on('error', (err) => {
    console.error('Redis client error:', err);
});

// Cache TTL in seconds
const DEFAULT_EXPIRATION = 3600; // 1 hour

// Functions for cache operations
export const getCache = async (key: string): Promise<string | null> => {
    return redis.get(key);
};

export const setCache = async (key: string, value: string, expiration = DEFAULT_EXPIRATION): Promise<void> => {
    await redis.set(key, value, 'EX', expiration);
};

export const deleteCache = async (key: string): Promise<void> => {
    await redis.del(key);
};

export const flushCache = async (): Promise<void> => {
    await redis.flushall();
};

export const deleteCacheByPattern = async (pattern: string): Promise<number> => {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        return redis.del(...keys);
    }
    return 0;
};

export default redis;