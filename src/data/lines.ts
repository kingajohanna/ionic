import { BusRoute } from '../types/busRoute';
import l1 from './line1.json';
import l2 from './line2.json';
import l1R from './line1_reverse.json';
import l2R from './line2_reverse.json';

const line1: BusRoute = l1;
const line2: BusRoute = l2;
const line1R: BusRoute = l1R;
const line2R: BusRoute = l2R;

export const busRoutes: BusRoute[] = [line1, line2, line1R, line2R];
