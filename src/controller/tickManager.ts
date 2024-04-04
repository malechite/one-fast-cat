import { v4 as uuidv4 } from "uuid";
import { ServiceName, Session, Tick } from "../types";
import { calculateSpeedAndDistance, formatTimestamp, getAverageSpeed, getTopSpeed } from "../util";
import { WheelController } from "./wheelController";
import { TICK_COLLECTION_SIZE, TICK_PROCESS_INTERVAL } from "../constants";
import { app } from "../app";

const tickService = app.service(ServiceName.Ticks);
const sessionService = app.service(ServiceName.Sessions);

let ticks: Tick[] = [];
let history: Tick[] = [];
let session: Session | null = null;
let processInterval: NodeJS.Timeout | null = null;
let speedValues: number[] = [];

const startSession = async () => {
  if (session) return;

  session = {
    id: uuidv4(),
    distance: 0,
    startTime: Date.now(),
    duration: 0,
    averageSpeed: 0,
    topSpeed: 0,
    totalNumberOfTicks: 0,
  };

  await sessionService.create(session);
  startProcessor();
  console.log(`Session ${session?.id} started`);
};

const handleTick = (tick: number) => {
  if (!session && ticks.length >= TICK_COLLECTION_SIZE) startSession();

  const currentTick: Tick = { timestamp: Date.now(), raw: tick};
  ticks.push(currentTick);
};

const processTicks = () => {
  if (ticks.length < TICK_COLLECTION_SIZE) return console.log("Not enough data to process.");

  const elapsedTime = ticks[ticks.length - 1].timestamp - ticks[0].timestamp;
  const { speed, distance } = calculateSpeedAndDistance(ticks);

  console.log(`Processing ${ticks.length} ticks...`);
  ticks.forEach((tick) => tick.sessionId = session?.id);

  console.log(`setting speed to ${speed}`);
  WheelController.setSpeed(speed);
  speedValues.push(speed);
  updateSessionDistance(distance);
  console.log(`Elapsed Time: ${elapsedTime}ms`);
  resetTicks();
};

const updateSessionDistance = (distance: number) => {
  if (!session) return;
  session.distance += distance;
};

const resetTicks = async () => {
  console.log("Dumping ticks and resetting");
  await tickService.create(ticks);
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

  sessionService.update(session.id, session);
  logSessionToConsole();
  resetSession();
  stopProcessor();
};

const logSessionToConsole = () => {
  if (!session) return;
  const { id, distance, startTime, averageSpeed, topSpeed, endTime, totalNumberOfTicks } = session;
  console.log("--------------------");
  console.log(`Session ${id}`);
  console.log(`Distance: ${distance} miles`);
  console.log(`Start Time: ${formatTimestamp(startTime)}`);
  console.log(`End Time: ${formatTimestamp(endTime)}`);
  console.log(`Average Speed: ${averageSpeed} mph`);
  console.log(`Top Speed: ${topSpeed} mph`);
  console.log(`Total Number of Ticks: ${totalNumberOfTicks}`);
  console.log("--------------------");
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
