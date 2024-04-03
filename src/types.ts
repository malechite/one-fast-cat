export interface Session {
  id: string;
  distance: number;
  startTime: number;
  endTime?: number;
  averageSpeed: number;
  topSpeed: number;
}

export enum Status {
  Idle = "idle",
  Active = "active",
}

export interface Tick {
  timestamp: number;
  raw: number;
}
