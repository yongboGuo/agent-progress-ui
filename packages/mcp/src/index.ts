import {
  appendAgentRunEvents,
  createAgentRunStore,
  type AgentPlanStep,
  type AgentRunEvent,
  type AgentRunSnapshot,
  type AgentRunStore
} from "@agent-progress-ui/core";

export interface McpDebugEntry {
  id: string;
  reason: string;
  envelope: unknown;
  timestamp: string;
}

interface McpEnvelopeBase {
  id: string;
  runId: string;
  timestamp: string;
  source?: "client" | "server";
}

export type McpEnvelope =
  | (McpEnvelopeBase & { kind: "session.started"; title: string; message?: string; elapsedMs?: number })
  | (McpEnvelopeBase & { kind: "plan.set"; title: string; message?: string; elapsedMs?: number; steps: AgentPlanStep[] })
  | (McpEnvelopeBase & { kind: "step.started"; title: string; message?: string; elapsedMs?: number; step: AgentPlanStep })
  | (McpEnvelopeBase & { kind: "step.updated"; title: string; message?: string; elapsedMs?: number; stepId: string; detail: string })
  | (McpEnvelopeBase & { kind: "step.completed"; title: string; message?: string; elapsedMs?: number; stepId: string; outcome?: "completed" | "failed" })
  | (McpEnvelopeBase & {
      kind: "tool.called";
      title: string;
      message?: string;
      elapsedMs?: number;
      toolCall: { id: string; name: string; summary: string };
    })
  | (McpEnvelopeBase & {
      kind: "tool.output";
      title: string;
      message?: string;
      elapsedMs?: number;
      toolCallId: string;
      output: { id: string; summary: string; detail?: string; status: "streaming" | "completed" | "failed" };
    })
  | (McpEnvelopeBase & {
      kind: "resource.attached";
      title: string;
      message?: string;
      elapsedMs?: number;
      resource: { id: string; title: string; kind: "source" | "document" | "result" | "file"; uri?: string; detail?: string };
    })
  | (McpEnvelopeBase & {
      kind: "artifact.created";
      title: string;
      message?: string;
      elapsedMs?: number;
      artifact: { id: string; type: string; label: string; description?: string; href?: string; preview?: string };
    })
  | (McpEnvelopeBase & {
      kind: "approval.requested";
      title: string;
      message?: string;
      elapsedMs?: number;
      approval: { id: string; label: string; description: string };
    })
  | (McpEnvelopeBase & {
      kind: "approval.resolved";
      title: string;
      message?: string;
      elapsedMs?: number;
      approvalId: string;
      resolution: "approved" | "rejected";
      note?: string;
    })
  | (McpEnvelopeBase & {
      kind: "wait.entered";
      title: string;
      message?: string;
      elapsedMs?: number;
      wait: { id: string; kind: "external" | "user"; label: string; description: string };
    })
  | (McpEnvelopeBase & {
      kind: "wait.resolved";
      title: string;
      message?: string;
      elapsedMs?: number;
      waitId: string;
      note?: string;
    })
  | (McpEnvelopeBase & { kind: "session.backgrounded"; title: string; message?: string; elapsedMs?: number; reason: string })
  | (McpEnvelopeBase & { kind: "session.completed"; title: string; message?: string; elapsedMs?: number; summary: string })
  | (McpEnvelopeBase & { kind: "session.failed"; title: string; message?: string; elapsedMs?: number; error: string });

export interface McpEnvelopeContext {
  sequence?: number;
}

export interface McpEnvelopeConversion {
  events: AgentRunEvent[];
  debug?: McpDebugEntry;
}

