import supercluster from 'supercluster';
import {Dimensions} from 'react-native';

const CLUSTER_MAX_ZOOM = 20;

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
 * Converts a facility to GeoJson.
 * @param  {Object} facility Facility to be converted.
 * @return {Object}          Facility in geojson format.
 */
LocationService.toGeoJson = (facility) => {
  return {
    "type": "Feature",
    "id": facility.id,
    "geometry": {
      "type": "Point",
      "coordinates": [
        parseFloat(facility.longitude),
        parseFloat(facility.latitude)
      ]
    },
    "properties": {
      "facilityId": facility.id
    }
  };
}

/**
 * Creates clusters of facilities.
 * @param  {Array} facilities Facilities to be clustered.
 * @param  {Object} region     Location region.
 * @return {Object}            Object with the cluster index and the clusters for theregion.
 */
LocationService.createClusters = (facilities, region) => {
  let index = supercluster({radius: 50, maxZoom: CLUSTER_MAX_ZOOM});
  index.load(facilities.map((facility) => {
    return LocationService.toGeoJson(facility);
  }));

  const padding = 0.25;
  let clusters = index.getClusters([
    region.longitude - (region.longitudeDelta * (0.5 + padding)),
    region.latitude - (region.latitudeDelta * (0.5 + padding)),
    region.longitude + (region.longitudeDelta * (0.5 + padding)),
    region.latitude + (region.latitudeDelta * (0.5 + padding))
  ], LocationService.getZoomLevel(region));

  return {index, clusters}
}

/**
 * Backtracking search that retreives the facilities within a point.
 * @param  {Object} point      Target point.
 * @param  {Object} clusterIndex Global cluster index.
 * @param  {Integer} zoomLevel    Current map zoom level.
 * @return {Array}              Array of features with the facilities datda.
 */
LocationService.getClusterFacilities = (point, clusterIndex, zoomLevel) => {
  if (point.id) {
    //leaf node
    return [point];
  }

  // try to get the childtren at this zoom level
  let children = clusterIndex.getChildren(point.properties.cluster_id, zoomLevel);

  // search deeper
  zoomLevel++;

  // get the child of the child...
  let facilities = [];
  for (let child of children) {
    // get childrens facilities
    facilities = facilities.concat(LocationService.getClusterFacilities(child, clusterIndex, zoomLevel));
  }

  // all of the facilities on this branch
  return facilities;
}

/**
 * Calculated the zoom level based on a region.
 * @param  {Object} region Location region.
 * @return {Integer}        zoom level based on a region.
 */
LocationService.getZoomLevel = (region) => {
  // http://stackoverflow.com/a/6055653
  const angle = region.longitudeDelta;
  // 0.95 for finetuning zoomlevel grouping
  return Math.round(Math.log(360 / angle) / Math.LN2);
}

/**
 * Calculates a region based on coordinates.
 * @param  {Number} latitude  Latitude.
 * @param  {Number} longitude Longitude.
 * @return {[type]}           A region for the coordinates.
 */
LocationService.getRegion = (latitude, longitude) => {
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.09219923956647946;

  return {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO
  }
}
