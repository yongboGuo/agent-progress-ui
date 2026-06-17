import type { CSSProperties } from "react";

export const defaultAgentThemeVars = {
  "--agent-ui-bg": "#0f1218",
  "--agent-ui-panel": "#141923",
  "--agent-ui-panel-soft": "#1a2230",
  "--agent-ui-panel-strong": "#202b3c",
  "--agent-ui-border": "rgba(227, 233, 255, 0.14)",
  "--agent-ui-text": "#f5f7fb",
  "--agent-ui-text-muted": "#8f9ab3",
  "--agent-ui-accent": "#d7ff69",
  "--agent-ui-accent-soft": "rgba(215, 255, 105, 0.16)",
  "--agent-ui-success": "#8cf0c8",
  "--agent-ui-warning": "#ffcb73",
  "--agent-ui-danger": "#ff8383"
} as const;

export type AgentThemeVars = typeof defaultAgentThemeVars;

export function createAgentThemeStyle(overrides?: Partial<AgentThemeVars>): CSSProperties {
  return { ...defaultAgentThemeVars, ...overrides } as CSSProperties;
}
