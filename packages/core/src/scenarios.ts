import type { TaskPlanStep, TaskScenario } from "./model";

const baseTime = "2026-04-29T09:00:00.000Z";

function at(seconds: number): string {
  const date = new Date(baseTime);
  date.setUTCSeconds(date.getUTCSeconds() + seconds);
  return date.toISOString();
}

const chatPlan: TaskPlanStep[] = [
  {
    id: "chat-understand",
    label: "Frame request",
    description: "Figure out the user intent and the answer shape."
  },
  {
    id: "chat-draft",
    label: "Draft response",
    description: "Produce the first useful response while streaming quickly."
  },
  {
    id: "chat-polish",
    label: "Polish tone",
    description: "Tighten copy so the answer lands cleanly."
  }
];

const researchPlan: TaskPlanStep[] = [
  {
    id: "research-scope",
    label: "Confirm scope",
    description: "Translate the request into a research plan."
  },
  {
    id: "research-sources",
    label: "Read sources",
    description: "Collect and verify the evidence base."
  },
  {
    id: "research-outline",
    label: "Outline findings",
    description: "Collapse source reading into a report structure."
  },
  {
    id: "research-draft",
    label: "Draft report",
    description: "Generate a reviewable draft with citations."
  }
];

const agentPlan: TaskPlanStep[] = [
  {
    id: "agent-plan",
    label: "Plan execution",
    description: "Lock scope, constraints, and success criteria."
  },
  {
    id: "agent-inspect",
    label: "Inspect workspace",
    description: "Read files and infer the safe edit boundary."
  },
  {
    id: "agent-implement",
    label: "Apply changes",
    description: "Mutate the project with checkpoints."
  },
  {
    id: "agent-verify",
    label: "Run checks",
    description: "Execute tests and gather proof."
  },
  {
    id: "agent-review",
    label: "Package output",
    description: "Collect diffs, screenshots, and review notes."
  }
];

