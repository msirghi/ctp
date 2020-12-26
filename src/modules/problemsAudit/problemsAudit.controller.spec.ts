import { HttpStatus } from "@nestjs/common";
import TestHelper from "../../common/testHelper";

describe("ProblemsAudit controller", () => {
  const baseUrl = TestHelper.getApiEndpoint();

  beforeAll(async () => {
    await TestHelper.createUser();
  });

  it("should return last user actions", async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/problems/actions`).then((res) => {
      expect(res.status).toBe(HttpStatus.OK);
    });
  });

  it("should throw an error if the user is not authorized", async () => {
    await TestHelper.requestHelper.get(`${baseUrl}/problems/actions`).then(
      () => {},
      (err) => {
        expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    );
  });
});
