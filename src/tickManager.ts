import { v4 as uuidv4 } from "uuid";
import { Session, Tick } from "./types";
import { calculateSpeedAndDistance } from "./util";
import { WheelService } from "./wheelService";
import { TICK_PROCESS_INTERVAL } from "./constants";
import { DateTime } from "luxon";

const TICK_COLLECTION_SIZE = 4;
const history: Tick[] = [];

let ticks: Tick[] = [];
let session: Session | null = null;
let processInterval: NodeJS.Timeout | null = null;

const init = () => startProcessor();

const startSession = () => {
  if (session) return;

  session = {
    id: uuidv4(),
    distance: 0,
    startTime: Date.now(),
    averageSpeed: 0,
    topSpeed: 0,
  };

  console.log(`Session ${session.id} started`);
};

const handleTick = (tick: number) => {
  if (!processInterval) init();
  const currentTick: Tick = { timestamp: Date.now(), raw: tick };
  ticks.push(currentTick);

  if (!session && ticks.length >= TICK_COLLECTION_SIZE) startSession();
};

const processTicks = () => {
  if (ticks.length < TICK_COLLECTION_SIZE)
    return console.log("Not enough data to process.");

  const elapsedTime = ticks[ticks.length - 1].timestamp - ticks[0].timestamp;
  const { speed, distance } = calculateSpeedAndDistance(ticks);

  console.log(`Processing ${ticks.length} ticks...`);
  ticks.forEach((tick) => console.log(`Tick: ${tick.timestamp}`));
  // Dump ticks to database here

  console.log(`setting speed to ${speed}`);
  WheelService.setSpeed(speed);
  updateSessionDistance(distance);
  console.log(`Elapsed Time: ${elapsedTime}ms`);
  resetTicks();
};

const updateSessionDistance = (distance: number) => {
  if (!session) return;
  session.distance += distance;
};

const resetTicks = () => {
  console.log("Resetting ticks");
  history.push(...ticks);
  ticks = [];
};

const resetSession = () => {
  session = null;
  console.log("Session reset");
};

const endSession = () => {
  if (!session) return;
  session.endTime = Date.now();

  const { id, distance, startTime, averageSpeed, topSpeed, endTime } = session;
  // Dump session to database here
  console.log(`Session ${id} ended`);
  console.log(`Distance: ${distance} miles`);
  console.log(`Start Time: ${DateTime.fromMillis(startTime).toISO()}`);
  console.log(
    `End Time: ${DateTime.fromMillis(endTime || Date.now()).toISO()}`
  );
  console.log(`Average Speed: ${averageSpeed} mph`);
  console.log(`Top Speed: ${topSpeed} mph`);
  resetSession();
  stopProcessor();
};

const startProcessor = () => {
  stopProcessor();
  processInterval = setInterval(processTicks, TICK_PROCESS_INTERVAL);
};

const stopProcessor = () => {
  if (processInterval) clearInterval(processInterval);
};

export const TickManager = {
  handleTick,
  endSession,
};
