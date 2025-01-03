import { setupNotificationService } from "../CPULoadNotifications";

describe("notify function", () => {
  const mockRequestPermission = jest.fn();
  const mockPostMessage = jest.fn();
  const mockRegister = jest.fn();

  beforeEach(() => {
    Object.defineProperty(navigator, "serviceWorker", {
      value: {
        register: mockRegister,

        ready: Promise.resolve({
          active: {
            postMessage: mockPostMessage,
          },
        }),
      },
      writable: true,
    });

    Object.defineProperty(window, "Notification", {
      value: { requestPermission: mockRequestPermission },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should post message to service worker when calling 'notify' if permissions were granted", async () => {
    mockRequestPermission.mockResolvedValueOnce("granted");
    const service = await setupNotificationService();
    await service.notify("EXCEEDED");
    expect(mockPostMessage).toHaveBeenCalledTimes(1);
  });

  test("should trigger a toast when calling 'notify' if permissions were denied", async () => {
    mockRequestPermission.mockResolvedValueOnce("denied");
    const service = await setupNotificationService();
    await service.notify("EXCEEDED");
    expect(mockPostMessage).toHaveBeenCalledTimes(0);
  });

  test("should send the correct notification for EXCEEDED mode", async () => {
    mockRequestPermission.mockResolvedValueOnce("granted");
    const service = await setupNotificationService();
    await service.notify("EXCEEDED");
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: "SHOW_NOTIFICATION",
      title: "High CPU Load",
    });
  });

  test("should send the correct notification for RECOVERED mode", async () => {
    mockRequestPermission.mockResolvedValueOnce("granted");
    const service = await setupNotificationService();
    await service.notify("RECOVERED");
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: "SHOW_NOTIFICATION",
      title: "Recovered",
    });
  });
});
