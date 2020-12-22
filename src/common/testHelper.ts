import * as request from 'supertest';
import Chance = require('chance');

require('dotenv').config();
const defaults = require('superagent-defaults');

const chance = new Chance();
const defaultUserEmail = process.env.DEFAULT_USER_EMAIL;
const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD;

const userData = {
  email: defaultUserEmail,
  password: defaultUserPassword,
  firstName: 'first',
  lastName: 'last',
  username: chance.word({ length: 5 })
};

let accessToken;

const createUser = async () => {
  await request('http://localhost:3000/api/v1')
    .post('/users')
    .send({ ...userData });

  await request('http://localhost:3000/api/v1')
    .post('/auth')
    .send({ email: userData.email, password: userData.password })
    .then((response) => {
      const { accessToken } = response.body;
      setAccessToken(accessToken);
    });
};

const superagent = defaults();
const requestHelper = {
  init: () => superagent.set('Authorization', `Bearer ${getAccessToken()}`),
  delete: (url) => requestHelper.init().delete(url),
  get: (url) => requestHelper.init().get(url),
  post: (url) => requestHelper.init().post(url),
  put: (url) => requestHelper.init().put(url),
  patch: (url) => requestHelper.init().patch(url)
};

const setAccessToken = (at: string) => {
  accessToken = at;
};

const getAccessToken = () => {
  return accessToken;
};

const API_ENDPONT = `${process.env.API_ENDPOINT}/api/v${process.env.API_VERSION}`;

export default {
  createUser,
  getAccessToken,
  requestHelper,
  getApiEndpoint: () => API_ENDPONT,
  getUserData: () => userData
};
