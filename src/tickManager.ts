import { v4 as uuidv4 } from "uuid";
import { Session, Tick } from "./types";
import { calculateSpeedAndDistance, formatTimestamp, getAverageSpeed, getTopSpeed } from "./util";
import { WheelService } from "./wheelService";
import { TICK_PROCESS_INTERVAL } from "./constants";

const TICK_COLLECTION_SIZE = 4;

let ticks: Tick[] = [];
let history: Tick[] = [];
let session: Session | null = null;
let processInterval: NodeJS.Timeout | null = null;
let speedValues: number[] = [];

const startSession = () => {
  if (session) return;

  session = {
    id: uuidv4(),
    distance: 0,
    startTime: Date.now(),
    averageSpeed: 0,
    topSpeed: 0,
    totalNumberOfTicks: 0,
  };

  startProcessor();
  console.log(`Session ${session?.id} started`);
};

const handleTick = (tick: number) => {
  if (!session && ticks.length >= TICK_COLLECTION_SIZE) startSession();

  const currentTick: Tick = { timestamp: Date.now(), raw: tick };
  ticks.push(currentTick);
};

const processTicks = () => {
  if (ticks.length < TICK_COLLECTION_SIZE) return console.log("Not enough data to process.");

  const elapsedTime = ticks[ticks.length - 1].timestamp - ticks[0].timestamp;
  const { speed, distance } = calculateSpeedAndDistance(ticks);

  console.log(`Processing ${ticks.length} ticks...`);
  ticks.forEach((tick) => {
    tick.sessionId = session?.id;
    console.log(`Tick: ${tick.timestamp}`);
  });

  console.log(`setting speed to ${speed}`);
  WheelService.setSpeed(speed);
  speedValues.push(speed);
  updateSessionDistance(distance);
  console.log(`Elapsed Time: ${elapsedTime}ms`);
  resetTicks();
};

const updateSessionDistance = (distance: number) => {
  if (!session) return;
  session.distance += distance;
};

const resetTicks = () => {
  console.log("Dumping ticks and resetting");
  // Dump ticks to database here
  history.push(...ticks);
  ticks = [];
};

const resetSession = () => {
  session = null;
  history = [];
  ticks = [];
  speedValues = [];
  console.log("Session reset");
};

const endSession = () => {
  if (!session) return;
  session.endTime = Date.now();
  session.averageSpeed = getAverageSpeed(speedValues);
  session.topSpeed = getTopSpeed(speedValues);
  session.totalNumberOfTicks = history.length + ticks.length;

  const { id, distance, startTime, averageSpeed, topSpeed, endTime, totalNumberOfTicks } = session;
  // Dump session to database here
  console.log("--------------------");
  console.log(`Session ${id} ended`);
  console.log(`Distance: ${distance} miles`);
  console.log(`Start Time: ${formatTimestamp(startTime)}`);
  console.log(`End Time: ${formatTimestamp(endTime)}`);
  console.log(`Average Speed: ${averageSpeed} mph`);
  console.log(`Top Speed: ${topSpeed} mph`);
  console.log(`Total Number of Ticks: ${totalNumberOfTicks}`);
  console.log("--------------------");
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
