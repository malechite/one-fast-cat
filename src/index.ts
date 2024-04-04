import { app } from "./app";
import { logger } from "./logger";
import { GPIO } from "./controller/gpioController";
import { WheelController } from "./controller/wheelController";

const port = app.get("port");
const host = app.get("host");

process.on("unhandledRejection", (reason) => logger.error("Unhandled Rejection %O", reason));

GPIO.initSensorListener((level, tick) => {
  WheelController.onTick(tick);
});

app.listen(port).then(() => {
  logger.info(`Feathers app listening on http://${host}:${port}`);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing GPIO resources");
  WheelController.kill();
  GPIO.cleanup();
  process.exit(0);
});
