import { MonitorMode } from "../types";
import { toast } from "react-toastify";


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
interface NotificationService {
  notify: (mode: MonitorMode) => void;
}
class SWNotificationService implements NotificationService {
  notify(mode: MonitorMode) {
    navigator.serviceWorker.ready.then((registration) => {
      registration?.active?.postMessage({
        type: "SHOW_NOTIFICATION",
        title: MESSAGES[mode],
      });
    });
  }
}

class ToastNotificationService implements NotificationService {
  notify(mode: MonitorMode) {
    toast(MESSAGES[mode]);
  }
}

export async function setupNotificationService(): Promise<NotificationService> {
  if (
    !("serviceWorker" in navigator) ||
    !("Notification" in window) ||
    !navigator.serviceWorker.ready
  ) {
    console.warn(
      "Service workers or notifications not supported. Falling back to toast notifications."
    );
    return new ToastNotificationService();
  }
  try {
    await navigator.serviceWorker.register("/NotificationServiceWorker.js");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn(
        "Notification permission not granted. Falling back to toast notifications."
      );
      return new ToastNotificationService();
    }
    return new SWNotificationService();
  } catch (error) {
    console.error("Failed to initialize notification service:", error);
    return new ToastNotificationService();
  }
}


