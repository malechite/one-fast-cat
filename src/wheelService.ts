enum Status {
  Idle = "idle",
  Active = "active",
}

const TICKS_PER_ROTATION = 16;
const HALF_ROTATION = TICKS_PER_ROTATION / 2;
const WHEEL_DIAMETER_INCHES = 43;
const CIRCUMFERENCE_INCHES = Math.PI * WHEEL_DIAMETER_INCHES;
const INCHES_PER_MILE = 63360; // 1 mile = 63,360 inches
const SECONDS_PER_HOUR = 3600;
let tickCount = 0;
let rotationCount = 0;
let lastTickTime = 0;
let status = Status.Idle;
let currentSpeed = 0; // in miles per hour
let activityCheckInterval: NodeJS.Timeout | null = null;

const updateStatus = () => {
  if (status === Status.Idle && tickCount > HALF_ROTATION) {
    status = Status.Active;
  }
};

const onRotationComplete = () => {
  console.log(`Wheel has completed ${rotationCount} rotations.`);
};

const resetIdleInterval = () => {
  if (activityCheckInterval) clearTimeout(activityCheckInterval);
  activityCheckInterval = setTimeout(() => {
    status = Status.Idle;
    currentSpeed = 0;
    rotationCount = 0;
    console.log(`Wheel is now idle.`);
  }, 10000); // 10 seconds of inactivity
};

const calculateSpeed = () => {
  if (tickCount === 0) {
    const currentTime = Date.now();
    const elapsedTimeInSeconds = (currentTime - lastTickTime) / 1000; // Convert ms to seconds

    console.log(
      `Elapsed Time for one rotation: ${elapsedTimeInSeconds} seconds`
    );
  }
};

const handleTick = (tick: number) => {
  const currentTime = Date.now();

  updateStatus();
  resetIdleInterval();
  tickCount++;

  if (tickCount >= TICKS_PER_ROTATION) {
    rotationCount++;
    tickCount = 0;
    onRotationComplete();
  }
  lastTickTime = currentTime;

  console.log(
    `Tick Count: ${tickCount}, State: ${status}, Current Speed: ${currentSpeed.toFixed(
      2
    )} mph`
  );
};

const init = () => {
  lastTickTime = Date.now();
  if (!activityCheckInterval) resetIdleInterval();
};

const kill = () => {
  if (activityCheckInterval) clearTimeout(activityCheckInterval);
  activityCheckInterval = null;
  console.log(`WheelService stopped.`);
};

export const WheelService = {
  handleTick,
  init,
  kill,
};
