import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

export const useWebSocket = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const pingIntervalRef = useRef(null);

    const connect = useCallback(() => {
        // Use user.id (returned by auth API) not user._id
        if (!isAuthenticated || !user?.id) {
            console.log('[WebSocket] Not connecting - authenticated:', isAuthenticated, 'user.id:', user?.id);
            return;
        }

        // Close existing connection
        if (wsRef.current) {
            wsRef.current.close();
        }

        // Create WebSocket URL with userId - handle both ws:// and http:// prefixes
        let wsUrl = WS_URL;
        if (wsUrl.startsWith('http://')) {
            wsUrl = wsUrl.replace('http://', 'ws://');
        } else if (wsUrl.startsWith('https://')) {
            wsUrl = wsUrl.replace('https://', 'wss://');
        }

        const fullWsUrl = `${wsUrl}?userId=${user.id}`;
        console.log('[WebSocket] Connecting to:', fullWsUrl);

        const ws = new WebSocket(fullWsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('[WebSocket] Connected successfully');
            setIsConnected(true);

            // Start ping interval
            pingIntervalRef.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'PING' }));
                }
            }, 25000);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('[WebSocket] Received message:', data);

                // Ignore PONG messages
                if (data.type === 'PONG' || data.type === 'CONNECTED') {
                    return;
                }

                // Add notification
                const notification = {
                    id: Date.now(),
                    ...data,
                    read: false
                };
                console.log('[WebSocket] Adding notification:', notification);
                setNotifications((prev) => [notification, ...prev].slice(0, 50));
            } catch (error) {
                console.error('[WebSocket] Failed to parse message:', error);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);

            // Clear ping interval
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
            }

            // Attempt reconnection after 5 seconds
            if (isAuthenticated && user?.id) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    connect();
                }, 5000);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }, [isAuthenticated, user?.id]);

    // Connect when authenticated
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            connect();
        }

        return () => {
            // Cleanup on unmount
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
            }
        };
    }, [isAuthenticated, user?.id, connect]);

    // Disconnect when logged out
    useEffect(() => {
        if (!isAuthenticated && wsRef.current) {
            wsRef.current.close();
            setNotifications([]);
        }
    }, [isAuthenticated]);

    const markAsRead = useCallback((notificationId) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
        );
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return {
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        clearNotifications
    };
};

export default useWebSocket;
