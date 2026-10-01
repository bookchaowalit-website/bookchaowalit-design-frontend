import { SEED_WORKS } from "@/lib/catalogue";
import { filterWorks } from "@/lib/works";
import { ToolInputError, requireString, respondToMcpRequest } from "@/lib/mcp";
import type { McpTool } from "@/lib/mcp";

const SERVER = { name: "bookchaowalit-design", version: "0.2.0" };

// Serves the published seed catalogue (data/works.json). Works a visitor adds
// on the page stay in their browser and are never visible here.
const TOOLS: McpTool[] = [
  {
    name: "get_all",
    description: "List the published design works (title, type, tools, status).",
    inputSchema: { type: "object", properties: {} },
    handler: () => SEED_WORKS,
  },
  {
    name: "get_by_id",
    description: "Get one published design work by id.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: (args) => {
      const id = requireString(args, "id");
      const work = SEED_WORKS.find((item) => item.id === id);
      if (!work) throw new ToolInputError(`No work with id "${id}".`);
      return work;
    },
  },
  {
    name: "search",
    description: "Search published works by title, type, tool, or status.",
    inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
    handler: (args) => filterWorks(SEED_WORKS, requireString(args, "query")),
  },
];

export async function POST(request: Request) {
  return respondToMcpRequest(request, SERVER, TOOLS);
}
