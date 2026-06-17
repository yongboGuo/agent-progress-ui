import { startTransition } from "react";

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
};

export function runWithViewTransition(update: () => void) {
  if (typeof document === "undefined") {
    startTransition(update);
    return;
  }

  const viewDocument = document as TransitionDocument;

  if (typeof viewDocument.startViewTransition === "function") {
    viewDocument.startViewTransition(() => {
      startTransition(update);
    });
    return;
  }

  startTransition(update);
}
