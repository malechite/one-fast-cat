import { Gpio } from "pigpio";

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
      if (level === 0) onTick(level, tick);
    });
  },
  cleanup: () => {
    sensor.disableAlert(); // Disable alerts
  },
};
