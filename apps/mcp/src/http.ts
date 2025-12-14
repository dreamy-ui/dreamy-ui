import { randomUUID } from "node:crypto";
import { InMemoryEventStore } from "@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import cors from "cors";
import express from "express";
import { server } from "./server";
import { initializeTools } from "./tools";

const app = express();
app.use(express.json());

app.use(
    cors({
        origin: "*", // use "*" with caution in production
        methods: "GET,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        exposedHeaders: ["mcp-session-id", "last-event-id", "mcp-protocol-version"]
    })
);

// Store transports for each session type
const transports = {
    streamable: new Map<string, StreamableHTTPServerTransport>(),
    sse: new Map<string, SSEServerTransport>()
};

// const transports: ;

// Modern Streamable HTTP endpoint
app.post(["/", "/mcp"], async (req, res) => {
    // Check for existing session ID
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    console.error("session id", sessionId);

    if (sessionId && transports.streamable.has(sessionId)) {
        // Reuse existing transport
        transport = transports.streamable.get(sessionId)!;
    } else if (!sessionId && isInitializeRequest(req.body)) {
        // New initialization request
        const eventStore = new InMemoryEventStore();
        transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            eventStore,
            onsessioninitialized: (sessionId) => {
                console.error(`Session initialized with ID: ${sessionId}`);
                // Store the transport by session ID
                transports.streamable.set(sessionId, transport);
            }
        });

        // Clean up transport when closed
        transport.onclose = () => {
            if (transport.sessionId) {
                transports.streamable.delete(transport.sessionId);
            }
        };

        await initializeTools(server);

        // Connect to the MCP server
        await server.connect(transport);
    } else {
        // Invalid request
        console.error("Invalid Streamable HTTP request: ", JSON.stringify(req.body, null, 2));
        res.status(400).json({
            jsonrpc: "2.0",
            error: {
                code: -32000,
                message: "Bad Request: No valid session ID provided"
            },
            id: null
        });
        return;
    }

    // Handle the request
    await transport.handleRequest(req, res, req.body);
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports.streamable.get(sessionId)) {
        console.error(
            "Invalid Streamable HTTP request (invalid/missing session ID): ",
            JSON.stringify(req.body, null, 2)
        );
        res.status(400).send("Invalid or missing session ID");
        return;
    }

    console.error("Handling session request for ID:", sessionId);

    const transport = transports.streamable.get(sessionId)!;
    await transport.handleRequest(req, res);
};

app.get("/mcp", handleSessionRequest);
app.delete("/mcp", handleSessionRequest);

// Legacy SSE endpoint for older clients
app.get("/sse", async (_req, res) => {
    // Create SSE transport for legacy clients
    const transport = new SSEServerTransport("/messages", res);
    transports.sse.set(transport.sessionId, transport);

    res.on("close", () => {
        transports.sse.delete(transport.sessionId);
    });

    await initializeTools(server);

    // Start the SSE transport to send headers and endpoint info
    await transport.start();

    await server.connect(transport);
});

// Legacy message endpoint for older clients
app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.sse.get(sessionId)!;
    if (transport) {
        await transport.handlePostMessage(req, res, req.body);
    } else {
        console.error("No transport found for sessionId", sessionId);
        res.status(400).send("No transport found for sessionId");
    }
});

// Root endpoint
// app.get("/", (_req, res) => {
//     res.json({
//         name: "Dreamy UI MCP Server",
//         version: "2.0.3",
//         description: "The official MCP server for Dreamy UI",
//         endpoints: {
//             "/mcp": "Modern Streamable HTTP endpoint",
//             "/sse": "Legacy SSE endpoint",
//             "/messages": "Legacy message endpoint",
//             "/health": "Health check endpoint"
//         }
//     });
// });

// Health check endpoint
app.get("/health", (_req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3010;

app.listen(port, () => {
    console.info(`Dreamy UI MCP SSE Server running on http://localhost:${port}`);
});
