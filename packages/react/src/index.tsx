import type { TaskArtifact, TaskFeedItem, TaskSnapshot, TaskState, TaskTone, TaskStep } from "@agent-progress-ui/core";
import { stateMeta } from "@agent-progress-ui/core";
import type { CSSProperties } from "react";

export { createTaskThemeStyle, defaultThemeVars } from "./theme";

const toneColor: Record<TaskTone, string> = {
  neutral: "var(--task-ui-text-muted)",
  accent: "var(--task-ui-accent)",
  success: "var(--task-ui-success)",
  warning: "var(--task-ui-warning)",
  danger: "var(--task-ui-danger)"
};

const statusColor: Record<TaskStep["status"], string> = {
  pending: "var(--task-ui-text-muted)",
  active: "var(--task-ui-accent)",
  completed: "var(--task-ui-success)",
  failed: "var(--task-ui-danger)"
};

const shellStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  padding: "1rem",
  borderRadius: "28px",
  background:
    "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)) padding-box, linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02)) border-box",
  border: "1px solid transparent",
  color: "var(--task-ui-text)",
  boxShadow: "0 28px 80px rgba(4, 10, 22, 0.4)",
  backdropFilter: "blur(18px)"
};

const panelStyle: CSSProperties = {
  borderRadius: "22px",
  border: "1px solid var(--task-ui-border)",
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

function panelHeadingStyle(): CSSProperties {
  return {
    margin: 0,
    fontSize: "0.85rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--task-ui-text-muted)"
  };
}

function stepConnector(status: TaskStep["status"], isLast: boolean): CSSProperties {
  return {
    position: "absolute",
    top: "1.1rem",
    left: "0.5rem",
    width: "1px",
    height: isLast ? 0 : "calc(100% + 0.8rem)",
    background:
      status === "completed"
        ? "linear-gradient(to bottom, rgba(140, 240, 200, 0.8), rgba(140, 240, 200, 0.2))"
        : "rgba(255, 255, 255, 0.12)"
  };
}

export function TaskStateBadge({ state }: { state: TaskState }) {
  const meta = stateMeta[state];

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
        color: toneColor[meta.tone],
        background: meta.tone === "accent" ? "var(--task-ui-accent-soft)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${toneColor[meta.tone]}30`
      }}
    >
      <span
        style={{
          width: "0.5rem",
          height: "0.5rem",
          borderRadius: "999px",
          background: toneColor[meta.tone],
          boxShadow: `0 0 18px ${toneColor[meta.tone]}`
        }}
      />
      {meta.label}
    </span>
  );
}

export function TaskTimer({ elapsedMs }: { elapsedMs: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.45rem",
        color: "var(--task-ui-text-muted)",
        fontSize: "0.85rem"
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "0.42rem",
          height: "0.42rem",
          borderRadius: "999px",
          background: "var(--task-ui-accent)"
        }}
      />
      {formatElapsedMs(elapsedMs)}
    </span>
  );
}

