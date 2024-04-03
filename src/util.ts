import { DateTime } from "luxon";
import {
  INCHES_PER_MILE,
  MS_PER_SECOND,
  ROLLERBLADE_CIRCUMFERENCE_INCHES,
  SECONDS_PER_HOUR,
} from "./constants";
import { Tick } from "./types";

interface SpeedAndDistance {
  speed: number;
  distance: number;
}

export const calculateSpeedAndDistance = (ticks: Tick[]): SpeedAndDistance => {
  if (ticks.length < 2) return { speed: 0, distance: 0 }; // Need at least two ticks to calculate speed

  // Calculate total distance
  const totalTicks = ticks.length;
  const totalDistanceInches = totalTicks * ROLLERBLADE_CIRCUMFERENCE_INCHES;

  // Calculate total time in hours
  const startTime = ticks[0].timestamp;
  const endTime = ticks[ticks.length - 1].timestamp;
  const totalTimeHours = timeToHours(endTime - startTime);

  // Calculate speed in mph
  const totalDistanceMiles = totalDistanceInches / INCHES_PER_MILE;
  const speed = totalDistanceMiles / totalTimeHours;

  return { speed, distance: totalDistanceMiles };
};

export const getTopSpeed = (speedValues: number[]): number =>
  Math.max(...speedValues);

export const getAverageSpeed = (speedValues: number[]): number => {
  const totalSpeed = speedValues.reduce((acc, speed) => acc + speed, 0);
  return totalSpeed / speedValues.length;
};

export const timeToHours = (time: number): number => {
  return time / MS_PER_SECOND / SECONDS_PER_HOUR;
};

export const formatTimestamp = (timestamp: number): string => {
  return DateTime.fromMillis(timestamp).toFormat("dd/MM/yyyy HH:mm:ss");
};
