const TICKS_PER_ROTATION = 16;
const WHEEL_DIAMETER_INCHES = 43;
const CIRCUMFERENCE_INCHES = Math.PI * WHEEL_DIAMETER_INCHES;
const INCHES_PER_MILE = 63360; // 1 mile = 63,360 inches
const SECONDS_PER_HOUR = 3600;
let tickCount = 0;
let rotationCount = 0;
let lastTickTime = 0;
let status = "idle"; // Possible values: "idle", "active"
let currentSpeed = 0; // in miles per hour
let activityCheckInterval: NodeJS.Timeout | null = null;
let speedUpdateInterval: NodeJS.Timeout | null = null;

const handleTick = (tick: number) => {
  updateStatus();
  countTicks();
  calculateSpeed();
  configureIdleInterval();

  console.log(
    `Tick Count: ${tickCount}, State: ${status}, Current Speed: ${currentSpeed.toFixed(
      2
    )} mph`
  );
};

const updateStatus = () => {
  if (status === "idle" && rotationCount > 0) {
    status = "active";
  }
};

const countTicks = () => {
  tickCount++;
  if (tickCount >= TICKS_PER_ROTATION) {
    rotationCount++;
    tickCount = 0;
  }
};

const calculateSpeed = () => {
  const currentTime = Date.now();
  const timeElapsedInSeconds = (currentTime - lastTickTime) / 1000;
  const rotationsPerSecond = 1 / timeElapsedInSeconds;
  currentSpeed =
    (CIRCUMFERENCE_INCHES * rotationsPerSecond * SECONDS_PER_HOUR) /
    INCHES_PER_MILE;
  lastTickTime = currentTime;
};

const configureIdleInterval = () => {
  if (activityCheckInterval) clearTimeout(activityCheckInterval);
  activityCheckInterval = setTimeout(() => {
    status = "idle";
    currentSpeed = 0;
    console.log(`Wheel is now idle.`);
  }, 10000); // 10 seconds of inactivity
};

const init = () => {
  lastTickTime = Date.now();
  if (!activityCheckInterval) configureIdleInterval();
};

const kill = () => {
  if (activityCheckInterval) clearTimeout(activityCheckInterval);
  if (speedUpdateInterval) clearInterval(speedUpdateInterval);
  activityCheckInterval = null;
  speedUpdateInterval = null;
  console.log(`WheelService stopped.`);
};

export const WheelService = {
  handleTick,
  init,
  kill,
};
