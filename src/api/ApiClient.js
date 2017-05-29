/**
 * Class responsible for the communication with the api backend.
 */
export default class ApiClient {}

//FIXME hardcoded local IP
const API_ENDPOINT = "http://192.168.1.76:8080";

/**
 * Retreives the database version from the backend.
 */
ApiClient.getDbVersion = async() => {
  return getEnum('/db_version', 'Error retrieving db version');
}

/**
 * Retreives the facility types from the backend.
 */
ApiClient.getFacilityTypes = async() => {
  return getEnum('/facility/types', 'Error retrieving facility types');
}

/**
 * Retreives the facility types from the backend.
 */
ApiClient.getOpeningHours = async() => {
  return getEnum('/facility/opening_hours', 'Error retrieving facility opening hours');
}

/**
 * Retrieves all facility ids within 2km radius of a coordinate.
 * @type {Promise} Promise to resolve an array of facility ids / coordinates.
 */
ApiClient.getNearestFacilities = async(latitude, longitude) => {
  try {
    let response = await fetch(`${API_ENDPOINT}/facility/nearest/${latitude}/${longitude}`);

    setTimeout(() => null, 0); //remote debugging workaround

    assertSuccess(response.status);
    let responseJson = await response.json();
    return responseJson;
  } catch (err) {
    console.log(`Error retrieving nearest facilties ${err}`);
    throwInternalError();
  }
}

/**
 * Retreives the medical services from the backend.
 */
ApiClient.getServices = async() => {
  return getEnum('/facility/services', 'Error retrieving medical services list');
}

/**
 * Common function that retrieves enums form the backend.
 * @param  {String} uri              Method uri.
 * @param  {String} errorDescription Description in case of an error.
 * @return {Promise}                  Promise to fullfil the request.
 */
async function getEnum(uri, errorDescription) {
  try {
    let response = await fetch(`${API_ENDPOINT}${uri}`);

    setTimeout(() => null, 0); //remote debugging workaround

    assertSuccess(response.status);
    let responseJson = await response.json();
    return responseJson;
  } catch (err) {
    console.log(`${errorDescription} ${err}`);
    throwInternalError();
  }
}

/**
 * Asserts if it's a successful HTTP response code.
 * @param  {Integer} status HTTP response code.
 */
function assertSuccess(status) {
  if (!status || status < 200 || status >= 400) {
    throwStatuCodeError(status);
  }
}

/**
 * Just throws an internal error.
 */
function throwInternalError() {
  throwStatuCodeError(500);
}

/**
 * Throws an error with a specific code.
 * @param  {Integer} code Code to be thrown.
 */
function throwStatuCodeError(code) {
  let error = new Error('Server returned HTTP code ' + code);
  error.statusCode = code;
  throw error;
}
