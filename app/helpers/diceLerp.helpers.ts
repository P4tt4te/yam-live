import { MathUtils } from "three";

export const DiceLerp = (current: number, position: number, add = 0) =>
  MathUtils.lerp(current, position + add, 0.05);
