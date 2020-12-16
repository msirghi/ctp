import * as request from 'supertest';
import Chance = require('chance');
import ErrorConstants from '../../constants/error.constants';
import TestHelper from '../../common/testHelper';
import { HttpStatus } from '@nestjs/common';

describe('LocationController', () => {
  let createdCountryId: string;
  let createdLocationId: string;
  const chance = new Chance();
  const locationName = chance.word({ length: 5 });
  const baseUrl = TestHelper.getApiEndpoint();

  beforeAll(async () => {
    await TestHelper.createUser();
  });

  const newCountryName = chance.word({ length: 5 });

  beforeAll(async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries`)
      .send({ name: newCountryName })
      .then((response) => {
        const { _id } = response.body;
        createdCountryId = _id;
      });
  });

  afterAll(async () => {
    await TestHelper.requestHelper.delete(`${baseUrl}/countries/${createdCountryId}`);
  });

  it('should create a region for an existing country', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/${createdCountryId}/locations`)
      .send({ name: locationName })
      .then((response) => {
        expect(response.status).toBe(HttpStatus.CREATED);
        const { _id, name } = response.body;
        createdLocationId = _id;
        expect(name).toBe(locationName);
      });
  });

  it('should throw an error on existing location for specific country', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/${createdCountryId}/locations`)
      .send({ name: locationName })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          const { message } = err.response.body;
          expect(message).toBe(ErrorConstants.LOCATION_IS_ALREADY_EXISTING);
        }
      );
  });

  it('should throw an error on non-existing country', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/1/locations`)
      .send({ name: locationName })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          const { message } = err.response.body;
          expect(message).toBe(ErrorConstants.INVALID_DATA_SUPPLIED);
        }
      );
  });

  it('should throw an error on two-letter location name', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/${createdCountryId}/locations`)
      .send({ name: 'ad' })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          const { message } = err.response.body;
          expect(message).toBeDefined();
        }
      );
  });

  it('should throw an error on location name with number', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/${createdCountryId}/locations`)
      .send({ name: 'ad12' })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          const { message } = err.response.body;
          expect(message).toBeDefined();
        }
      );
  });

  it('should get location by id', async () => {
    await request(`http://localhost:3000/api/v1`)
      .get(`/countries/${createdCountryId}/locations/${createdLocationId}`)
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
        const { name } = response.body;
        expect(name).toBe(locationName);
      });
  });

  it('should throw an error on non-existing location', async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/countries/${createdCountryId}/locations/id/123`).then(
      () => {},
      (err) => {
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        const { message } = err.response.body;
        expect(message).toBe(ErrorConstants.LOCATION_NOT_FOUND);
      }
    );
  });

  it('should throw an error on getting non-existing country or location', async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/countries/${createdCountryId}/locations/123`).then(
      () => {},
      (err) => {
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        const { message } = err.response.body;
        expect(message).toBe(ErrorConstants.INVALID_DATA_SUPPLIED);
      }
    );
  });

  it('should get location by id', async () => {
    await request(`http://localhost:3000/api/v1`)
      .get(`/countries/${createdCountryId}/locations/${createdLocationId}`)
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.name).toBe(locationName);
      });
  });

  it('should update location', async () => {
    await TestHelper.requestHelper
      .put(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}`)
      .send({ name: 'Name', population: 25 })
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.name).toBe('name');
        expect(response.body.population).toBe(25);
      });
  });

  it('should update location name', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/name`)
      .send({ name: 'Updated' })
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.name).toBe('updated');
      });
  });

  it('should throw an error on updating location name if location is already existing', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/name`)
      .send({ name: 'Updated' })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.LOCATION_IS_ALREADY_EXISTING);
        }
      );
  });

  it('should throw an error on updating location name if location contains numbers', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/name`)
      .send({ name: 'Updated12' })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.INVALID_LOCATION_NAME);
        }
      );
  });

  it('should throw an error on updating location name if location has two letters', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/name`)
      .send({ name: 'ad' })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBeDefined();
        }
      );
  });

  it('should throw an error on updating location population if value is 0', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/population`)
      .send({ population: 0 })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBeDefined();
        }
      );
  });

  it('should update location population', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/population`)
      .send({ population: 25000 })
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.population).toBe(25000);
      });
  });

  it('should throw an error on updating location population if on invalid data', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/population`)
      .send({ population: 'ad' })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBeDefined();
        }
      );
  });

  it('should remove location by id', async () => {
    await TestHelper.requestHelper
      .delete(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}`)
      .then((response) => {
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
      });
  });
});
