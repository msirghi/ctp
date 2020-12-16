// problems API
const PROBLEM_BY_ID_OK = 'Returns problem by id';
const PROBLEM_BY_ID_NOT_FOUND = 'Country/location/problem were not found';
const GET_PROBLEMS_BY_LOCATION_OK = 'Returns all problems by location';
const GET_PROBLEMS_BY_LOCATION_NOT_FOUND = 'Location/problem were not found';
const PROBLEM_CREATED = 'Creates new problem';
const PROBLEM_CREATION_NOT_FOUND = 'Country/location were not found';
const PROBLEM_UPDATE_OK = 'Updates an existing problem';
const PROBLEM_NAME_UPDATE = 'Updated problem name';
const PROBLEM_DELETE = 'Deletes problem by id';
const PROBLEM_VIEWS_UPDATE = 'Updates views of the problem';

// locations API
const LOCATION_CREATED = 'Creates new location';
const LOCATIONS_BY_COUNTRY = 'Returns all locations by country';
const LOCATION_NOT_FOUND = 'Location not found';
const GET_LOCATION_BY_ID = 'Returns location by country and id';
const GET_LOCATION_BY_ID_ONLY = 'Returns location by id';
const LOCATION_DELETE = 'Deleted location by id';
const LOCATION_UPDATE = 'Updates location by id';
const LOCATION_UPDATE_NAME = 'Updates location name by id';
const LOCATION_UPDATE_POPULATION = 'Updates location population by id';

// country API
const COUNTRY_NOT_FOUND = 'Country was not found';
const GET_COUNTRY_BY_ID = 'Retrieves country by id';
const GET_COUNTRY_LIST = 'Retrieves list of countries';
const CREATE_COUNTRY = 'Creates new country';
const REMOVE_COUNTRY = 'Removes country by id';
const UPDATE_COUNTRY = 'Updates country by id';

// users API
const REGISTER = 'Registers new user';
const REGISTER_BAD_REQUEST = 'Email/username is taken or the password is weak';
const GET_LOGGED_IN_INFO = 'Returns logged in user info';
const UPDATE_FIRST_NAME = 'Updates first name';
const UPDATE_LAST_NAME = 'Updates last name';
const INVALID_NAME = 'Invalid name';
const UPDATE_PASSWORD = 'Updates user password';

// auth API
const LOGIN = 'Loggs in user';
const INVALID_CREDENTIALS = 'Invalid credentials';

// preference API
const PREFERENCE_INIT = 'Initializes user preferences';
const PREFERENCE_NOT_INIT = 'Preferences were not initialized';
const INTERFACE_UPDATE = 'Updates users interface mode';
const INTERFACE_LANGUAGE_UPDATE = 'Updates users language';

// common
const NOT_AUTH = 'Auth token is missing or invalid';
const FORBIDDEN = 'Lack of permissions for this operation.';
const INVALID_DATA = 'Invalid data';

export default {
  INTERFACE_UPDATE,
  INTERFACE_LANGUAGE_UPDATE,
  PREFERENCE_INIT,
  PREFERENCE_NOT_INIT,
  LOGIN,
  INVALID_CREDENTIALS,
  UPDATE_PASSWORD,
  UPDATE_FIRST_NAME,
  UPDATE_LAST_NAME,
  GET_LOGGED_IN_INFO,
  INVALID_NAME,
  REGISTER,
  REGISTER_BAD_REQUEST,
  UPDATE_COUNTRY,
  REMOVE_COUNTRY,
  CREATE_COUNTRY,
  GET_COUNTRY_LIST,
  GET_COUNTRY_BY_ID,
  LOCATION_UPDATE_POPULATION,
  LOCATION_UPDATE_NAME,
  INVALID_DATA,
  PROBLEM_BY_ID_OK,
  PROBLEM_BY_ID_NOT_FOUND,
  GET_PROBLEMS_BY_LOCATION_OK,
  GET_PROBLEMS_BY_LOCATION_NOT_FOUND,
  NOT_AUTH,
  PROBLEM_CREATED,
  PROBLEM_CREATION_NOT_FOUND,
  FORBIDDEN,
  PROBLEM_UPDATE_OK,
  PROBLEM_NAME_UPDATE,
  PROBLEM_DELETE,
  PROBLEM_VIEWS_UPDATE,
  LOCATION_CREATED,
  COUNTRY_NOT_FOUND,
  LOCATIONS_BY_COUNTRY,
  LOCATION_NOT_FOUND,
  GET_LOCATION_BY_ID,
  GET_LOCATION_BY_ID_ONLY,
  LOCATION_DELETE,
  LOCATION_UPDATE
};