export function LivenessPulse({ state }: { state: TaskState }) {
  const tone = toneColor[stateMeta[state].tone];

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

export function StageRail({ steps, activeStepId }: { steps: TaskStep[]; activeStepId?: string }) {
  return (
    <div style={{ ...panelStyle, minHeight: "100%" }}>
      <p style={panelHeadingStyle()}>Stage Rail</p>
      <div style={{ display: "grid", gap: "0.85rem", marginTop: "1rem" }}>
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId || step.status === "active";

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
                    background: statusColor[step.status],
                    boxShadow: isActive ? `0 0 24px ${statusColor[step.status]}` : "none"
                  }}
                />
                <span style={stepConnector(step.status, index === steps.length - 1)} />
              </div>
              <div
                style={{
                  borderRadius: "18px",
                  border: `1px solid ${isActive ? "rgba(215, 255, 105, 0.28)" : "var(--task-ui-border)"}`,
                  background: isActive ? "rgba(215, 255, 105, 0.08)" : "rgba(255,255,255,0.02)",
                  padding: "0.85rem 0.95rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "0.95rem" }}>{step.label}</strong>
                  <span style={{ color: statusColor[step.status], fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    {step.status}
                  </span>
                </div>
                <p style={{ margin: "0.45rem 0 0", color: "var(--task-ui-text-muted)", fontSize: "0.88rem", lineHeight: 1.55 }}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EvidenceItem({ item }: { item: TaskFeedItem }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "0.2rem",
        paddingBottom: "0.85rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
        <strong style={{ fontSize: "0.92rem" }}>{item.title}</strong>
        <span style={{ color: "var(--task-ui-text-muted)", fontSize: "0.75rem" }}>
          {item.elapsedMs ? formatElapsedMs(item.elapsedMs) : item.timestamp.slice(11, 16)}
        </span>
      </div>
      {item.message ? (
        <p style={{ margin: 0, color: "var(--task-ui-text-muted)", fontSize: "0.84rem", lineHeight: 1.55 }}>{item.message}</p>
      ) : null}
    </div>
  );
}

export function EvidenceFeed({ feed, maxItems = 6 }: { feed: TaskFeedItem[]; maxItems?: number }) {
  const items = feed.slice(-maxItems).reverse();

  return (
    <div style={panelStyle}>
      <p style={panelHeadingStyle()}>Evidence Feed</p>
      <div style={{ display: "grid", gap: "0.85rem", marginTop: "1rem" }}>
        {items.map((item) => (
          <EvidenceItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ArtifactPill({ artifact }: { artifact: TaskArtifact }) {
  return (
    <div
      style={{
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.04)",
        padding: "0.9rem"
      }}
    >
      <p style={{ margin: 0, color: "var(--task-ui-accent)", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {artifact.type}
      </p>
      <strong style={{ display: "block", marginTop: "0.35rem", fontSize: "0.98rem" }}>{artifact.label}</strong>
      {artifact.description ? (
        <p style={{ margin: "0.4rem 0 0", color: "var(--task-ui-text-muted)", fontSize: "0.84rem", lineHeight: 1.55 }}>
          {artifact.description}
        </p>
      ) : null}
    </div>
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
        color: active ? "var(--task-ui-accent)" : "var(--task-ui-text-muted)",
        fontSize: "0.8rem"
      }}
    >
      {label}
    </span>
  );
}

export interface TaskWorkbenchProps {
  snapshot: TaskSnapshot;
  headline?: string;
  subhead?: string;
  style?: CSSProperties;
}

export function TaskWorkbench({ snapshot, headline, subhead, style }: TaskWorkbenchProps) {
  return (
    <section style={{ ...shellStyle, ...style }}>
      <div
        style={{
          ...panelStyle,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <LivenessPulse state={snapshot.state} />
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
              <TaskStateBadge state={snapshot.state} />
              <TaskTimer elapsedMs={snapshot.elapsedMs} />
            </div>
            <strong style={{ display: "block", marginTop: "0.55rem", fontSize: "1.15rem" }}>{headline ?? snapshot.title}</strong>
            {subhead ?? snapshot.message ? (
              <p style={{ margin: "0.35rem 0 0", color: "var(--task-ui-text-muted)", maxWidth: "42rem", lineHeight: 1.6 }}>
                {subhead ?? snapshot.message}
              </p>
            ) : null}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
          <ActionChip label="Cancel" active={snapshot.canCancel} />
          <ActionChip label="Background" active={snapshot.canBackground} />
          <ActionChip label="Review" active={snapshot.canReview} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
        }}
      >
        <StageRail steps={snapshot.steps} activeStepId={snapshot.activeStepId} />
        <div style={{ display: "grid", gap: "1rem" }}>
          <div style={panelStyle}>
            <p style={panelHeadingStyle()}>Artifacts</p>
            <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
              {snapshot.artifacts.length ? (
                snapshot.artifacts.map((artifact) => <ArtifactPill key={artifact.id} artifact={artifact} />)
              ) : (
                <p style={{ margin: 0, color: "var(--task-ui-text-muted)", fontSize: "0.88rem" }}>
                  No reviewable artifact yet. The system is still gathering proof.
                </p>
              )}
            </div>
          </div>
          <EvidenceFeed feed={snapshot.feed} />
        </div>
      </div>
    </section>
  );
}
