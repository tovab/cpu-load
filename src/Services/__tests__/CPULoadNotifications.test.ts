import { notify } from "../CPULoadNotifications";

describe('notify function', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        ready: Promise.resolve({
          active: {
            postMessage: jest.fn(),
          },
        }),
      },
      writable: true
    });
  });

  test('should send the correct notification for EXCEEDED mode', async () => {
    const mockPostMessage = jest.fn();
    (navigator.serviceWorker.ready as Promise<any>).then((registration) => {
      registration.active.postMessage = mockPostMessage;
    });

    await notify('EXCEEDED');

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'SHOW_NOTIFICATION',
      title: 'High CPU Load',
    });
  });

  test('should send the correct notification for RECOVERED mode', async () => {
    const mockPostMessage = jest.fn();
    (navigator.serviceWorker.ready as Promise<any>).then((registration) => {
      registration.active.postMessage = mockPostMessage;
    });

    await notify('RECOVERED');

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'SHOW_NOTIFICATION',
      title: 'Recovered',
    });
  });
});
