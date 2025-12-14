import { randomUUID } from 'crypto';
import { InMemoryEventStore } from '@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import cors from 'cors';
import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// src/http.ts
var server = new McpServer({
  name: "dreamy-ui",
  version: "1.0.0"
});

// src/lib/fetch.ts
var DREAMY_BASE_URL = "http://localhost:3000";
async function fetchJson(url, options, errorContext) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const context = errorContext || `fetch ${url}`;
    throw new Error(`Failed to ${context}: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}
function createDreamyUrl(path) {
  return `${DREAMY_BASE_URL}${path}`;
}
async function fetchComponentList() {
  return fetchJson(
    createDreamyUrl("/components/index.json"),
    void 0,
    "fetch component list"
  );
}
async function fetchComponent(component) {
  return fetchJson(
    createDreamyUrl(`/components/${component}.json`),
    void 0,
    `fetch component data for ${component}`
  );
}
async function getAllComponentNames() {
  const componentList = await fetchComponentList();
  return componentList.map((c) => c.component);
}
async function fetchRecipe(component) {
  return await fetchJson(
    createDreamyUrl(`/recipes/${component}.json`),
    void 0,
    "recipe fetch"
  );
}

// src/tools/get-component.ts
var getComponentPropsTool = {
  name: "get_component",
  description: "Get whole data of a specific Dreamy UI component. This tool retrieves the properties, attributes, design related props for a component, like size, variant, etc. and configuration options available for a given Dreamy UI component.",
  async ctx() {
    try {
      const componentList = await getAllComponentNames();
      return { componentList };
    } catch (error) {
      throw new Error(
        `Failed to initialize component props tool: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
  exec(server2, { ctx, name, description }) {
    server2.registerTool(
      name,
      {
        title: name,
        description,
        inputSchema: z.object({
          component: z.enum(ctx.componentList).describe("The name of the Dreamy UI component to get data of")
        })
      },
      async ({ component }) => {
        try {
          component = component.toLowerCase();
          const [componentJson, recipe] = await Promise.all([
            fetchComponent(component),
            fetchRecipe(component)
          ]);
          console.error("componentJson", componentJson);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(componentJson)
              },
              {
                type: "text",
                text: JSON.stringify(recipe)
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Failed to get data of ${component}: ${error instanceof Error ? error.message : "Unknown error"}`
              }
            ]
          };
        }
      }
    );
  }
};

// src/tools/index.ts
var tools = [
  // getComponentExampleTool,
  getComponentPropsTool
  // getThemeTool,
  // listComponentsTool,
  // customizeThemeTool,
  // v2ToV3MigrationTool,
  // listComponentTemplatesTool,
  // getComponentTemplatesTool,
  // installationTool
];
var registeredToolCache = /* @__PURE__ */ new Map();
var initializeTools = async (server2) => {
  await Promise.all(
    tools.map(async (tool) => {
      const toolCtx = await tool.ctx?.();
      if (registeredToolCache.has(tool.name)) {
        return;
      }
      registeredToolCache.set(tool.name, tool);
      tool.exec(server2, {
        name: tool.name,
        description: tool.description,
        ctx: toolCtx
      });
    })
  );
};

// src/http.ts
var app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    // use "*" with caution in production
    methods: "GET,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    exposedHeaders: ["mcp-session-id", "last-event-id", "mcp-protocol-version"]
  })
);
var transports = {
  streamable: /* @__PURE__ */ new Map(),
  sse: /* @__PURE__ */ new Map()
};
app.post(["/", "/mcp"], async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];
  let transport;
  console.error("session id", sessionId);
  if (sessionId && transports.streamable.has(sessionId)) {
    transport = transports.streamable.get(sessionId);
  } else if (!sessionId && isInitializeRequest(req.body)) {
    const eventStore = new InMemoryEventStore();
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      eventStore,
      onsessioninitialized: (sessionId2) => {
        console.error(`Session initialized with ID: ${sessionId2}`);
        transports.streamable.set(sessionId2, transport);
      }
    });
    transport.onclose = () => {
      if (transport.sessionId) {
        transports.streamable.delete(transport.sessionId);
      }
    };
    await initializeTools(server);
    await server.connect(transport);
  } else {
    console.error("Invalid Streamable HTTP request: ", JSON.stringify(req.body, null, 2));
    res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32e3,
        message: "Bad Request: No valid session ID provided"
      },
      id: null
    });
    return;
  }
  await transport.handleRequest(req, res, req.body);
});
var handleSessionRequest = async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];
  if (!sessionId || !transports.streamable.get(sessionId)) {
    console.error(
      "Invalid Streamable HTTP request (invalid/missing session ID): ",
      JSON.stringify(req.body, null, 2)
    );
    res.status(400).send("Invalid or missing session ID");
    return;
  }
  console.error("Handling session request for ID:", sessionId);
  const transport = transports.streamable.get(sessionId);
  await transport.handleRequest(req, res);
};
app.get("/mcp", handleSessionRequest);
app.delete("/mcp", handleSessionRequest);
app.get("/sse", async (_req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  transports.sse.set(transport.sessionId, transport);
  res.on("close", () => {
    transports.sse.delete(transport.sessionId);
  });
  await initializeTools(server);
  await transport.start();
  await server.connect(transport);
});
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports.sse.get(sessionId);
  if (transport) {
    await transport.handlePostMessage(req, res, req.body);
  } else {
    console.error("No transport found for sessionId", sessionId);
    res.status(400).send("No transport found for sessionId");
  }
});
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: process.uptime()
  });
});
var port = process.env.PORT ? Number(process.env.PORT) : 3010;
app.listen(port, () => {
  console.info(`Dreamy UI MCP SSE Server running on http://localhost:${port}`);
});
