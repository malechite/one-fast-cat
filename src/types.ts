export interface Session {}

export enum Status {
  Idle = "idle",
  Active = "active",
}

export interface Tick {
  timestamp: number;
  raw: number;
}
