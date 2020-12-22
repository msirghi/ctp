import TestHelper from '../../common/testHelper';
import { HttpStatus } from '@nestjs/common';

describe('Notifications controller', () => {
  const baseUrl = TestHelper.getApiEndpoint();
  let createdNotificationId: string;

  beforeAll(async () => {
    await TestHelper.createUser();
  });

  it('should create new notification', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/notifications`)
      .send({ message: 'Notification message' })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.CREATED);
        const { _id, message, createdAt, read } = res.body;

        expect(_id).toBeDefined();
        expect(message).toBe('Notification message');
        expect(createdAt).toBeDefined();
        expect(read).toBeFalsy();

        createdNotificationId = _id;
      });
  });

  it('should throw an error on notification creation if message is too short', async () => {
    await TestHelper.requestHelper
      .post(`${baseUrl}/notifications`)
      .send({ message: 'ms' })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        }
      );
  });

  it('should return notification by id', async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/notifications/${createdNotificationId}`).then((res) => {
      expect(res.status).toBe(HttpStatus.OK);

      const { _id, createdAt, message, read } = res.body;
      expect(_id).toBe(createdNotificationId);
      expect(createdAt).toBeDefined();
      expect(message).toBe('Notification message');
      expect(read).toBeFalsy();
    });
  });

  it('should throw an error if notification was not found', async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/notifications/${createdNotificationId.slice(0, -1)}1`).then(
      () => {},
      (err) => {
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    );
  });

  it('should return all user notifications', async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/notifications`).then((res) => {
      expect(res.status).toBe(HttpStatus.OK);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  it('should mark notification as read', async () => {
    await TestHelper.requestHelper.patch(`${baseUrl}/notifications/${createdNotificationId}`).then((res) => {
      expect(res.status).toBe(HttpStatus.OK);
    });
  });

  it('should throw an error on marking the notification as read if it was not found', async () => {
    await TestHelper.requestHelper.patch(`${baseUrl}/notifications/${createdNotificationId.slice(0, -1)}1`).then(
      () => {},
      (err) => {
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    );
  });

  it('should mark notification as unread', async () => {
    await TestHelper.requestHelper.patch(`${baseUrl}/notifications/${createdNotificationId}/unread`).then((res) => {
      expect(res.status).toBe(HttpStatus.OK);
    });
  });

  it('should throw an error on marking the notification as unread if it was not found', async () => {
    await TestHelper.requestHelper.patch(`${baseUrl}/notifications/${createdNotificationId.slice(0, -1)}1/unread`).then(
      () => {},
      (err) => {
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    );
  });

  it('should update notification message', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/notifications/${createdNotificationId}/message`)
      .send({ message: 'new message' })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.OK);
      });
  });

  it('should throw an error in message update if notification was not found', async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/notifications/${createdNotificationId.slice(0, -1)}1/message`)
      .send({ message: 'new message' })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
        }
      );
  });

  it('should remove notification by id', async () => {
    await TestHelper.requestHelper.delete(`${baseUrl}/notifications/${createdNotificationId}`).then((res) => {
      expect(res.status).toBe(HttpStatus.NO_CONTENT);
    });
  });
});
