import type { CSSProperties } from "react";

export const defaultThemeVars = {
  "--task-ui-bg": "#0f1218",
  "--task-ui-panel": "#141923",
  "--task-ui-panel-soft": "#1a2230",
  "--task-ui-panel-strong": "#202b3c",
  "--task-ui-border": "rgba(227, 233, 255, 0.14)",
  "--task-ui-text": "#f5f7fb",
  "--task-ui-text-muted": "#8f9ab3",
  "--task-ui-accent": "#d7ff69",
  "--task-ui-accent-soft": "rgba(215, 255, 105, 0.16)",
  "--task-ui-success": "#8cf0c8",
  "--task-ui-warning": "#ffcb73",
  "--task-ui-danger": "#ff8383"
} as const;

export type TaskThemeVars = typeof defaultThemeVars;

export function createTaskThemeStyle(overrides?: Partial<TaskThemeVars>): CSSProperties {
  return { ...defaultThemeVars, ...overrides } as CSSProperties;
}
