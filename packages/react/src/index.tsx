"use client";

import type {
  AgentApproval,
  AgentArtifact,
  AgentTone,
  AgentRunSnapshot,
  AgentRunStageRail,
  AgentRunStore,
  AgentRunEvidence,
  AgentTimelineItem,
  AgentRunStatus
} from "@agent-progress-ui/core";
import { agentStatusMeta } from "@agent-progress-ui/core";
import type { CSSProperties, ReactNode } from "react";
import { useDeferredValue, useSyncExternalStore } from "react";

export { createAgentThemeStyle, defaultAgentThemeVars } from "./theme";

const toneColor: Record<AgentTone, string> = {
  neutral: "var(--agent-ui-text-muted)",
  accent: "var(--agent-ui-accent)",
  success: "var(--agent-ui-success)",
  warning: "var(--agent-ui-warning)",
  danger: "var(--agent-ui-danger)"
};

const shellStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  padding: "1rem",
  borderRadius: "28px",
  background:
    "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)) padding-box, linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02)) border-box",
  border: "1px solid transparent",
  color: "var(--agent-ui-text)",
  boxShadow: "0 28px 80px rgba(4, 10, 22, 0.4)",
  backdropFilter: "blur(18px)"
};

const panelStyle: CSSProperties = {
  borderRadius: "22px",
  border: "1px solid var(--agent-ui-border)",
  background: "rgba(15, 18, 24, 0.56)",
  padding: "1rem"
};

function formatElapsedMs(elapsedMs: number): string {
  const totalSeconds = Math.floor(elapsedMs / 1_000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function heading(text: string): ReactNode {
  return (
    <p
      style={{
        margin: 0,
        fontSize: "0.85rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--agent-ui-text-muted)"
      }}
    >
      {text}
    </p>
  );
}

function StateBadge({ status }: { status: AgentRunStatus }) {
  const meta = agentStatusMeta[status];
  const color = toneColor[meta.tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.55rem",
        padding: "0.5rem 0.9rem",
        borderRadius: "999px",
        fontSize: "0.8rem",
        fontWeight: 600,
        color,
        background: meta.tone === "accent" ? "var(--agent-ui-accent-soft)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${color}30`
      }}
    >
      <span
        style={{
          width: "0.5rem",
          height: "0.5rem",
          borderRadius: "999px",
          background: color,
          boxShadow: `0 0 18px ${color}`
        }}
      />
      {meta.label}
    </span>
  );
}

function LivenessPulse({ status }: { status: AgentRunStatus }) {
  const tone = toneColor[agentStatusMeta[status].tone];

  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" width="40" height="40">
      <circle cx="20" cy="20" r="6" fill={tone} />
      <circle cx="20" cy="20" r="10" stroke={tone} strokeWidth="1.5" fill="none" opacity="0.7">
        <animate attributeName="r" values="10;16;10" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.72;0.08;0.72" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="20" r="14" stroke={tone} strokeWidth="1" fill="none" opacity="0.2">
        <animate attributeName="r" values="14;19;14" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function ActionChip({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.45rem 0.78rem",
        borderRadius: "999px",
        border: `1px solid ${active ? "rgba(215, 255, 105, 0.3)" : "rgba(255,255,255,0.08)"}`,
        background: active ? "rgba(215, 255, 105, 0.08)" : "rgba(255,255,255,0.02)",
        color: active ? "var(--agent-ui-accent)" : "var(--agent-ui-text-muted)",
        fontSize: "0.8rem"
      }}
    >
      {label}
    </span>
  );
}

