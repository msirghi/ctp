import { HttpStatus } from "@nestjs/common";
import TestHelper from "../../common/testHelper";
import * as request from "supertest";

describe("Health controller", () => {
  const baseUrl = TestHelper.getApiEndpoint();

  it("should return health status", async () => {
    await request(`${baseUrl}`)
      .get("/health")
      .then((res) => {
        expect(res.status).toBe(HttpStatus.OK);
      });
  });
});
