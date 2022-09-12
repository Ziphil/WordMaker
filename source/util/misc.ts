//

import {
  Random,
  Vector,
  vec
} from "excalibur";


export function tap<T>(self: T, callback: (value: T) => void): T {
  callback(self);
  return self;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, ratio: number): number;
export function lerp(start: Vector, end: Vector, ratio: number): Vector;
export function lerp(start: any, end: any, ratio: number): number | Vector {
  if (typeof start === "number") {
    return start * (1 - ratio) + end * ratio;
  } else {
    const x = lerp(start.x, end.x, ratio);
    const y = lerp(start.y, end.y, ratio);
    return vec(x, y);
  }
}

export function calcVectorFromDirection(direction: Direction): Vector {
  if (direction === "right") {
    return vec(1, 0);
  } else if (direction === "left") {
    return vec(-1, 0);
  } else if (direction === "down") {
    return vec(0, 1);
  } else if (direction === "up") {
    return vec(0, -1);
  } else {
    throw new Error("cannot happen");
  }
}

export function randomize(random: Random, value: number): number {
  return random.integer(value / 2, value * 3 / 2);
}

export type Direction = "right" | "left" | "down" | "up";