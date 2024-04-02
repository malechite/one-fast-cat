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
let speedUpdateInterval: NodeJS.Timeout | null = null;

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

const resetSpeedInterval = () => {
  if (speedUpdateInterval) clearInterval(speedUpdateInterval);
  speedUpdateInterval = setInterval(() => {
    if (status === Status.Active) {
      console.log(`Current Speed: ${currentSpeed.toFixed(2)} mph`);
    }
  }, 500);
};

const calculateSpeed = () => {
  const elapsedTime = Date.now() - lastTickTime;
  const timePerRotation = elapsedTime * TICKS_PER_ROTATION;
  const inchesPerHour = CIRCUMFERENCE_INCHES / timePerRotation;
  currentSpeed = (inchesPerHour * SECONDS_PER_HOUR) / INCHES_PER_MILE;
};

const handleTick = (tick: number) => {
  updateStatus();
  resetIdleInterval();
  tickCount++;

  if (tickCount >= TICKS_PER_ROTATION) {
    rotationCount++;
    tickCount = 0;
    onRotationComplete();
  }
  calculateSpeed();
  console.log(
    `Tick Count: ${tickCount}, State: ${status}, Current Speed: ${currentSpeed.toFixed(
      2
    )} mph`
  );
  lastTickTime = Date.now();
};

const init = () => {
  lastTickTime = Date.now();
  if (!activityCheckInterval) resetIdleInterval();
  if (!speedUpdateInterval) resetSpeedInterval();
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
