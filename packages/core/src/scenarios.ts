import type { AgentRunEvent, AgentScenario } from "./model";

const baseTime = "2026-06-14T09:00:00.000Z";

function at(seconds: number) {
  const date = new Date(baseTime);
  date.setUTCSeconds(date.getUTCSeconds() + seconds);
  return date.toISOString();
}

function event<T extends AgentRunEvent>(input: T): T {
  return input;
}

export const scenarioCatalog = {
  "research-agent": {
    id: "research-agent",
    name: "Research Agent",
    strapline: "Primary-source research with wait states, artifacts, and review checkpoints.",
    description: "A long-running research run that collects sources, pauses on external fetches, and ends with a reviewable memo bundle.",
    recommendedProgress: 0.88,
    events: [
      event({
        id: "research-01",
        runId: "run_research_01",
        type: "run.created",
        timestamp: at(0),
        title: "Research run accepted",
        message: "A scoped research run is waiting for planning.",
        elapsedMs: 0
      }),
      event({
        id: "research-02",
        runId: "run_research_01",
        type: "plan.set",
        timestamp: at(2),
        sequence: 1,
        title: "Plan locked",
        message: "Four stages are visible before the run touches tools.",
        elapsedMs: 2_000,
        steps: [
          { id: "scope", label: "Lock scope", description: "Confirm audience, output, and constraints." },
          { id: "collect", label: "Collect sources", description: "Read primary sources and attach evidence." },
          { id: "synthesize", label: "Draft memo", description: "Collapse verified evidence into a report." },
          { id: "review", label: "Package review", description: "Prepare artifacts for handoff." }
        ]
      }),
      event({
        id: "research-03",
        runId: "run_research_01",
        type: "step.started",
        timestamp: at(3),
        title: "Scope confirmation started",
        message: "The run is aligning on the intended audience.",
        elapsedMs: 3_000,
        step: { id: "scope", label: "Lock scope", description: "Confirm audience, output, and constraints." }
      }),
      event({
        id: "research-04",
        runId: "run_research_01",
        type: "step.completed",
        timestamp: at(7),
        title: "Scope locked",
        message: "The brief is now optimized for product strategy readers.",
        elapsedMs: 7_000,
        stepId: "scope"
      }),
      event({
        id: "research-05",
        runId: "run_research_01",
        type: "step.started",
        timestamp: at(8),
        title: "Source collection started",
        message: "The run is beginning external fetches and tool reads.",
        elapsedMs: 8_000,
        step: { id: "collect", label: "Collect sources", description: "Read primary sources and attach evidence." }
      }),
      event({
        id: "research-06",
        runId: "run_research_01",
        type: "tool.called",
        timestamp: at(10),
        title: "Search tool called",
        message: "The agent is querying a curated source set.",
        elapsedMs: 10_000,
        toolCall: { id: "tool-search", name: "web.search", summary: "Search for primary-source references published in the last 12 months." }
      }),
      event({
        id: "research-07",
        runId: "run_research_01",
        type: "tool.output",
        timestamp: at(13),
        title: "Search results streamed",
        message: "The first result batch has been normalized.",
        elapsedMs: 13_000,
        toolCallId: "tool-search",
        output: { id: "search-output-1", summary: "7 high-confidence documents matched the query.", status: "completed" }
      }),
      event({
        id: "research-08",
        runId: "run_research_01",
        type: "resource.attached",
        timestamp: at(14),
        title: "Primary source attached",
        message: "A policy report was added to the evidence set.",
        elapsedMs: 14_000,
        resource: { id: "source-1", title: "Policy report", kind: "source", uri: "mcp://research/policy-report", detail: "Verified external source" }
      }),
      event({
        id: "research-09",
        runId: "run_research_01",
        type: "wait.entered",
        timestamp: at(16),
        title: "Waiting on external retrieval",
        message: "A rate-limited document fetch is holding the next source batch.",
        elapsedMs: 16_000,
        wait: { id: "wait-fetch", kind: "external", label: "Awaiting remote fetch", description: "The run is waiting for the remote document extractor to return." }
      }),
      event({
        id: "research-10",
        runId: "run_research_01",
        type: "wait.resolved",
        timestamp: at(24),
        title: "External wait resolved",
        message: "The blocked source batch is available again.",
        elapsedMs: 24_000,
        waitId: "wait-fetch",
        note: "The remote extractor returned the missing document batch."
      }),
      event({
        id: "research-11",
        runId: "run_research_01",
        type: "step.completed",
        timestamp: at(29),
        title: "Source collection completed",
        message: "The evidence set is strong enough to draft.",
        elapsedMs: 29_000,
        stepId: "collect"
      }),
      event({
        id: "research-12",
        runId: "run_research_01",
        type: "step.started",
        timestamp: at(30),
        title: "Memo drafting started",
        message: "The run is compressing sources into an operator memo.",
        elapsedMs: 30_000,
        step: { id: "synthesize", label: "Draft memo", description: "Collapse verified evidence into a report." }
      }),
      event({
        id: "research-13",
        runId: "run_research_01",
        type: "artifact.created",
        timestamp: at(40),
        title: "Draft memo created",
        message: "A reviewable first draft is available.",
        elapsedMs: 40_000,
        artifact: { id: "artifact-memo", type: "memo", label: "Strategy memo", description: "First reviewable draft of the research memo." }
      }),
      event({
        id: "research-14",
        runId: "run_research_01",
        type: "step.completed",
        timestamp: at(44),
        title: "Drafting completed",
        message: "The memo is ready for packaging.",
        elapsedMs: 44_000,
        stepId: "synthesize"
      }),
      event({
        id: "research-15",
        runId: "run_research_01",
        type: "step.started",
        timestamp: at(45),
        title: "Review package started",
        message: "The run is bundling citations and handoff context.",
        elapsedMs: 45_000,
        step: { id: "review", label: "Package review", description: "Prepare artifacts for handoff." }
      }),
      event({
        id: "research-16",
        runId: "run_research_01",
        type: "artifact.created",
        timestamp: at(50),
        title: "Citation bundle created",
        message: "Reviewers can inspect the source package.",
        elapsedMs: 50_000,
        artifact: { id: "artifact-citations", type: "bundle", label: "Citation bundle", description: "Linked source notes and raw extracts." }
      }),
      event({
        id: "research-17",
        runId: "run_research_01",
        type: "run.completed",
        timestamp: at(53),
        title: "Research run completed",
        message: "The memo and evidence bundle are ready to inspect.",
        elapsedMs: 53_000,
        summary: "Completed with a memo draft and evidence bundle."
      })
    ]
  },
  "code-agent": {
    id: "code-agent",
    name: "Code Agent",
    strapline: "A code-focused run with MCP tool calls, background execution, and output bundling.",
    description: "A code agent run that inspects files, edits a workspace through tools, backgrounds verification, and completes with diffs.",
    recommendedProgress: 0.9,
    events: [
      event({
        id: "code-01",
        runId: "run_code_01",
        type: "run.created",
        timestamp: at(0),
        title: "Code run accepted",
        message: "The run is entering planning.",
        elapsedMs: 0
      }),
      event({
        id: "code-02",
        runId: "run_code_01",
        type: "plan.set",
        timestamp: at(1),
        title: "Execution plan ready",
        message: "The run will inspect, edit, verify, and package.",
        elapsedMs: 1_000,
        steps: [
          { id: "inspect", label: "Inspect workspace", description: "Read the safe edit boundary and target files." },
          { id: "implement", label: "Apply change", description: "Use tool calls to update the codebase." },
          { id: "verify", label: "Run checks", description: "Execute tests and static validation." },
          { id: "package", label: "Prepare handoff", description: "Bundle the diff and reviewer notes." }
        ]
      }),
      event({
        id: "code-03",
        runId: "run_code_01",
        type: "step.started",
        timestamp: at(3),
        title: "Workspace inspection started",
        message: "The run is reading file boundaries and current implementation shape.",
        elapsedMs: 3_000,
        step: { id: "inspect", label: "Inspect workspace", description: "Read the safe edit boundary and target files." }
      }),
      event({
        id: "code-04",
        runId: "run_code_01",
        type: "tool.called",
        timestamp: at(5),
        title: "Filesystem tool called",
        message: "Scanning candidate files for the change surface.",
        elapsedMs: 5_000,
        toolCall: { id: "tool-rg", name: "workspace.search", summary: "Find affected entry points, tests, and public interfaces." }
      }),
      event({
        id: "code-05",
        runId: "run_code_01",
        type: "tool.output",
        timestamp: at(7),
        title: "Workspace scan completed",
        message: "The primary edit targets were identified.",
        elapsedMs: 7_000,
        toolCallId: "tool-rg",
        output: { id: "rg-output", summary: "4 implementation files and 2 tests were selected.", status: "completed" }
      }),
      event({
        id: "code-06",
        runId: "run_code_01",
        type: "step.completed",
        timestamp: at(8),
        title: "Workspace inspection completed",
        message: "The run has a clear edit plan.",
        elapsedMs: 8_000,
        stepId: "inspect"
      }),
      event({
        id: "code-07",
        runId: "run_code_01",
        type: "step.started",
        timestamp: at(9),
        title: "Implementation started",
        message: "The run is now applying the planned changes.",
        elapsedMs: 9_000,
        step: { id: "implement", label: "Apply change", description: "Use tool calls to update the codebase." }
      }),
      event({
        id: "code-08",
        runId: "run_code_01",
        type: "tool.called",
        timestamp: at(12),
        title: "Patch tool called",
        message: "Generating and applying a focused patch.",
        elapsedMs: 12_000,
        toolCall: { id: "tool-patch", name: "workspace.patch", summary: "Apply the refactor required by the run plan." }
      }),
      event({
        id: "code-09",
        runId: "run_code_01",
        type: "tool.output",
        timestamp: at(16),
        title: "Patch applied",
        message: "The target files were updated successfully.",
        elapsedMs: 16_000,
        toolCallId: "tool-patch",
        output: { id: "patch-output", summary: "3 files updated and 1 new file created.", status: "completed" }
      }),
      event({
        id: "code-10",
        runId: "run_code_01",
        type: "artifact.created",
        timestamp: at(17),
        title: "Diff bundle created",
        message: "The current diff is available for review.",
        elapsedMs: 17_000,
        artifact: { id: "artifact-diff", type: "diff", label: "Workspace diff", description: "Patch bundle generated from the implementation step." }
      }),
      event({
        id: "code-11",
        runId: "run_code_01",
        type: "step.completed",
        timestamp: at(18),
        title: "Implementation completed",
        message: "The run is ready to verify.",
        elapsedMs: 18_000,
        stepId: "implement"
      }),
      event({
        id: "code-12",
        runId: "run_code_01",
        type: "step.started",
        timestamp: at(19),
        title: "Verification started",
        message: "Checks are running in the background-capable path.",
        elapsedMs: 19_000,
        step: { id: "verify", label: "Run checks", description: "Execute tests and static validation." }
      }),
      event({
        id: "code-13",
        runId: "run_code_01",
        type: "run.backgrounded",
        timestamp: at(22),
        title: "Verification backgrounded",
        message: "The run can continue while the operator leaves the surface.",
        elapsedMs: 22_000,
        reason: "Long-running verification has been backgrounded."
      }),
      event({
        id: "code-14",
        runId: "run_code_01",
        type: "tool.called",
        timestamp: at(24),
        title: "Test tool called",
        message: "Executing the workspace validation command.",
        elapsedMs: 24_000,
        toolCall: { id: "tool-test", name: "workspace.test", summary: "Run the workspace test suite and collect failures." }
      }),
      event({
        id: "code-15",
        runId: "run_code_01",
        type: "tool.output",
        timestamp: at(30),
        title: "Tests completed",
        message: "The test command returned successfully.",
        elapsedMs: 30_000,
        toolCallId: "tool-test",
        output: { id: "test-output", summary: "All targeted tests passed.", detail: "14 tests passed across 3 files.", status: "completed" }
      }),
      event({
        id: "code-16",
        runId: "run_code_01",
        type: "step.completed",
        timestamp: at(31),
        title: "Verification completed",
        message: "The run is safe to hand off.",
        elapsedMs: 31_000,
        stepId: "verify"
      }),
      event({
        id: "code-17",
        runId: "run_code_01",
        type: "step.started",
        timestamp: at(32),
        title: "Packaging handoff started",
        message: "The run is bundling notes and outputs for the reviewer.",
        elapsedMs: 32_000,
        step: { id: "package", label: "Prepare handoff", description: "Bundle the diff and reviewer notes." }
      }),
      event({
        id: "code-18",
        runId: "run_code_01",
        type: "artifact.created",
        timestamp: at(36),
        title: "Reviewer bundle created",
        message: "A handoff bundle is ready.",
        elapsedMs: 36_000,
        artifact: { id: "artifact-handoff", type: "bundle", label: "Reviewer handoff", description: "Diff summary, test proof, and reviewer notes." }
      }),
      event({
        id: "code-19",
        runId: "run_code_01",
        type: "run.completed",
        timestamp: at(39),
        title: "Code run completed",
        message: "The diff and validation bundle are ready.",
        elapsedMs: 39_000,
        summary: "Completed with a clean diff bundle and passing validation."
      })
    ]
  },
  "approval-handoff": {
    id: "approval-handoff",
    name: "Approval Handoff",
    strapline: "A run that pauses on human approval before mutating the world.",
    description: "An approval-focused transcript that exposes a human checkpoint before a side-effectful action is allowed to continue.",
    recommendedProgress: 0.95,
    events: [
      event({
        id: "approval-01",
        runId: "run_approval_01",
        type: "run.created",
        timestamp: at(0),
        title: "Approval run accepted",
        message: "The run is preparing a sensitive action.",
        elapsedMs: 0
      }),
      event({
        id: "approval-02",
        runId: "run_approval_01",
        type: "plan.set",
        timestamp: at(1),
        title: "Approval plan ready",
        message: "The run will inspect, request approval, execute, and summarize.",
        elapsedMs: 1_000,
        steps: [
          { id: "inspect", label: "Inspect request", description: "Understand the requested change and blast radius." },
          { id: "approval", label: "Request approval", description: "Pause until a reviewer approves the action." },
          { id: "execute", label: "Execute action", description: "Perform the side effect after approval." },
          { id: "handoff", label: "Prepare summary", description: "Package an auditable summary of the action." }
        ]
      }),
      event({
        id: "approval-03",
        runId: "run_approval_01",
        type: "step.started",
        timestamp: at(2),
        title: "Request inspection started",
        message: "The run is verifying impact before any mutation occurs.",
        elapsedMs: 2_000,
        step: { id: "inspect", label: "Inspect request", description: "Understand the requested change and blast radius." }
      }),
      event({
        id: "approval-04",
        runId: "run_approval_01",
        type: "step.completed",
        timestamp: at(6),
        title: "Request inspection completed",
        message: "The run has enough context to seek approval.",
        elapsedMs: 6_000,
        stepId: "inspect"
      }),
      event({
        id: "approval-05",
        runId: "run_approval_01",
        type: "step.started",
        timestamp: at(7),
        title: "Approval step started",
        message: "A human approval checkpoint is entering the foreground.",
        elapsedMs: 7_000,
        step: { id: "approval", label: "Request approval", description: "Pause until a reviewer approves the action." }
      }),
      event({
        id: "approval-06",
        runId: "run_approval_01",
        type: "approval.requested",
        timestamp: at(8),
        title: "Approval requested",
        message: "The run needs explicit approval before continuing.",
        elapsedMs: 8_000,
        approval: { id: "approval-prod", label: "Production write", description: "Approve a write against the production dataset." }
      }),
      event({
        id: "approval-07",
        runId: "run_approval_01",
        type: "approval.resolved",
        timestamp: at(18),
        title: "Approval granted",
        message: "A reviewer approved the requested action.",
        elapsedMs: 18_000,
        approvalId: "approval-prod",
        resolution: "approved",
        note: "Approved by operator with the requested guardrails intact."
      }),
      event({
        id: "approval-08",
        runId: "run_approval_01",
        type: "step.completed",
        timestamp: at(19),
        title: "Approval step completed",
        message: "The run can now execute the approved action.",
        elapsedMs: 19_000,
        stepId: "approval"
      }),
      event({
        id: "approval-09",
        runId: "run_approval_01",
        type: "step.started",
        timestamp: at(20),
        title: "Execution started",
        message: "The run is now applying the approved action.",
        elapsedMs: 20_000,
        step: { id: "execute", label: "Execute action", description: "Perform the side effect after approval." }
      }),
      event({
        id: "approval-10",
        runId: "run_approval_01",
        type: "tool.called",
        timestamp: at(22),
        title: "Action tool called",
        message: "The approved write is being executed.",
        elapsedMs: 22_000,
        toolCall: { id: "tool-write", name: "mcp.writeDataset", summary: "Execute the approved dataset mutation." }
      }),
      event({
        id: "approval-11",
        runId: "run_approval_01",
        type: "tool.output",
        timestamp: at(25),
        title: "Action tool completed",
        message: "The side effect completed successfully.",
        elapsedMs: 25_000,
        toolCallId: "tool-write",
        output: { id: "write-output", summary: "Dataset mutation completed with 2 rows updated.", status: "completed" }
      }),
      event({
        id: "approval-12",
        runId: "run_approval_01",
        type: "step.completed",
        timestamp: at(26),
        title: "Execution completed",
        message: "The run is transitioning into summary mode.",
        elapsedMs: 26_000,
        stepId: "execute"
      }),
      event({
        id: "approval-13",
        runId: "run_approval_01",
        type: "step.started",
        timestamp: at(27),
        title: "Summary packaging started",
        message: "The run is building an auditable summary.",
        elapsedMs: 27_000,
        step: { id: "handoff", label: "Prepare summary", description: "Package an auditable summary of the action." }
      }),
      event({
        id: "approval-14",
        runId: "run_approval_01",
        type: "artifact.created",
        timestamp: at(31),
        title: "Audit summary created",
        message: "The reviewer summary is ready.",
        elapsedMs: 31_000,
        artifact: { id: "artifact-audit", type: "summary", label: "Audit summary", description: "Approval note, action details, and result summary." }
      }),
      event({
        id: "approval-15",
        runId: "run_approval_01",
        type: "run.completed",
        timestamp: at(34),
        title: "Approval run completed",
        message: "The approved action and audit summary are ready.",
        elapsedMs: 34_000,
        summary: "Completed after explicit approval with an audit-ready summary."
      })
    ]
  }
} as const satisfies Record<string, AgentScenario>;

export type ScenarioKey = keyof typeof scenarioCatalog;