export const scenarioCatalog = {
  chat: {
    id: "chat",
    name: "Fast Chat Reply",
    strapline: "0-15 seconds. Keep the UI warm, not theatrical.",
    description: "A lightweight answer flow that starts streaming early and stays compact.",
    recommendedProgress: 0.72,
    events: [
      {
        id: "chat-1",
        taskId: "task_chat_01",
        type: "task_created",
        state: "queued",
        timestamp: at(0),
        title: "Queued for reply",
        message: "Scheduling a low-latency response worker.",
        elapsedMs: 0
      },
      {
        id: "chat-2",
        taskId: "task_chat_01",
        type: "plan_ready",
        state: "planning",
        timestamp: at(1),
        title: "Plan ready",
        message: "A short answer path is prepared.",
        steps: chatPlan,
        elapsedMs: 1_000
      },
      {
        id: "chat-3",
        taskId: "task_chat_01",
        type: "step_started",
        state: "executing",
        timestamp: at(2),
        title: "Framing the request",
        message: "Detecting tone, length, and needed context.",
        stepId: "chat-understand",
        stepLabel: "Frame request",
        elapsedMs: 2_000
      },
      {
        id: "chat-4",
        taskId: "task_chat_01",
        type: "step_completed",
        state: "executing",
        timestamp: at(4),
        title: "Intent matched",
        message: "The answer can stay concise and direct.",
        stepId: "chat-understand",
        stepLabel: "Frame request",
        elapsedMs: 4_000
      },
      {
        id: "chat-5",
        taskId: "task_chat_01",
        type: "step_started",
        state: "executing",
        timestamp: at(4),
        title: "Drafting response",
        message: "Streaming the first useful sentence immediately.",
        stepId: "chat-draft",
        stepLabel: "Draft response",
        elapsedMs: 4_100
      },
      {
        id: "chat-6",
        taskId: "task_chat_01",
        type: "artifact_created",
        state: "synthesizing",
        timestamp: at(7),
        title: "Draft available",
        message: "The first answer is coherent enough to preview.",
        artifact: {
          type: "answer",
          id: "chat-artifact-draft",
          label: "Streaming answer",
          description: "A compact response preview."
        },
        elapsedMs: 7_000
      },
      {
        id: "chat-7",
        taskId: "task_chat_01",
        type: "step_completed",
        state: "completed",
        timestamp: at(9),
        title: "Reply sent",
        message: "The final answer is ready in-thread.",
        stepId: "chat-draft",
        stepLabel: "Draft response",
        elapsedMs: 9_000
      }
    ]
  },
  research: {
    id: "research",
    name: "Deep Research",
    strapline: "15 seconds to 2 minutes. Show evidence, not fake percentage.",
    description: "A multi-source research flow with explicit waiting, source evidence, and reviewable drafts.",
    recommendedProgress: 0.82,
    events: [
      {
        id: "research-1",
        taskId: "task_research_01",
        type: "task_created",
        state: "queued",
        timestamp: at(0),
        title: "Research request accepted",
        message: "Preparing a scoped research run.",
        elapsedMs: 0
      },
      {
        id: "research-2",
        taskId: "task_research_01",
        type: "plan_ready",
        state: "planning",
        timestamp: at(4),
        title: "Plan ready",
        message: "Four stages have been proposed before execution.",
        steps: researchPlan,
        elapsedMs: 4_000
      },
      {
        id: "research-3",
        taskId: "task_research_01",
        type: "step_started",
        state: "understanding",
        timestamp: at(5),
        title: "Confirming research scope",
        message: "Checking target audience and output format.",
        stepId: "research-scope",
        stepLabel: "Confirm scope",
        elapsedMs: 5_000
      },
      {
        id: "research-4",
        taskId: "task_research_01",
        type: "step_completed",
        state: "executing",
        timestamp: at(9),
        title: "Scope locked",
        message: "The report will optimize for product strategy readers.",
        stepId: "research-scope",
        stepLabel: "Confirm scope",
        elapsedMs: 9_000
      },
      {
        id: "research-5",
        taskId: "task_research_01",
        type: "step_started",
        state: "executing",
        timestamp: at(10),
        title: "Reading primary sources",
        message: "Actively collecting the strongest external references.",
        stepId: "research-sources",
        stepLabel: "Read sources",
        elapsedMs: 10_000
      },
      {
        id: "research-6",
        taskId: "task_research_01",
        type: "source_found",
        state: "executing",
        timestamp: at(15),
        title: "Source verified",
        message: "OpenAI help documentation added to the evidence set.",
        source: {
          title: "OpenAI Help - Deep research",
          domain: "help.openai.com"
        },
        elapsedMs: 15_000
      },
      {
        id: "research-7",
        taskId: "task_research_01",
        type: "source_found",
        state: "executing",
        timestamp: at(20),
        title: "Source verified",
        message: "Anthropic release notes added for agent visibility patterns.",
        source: {
          title: "Anthropic - Claude Code autonomy",
          domain: "anthropic.com"
        },
        elapsedMs: 20_000
      },
      {
        id: "research-8",
        taskId: "task_research_01",
        type: "waiting_external",
        state: "waiting_external",
        timestamp: at(28),
        title: "Waiting on external fetch",
        message: "A rate-limited source will be retried before synthesis.",
        stepId: "research-sources",
        stepLabel: "Read sources",
        elapsedMs: 28_000
      },
      {
        id: "research-9",
        taskId: "task_research_01",
        type: "retrying",
        state: "retrying",
        timestamp: at(34),
        title: "Retrying source fetch",
        message: "Backoff completed. Resuming research collection.",
        stepId: "research-sources",
        stepLabel: "Read sources",
        elapsedMs: 34_000
      },
      {
        id: "research-10",
        taskId: "task_research_01",
        type: "step_completed",
        state: "executing",
        timestamp: at(42),
        title: "Evidence collection closed",
        message: "The source set is deep enough to begin synthesis.",
        stepId: "research-sources",
        stepLabel: "Read sources",
        elapsedMs: 42_000
      },
      {
        id: "research-11",
        taskId: "task_research_01",
        type: "step_started",
        state: "synthesizing",
        timestamp: at(43),
        title: "Outlining findings",
        message: "Turning notes into a structured report draft.",
        stepId: "research-outline",
        stepLabel: "Outline findings",
        elapsedMs: 43_000
      },
      {
        id: "research-12",
        taskId: "task_research_01",
        type: "artifact_created",
        state: "synthesizing",
        timestamp: at(48),
        title: "Outline available",
        message: "A reviewable structure is ready before the final report.",
        artifact: {
          type: "outline",
          id: "research-outline",
          label: "Executive outline",
          description: "Four-section report shape with citations reserved."
        },
        elapsedMs: 48_000
      },
      {
        id: "research-13",
        taskId: "task_research_01",
        type: "step_completed",
        state: "ready_for_review",
        timestamp: at(56),
        title: "Draft ready for review",
        message: "Users can review the draft before export.",
        stepId: "research-outline",
        stepLabel: "Outline findings",
        elapsedMs: 56_000,
        artifact: {
          type: "report",
          id: "research-report",
          label: "Report draft",
          description: "Reviewable markdown draft with sources attached."
        }
      }
    ]
  },
  agent: {
    id: "agent",
    name: "Agent Workbench",
    strapline: "2-10 minutes. This is no longer a loading state.",
    description: "A long-running agent flow with tool events, checkpoints, artifacts, and a handoff into review.",
    recommendedProgress: 0.86,
    events: [
      {
        id: "agent-1",
        taskId: "task_agent_01",
        type: "task_created",
        state: "queued",
        timestamp: at(0),
        title: "Agent run queued",
        message: "Provisioning a fresh execution environment.",
        elapsedMs: 0
      },
      {
        id: "agent-2",
        taskId: "task_agent_01",
        type: "plan_ready",
        state: "planning",
        timestamp: at(12),
        title: "Execution plan ready",
        message: "Five stages are visible before any write happens.",
        steps: agentPlan,
        elapsedMs: 12_000
      },
      {
        id: "agent-3",
        taskId: "task_agent_01",
        type: "step_started",
        state: "planning",
        timestamp: at(14),
        title: "Planning execution",
        message: "Parsing the request and defining safe checkpoints.",
        stepId: "agent-plan",
        stepLabel: "Plan execution",
        elapsedMs: 14_000
      },
      {
        id: "agent-4",
        taskId: "task_agent_01",
        type: "step_completed",
        state: "executing",
        timestamp: at(22),
        title: "Plan confirmed",
        message: "Scope is locked and the workspace can be inspected.",
        stepId: "agent-plan",
        stepLabel: "Plan execution",
        elapsedMs: 22_000
      },
      {
        id: "agent-5",
        taskId: "task_agent_01",
        type: "step_started",
        state: "executing",
        timestamp: at(24),
        title: "Inspecting workspace",
        message: "Reading files and inferring the change boundary.",
        stepId: "agent-inspect",
        stepLabel: "Inspect workspace",
        elapsedMs: 24_000
      },
      {
        id: "agent-6",
        taskId: "task_agent_01",
        type: "tool_started",
        state: "executing",
        timestamp: at(34),
        title: "Tool started",
        message: "Search is scanning the repository for entry points.",
        tool: {
          name: "repo.search",
          detail: "Searching for likely integration surfaces."
        },
        elapsedMs: 34_000
      },
      {
        id: "agent-7",
        taskId: "task_agent_01",
        type: "tool_finished",
        state: "executing",
        timestamp: at(40),
        title: "Workspace mapped",
        message: "The main routes and reusable primitives are identified.",
        tool: {
          name: "repo.search",
          detail: "Relevant files scored and ranked."
        },
        elapsedMs: 40_000
      },
      {
        id: "agent-8",
        taskId: "task_agent_01",
        type: "step_completed",
        state: "executing",
        timestamp: at(48),
        title: "Inspection complete",
        message: "Safe edit boundaries are now visible.",
        stepId: "agent-inspect",
        stepLabel: "Inspect workspace",
        elapsedMs: 48_000
      },
      {
        id: "agent-9",
        taskId: "task_agent_01",
        type: "step_started",
        state: "executing",
        timestamp: at(49),
        title: "Applying changes",
        message: "The agent is editing and staging artifacts for review.",
        stepId: "agent-implement",
        stepLabel: "Apply changes",
        elapsedMs: 49_000
      },
      {
        id: "agent-10",
        taskId: "task_agent_01",
        type: "artifact_created",
        state: "executing",
        timestamp: at(64),
        title: "Artifact created",
        message: "A patch preview is available before verification.",
        artifact: {
          type: "diff",
          id: "agent-diff",
          label: "Patch preview",
          description: "A reviewable diff summary with ownership notes."
        },
        elapsedMs: 64_000
      },
      {
        id: "agent-11",
        taskId: "task_agent_01",
        type: "backgrounded",
        state: "backgrounded",
        timestamp: at(70),
        title: "Task moved to background",
        message: "The user can leave without losing progress.",
        elapsedMs: 70_000
      },
      {
        id: "agent-12",
        taskId: "task_agent_01",
        type: "step_completed",
        state: "synthesizing",
        timestamp: at(92),
        title: "Implementation checkpoint saved",
        message: "The code changes are stable enough for verification.",
        stepId: "agent-implement",
        stepLabel: "Apply changes",
        elapsedMs: 92_000
      },
      {
        id: "agent-13",
        taskId: "task_agent_01",
        type: "step_started",
        state: "synthesizing",
        timestamp: at(94),
        title: "Running checks",
        message: "Build and smoke checks are underway.",
        stepId: "agent-verify",
        stepLabel: "Run checks",
        elapsedMs: 94_000
      },
      {
        id: "agent-14",
        taskId: "task_agent_01",
        type: "tool_finished",
        state: "synthesizing",
        timestamp: at(114),
        title: "Checks passed",
        message: "The verification suite finished without blocking failures.",
        tool: {
          name: "npm.run",
          detail: "lint, typecheck, tests, and build completed."
        },
        elapsedMs: 114_000
      },
      {
        id: "agent-15",
        taskId: "task_agent_01",
        type: "step_completed",
        state: "ready_for_review",
        timestamp: at(122),
        title: "Ready for review",
        message: "Diffs, artifacts, and next steps are bundled for inspection.",
        stepId: "agent-verify",
        stepLabel: "Run checks",
        elapsedMs: 122_000,
        artifact: {
          type: "bundle",
          id: "agent-review",
          label: "Review bundle",
          description: "Diff, screenshots, logs, and verification output."
        }
      }
    ]
  }
} satisfies Record<string, TaskScenario>;

export type ScenarioKey = keyof typeof scenarioCatalog;
export const scenarioList = Object.values(scenarioCatalog);
