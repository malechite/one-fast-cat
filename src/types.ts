export interface Session {
  id: string;
  distance: number;
  startTime: string;
  endTime?: string;
  duration: number;
  averageSpeed: number;
  topSpeed: number;
  totalNumberOfTicks: number;
}

export enum Status {
  Idle = "idle",
  Active = "active",
}

export interface Tick {
  sessionId?: string;
  timestamp: number;
  raw: number;
}

export enum ServiceName {
  Ticks = "ticks",
  Sessions = "sessions",
}