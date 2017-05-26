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

/**
 * Hack that calculates coords deltas.
 * @see https://github.com/airbnb/react-native-maps/issues/505
 *
 * @param  {Number} lat      Latitude.
 * @param  {Number} lon      Longitude.
 * @param  {Integer} distance Distance in meters.
 * @return {Number}          The delta (we hope).
 */
LocationService.getDelta = (lat, lon, distance) => {
  distance = distance / 2
  const circumference = 40075
  const oneDegreeOfLatitudeInMeters = 111.32 * 1000
  const angularDistance = distance / circumference

  const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
  const longitudeDelta = Math.abs(Math.atan2(Math.sin(angularDistance) * Math.cos(lat), Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

  return {latitude: lat, longitude: lon, latitudeDelta, longitudeDelta}
}
