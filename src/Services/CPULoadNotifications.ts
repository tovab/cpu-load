function showNotification(title: string) {
  navigator.serviceWorker.ready.then((registration) => {
    registration?.active?.postMessage({
      type: "SHOW_NOTIFICATION",
      title,
    });
  });
}
export function alertExceeded() {
  showNotification("High CPU Load");
}

export function notifyRecovered() {
  showNotification("Recovered");
}
