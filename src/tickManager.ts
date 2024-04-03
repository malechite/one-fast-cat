import { v4 as uuidv4 } from "uuid";
import { Tick } from "./types";
import { calculateAverageSpeed } from "./util";
import { WheelService } from "./wheelService";

const TICK_COLLECTION_SIZE = 4;

let ticks: Tick[] = [];
let sessionId: string | null = null;
let processInterval: NodeJS.Timeout | null = null;

const init = () => resetProcessInterval();

const startSession = () => {
  if (sessionId) return;
  sessionId = uuidv4();
  console.log(`Session ${sessionId} started`);
};

const handleTick = (tick: number) => {
  if (!processInterval) init();
  const currentTick: Tick = { timestamp: Date.now(), raw: tick };
  ticks.push(currentTick);

  if (!sessionId && ticks.length >= TICK_COLLECTION_SIZE) startSession();
};

const processTicks = () => {
  if (ticks.length < TICK_COLLECTION_SIZE)
    return console.log("Not enough data to process.");

  const elapsedTime = ticks[ticks.length - 1].timestamp - ticks[0].timestamp;
  const averageSpeed = calculateAverageSpeed(ticks);

  console.log(`Processing ${ticks.length} ticks...`);
  ticks.forEach((tick) => console.log(`Tick: ${tick.timestamp}`));
  // Dump ticks to database here

  console.log(`setting speed to ${averageSpeed}`);
  WheelService.setSpeed(averageSpeed);
  console.log(`Elapsed Time: ${elapsedTime}ms`);
  resetTicks();
};

const resetTicks = () => {
  console.log("Resetting ticks");
  ticks = [];
};

const endSession = () => {
  sessionId = null;
  console.log("Session ended");
};

const resetProcessInterval = () => {
  if (processInterval) clearInterval(processInterval);
  processInterval = setInterval(processTicks, 5000);
};

export const TickManager = {
  handleTick,
  endSession,
};
