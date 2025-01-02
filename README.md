# CPU Load Monitor

(Based on the requirements described [here](https://app.greenhouse.io/tests/5a6c8661af03f5050ac3760cd413e845))\
The application retrieves load data every 10 seconds.\
The application will show a notification when the load value is at 1 or more for at least 2 minutes.\
The application will show a notification when the load value is recovered (load value under 1 for at least 2 minutes).\
The chart displays the CPU load over a ten minute window.
There is a CPU stress testing feature included - the user can intentionally stress the CPU in order to see the CPU load rise.\
The application will retrieve data from the local server at http://localhost:3001. Please run the application "cpu-load" which is shipped along with this FE application.

## Available Scripts

In the project directory, you can run:

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

## To do - ie. if this was a production application...

- Add i18n and l10n.
- Add error handling - logging and also displaying to the user.
- The application will not fetch data as often while running in the background. If consistent fetching is needed, implement a solution for this.
- The data in the list should be more granular/detailed - example: how long did the high load last for? how high was it?
- Consider persisting data in the BE
- Consider asking the user to allow notifications at a more optimal time (not immediately on page load) - either at a delay after page load, or in response to some action
- Better chart display: for example, show label at the minute interval on the x-axis
- Consult with a designer to improve the UI!
