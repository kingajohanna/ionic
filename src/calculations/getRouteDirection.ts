import axios from 'axios';
import { Point } from '../types/point';
import { environment } from 'src/environments/environment';
import { busRoutes } from '../data/lines';
import { getBusLine } from './getBusLine';
import { Route } from '../types/route';

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

    const coords: [number, number][] = [];
    busline.stops.forEach((stop) => {
      coords.push([stop.point.longitude, stop.point.latitude]);
    });

    const beforeBus = await getCoords(startPoint, firstBusStop!, Mode.WALKING);
    const onBus = await getCoords(firstBusStop!, lastBusStop!, Mode.DRIVING);
    const afterBus = await getCoords(lastBusStop!, endPoint, Mode.WALKING);

    if (
      walkingRoute.duration <
      beforeBus.duration + onBus.duration + afterBus.duration
    )
      return {
        beforeBus: walkingRoute.geometry.coordinates,
        onBus: [],
        afterBus: [],
      } as Route;
    return {
      beforeBus: beforeBus.geometry.coordinates,
      onBus: coords,
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
