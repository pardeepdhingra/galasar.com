# WebMCP Demo — Traditional vs WebMCP-Enabled Restaurant

## What's Inside

- **index.html** — Demo hub with side-by-side comparison
- **traditional.html** — Standard restaurant page (no WebMCP)
- **webmcp-enabled.html** — Same restaurant with 10 registered WebMCP tools

## Quick Start

1. Open `index.html` in any browser
2. Click "Run AI Agent" on each restaurant page
3. Watch the speed difference: ~38s (traditional) vs ~8s (WebMCP)

## Running with Chrome Beta / Canary (Native WebMCP)

The demo includes a polyfill (`@mcp-b/global`) so it works in any browser. But to test with Chrome's native WebMCP support:

### Step 1: Install Chrome Canary

Download from: https://www.google.com/chrome/canary/

### Step 2: Enable WebMCP Flag

1. Open Chrome Canary
2. Navigate to `chrome://flags`
3. Search for `web-mcp` or `model-context`
4. Set the flag to **Enabled**
5. Restart Chrome Canary

### Step 3: Open the Demo

1. Serve the files locally (or just open `index.html` directly):
   ```bash
   npx serve .
   ```
2. Open `http://localhost:3000` in Chrome Canary
3. The `webmcp-enabled.html` page will register tools via the native `navigator.modelContext` API

### Step 4: Verify Tool Registration

1. Open DevTools (F12)
2. Go to Console
3. Type: `navigator.modelContext` — you should see the API object
4. On the WebMCP restaurant page, click "Show Registered Tools" to see all 10 tools

## The 10 Registered Tools

| Tool | Description |
|------|-------------|
| `get_menu` | Get full menu with prices, categories, and dietary info |
| `get_availability` | Check available time slots for a date and party size |
| `fill_reservation_form` | Fill all reservation fields in one call |
| `validate_reservation` | Validate form before confirming |
| `confirm_reservation` | Submit and confirm the reservation |
| `get_page_state` | Get full page context for the agent |
| `search_menu` | Search by keyword, dietary needs, or price range |
| `get_restaurant_info` | Get restaurant hours, address, and policies |
| `select_time_slot` | Select a time slot with availability check |
| `reset_reservation` | Clear form and reset to default state |

## Learn More

- [W3C WebMCP Draft](https://webmachinelearning.github.io/webmcp/)
- [MCP Protocol (Anthropic)](https://modelcontextprotocol.io/)
- [@mcp-b/global Polyfill](https://www.npmjs.com/package/@mcp-b/global)
