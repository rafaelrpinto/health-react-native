import {AsyncStorage} from 'react-native'
import ApiClient from '../api/ApiClient'

export default class CacheService {}

// cache keys
const CACHE_REGION = "@HealthAppCache"
const DB_VERSION_KEY = `${CACHE_REGION}:db_version`;
const TYPES = `${CACHE_REGION}:facility_types`;
const OPENING_HOURS = `${CACHE_REGION}:opening_hours`;
const SERVICES = `${CACHE_REGION}:medical_services`;

CacheService.loadCache = async() => {
  let cachedDbVersion = await get(DB_VERSION_KEY);
  console.log(`Cached db version: ${cachedDbVersion}`);

  if (cachedDbVersion) {
    // we already have local cache, now we check if it's updated
    let currentDbVersion = await ApiClient.getDbVersion();

    console.log(`Backend db version: ${currentDbVersion.version}`);

    if (cachedDbVersion == currentDbVersion.version) {
      console.log('DB version up-to-date. No need to fetch elements from the backend...');
    } else {

      // local cache is obsolete, fetching new objects...
      console.log('Fetching updated objects....');

      let [types,
        openingHours,
        services] = await Promise.all([ApiClient.getFacilityTypes(), ApiClient.getOpeningHours(), ApiClient.getServices()]);

      // cache the received values
      await cacheInitialEnums(currentDbVersion, types, openingHours, services);
    }

  } else {

    console.log('Fetching backend objects....');

    // no local data, fetch everything together to make things faster...
    let [currentDbVersion,
      types,
      openingHours,
      services] = await Promise.all([ApiClient.getDbVersion(), ApiClient.getFacilityTypes(), ApiClient.getOpeningHours(), ApiClient.getServices()]);

    // cache the received values
    await cacheInitialEnums(currentDbVersion, types, openingHours, services);
  }

  console.log('Done...');
}

/**
 * Caches the objects retrieved in the inital data laod.
 * @param  {Object} currentDbVersion Current version of the database.
 * @param  {Array} types            Facility types.
 * @param  {Array} openingHours     Opening hours list.
 * @param  {Array} services         Medical services.
 * @return {Promise}                  A promise to store the elements.
 */
function cacheInitialEnums(currentDbVersion, types, openingHours, services) {
  console.log('Objects received. Caching...');

  return Promise.all([
    set(DB_VERSION_KEY, currentDbVersion.version),
    set(TYPES, types),
    set(OPENING_HOURS, openingHours),
    set(SERVICES, services)
  ]);
}

/**
 * Caches an object.
 * @param {String} key   Cache key.
 * @return {Object} cached object.
 */
function get(key) {
  //FIXME: Redundant promise as workaround of AsyncStorage not fullfiling primises
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key, (err, cacheItem) => {
      if (err)
        return reject(err);
      if (cacheItem) {
        cacheItem = JSON.parse(cacheItem);
      }
      resolve(cacheItem);
    });
  });
}

/**
 * Caches an object.
 * @param {String} key   Cache key.
 * @param {Object} value Cached value.
 */
function set(key, value) {
  //FIXME: Redundant promise as workaround of AsyncStorage not fullfiling primises
  return new Promise((resolve, reject) => {
    AsyncStorage.setItem(key, JSON.stringify(value), (err, result) => {
      if (err)
        return reject(err);
      resolve(result);
    });
  });
}
