export type MonitorData = { time: Date };

export type MonitorMode = "EXCEEDED" | "RECOVERED";

export type MonitorHistory = { [key in MonitorMode]: MonitorData[] };

/** This is the type that should be used in the BE service as well. */
export type CpuLoad = {
  average: number;
  time: Date;
};
