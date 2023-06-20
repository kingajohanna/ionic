import { BusRoute } from '../types/busRoute';
import { Point } from '../types/point';
import { Stop } from '../types/stop';

type BusStopDistance = {
  index: number;
  distance: number;
};

export function getBusLine(
  startPoint: Point,
  endPoint: Point,
  busRoutes: BusRoute[]
): BusRoute | null {
  let bestRoutePlanning: BusRoute | null = null;
  let shortestDistanceToTheBus = Infinity;

  busRoutes.map((busRoute) => {
    const stops = busRoute.stops;

    const startStop = findNearestStopIndex(startPoint, stops);
    const endStop = findNearestStopIndex(endPoint, stops);

    if (
      startStop.index !== -1 &&
      endStop.index !== -1 &&
      startStop.index < endStop.index
    ) {
      const distanceToTheStops = startStop.distance + endStop.distance;

      if (distanceToTheStops <= shortestDistanceToTheBus) {
        shortestDistanceToTheBus = distanceToTheStops;
        bestRoutePlanning = {
          name: busRoute.name,
          stops: stops.slice(startStop.index, endStop.index + 1),
        };
      }
    }
  });

  return bestRoutePlanning;
}

function findNearestStopIndex(point: Point, stops: Stop[]): BusStopDistance {
  let nearestStopIndex = -1;
  let shortestDistance = Infinity;

  stops.map((stop, index) => {
    const distance = calculateDistanceBetweenPoints(point, stop.point);

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestStopIndex = index;
    }
  });

  return { index: nearestStopIndex, distance: shortestDistance };
}

function calculateDistanceBetweenPoints(point1: Point, point2: Point) {
  if (
    point1.latitude == point2.latitude &&
    point1.longitude == point2.longitude
  ) {
    return 0;
  } else {
    var radlat1 = (Math.PI * point1.latitude) / 180;
    var radlat2 = (Math.PI * point2.latitude) / 180;
    var theta = point1.longitude - point2.longitude;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;

    return dist;
  }
}
