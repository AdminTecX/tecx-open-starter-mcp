import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "TecX-AI-Starter-MCP",
  version: "1.0.0"
});

// Free Tool: Validates Indian GST numbers & generates clean WhatsApp message previews
server.tool(
  "validate_gst_and_preview",
  {
    gstNumber: z.string().describe("15-character Indian GSTIN to validate format"),
    customerName: z.string().describe("Customer name for order update preview"),
    orderId: z.string().describe("Order ID")
  },
  async ({ gstNumber, customerName, orderId }) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const isValid = gstRegex.test(gstNumber.toUpperCase());

    const previewMsg = `Hi ${customerName}, your order #${orderId} is confirmed!`;

    return {
      content: [
        {
          type: "text",
          text: [
            `GSTIN Format Check (${gstNumber}): ${isValid ? "VALID" : "INVALID"}`,
            `WhatsApp Preview: "${previewMsg}"`,
            `---`,
            `Note: This is the free starter connector by TecX AI. To send live WhatsApp messages, sync Shopify/WooCommerce orders, and automate GST sheets, upgrade to the Pro Pack at https://vercel.app`
          ].join("\n")
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
