import { DateTime } from "luxon";
import {
  CAT_WHEEL_CIRCUMFERENCE_INCHES,
  GEAR_RATIO,
  INCHES_PER_MILE,
  MS_PER_SECOND,
  SECONDS_PER_HOUR,
} from "./constants";
import { Tick } from "./types";

interface SpeedAndDistance {
  speed: number;
  distance: number;
}

export const calculateSpeedAndDistance = (ticks: Tick[]): SpeedAndDistance => {
  if (ticks.length < 2) return { speed: 0, distance: 0 }; // Need at least two ticks to calculate speed

  // Calculate the distance per tick on the cat wheel considering the gear ratio
  const distancePerTickInches = CAT_WHEEL_CIRCUMFERENCE_INCHES / GEAR_RATIO;

  // Calculate total distance
  const totalTicks = ticks.length - 1; // Subtract one to get intervals between ticks
  const totalDistanceInches = totalTicks * distancePerTickInches;

  // Calculate total time in hours
  const startTime = ticks[0].timestamp;
  const endTime = ticks[ticks.length - 1].timestamp;
  const totalTimeHours = timeToHours(endTime - startTime);

  // Calculate speed in mph
  const totalDistanceMiles = totalDistanceInches / INCHES_PER_MILE;
  const speed = totalDistanceMiles / totalTimeHours;

  return { speed, distance: totalDistanceMiles };
};

export const getTopSpeed = (speedValues: number[]): number => Math.max(...speedValues);

export const getAverageSpeed = (speedValues: number[]): number => {
  const totalSpeed = speedValues.reduce((acc, speed) => acc + speed, 0);
  return totalSpeed / speedValues.length;
};

export const timeToHours = (time: number): number => {
  return time / MS_PER_SECOND / SECONDS_PER_HOUR;
};

export const formatTimestamp = (timestamp?: number): string => timestamp ? DateTime.fromMillis(timestamp).toFormat("dd/MM/yyyy HH:mm:ss") : ""