function debugEntry(reason: string, envelope: unknown): McpDebugEntry {
  return {
    id: `debug-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    reason,
    envelope,
    timestamp: new Date().toISOString()
  };
}

function withBase(envelope: McpEnvelope, context: McpEnvelopeContext) {
  return {
    id: envelope.id,
    runId: envelope.runId,
    timestamp: envelope.timestamp,
    sequence: context.sequence ?? 0,
    title: envelope.title,
    message: envelope.message,
    elapsedMs: envelope.elapsedMs
  };
}

export function mcpEnvelopeToAgentEvents(
  envelope: McpEnvelope | Record<string, unknown>,
  context: McpEnvelopeContext = {}
): McpEnvelopeConversion {
  if (!("kind" in envelope) || typeof envelope.kind !== "string") {
    return {
      events: [],
      debug: debugEntry("Envelope is missing a recognized kind.", envelope)
    };
  }

  const typedEnvelope = envelope as McpEnvelope;
  const base = withBase(typedEnvelope, context);

  switch (typedEnvelope.kind) {
    case "session.started":
      return { events: [{ ...base, type: "run.created" }] };
    case "plan.set":
      return { events: [{ ...base, type: "plan.set", steps: typedEnvelope.steps }] };
    case "step.started":
      return { events: [{ ...base, type: "step.started", step: typedEnvelope.step }] };
    case "step.updated":
      return { events: [{ ...base, type: "step.updated", stepId: typedEnvelope.stepId, detail: typedEnvelope.detail }] };
    case "step.completed":
      return { events: [{ ...base, type: "step.completed", stepId: typedEnvelope.stepId, outcome: typedEnvelope.outcome }] };
    case "tool.called":
      return { events: [{ ...base, type: "tool.called", toolCall: typedEnvelope.toolCall }] };
    case "tool.output":
      return { events: [{ ...base, type: "tool.output", toolCallId: typedEnvelope.toolCallId, output: typedEnvelope.output }] };
    case "resource.attached":
      return { events: [{ ...base, type: "resource.attached", resource: typedEnvelope.resource }] };
    case "artifact.created":
      return { events: [{ ...base, type: "artifact.created", artifact: typedEnvelope.artifact }] };
    case "approval.requested":
      return { events: [{ ...base, type: "approval.requested", approval: typedEnvelope.approval }] };
    case "approval.resolved":
      return {
        events: [
          {
            ...base,
            type: "approval.resolved",
            approvalId: typedEnvelope.approvalId,
            resolution: typedEnvelope.resolution,
            note: typedEnvelope.note
          }
        ]
      };
    case "wait.entered":
      return { events: [{ ...base, type: "wait.entered", wait: typedEnvelope.wait }] };
    case "wait.resolved":
      return { events: [{ ...base, type: "wait.resolved", waitId: typedEnvelope.waitId, note: typedEnvelope.note }] };
    case "session.backgrounded":
      return { events: [{ ...base, type: "run.backgrounded", reason: typedEnvelope.reason }] };
    case "session.completed":
      return { events: [{ ...base, type: "run.completed", summary: typedEnvelope.summary }] };
    case "session.failed":
      return { events: [{ ...base, type: "run.failed", error: typedEnvelope.error }] };
    default:
      return {
        events: [],
        debug: debugEntry(`Unsupported MCP envelope kind: ${(typedEnvelope as McpEnvelope).kind}`, envelope)
      };
  }
}

export interface McpRunAdapter {
  ingestEnvelope: (envelope: McpEnvelope | Record<string, unknown>) => AgentRunSnapshot;
  ingestTranscript: (transcript: Array<McpEnvelope | Record<string, unknown>>) => AgentRunSnapshot;
  getDebugEntries: () => McpDebugEntry[];
  getEvents: () => AgentRunEvent[];
  getSnapshot: () => AgentRunSnapshot;
  store: AgentRunStore;
  subscribe: AgentRunStore["subscribe"];
}

export function createMcpRunAdapter(options?: {
  initialEnvelopes?: Array<McpEnvelope | Record<string, unknown>>;
  onDebug?: (entry: McpDebugEntry) => void;
}): McpRunAdapter {
  const store = createAgentRunStore();
  const debugEntries: McpDebugEntry[] = [];
  let sequence = 0;

  function recordDebug(entry?: McpDebugEntry) {
    if (!entry) {
      return;
    }

    debugEntries.push(entry);
    options?.onDebug?.(entry);
  }

  function ingestEnvelope(envelope: McpEnvelope | Record<string, unknown>) {
    const conversion = mcpEnvelopeToAgentEvents(envelope, { sequence });
    sequence += 1;
    recordDebug(conversion.debug);

    if (conversion.events.length > 0) {
      appendAgentRunEvents(store, conversion.events);
    }

    return store.getSnapshot();
  }

  function ingestTranscript(transcript: Array<McpEnvelope | Record<string, unknown>>) {
    transcript.forEach((envelope) => {
      ingestEnvelope(envelope);
    });

    return store.getSnapshot();
  }

  if (options?.initialEnvelopes) {
    ingestTranscript(options.initialEnvelopes);
  }

  return {
    ingestEnvelope,
    ingestTranscript,
    getDebugEntries: () => [...debugEntries],
    getEvents: store.getEvents,
    getSnapshot: store.getSnapshot,
    store,
    subscribe: store.subscribe
  };
}

type EventSourceLike = {
  on?: (eventName: string, listener: (payload: unknown) => void) => void;
  off?: (eventName: string, listener: (payload: unknown) => void) => void;
  addListener?: (eventName: string, listener: (payload: unknown) => void) => void;
  removeListener?: (eventName: string, listener: (payload: unknown) => void) => void;
};

function attachListener(
  target: EventSourceLike,
  eventName: string,
  listener: (payload: unknown) => void
) {
  if (target.on) {
    target.on(eventName, listener);
    return () => target.off?.(eventName, listener);
  }

  target.addListener?.(eventName, listener);
  return () => target.removeListener?.(eventName, listener);
}

function normalizeObservedEnvelope(
  payload: unknown,
  source: "client" | "server"
): McpEnvelope | Record<string, unknown> {
  if (payload && typeof payload === "object") {
    return {
      ...(payload as Record<string, unknown>),
      source
    };
  }

  return {
    kind: "debug.unknown",
    payload,
    source
  };
}

export function observeMcpClient(
  client: EventSourceLike,
  callbacks: {
    onEnvelope: (envelope: McpEnvelope | Record<string, unknown>) => void;
  }
) {
  const detach = ["message", "request", "notification", "response"].map((eventName) =>
    attachListener(client, eventName, (payload) => {
      callbacks.onEnvelope(normalizeObservedEnvelope(payload, "client"));
    })
  );

  return () => {
    detach.forEach((dispose) => dispose?.());
  };
}

export function observeMcpServer(
  server: EventSourceLike,
  callbacks: {
    onEnvelope: (envelope: McpEnvelope | Record<string, unknown>) => void;
  }
) {
  const detach = ["message", "request", "notification", "response"].map((eventName) =>
    attachListener(server, eventName, (payload) => {
      callbacks.onEnvelope(normalizeObservedEnvelope(payload, "server"));
    })
  );

  return () => {
    detach.forEach((dispose) => dispose?.());
  };
}

export function createMockMcpTranscript(profile: "research-agent" | "code-agent" = "research-agent"): McpEnvelope[] {
  if (profile === "code-agent") {
    return [
      {
        id: "mcp-code-01",
        runId: "mcp_code_run",
        kind: "session.started",
        timestamp: "2026-06-14T10:00:00.000Z",
        title: "MCP code run started",
        message: "The adapter is normalizing an MCP code run."
      },
      {
        id: "mcp-code-02",
        runId: "mcp_code_run",
        kind: "plan.set",
        timestamp: "2026-06-14T10:00:02.000Z",
        title: "MCP plan set",
        message: "The run exposes a full stage rail.",
        steps: [
          { id: "inspect", label: "Inspect workspace", description: "Collect the edit boundary." },
          { id: "edit", label: "Apply change", description: "Use MCP tools to update files." },
          { id: "verify", label: "Run checks", description: "Validate the change set." }
        ]
      },
      {
        id: "mcp-code-03",
        runId: "mcp_code_run",
        kind: "step.started",
        timestamp: "2026-06-14T10:00:03.000Z",
        title: "Inspect stage started",
        step: { id: "inspect", label: "Inspect workspace", description: "Collect the edit boundary." }
      },
      {
        id: "mcp-code-04",
        runId: "mcp_code_run",
        kind: "tool.called",
        timestamp: "2026-06-14T10:00:05.000Z",
        title: "MCP tool called",
        toolCall: { id: "mcp-rg", name: "mcp.searchWorkspace", summary: "Search the workspace for affected files." }
      },
      {
        id: "mcp-code-05",
        runId: "mcp_code_run",
        kind: "tool.output",
        timestamp: "2026-06-14T10:00:07.000Z",
        title: "MCP tool output",
        toolCallId: "mcp-rg",
        output: { id: "mcp-rg-out", summary: "4 files were selected for editing.", status: "completed" }
      },
      {
        id: "mcp-code-06",
        runId: "mcp_code_run",
        kind: "artifact.created",
        timestamp: "2026-06-14T10:00:12.000Z",
        title: "Patch artifact ready",
        artifact: { id: "mcp-diff", type: "diff", label: "MCP patch bundle", description: "Generated from the MCP tool chain." }
      },
      {
        id: "mcp-code-07",
        runId: "mcp_code_run",
        kind: "session.completed",
        timestamp: "2026-06-14T10:00:20.000Z",
        title: "MCP code run completed",
        summary: "Completed with a patch bundle and recorded MCP tool transcript."
      }
    ];
  }

  return [
    {
      id: "mcp-research-01",
      runId: "mcp_research_run",
      kind: "session.started",
      timestamp: "2026-06-14T11:00:00.000Z",
      title: "MCP research run started",
      message: "The transcript begins with a scoped research request."
    },
    {
      id: "mcp-research-02",
      runId: "mcp_research_run",
      kind: "plan.set",
      timestamp: "2026-06-14T11:00:02.000Z",
      title: "Research plan ready",
      steps: [
        { id: "scope", label: "Lock scope", description: "Confirm audience and constraints." },
        { id: "collect", label: "Collect evidence", description: "Read documents and attach verified sources." },
        { id: "memo", label: "Draft memo", description: "Prepare the reviewable memo artifact." }
      ]
    },
    {
      id: "mcp-research-03",
      runId: "mcp_research_run",
      kind: "tool.called",
      timestamp: "2026-06-14T11:00:05.000Z",
      title: "Source tool called",
      toolCall: { id: "mcp-source", name: "mcp.fetchSources", summary: "Fetch the strongest primary sources." }
    },
    {
      id: "mcp-research-04",
      runId: "mcp_research_run",
      kind: "resource.attached",
      timestamp: "2026-06-14T11:00:08.000Z",
      title: "Source attached",
      resource: { id: "mcp-source-1", title: "Analyst note", kind: "source", uri: "mcp://research/analyst-note", detail: "Verified source imported via MCP." }
    },
    {
      id: "mcp-research-05",
      runId: "mcp_research_run",
      kind: "wait.entered",
      timestamp: "2026-06-14T11:00:10.000Z",
      title: "Waiting for follow-up fetch",
      wait: { id: "mcp-wait", kind: "external", label: "External wait", description: "Awaiting the next resource batch." }
    },
    {
      id: "mcp-research-06",
      runId: "mcp_research_run",
      kind: "wait.resolved",
      timestamp: "2026-06-14T11:00:16.000Z",
      title: "External wait resolved",
      waitId: "mcp-wait",
      note: "The blocked source batch arrived."
    },
    {
      id: "mcp-research-07",
      runId: "mcp_research_run",
      kind: "artifact.created",
      timestamp: "2026-06-14T11:00:20.000Z",
      title: "Memo created",
      artifact: { id: "mcp-memo", type: "memo", label: "MCP memo", description: "A memo assembled from MCP resources." }
    },
    {
      id: "mcp-research-08",
      runId: "mcp_research_run",
      kind: "session.completed",
      timestamp: "2026-06-14T11:00:24.000Z",
      title: "MCP research run completed",
      summary: "Completed with a verified source and memo artifact."
    }
  ];
}
