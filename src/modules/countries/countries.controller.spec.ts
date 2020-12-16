import ErrorConstants from '../../constants/error.constants';
import * as request from 'supertest';
import Chance = require('chance');
import TestHelper from '../../common/testHelper';
import { HttpStatus } from '@nestjs/common';

describe('CountriesController', () => {
  let createdId: string;
  const chance = new Chance();
  const newCountryName = chance.word({ length: 5 });
  const baseUrl = TestHelper.getApiEndpoint();

  beforeAll(async () => {
    await TestHelper.createUser();
  });

  it('should create new country', async () => {
    return TestHelper.requestHelper
      .post(`${baseUrl}/countries`)
      .send({ name: newCountryName })
      .then((response) => {
        expect(response.status).toBe(201);
        const { _id, name } = response.body;
        createdId = _id;
        expect(name).toBe(newCountryName);
      });
  });

  it('should throw an error if country is the same but with different case', async () => {
    return TestHelper.requestHelper
      .post(`${baseUrl}/countries`)
      .send({ name: newCountryName.toUpperCase() })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.EXISTING_COUNTRY_ERROR);
        }
      );
  });

  it('should throw an error on invalid country name', async () => {
    return TestHelper.requestHelper
      .post(`${baseUrl}/countries`)
      .send({ name: chance.word({ length: 2 }) })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(400);
          const { message } = err.response.body;
          expect(message).toBe(ErrorConstants.INVALID_COUNTRY_NAME);
        }
      );
  });

  it('should throw an error if name contains number', async () => {
    return TestHelper.requestHelper
      .post(`${baseUrl}/countries`)
      .send({ name: 'Country1' })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(400);
          const { message } = err.response.body;
          expect(message).toBe(ErrorConstants.INVALID_COUNTRY_NAME);
        }
      );
  });

  it('should get new country by id', async () => {
    return await request(`http://localhost:3000/api/v1`)
      .get(`/countries/${createdId}`)
      .then(
        (_) => {},
        (err) => {
          expect(err.response.status).toBe(200);
          const { _id, name } = err.response.body;
          expect(_id).toBe(createdId);
          expect(name).toBe(newCountryName);
        }
      );
  });

  it('should throw an error on duplicate country name', async () => {
    return await TestHelper.requestHelper
      .post(`${baseUrl}/countries`)
      .send({ name: newCountryName })
      .then(
        (_) => {},
        (err) => {
          const { message } = err.response.body;
          expect(err.status).toBe(400);
          expect(message).toBe(ErrorConstants.EXISTING_COUNTRY_ERROR);
        }
      );
  });

  it('should get a list of countries with newly created country', async () => {
    return await request(`http://localhost:3000/api/v1`)
      .get('/countries')
      .then((response) => {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();

        const country = response.body.find((val) => val._id === createdId);
        expect(country).toBeDefined();
      });
  });

  it('should update country by id', async () => {
    const newName = chance.word({ length: 5 });
    return await TestHelper.requestHelper
      .put(`${baseUrl}/countries/${createdId}`)
      .send({ name: newName })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(newName);
      });
  });

  it('should throw error on updating non-existing country', async () => {
    return await TestHelper.requestHelper
      .put(`${baseUrl}/countries/${createdId.slice(0, -1) + '1'}`)
      .send({ name: 'Updated' })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(400);
        }
      );
  });

  it('should delete country by id', async () => {
    return await TestHelper.requestHelper.delete(`${baseUrl}/countries/${createdId}`).then((response) => {
      expect(response.status).toBe(204);
    });
  });
});
