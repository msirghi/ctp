import TestHelper from '../../common/testHelper';
import Chance = require('chance');
import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import ErrorConstants from '../../constants/error.constants';
import { INTERFACE_TYPE } from '../../common/enums';

describe('PreferenceController', () => {
  const baseUrl = TestHelper.getApiEndpoint();
  const chance = new Chance();
  const userData = {
    email: chance.email(),
    password: 'StrongPass',
    firstName: 'first',
    lastName: 'last',
    username: chance.word({ length: 5 })
  };
  let accessToken: string;

  beforeAll(async () => {
    await TestHelper.requestHelper.post(`${baseUrl}/users`).send({ ...userData });
    await TestHelper.requestHelper
      .post(`${baseUrl}/auth`)
      .send({ email: userData.email, password: userData.password })
      .then((res) => {
        accessToken = res.body.accessToken;
      });
  });

  it('should throw an error if on updating language if prefs are not initialized', async () => {
    await request(baseUrl)
      .patch('/language')
      .set({ Authorization: `Bearer ${accessToken}` })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.PREFERENCES_NOT_INIT);
        }
      );
  });

  it('should throw an error if on updating interface if prefs are not initialized', async () => {
    await request(baseUrl)
      .patch('/interface')
      .set({ Authorization: `Bearer ${accessToken}` })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.PREFERENCES_NOT_INIT);
        }
      );
  });

  it('should throw an error if on getting the preferences if they are not initialized', async () => {
    await request(baseUrl)
      .get('/preferences')
      .set({ Authorization: `Bearer ${accessToken}` })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.PREFERENCES_NOT_INIT);
        }
      );
  });

  it('should init preferences', async () => {
    await request(baseUrl)
      .post('/preferences')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ interfaceType: 'DARK', language: 'en' })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.CREATED);
        expect(res.body.interfaceType).toBe(INTERFACE_TYPE.DARK);
        expect(res.body.language).toBe('en');
      });
  });

  it('should get user preferences', async () => {
    await request(baseUrl)
      .get('/preferences')
      .set({ Authorization: `Bearer ${accessToken}` })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.OK);
        expect(res.body.interfaceType).toBe(INTERFACE_TYPE.DARK);
        expect(res.body.language).toBe('en');
      });
  });

  it('should update interface type', async () => {
    await request(baseUrl)
      .patch('/preferences/interface')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ type: INTERFACE_TYPE.LIGHT })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.OK);
      });

    await request(baseUrl)
      .get('/preferences')
      .set({ Authorization: `Bearer ${accessToken}` })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.OK);
        expect(res.body.interfaceType).toBe(INTERFACE_TYPE.LIGHT);
        expect(res.body.language).toBe('en');
      });
  });

  it('should update language type', async () => {
    await request(baseUrl)
      .patch('/preferences/language')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ language: 'DE' })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.OK);
      });

    await request(baseUrl)
      .get('/preferences')
      .set({ Authorization: `Bearer ${accessToken}` })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.OK);
        expect(res.body.interfaceType).toBe(INTERFACE_TYPE.LIGHT);
        expect(res.body.language).toBe('de');
      });
  });
});
