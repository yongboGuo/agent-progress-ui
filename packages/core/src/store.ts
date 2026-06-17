import type { AgentRunEvent, AgentRunSnapshot, AgentRunStore } from "./model";
import { reduceAgentRunEvents } from "./reducer";

function toArray(events: AgentRunEvent | AgentRunEvent[]): AgentRunEvent[] {
  return Array.isArray(events) ? events : [events];
}

export function createAgentRunStore(initialEvents: AgentRunEvent[] = []): AgentRunStore {
  let events = [...initialEvents];
  let snapshot = reduceAgentRunEvents(events);
  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((listener) => listener());
  }

  return {
    append(nextEvents) {
      events = [...events, ...toArray(nextEvents)];
      snapshot = reduceAgentRunEvents(events);
      notify();
      return snapshot;
    },
    getEvents() {
      return [...events];
    },
    getSnapshot() {
      return snapshot;
    },
    replace(nextEvents) {
      events = [...nextEvents];
      snapshot = reduceAgentRunEvents(events);
      notify();
      return snapshot;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}

export function appendAgentRunEvents(
  store: AgentRunStore,
  events: AgentRunEvent | AgentRunEvent[]
): AgentRunSnapshot {
  return store.append(events);
}

export function getAgentRunSnapshot(store: AgentRunStore): AgentRunSnapshot;
export function getAgentRunSnapshot(events: AgentRunEvent[]): AgentRunSnapshot;
export function getAgentRunSnapshot(input: AgentRunStore | AgentRunEvent[]): AgentRunSnapshot {
  if (Array.isArray(input)) {
    return reduceAgentRunEvents(input);
  }

  return input.getSnapshot();
}
