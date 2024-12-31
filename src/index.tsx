import React from 'react';
import ReactDOM, { Container } from 'react-dom/client';
import App from './Components/App';


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

const root = ReactDOM.createRoot(document.getElementById('root') as Container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);