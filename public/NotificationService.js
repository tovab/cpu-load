self.addEventListener('message', event => {
    if (event.data.type === 'SHOW_NOTIFICATION') {
        const { title } = event.data;
        self.registration.showNotification(title, {
          icon: "public/assets/dd-favicon.png",
          body: 'Body text here',

        });

    }
});
