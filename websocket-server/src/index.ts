import 'dotenv/config';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const WS_PORT = parseInt(process.env.WS_PORT || '8080', 10);
const API_SECRET = process.env.API_SECRET || 'shared-secret';

// Store connected clients by user ID
const clients = new Map<string, Set<WebSocket>>();

// Create HTTP server for internal notifications
const httpServer = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Secret');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/notify') {
        // Verify API secret
        const secret = req.headers['x-api-secret'];
        if (secret !== API_SECRET) {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }

        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { userId, type, message, gigTitle } = data;

                console.log(`[/notify] Received notification for userId: ${userId}, type: ${type}`);
                console.log(`[/notify] Currently connected users: ${Array.from(clients.keys()).join(', ') || 'none'}`);

                if (!userId) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'userId is required' }));
                    return;
                }

                // Send notification to all connections for this user
                const userConnections = clients.get(userId);
                if (userConnections && userConnections.size > 0) {
                    const notification = JSON.stringify({
                        type,
                        message,
                        gigTitle,
                        timestamp: new Date().toISOString(),
                    });

                    console.log(`[/notify] Sending to ${userConnections.size} connection(s) for userId: ${userId}`);

                    userConnections.forEach((ws) => {
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(notification);
                        }
                    });

                    res.writeHead(200);
                    res.end(JSON.stringify({
                        success: true,
                        delivered: userConnections.size
                    }));
                } else {
                    console.log(`[/notify] User ${userId} is NOT connected`);
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        success: true,
                        delivered: 0,
                        message: 'User not connected'
                    }));
                }
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'ok',
            connections: getTotalConnections(),
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

// Create WebSocket server
const wss = new WebSocketServer({ server: httpServer });

function getTotalConnections(): number {
    let total = 0;
    clients.forEach((set) => {
        total += set.size;
    });
    return total;
}

wss.on('connection', (ws, req) => {
    // Get userId from query string (ws://localhost:8080?userId=xxx)
    const url = new URL(req.url || '', `http://localhost:${WS_PORT}`);
    const userId = url.searchParams.get('userId');

    if (!userId) {
        ws.close(4001, 'userId required');
        return;
    }

    console.log(`Client connected: ${userId}`);

    // Add to clients map
    if (!clients.has(userId)) {
        clients.set(userId, new Set());
    }
    clients.get(userId)!.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'CONNECTED',
        message: 'Connected to GigFlow notifications',
        timestamp: new Date().toISOString(),
    }));

    // Handle ping/pong for keepalive
    ws.on('pong', () => {
        // Client is alive
    });

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());

            // Handle ping from client
            if (message.type === 'PING') {
                ws.send(JSON.stringify({ type: 'PONG' }));
            }
        } catch {
            // Ignore invalid messages
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected: ${userId}`);
        const userConnections = clients.get(userId);
        if (userConnections) {
            userConnections.delete(ws);
            if (userConnections.size === 0) {
                clients.delete(userId);
            }
        }
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error for ${userId}:`, error.message);
    });
});

// Ping interval to detect stale connections
setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    });
}, 30000);

// Start server
httpServer.listen(WS_PORT, () => {
    console.log(`🔌 WebSocket server running on ws://localhost:${WS_PORT}`);
    console.log(`📊 Health check: http://localhost:${WS_PORT}/health`);
    console.log(`📨 Notify endpoint: POST http://localhost:${WS_PORT}/notify`);
});
