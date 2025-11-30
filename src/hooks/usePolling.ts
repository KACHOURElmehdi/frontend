import { useEffect, useRef } from 'react';

interface UsePollingOptions {
    interval?: number;
    enabled?: boolean;
}

export function usePolling(callback: () => void, options: UsePollingOptions = {}) {
    const { interval = 3000, enabled = true } = options;
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const id = setInterval(() => {
            savedCallback.current();
        }, interval);

        return () => clearInterval(id);
    }, [interval, enabled]);
}
