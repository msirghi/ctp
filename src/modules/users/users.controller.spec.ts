import TestHelper from '../../common/testHelper';
import Chance = require('chance');
import { HttpStatus } from '@nestjs/common';
import ErrorConstants from '../../constants/error.constants';

describe('UsersController', () => {
  let baseUrl = TestHelper.getApiEndpoint();
  let chance = new Chance();

  beforeAll(async () => {
    await TestHelper.createUser();
  });

  const defaultUser = {
    username: chance.word({ length: 5 }),
    lastName: 'Last',
    firstName: 'First',
    password: 'StrongPassword123',
    email: chance.email()
  };

  it('should register the user', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/users`)
      .send({ ...defaultUser })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.CREATED);
        const { lastName, firstName, password, email } = res.body;
        expect(lastName).toBe(defaultUser.lastName);
        expect(firstName).toBe(defaultUser.firstName);
        expect(email).toBe(defaultUser.email);
        expect(password).not.toBeDefined();
      });
  });

  it('should throw an error if the password is weak', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/users`)
      .send({ ...defaultUser, email: chance.email(), username: chance.word() })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.WEAK_PASSWORD);
        }
      );
  });

  it('should throw an error if the email is already taken', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/users`)
      .send({ ...defaultUser })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.EMAIL_TAKEN);
        }
      );
  });

  it('should throw an error if the username is already taken', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/users`)
      .send({ ...defaultUser, email: chance.email() })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.USERNAME_TAKEN);
        }
      );
  });

  it('should get logged in user info', async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/users`).then((response) => {
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.email).toBeDefined();
      expect(response.body.firstName).toBeDefined();
      expect(response.body.lastName).toBeDefined();
      expect(response.body.password).not.toBeDefined();
    });
  });

  it('should update first name', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/users/firstName`)
      .send({ firstName: chance.word() })
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
      });
  });

  it('should update last name', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/users/lastName`)
      .send({ lastName: chance.word() })
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
      });
  });

  it('should throw an error on updating password if password is weak', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/users/pwd`)
      .send({ password: 'asd' })
      .then(
        (_) => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
          expect(err.response.body.message).toBe(ErrorConstants.WEAK_PASSWORD);
        }
      );
  });
});
