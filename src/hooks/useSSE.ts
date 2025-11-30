import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

interface UseSSEOptions {
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    enabled?: boolean;
    pollingInterval?: number;
}

export function useSSE(url: string, options: UseSSEOptions = {}) {
    const { token } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const retryCountRef = useRef(0);
    const eventSourceRef = useRef<EventSource | null>(null);
    const queryClient = useQueryClient();

    const connect = useCallback(() => {
        if (!options.enabled || !url || !token) {
            return;
        }

        const fullUrl = url.includes('?') ? `${url}&token=${token}` : `${url}?token=${token}`;

        // Close existing connection if any
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const eventSource = new EventSource(fullUrl);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            setIsConnected(true);
            retryCountRef.current = 0;
        };

        eventSource.onmessage = (event) => {
            if (options.onMessage) {
                options.onMessage(event);
            }
            // Invalidate queries on message to keep data fresh
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        };

        eventSource.onerror = (event) => {
            setIsConnected(false);
            eventSource.close();
            eventSourceRef.current = null;

            if (options.onError) {
                options.onError(event);
            }

            // Exponential backoff for reconnection
            const timeout = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
            retryCountRef.current += 1;

            reconnectTimeoutRef.current = setTimeout(() => {
                connect();
            }, timeout);
        };
    }, [url, token, options.enabled, options.onMessage, options.onError, queryClient]);

    useEffect(() => {
        if (options.enabled) {
            connect();
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect, options.enabled]);

    return { isConnected };
}

