import * as request from 'supertest';
import { ProblemDTO } from 'dist/problems/dto/Problem.dto';
import { HttpStatus } from '@nestjs/common';
import ErrorConstants from '../../constants/error.constants';
import TestHelper from '../../common/testHelper';
import Chance = require('chance');

describe('ProblemsController', () => {
  const chance = new Chance();
  let createdCountryId: string;
  let createdLocationId: string;
  let createdProblemId: string;
  const baseUrl = TestHelper.getApiEndpoint();

  const problemDto: ProblemDTO = {
    name: 'problem',
    address: 'address',
    description: 'description'
  };

  beforeAll(async () => {
    await TestHelper.createUser();
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries`)
      .send({ name: chance.word({ length: 5 }) })
      .then((response) => {
        const { _id } = response.body;
        createdCountryId = _id;
      });
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/${createdCountryId}/locations`)
      .send({ name: 'new location' })
      .then((response) => {
        const { _id } = response.body;
        createdLocationId = _id;
      });
  });

  afterAll(async () => {
    await TestHelper.requestHelper.delete(
      `${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/problems/${createdProblemId}`
    );
    await TestHelper.requestHelper.delete(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}`);
    await TestHelper.requestHelper.delete(`${baseUrl}/countries/${createdCountryId}`);
  });

  it('should create new problem', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/problems`)
      .send({ ...problemDto })
      .then((response) => {
        const { _id, name, description, locationId, raiting } = response.body;
        createdProblemId = _id;
        expect(name).toBe(problemDto.name);
        expect(description).toBe(problemDto.description);
        expect(locationId).toBe(createdLocationId);
        expect(raiting).toBe(0);
      });
  });

  it('should throw an error on problem creation if name has two letters', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/problems`)
      .send({ ...problemDto, name: 'aa' })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.INVALID_PROBLEM_NAME);
        }
      );
  });

  it('should throw an error on problem creation if country does not exist', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/notfoundCountry/locations/${createdLocationId}/problems`)
      .send({ ...problemDto })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.COUNTRY_NOT_FOUND);
        }
      );
  });

  it('should throw an error on problem creation if location does not exist', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/${createdCountryId}/locations/notfoundLocation/problems`)
      .send({ ...problemDto })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.LOCATION_NOT_FOUND);
        }
      );
  });

  it('should get problem by id', async () => {
    await TestHelper.requestHelper
      .get(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/problems/${createdProblemId}`)
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
        const { name, description, _id, locationId, address } = response.body;
        expect(_id).toBe(createdProblemId);
        expect(name).toBe(problemDto.name);
        expect(locationId).toBe(createdLocationId);
        expect(description).toBe(problemDto.description);
        expect(address).toBe(problemDto.address);
      });
  });

  it('should throw an error if problem was not found', async () => {
    await TestHelper.requestHelper
      .get(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/problems/5fcd19d1e09cf40ef02d11a4`)
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
          expect(err.response.body.message).toBe(ErrorConstants.PROBLEM_NOT_FOUND);
        }
      );
  });

  it('should throw an error if location was not found on getting the problem by id', async () => {
    await TestHelper.requestHelper
      .get(
        `${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId.slice(
          0,
          -1
        )}1/problems/5fcd19d1e09cf40ef02d11a4`
      )
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
          expect(err.response.body.message).toBe(ErrorConstants.LOCATION_NOT_FOUND);
        }
      );
  });

  it('should receive all problems by location', async () => {
    await TestHelper.requestHelper
      .get(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/problems`)
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0]._id).toBe(createdProblemId);
        expect(response.body[0].locationId).toBe(createdLocationId);
        expect(response.body[0].name).toBe(problemDto.name);
      });
  });

  it('should throw an error on getting all problems by location if location is not found', async () => {
    await TestHelper.requestHelper
      .get(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId.slice(0, -1)}1/problems`)
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
          expect(err.response.body.message).toBe(ErrorConstants.LOCATION_NOT_FOUND);
        }
      );
  });

  it('should throw an error on getting all problems by location if country is not found', async () => {
    await TestHelper.requestHelper
      .get(`${baseUrl}/countries/notfoundCountry/locations/${createdLocationId}/problems`)
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
        }
      );
  });

  it('should update problem', async () => {
    await TestHelper.requestHelper
      .put(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/problems/${createdProblemId}`)
      .send({ name: 'updated', description: 'new description', address: 'new address' })
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
        const { name, description, _id, address } = response.body;
        expect(name).toBe('updated');
        expect(description).toBe('new description');
        expect(_id).toBe(createdProblemId);
        expect(address).toBe('new address');
      });
  });

  it('should throw an error on updating the problem if it was not found', async () => {
    await TestHelper.requestHelper
      .put(
        `${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/problems/${createdProblemId.slice(
          0,
          -1
        )}1`
      )
      .send({ name: 'updated', description: 'new description', address: 'new address' })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
          expect(err.response.body.message).toBe(ErrorConstants.PROBLEM_NOT_FOUND);
        }
      );
  });

  it('should throw an error on updating the problem if location was not found', async () => {
    await TestHelper.requestHelper
      .put(
        `${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId.slice(
          0,
          -1
        )}1/problems/${createdProblemId}`
      )
      .send({ name: 'updated', description: 'new description', address: 'new address' })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
          expect(err.response.body.message).toBe(ErrorConstants.LOCATION_NOT_FOUND);
        }
      );
  });

  it('should throw an error on updating the problem if name length is too short', async () => {
    await TestHelper.requestHelper
      .put(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/problems/${createdProblemId}`)
      .send({ name: 'up', description: 'new description', address: 'new address' })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.INVALID_PROBLEM_NAME);
        }
      );
  });
});
