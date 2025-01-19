# CPU Load Monitor

(Based on the requirements described [here](https://app.greenhouse.io/tests/5a6c8661af03f5050ac3760cd413e845))\
The application retrieves load data every 10 seconds.\
The application will show a notification when the load value is at 1 or more for at least 2 minutes.\
The application will show a notification when the load value is recovered (load value under 1 for at least 2 minutes).\
If notifications are enabled in the browser for this site, then the browser will show a notification, even if the user is on a different tab. If notifications are not allowed/enabled, a toast will be shown on the tab.\
The chart displays the CPU load over a ten minute window.\
There is a CPU stress testing feature included - the user can intentionally stress the CPU in order to see the CPU load rise.\
The application will retrieve data from the local server at http://localhost:3001. Please run the application "cpu-load" which is shipped along with this FE application.

## Available Scripts

In the project directory, you can run:

### `npm start`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### `npm test`

## Next steps:

- 🧭 Notification permission request should be in response to a user action - this is necessary in order to display notifications from Safari, and also provides a better UX than requesting on page load.
- 🌍 Add internationalization and localization.
- 🚨 Add error handling - logging and also displaying to the user. (In this POC, errors are just logged to the console.)
- 💾 Consider persisting data in the BE so that data will be consistent - it can fetch data even when the FE application is not running, and can continue to fetch consistently while the application is in the background (currently, if the user switches tabs the fetch interval may slow down).
- 📊 The data in the list should be more granular/detailed - example: how long did the high load last for? how high was it?
- 💹 Better chart display: for example, show label at the minute interval on the x-axis
- ⚙️ Add functionality for the user to control the threshold for alerts, and to control the time window for the chart.
- 🎨 Consult with a designer to improve the UI!
- 🎓 Get some code review - especially since this is my first React application!
