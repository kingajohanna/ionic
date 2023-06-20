import axios from 'axios';
import { Point } from '../types/point';
import { environment } from 'src/environments/environment';
import { busRoutes } from '../data/lines';
import { getBusLine } from './getBusLine';
import { Route } from '../types/route';
import { BusRoute } from '../types/busRoute';
import { Stop } from '../types/stop';

enum Mode {
  WALKING = 'walking',
  DRIVING = 'driving',
}

export const getRouteDirection = async (startPoint: Point, endPoint: Point) => {
  const busline = getBusLine(startPoint, endPoint, busRoutes);

  const walkingRoute = await getCoords(startPoint, endPoint, Mode.WALKING);

  if (busline) {
    const firstBusStop = busline.stops[0].point;
    const lastBusStop = busline.stops[busline.stops.length - 1].point;

    const beforeBus = await getCoords(startPoint, firstBusStop!, Mode.WALKING);
    const { onBusCoords, busTripTime } = await getBusRoute(busline);
    const afterBus = await getCoords(lastBusStop!, endPoint, Mode.WALKING);

    if (
      walkingRoute.duration <
      beforeBus.duration + busTripTime + afterBus.duration
    )
      return {
        beforeBus: walkingRoute.geometry.coordinates,
        onBus: [],
        afterBus: [],
      } as Route;
    return {
      beforeBus: beforeBus.geometry.coordinates,
      onBus: onBusCoords,
      afterBus: afterBus.geometry.coordinates,
    } as Route;
  } else {
    return {
      beforeBus: walkingRoute.geometry.coordinates,
      onBus: [],
      afterBus: [],
    } as Route;
  }
};

const getBusRoute = async (busline: BusRoute) => {
  let coords: [number, number][] = [];
  let triptime = 0;

  let previousStop: Stop | null = null;

  for (const stop of busline.stops) {
    if (previousStop) {
      const onBus = await getCoords(
        previousStop.point,
        stop.point,
        Mode.DRIVING
      );
      coords = [...coords, ...onBus.geometry.coordinates];
      triptime += onBus.duration;
    }
    previousStop = stop;
  }

  return { onBusCoords: coords, busTripTime: triptime };
};

const getCoords = async (startPoint: Point, endPoint: Point, mode: string) => {
  try {
    const directionResponse = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/${mode}/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${endPoint.latitude}?alternatives=false&geometries=geojson&overview=simplified&steps=false&access_token=${environment.mapbox.accessToken}`
    );

    if (directionResponse.data?.code === 'Ok') {
      return directionResponse.data?.routes[0];
    }
  } catch (error) {
    return [];
  }
};
