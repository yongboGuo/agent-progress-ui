import { EventEmitter } from "node:events";

import { describe, expect, it } from "vitest";

import {
  createMcpRunAdapter,
  createMockMcpTranscript,
  mcpEnvelopeToAgentEvents,
  observeMcpClient,
  observeMcpServer
} from "../src";

describe("@agent-progress-ui/mcp", () => {
  it("maps a mock transcript into a completed snapshot", () => {
    const adapter = createMcpRunAdapter();
    const snapshot = adapter.ingestTranscript(createMockMcpTranscript("research-agent"));

    expect(snapshot.header.status).toBe("completed");
    expect(snapshot.evidence.resources).toHaveLength(1);
    expect(snapshot.artifacts[0]?.type).toBe("memo");
  });

  it("routes unknown envelopes into the debug channel", () => {
    const adapter = createMcpRunAdapter();
    adapter.ingestEnvelope({ nope: true });

    expect(adapter.getDebugEntries()).toHaveLength(1);
    expect(adapter.getEvents()).toHaveLength(0);
  });

  it("observes client and server sources consistently", () => {
    const client = new EventEmitter();
    const server = new EventEmitter();
    const captured: Array<Record<string, unknown>> = [];

    const stopClient = observeMcpClient(client, {
      onEnvelope(envelope) {
        captured.push(envelope as Record<string, unknown>);
      }
    });
    const stopServer = observeMcpServer(server, {
      onEnvelope(envelope) {
        captured.push(envelope as Record<string, unknown>);
      }
    });

    client.emit("message", createMockMcpTranscript("code-agent")[0]);
    server.emit("message", createMockMcpTranscript("code-agent")[1]);
    stopClient();
    stopServer();

    expect(captured).toHaveLength(2);
    expect(captured[0]?.source).toBe("client");
    expect(captured[1]?.source).toBe("server");
  });

  it("converts a normalized envelope to core events", () => {
    const result = mcpEnvelopeToAgentEvents(createMockMcpTranscript("code-agent")[0], { sequence: 3 });

    expect(result.events[0]?.type).toBe("run.created");
    expect(result.events[0]?.sequence).toBe(3);
  });
});
