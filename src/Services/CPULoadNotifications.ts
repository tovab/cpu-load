import { MonitorMode } from "../types";

const MESSAGES: Record<MonitorMode, string> = {
  EXCEEDED: "High CPU Load",
  RECOVERED: "Recovered",
};

export function notify(mode: MonitorMode) {
  navigator.serviceWorker.ready.then((registration) => {
    registration?.active?.postMessage({
      type: "SHOW_NOTIFICATION",
      title: MESSAGES[mode],
    });
  });
}