export function AgentHeader({
  header,
  approvals
}: {
  header: AgentRunSnapshot["header"];
  approvals: AgentApproval[];
}) {
  return (
    <section
      style={{
        ...panelStyle,
        display: "grid",
        gap: "1rem"
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <LivenessPulse status={header.status} />
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
              <StateBadge status={header.status} />
              <span style={{ color: "var(--agent-ui-text-muted)", fontSize: "0.85rem" }}>
                {formatElapsedMs(header.elapsedMs)}
              </span>
            </div>
            <strong style={{ display: "block", marginTop: "0.55rem", fontSize: "1.15rem" }}>{header.title}</strong>
            {header.summary ? (
              <p style={{ margin: "0.35rem 0 0", color: "var(--agent-ui-text-muted)", maxWidth: "42rem", lineHeight: 1.6 }}>
                {header.summary}
              </p>
            ) : null}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
          <ActionChip label={header.currentPhase} active />
          <ActionChip label={header.isBackgrounded ? "Backgrounded" : "Foreground"} active={header.isBackgrounded} />
          <ActionChip label={approvals.some((approval) => approval.status === "pending") ? "Approval open" : "No approval"} active={approvals.some((approval) => approval.status === "pending")} />
        </div>
      </div>
      {header.wait ? (
        <div
          style={{
            borderRadius: "18px",
            border: "1px solid rgba(255, 203, 115, 0.28)",
            background: "rgba(255, 203, 115, 0.08)",
            padding: "0.9rem 1rem"
          }}
        >
          <strong style={{ display: "block", fontSize: "0.95rem", color: "var(--agent-ui-warning)" }}>{header.wait.label}</strong>
          <p style={{ margin: "0.35rem 0 0", color: "var(--agent-ui-text)", lineHeight: 1.6 }}>{header.wait.description}</p>
        </div>
      ) : null}
    </section>
  );
}

export function AgentApprovalBar({ approvals }: { approvals: AgentApproval[] }) {
  return (
    <section style={panelStyle}>
      {heading("Approval Bar")}
      <div style={{ display: "grid", gap: "0.85rem", marginTop: "1rem" }}>
        {approvals.length === 0 ? (
          <p style={{ margin: 0, color: "var(--agent-ui-text-muted)", lineHeight: 1.6 }}>
            No explicit approvals are currently open on this run.
          </p>
        ) : (
          approvals.map((approval) => (
            <div
              key={approval.id}
              style={{
                borderRadius: "18px",
                border: `1px solid ${
                  approval.status === "approved"
                    ? "rgba(140, 240, 200, 0.24)"
                    : approval.status === "rejected"
                      ? "rgba(255, 131, 131, 0.24)"
                      : "rgba(255, 203, 115, 0.28)"
                }`,
                background:
                  approval.status === "approved"
                    ? "rgba(140, 240, 200, 0.08)"
                    : approval.status === "rejected"
                      ? "rgba(255, 131, 131, 0.08)"
                      : "rgba(255, 203, 115, 0.08)",
                padding: "0.95rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "baseline" }}>
                <strong style={{ fontSize: "0.95rem" }}>{approval.label}</strong>
                <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--agent-ui-text-muted)" }}>
                  {approval.status}
                </span>
              </div>
              <p style={{ margin: "0.45rem 0 0", color: "var(--agent-ui-text-muted)", lineHeight: 1.55 }}>{approval.description}</p>
              {approval.resolutionNote ? (
                <p style={{ margin: "0.55rem 0 0", color: "var(--agent-ui-text)", fontSize: "0.84rem", lineHeight: 1.55 }}>
                  {approval.resolutionNote}
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function AgentStageRail({ stageRail }: { stageRail: AgentRunStageRail }) {
  return (
    <section style={{ ...panelStyle, minHeight: "100%" }}>
      {heading("Stage Rail")}
      <div style={{ display: "grid", gap: "0.85rem", marginTop: "1rem" }}>
        {stageRail.steps.map((step, index) => {
          const isActive = step.id === stageRail.activeStepId || step.status === "active";
          const color =
            step.status === "completed"
              ? "var(--agent-ui-success)"
              : step.status === "failed"
                ? "var(--agent-ui-danger)"
                : step.status === "active"
                  ? "var(--agent-ui-accent)"
                  : "var(--agent-ui-text-muted)";

          return (
            <div
              key={step.id}
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "1.4rem 1fr",
                gap: "0.9rem"
              }}
            >
              <div style={{ position: "relative", paddingTop: "0.25rem" }}>
                <span
                  style={{
                    display: "block",
                    width: "1rem",
                    height: "1rem",
                    borderRadius: "999px",
                    background: color,
                    boxShadow: isActive ? `0 0 24px ${color}` : "none"
                  }}
                />
                {index < stageRail.steps.length - 1 ? (
                  <span
                    style={{
                      position: "absolute",
                      top: "1.1rem",
                      left: "0.5rem",
                      width: "1px",
                      height: "calc(100% + 0.8rem)",
                      background: step.status === "completed" ? "linear-gradient(to bottom, rgba(140, 240, 200, 0.8), rgba(140, 240, 200, 0.2))" : "rgba(255,255,255,0.12)"
                    }}
                  />
                ) : null}
              </div>
              <div
                style={{
                  borderRadius: "18px",
                  border: `1px solid ${isActive ? "rgba(215, 255, 105, 0.28)" : "var(--agent-ui-border)"}`,
                  background: isActive ? "rgba(215, 255, 105, 0.08)" : "rgba(255,255,255,0.02)",
                  padding: "0.85rem 0.95rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "0.95rem" }}>{step.label}</strong>
                  <span style={{ color, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>{step.status}</span>
                </div>
                <p style={{ margin: "0.45rem 0 0", color: "var(--agent-ui-text-muted)", fontSize: "0.88rem", lineHeight: 1.55 }}>
                  {step.detail ?? step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function AgentTimeline({ timeline }: { timeline: AgentTimelineItem[] }) {
  const items = useDeferredValue(timeline);

  return (
    <section style={panelStyle}>
      {heading("Timeline")}
      <div style={{ display: "grid", gap: "0.9rem", marginTop: "1rem" }}>
        {items.slice().reverse().map((item) => (
          <div key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
              <strong style={{ fontSize: "0.92rem" }}>{item.title}</strong>
              <span style={{ color: "var(--agent-ui-text-muted)", fontSize: "0.75rem" }}>{item.timestamp.slice(11, 19)}</span>
            </div>
            <p style={{ margin: "0.3rem 0 0", color: "var(--agent-ui-text-muted)", fontSize: "0.84rem", lineHeight: 1.55 }}>
              {item.detail ?? item.eventType}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AgentEvidencePanel({ evidence }: { evidence: AgentRunEvidence }) {
  const entries = useDeferredValue(evidence.entries);

  return (
    <section style={panelStyle}>
      {heading("Evidence")}
      <div style={{ display: "grid", gap: "0.85rem", marginTop: "1rem" }}>
        {entries.length === 0 ? (
          <p style={{ margin: 0, color: "var(--agent-ui-text-muted)", lineHeight: 1.6 }}>
            No evidence has been attached to this run yet.
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              style={{
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                padding: "0.85rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
                <strong style={{ fontSize: "0.92rem" }}>{entry.title}</strong>
                <span style={{ color: "var(--agent-ui-text-muted)", fontSize: "0.75rem" }}>{entry.timestamp.slice(11, 19)}</span>
              </div>
              {entry.detail ? (
                <p style={{ margin: "0.35rem 0 0", color: "var(--agent-ui-text-muted)", fontSize: "0.84rem", lineHeight: 1.55 }}>
                  {entry.detail}
                </p>
              ) : null}
              <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginTop: "0.55rem" }}>
                <ActionChip label={entry.kind} active={entry.kind === "tool" || entry.kind === "output"} />
                {entry.status ? <ActionChip label={entry.status} active={entry.status === "pending" || entry.status === "running"} /> : null}
                {entry.meta ? <ActionChip label={entry.meta} active={false} /> : null}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function AgentArtifactDock({ artifacts }: { artifacts: AgentArtifact[] }) {
  return (
    <section style={panelStyle}>
      {heading("Artifact Dock")}
      <div style={{ display: "grid", gap: "0.85rem", marginTop: "1rem" }}>
        {artifacts.length === 0 ? (
          <p style={{ margin: 0, color: "var(--agent-ui-text-muted)", lineHeight: 1.6 }}>
            No artifacts have been created yet.
          </p>
        ) : (
          artifacts.map((artifact) => (
            <div
              key={artifact.id}
              style={{
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                padding: "0.9rem"
              }}
            >
              <p style={{ margin: 0, color: "var(--agent-ui-accent)", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {artifact.type}
              </p>
              <strong style={{ display: "block", marginTop: "0.35rem", fontSize: "0.98rem" }}>{artifact.label}</strong>
              {artifact.description ? (
                <p style={{ margin: "0.4rem 0 0", color: "var(--agent-ui-text-muted)", fontSize: "0.84rem", lineHeight: 1.55 }}>
                  {artifact.description}
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function AgentInspector({ snapshot }: { snapshot: AgentRunSnapshot }) {
  return (
    <section style={panelStyle}>
      {heading("Inspector")}
      <pre
        style={{
          margin: "1rem 0 0",
          overflowX: "auto",
          borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(9,12,18,0.72)",
          padding: "1rem",
          fontSize: "0.76rem",
          lineHeight: 1.65
        }}
      >
        {JSON.stringify(snapshot, null, 2)}
      </pre>
    </section>
  );
}

export function useAgentRun(store: AgentRunStore): AgentRunSnapshot {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

type SnapshotProps = {
  snapshot: AgentRunSnapshot;
  store?: never;
  style?: CSSProperties;
};

type StoreProps = {
  store: AgentRunStore;
  snapshot?: never;
  style?: CSSProperties;
};

export type AgentWorkbenchProps = SnapshotProps | StoreProps;

export function AgentWorkbench(props: AgentWorkbenchProps) {
  const liveSnapshot = props.store !== undefined ? useAgentRun(props.store) : props.snapshot;
  const snapshot = useDeferredValue(liveSnapshot);
  const shouldEmphasizeArtifacts = snapshot.header.status === "completed" || snapshot.header.status === "failed";

  return (
    <section style={{ ...shellStyle, ...props.style }}>
      <AgentHeader header={snapshot.header} approvals={snapshot.approvals} />
      {snapshot.approvals.some((approval) => approval.status === "pending") ? (
        <AgentApprovalBar approvals={snapshot.approvals} />
      ) : null}
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "minmax(0,0.8fr) minmax(0,1.2fr)"
        }}
      >
        <AgentStageRail stageRail={snapshot.stageRail} />
        <AgentTimeline timeline={snapshot.timeline} />
      </div>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: shouldEmphasizeArtifacts ? "minmax(0,1fr) minmax(0,1fr)" : "minmax(0,1.2fr) minmax(0,0.8fr)"
        }}
      >
        <AgentEvidencePanel evidence={snapshot.evidence} />
        <AgentArtifactDock artifacts={snapshot.artifacts} />
      </div>
      <AgentInspector snapshot={snapshot} />
    </section>
  );
}
