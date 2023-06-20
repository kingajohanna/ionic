import { Point } from './point';

export interface Stop {
  point: Point;
  name: string;
  times: string[];
}
