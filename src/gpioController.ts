import { Gpio } from "pigpio";

const TICKS_PER_ROTATION = 100;
let tickCount = 0;
let rotationCount = 0;

const WHEEL_TICK_DEBOUNCE_MICROSECONDS = 1000; // Example value, adjust based on testing

const sensor = new Gpio(17, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP,
  alert: true,
});

// Apply a glitch filter to ignore noise shorter than a set threshold
sensor.glitchFilter(WHEEL_TICK_DEBOUNCE_MICROSECONDS);

export const GPIO = {
  sensor,
  initSensorListener: (onTick: (level: number, tick: number) => void) => {
    sensor.on("alert", (level, tick) => {
      if (level === 0) {
        tickCount++;
        console.log("Tick Count", tickCount);
        onTick(level, tick);

        if (tickCount >= TICKS_PER_ROTATION) {
          rotationCount++;
          console.log(`Wheel has completed ${rotationCount} rotation(s)`);
          tickCount = 0; // Reset tick count after counting a full rotation
        }
      }
    });
  },
  cleanup: () => {
    sensor.disableAlert(); // Disable alerts
  },
};
