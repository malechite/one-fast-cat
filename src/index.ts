import express from "express";
import { GPIO } from "./gpioController";
import { WheelService } from "./wheelService";

const app = express();
const port = 3000; // Example port

WheelService.init();

GPIO.initSensorListener((level, tick) => {
  WheelService.onTick(tick);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  // Other initialization logic can go here
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing GPIO resources");
  WheelService.kill();
  GPIO.cleanup();
  process.exit(0);
});
