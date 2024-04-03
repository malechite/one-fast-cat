export interface Session {
  id: string;
  distance: number;
  startTime: number;
  endTime?: number;
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
