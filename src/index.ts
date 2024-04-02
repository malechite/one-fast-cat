import express from "express";
import { GPIO } from "./gpioController";

const app = express();
const port = 3000; // Example port

GPIO.initSensorListener((level, tick) => {
  console.log(`Wheel tick detected at tick: ${tick}`);
  // Here you can add logic to handle the tick, such as calculating speed or distance
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  // Other initialization logic can go here
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing GPIO resources");

  GPIO.cleanup();
  process.exit(0);
});
