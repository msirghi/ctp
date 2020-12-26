import TestHelper from "../../common/testHelper";
import Chance = require("chance");
import { ProblemDTO } from "../problems/dto/problem.dto";
import { HttpStatus } from "@nestjs/common";
import ErrorConstants from "../../constants/error.constants";

describe("Comments", () => {
  let createdCountryId: string;
  let createdLocationId: string;
  let createdProblemId: string;
  let createdCommentId: string;
  const baseUrl = TestHelper.getApiEndpoint();
  const chance = new Chance();
  const problemDto: ProblemDTO = {
    name: "problem",
    address: "address",
    description: "description",
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
      .send({ name: "new location" })
      .then((response) => {
        const { _id } = response.body;
        createdLocationId = _id;
      });
    await TestHelper.requestHelper
      .post(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/problems`)
      .send({ ...problemDto })
      .then((response) => {
        const { _id } = response.body;
        createdProblemId = _id;
      });
  });

  afterAll(async () => {
    await TestHelper.requestHelper.delete(
      `${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}/problems/${createdProblemId}`
    );
    await TestHelper.requestHelper.delete(`${baseUrl}/countries/${createdCountryId}/locations/${createdLocationId}`);
    await TestHelper.requestHelper.delete(`${baseUrl}/countries/${createdCountryId}`);
  });

  it("should create new comment for a problem", async () => {
    await TestHelper.requestHelper
      .post(
        `${baseUrl}/countries/${createdCountryId}/location/${createdLocationId}/problems/${createdCountryId}/comments`
      )
      .send({ message: "new comment" })
      .then((response) => {
        expect(response.status).toBe(HttpStatus.CREATED);
        const { message, createdAt, _id } = response.body;
        expect(message).toBe("new comment");
        expect(createdAt).toBeDefined();
        createdCommentId = _id;
      });
  });

  it("should throw an error if message is too short", async () => {
    await TestHelper.requestHelper
      .post(
        `${baseUrl}/countries/${createdCountryId}/location/${createdLocationId}/problems/${createdCountryId}/comments`
      )
      .send({ message: "ne" })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        }
      );
  });

  it("should return comment by id", async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/comments/${createdCommentId}`).then((response) => {
      expect(response.status).toBe(HttpStatus.OK);
      const { _id, createdAt, message } = response.body;
      expect(_id).toBeDefined();
      expect(createdAt).toBeDefined();
      expect(message).toBeDefined();
    });
  });

  it("should throw an error on not found comment", async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/comments/${createdCommentId.slice(0, -1)}1`).then(
      (_) => {},
      (err) => {
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.response.body.message).toBe(ErrorConstants.COMMENT_NOT_FOUND);
      }
    );
  });

  it("should update comment message", async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/comments/${createdCommentId}/message`)
      .send({ message: "new message" })
      .then((res) => {
        expect(res.status).toBe(HttpStatus.OK);
        const { _id, message } = res.body;
        expect(_id).toBe(createdCommentId);
        expect(message).toBe("new message");
      });
  });

  it("should throw an error if the comment was not found during updating the message", async () => {
    await TestHelper.requestHelper
      .patch(`${baseUrl}/comments/${createdCommentId.slice(0, -1)}1/message`)
      .send({ message: "new message" })
      .then(
        () => {},
        (err) => {
          expect(err.status).toBe(HttpStatus.NOT_FOUND);
          expect(err.response.body.message).toBe(ErrorConstants.COMMENT_NOT_FOUND);
        }
      );
  });

  it("should throw an error if the comment was not found during removal", async () => {
    await TestHelper.requestHelper.delete(`${baseUrl}/comments/${createdCommentId.slice(0, -1)}1`).then(
      () => {},
      (err) => {
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.response.body.message).toBe(ErrorConstants.COMMENT_NOT_FOUND);
      }
    );
  });

  it("should remove the comment", async () => {
    await TestHelper.requestHelper.delete(`${baseUrl}/comments/${createdCommentId}`).then(({ status }) => {
      expect(status).toBe(HttpStatus.NO_CONTENT);
    });
  });
});
