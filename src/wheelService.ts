import { METRICS_UPDATE_INTERVAL } from "./constants";
import { TickManager } from "./tickManager";
import { Status } from "./types";

let status = Status.Idle;
let currentSpeed = 0; // in miles per hour
let activityCheckInterval: NodeJS.Timeout | null = null;
let metricUpdateInterval: NodeJS.Timeout | null = null;

const setStatus = (s: Status) => (status = s);
const setSpeed = (speed: number) => (currentSpeed = speed);

const init = () => {
  if (!activityCheckInterval) resetIdleInterval();
  if (!metricUpdateInterval) resetMetricUpdateInterval();
};

const onTick = (tick: number) => {
  TickManager.handleTick(tick);
  setStatus(Status.Active);
};

const updateMetrics = () => {};

const onRotationComplete = () => {
  console.log(`Wheel has completed ${0} rotations.`);
};

const resetIdleInterval = () => {
  if (activityCheckInterval) clearTimeout(activityCheckInterval);
  activityCheckInterval = setTimeout(idle, 10000); // 10 seconds of inactivity
};

const resetMetricUpdateInterval = () => {
  if (metricUpdateInterval) clearTimeout(metricUpdateInterval);
  metricUpdateInterval = setTimeout(updateMetrics, METRICS_UPDATE_INTERVAL);
};

const idle = () => {
  if (status !== Status.Idle) {
    status = Status.Idle;
    currentSpeed = 0;
    console.log(`Wheel is now idle.`);
  }
};

const kill = () => {
  if (activityCheckInterval) clearTimeout(activityCheckInterval);
  if (metricUpdateInterval) clearTimeout(metricUpdateInterval);
  activityCheckInterval = null;
  metricUpdateInterval = null;
  console.log(`WheelService stopped.`);
};

export const WheelService = {
  status,
  currentSpeed,
  onRotationComplete,
  setSpeed,
  onTick,
  init,
  kill,
};
