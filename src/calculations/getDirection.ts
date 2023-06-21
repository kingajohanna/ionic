import { busRoutes } from '../data/lines';
import { BusRoute } from '../types/busRoute';
import { Stop } from '../types/stop';

export const getRouteAndDirection = (stop: Stop) => {
  const routeAndDirection = busRoutes.find((route) => {
    return route.stops.filter(
      (s) => s.name === stop.name && s.times[0] === stop.times[0]
    );
  });

  console.log('***', routeAndDirection);

  if (routeAndDirection) {
    const lastStop =
      routeAndDirection.stops[routeAndDirection.stops.length - 1];
    return {
      route: routeAndDirection.name,
      direction: lastStop.name,
    };
  }

  return null; // Return null if the route and direction are not found
};
