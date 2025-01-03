this.addEventListener("message", (event) => {
  if (event.data.type === "SHOW_NOTIFICATION") {
    const { title } = event.data;
    this.registration.showNotification(title);
  }
});
