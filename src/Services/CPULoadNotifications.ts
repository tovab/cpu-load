import { MonitorMode } from "../types";


export function setupNotificationService(){
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/NotificationService.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted');
        } else {
            console.log('Notification permission denied');
        }
    });
  }
}


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


