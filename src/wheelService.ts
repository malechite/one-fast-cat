enum Status {
  Idle = "idle",
  Active = "active",
}

const TICKS_PER_ROTATION = 16;
const WHEEL_DIAMETER_INCHES = 43;
const CIRCUMFERENCE_INCHES = Math.PI * WHEEL_DIAMETER_INCHES;
const INCHES_PER_MILE = 63360; // 1 mile = 63,360 inches
const SECONDS_PER_HOUR = 3600;
let tickCount = 0;
let rotationCount = 0;
let lastRotationTime = 0;
let status = Status.Idle;
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
  if (status === Status.Idle && rotationCount > 0) {
    status = Status.Active;
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
  // Only calculate speed after completing a full rotation
  if (rotationCount > 0 && tickCount === 0) {
    const currentTime = Date.now();
    const timeElapsedInSeconds = (currentTime - lastRotationTime) / 1000;

    // Calculate speed based on the circumference and the time elapsed since the last rotation
    currentSpeed =
      (CIRCUMFERENCE_INCHES / INCHES_PER_MILE) *
      (SECONDS_PER_HOUR / timeElapsedInSeconds);

    lastRotationTime = currentTime;
  }
};

const configureIdleInterval = () => {
  if (activityCheckInterval) clearTimeout(activityCheckInterval);
  activityCheckInterval = setTimeout(() => {
    status = Status.Idle;
    currentSpeed = 0;
    console.log(`Wheel is now idle.`);
  }, 10000); // 10 seconds of inactivity
};

const init = () => {
  lastRotationTime = Date.now();
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
