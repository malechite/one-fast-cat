import { METRICS_UPDATE_INTERVAL } from "../constants";
import { TickManager } from "./tickManager";
import { Status } from "../types";

let status = Status.Idle;
let currentSpeed = 0; // in miles per hour
let idleTimer: NodeJS.Timeout | null = null;
let reportingInterval: NodeJS.Timeout | null = null;

const setStatus = (s: Status) => (status = s);
const setSpeed = (speed: number) => (currentSpeed = speed);

const init = () => {
  if (!idleTimer) resetIdleTimer();
  if (!reportingInterval) resetReportingInterval();
};

const onTick = (tick: number) => {
  TickManager.handleTick(tick);
  setStatus(Status.Active);
  resetIdleTimer();
};

const updateMetrics = () => {};

const onRotationComplete = () => {
  console.log(`Wheel has completed ${0} rotations.`);
};

const resetIdleTimer = () => {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(idle, 10000); // 10 seconds of inactivity
};

const resetReportingInterval = () => {
  if (reportingInterval) clearInterval(reportingInterval);
  reportingInterval = setInterval(updateMetrics, METRICS_UPDATE_INTERVAL);
};

const idle = () => {
  if (status !== Status.Idle) {
    TickManager.endSession();
    status = Status.Idle;
    currentSpeed = 0;
    console.log(`Wheel is now idle.`);
  }
};

const kill = () => {
  if (idleTimer) clearTimeout(idleTimer);
  if (reportingInterval) clearTimeout(reportingInterval);
  idleTimer = null;
  reportingInterval = null;
  console.log(`WheelController stopped.`);
};

export const WheelController = {
  status,
  currentSpeed,
  onRotationComplete,
  setSpeed,
  onTick,
  init,
  kill,
};
