/**
 * Service that provides methos located to gps locations.
 */
export default class LocationService {}

/**
 * Retreives the device's location.
 * @return {Object} Coordinates object with lat and long attributes.
 */
LocationService.getDeviceLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (!position || !position.coords) {
        return reject(new Error('Empty coordinates'));
      }
      resolve(position.coords);
    }, reject);
  });
}
