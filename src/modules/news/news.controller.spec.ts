import TestHelper from '../../common/testHelper';
import Chance = require('chance');
import { HttpStatus } from '@nestjs/common';
import ErrorConstants from '../../constants/error.constants';

describe('News controller', () => {
  const chance = new Chance();
  let createdCountryId: string;
  let createdNewsId: string;
  const baseUrl = TestHelper.getApiEndpoint();

  beforeAll(async () => {
    await TestHelper.createUser();
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries`)
      .send({ name: chance.word({ length: 5 }) })
      .then((response) => {
        const { _id } = response.body;
        createdCountryId = _id;
      });
  });

  afterAll(async () => {
    await TestHelper.requestHelper.delete(`${baseUrl}/countries/${createdCountryId}`);
  });

  it('should create new news', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/${createdCountryId}/news`)
      .send({ name: 'name', description: 'description' })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.CREATED);
        const { _id, name, description } = res.body;
        expect(_id).toBeDefined();
        expect(name).toBeDefined();
        expect(description).toBeDefined();
        createdNewsId = _id;
      });
  });

  it('should throw an error on creating news if country was not found', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/${createdCountryId.slice(0, -1)}1/news`)
      .send({ name: 'name', description: 'description' })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
        }
      );
  });

  it('should return news by id', async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/countries/${createdCountryId}/news/${createdNewsId}`).then((res) => {
      expect(res.status).toBe(HttpStatus.OK);
      const { _id, name, description } = res.body;
      expect(_id).toBe(createdNewsId);
      expect(name).toBe('name');
      expect(description).toBe('description');
    });
  });

  it('should throw an error on returning news by id if it was not found', async () => {
    await TestHelper.requestHelper
      .get(`${baseUrl}/countries/${createdCountryId}/news/${createdNewsId.slice(0, -1)}1`)
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
        }
      );
  });

  it('should throw an error on returning news by id if the country was not found', async () => {
    await TestHelper.requestHelper
      .get(`${baseUrl}/countries/${createdCountryId.slice(0, -1)}1/news/${createdNewsId}`)
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
        }
      );
  });

  it('should return countries news', async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/countries/${createdCountryId}/news`).then((res) => {
      expect(res.status).toBe(HttpStatus.OK);
    });
  });

  it('should throw an error on return countries news if country was not found', async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/countries/${createdCountryId.slice(0, -1)}1/news`).then(
      () => {},
      (err) => {
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    );
  });

  it('should update news by id', async () => {
    await TestHelper.requestHelper
      .put(`${baseUrl}/countries/${createdCountryId}/news/${createdNewsId}`)
      .send({ name: 'new title', description: 'new description' })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.OK);
        const { name, description } = res.body;
        expect(name).toBe('new title');
        expect(description).toBe('new description');
      });
  });

  it('should throw an error on updating news by id if it was not found', async () => {
    await TestHelper.requestHelper
      .put(`${baseUrl}/countries/${createdCountryId}/news/${createdNewsId.slice(0, -1)}1`)
      .send({ name: 'new title', description: 'new description' })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
          expect(err.response.body.message).toBe(ErrorConstants.NEWS_NOT_FOUND);
        }
      );
  });

  it('should throw an error on updating news by id if the country was not found', async () => {
    await TestHelper.requestHelper
      .put(`${baseUrl}/countries/${createdCountryId.slice(0, -1)}1/news/${createdNewsId}`)
      .send({ name: 'new title', description: 'new description' })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
        }
      );
  });

  it('should update news name', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId}/news/${createdNewsId}/name`)
      .send({ name: 'new title 2' })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.OK);
        const { _id, name } = res.body;
        expect(_id).toBe(createdNewsId);
        expect(name).toBe('new title 2');
      });
  });

  it('should throw an error on new name update if it was not found', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId}/news/${createdNewsId.slice(0, -1)}1/name`)
      .send({ name: 'new title 2' })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
          expect(err.response.body.message).toBe(ErrorConstants.NEWS_NOT_FOUND);
        }
      );
  });

  it('should throw an error on new name update if its country was not found', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId.slice(0, -1)}1/news/${createdNewsId}/name`)
      .send({ name: 'new title 2' })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
        }
      );
  });

  it('should throw an error on new desription update if its country was not found', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId.slice(0, -1)}1/news/${createdNewsId}/description`)
      .send({ description: 'new decs 2' })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
        }
      );
  });

  it('should update news description', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId}/news/${createdNewsId}/description`)
      .send({ description: 'new desc 2' })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.OK);
        const { _id, description } = res.body;
        expect(_id).toBe(createdNewsId);
        expect(description).toBe('new desc 2');
      });
  });

  it('should throw an error on new description update if it was not found', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/countries/${createdCountryId}/news/${createdNewsId.slice(0, -1)}1/description`)
      .send({ description: 'new desc 2' })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
          expect(err.response.body.message).toBe(ErrorConstants.NEWS_NOT_FOUND);
        }
      );
  });
});
