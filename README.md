# mnote

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

To run inspect MCP:

Build Image Dev

```bash
docker build -f Dockerfile.dev -t mcp-obsidian-server .
```

Run Inspector

```bash
bun run inspector
```

This project was created using `bun init` in bun v1.3.9. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
