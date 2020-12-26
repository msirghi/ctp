// @ts-nocheck
import TokenService from "../TokenService";
import { verify } from "jsonwebtoken";
import { ROLES } from "../../common/enums";

describe("Token service", () => {
  const defaultUserId = 2;
  process.env.ACCESS_TOKEN_SECRET = "Secret";
  process.env.REFRESH_TOKEN_SECRET = "Secret";
  process.env.EMAIL_TOKEN_SECRET = "Secret";

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should generete valid jwt token with user id in it", () => {
    const token = TokenService.generateToken(defaultUserId);
    expect(token.length > 20).toBeTruthy();

    const payload = verify(token, process.env.EMAIL_TOKEN_SECRET!);
    expect(payload.user).toBe(defaultUserId);
  });

  it("should generate access token", () => {
    const token = TokenService.createAccessToken({ role: ROLES.USER, _id: 1, username: "username" });
    expect(token.length > 20).toBeTruthy();

    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    expect(payload.userId).toBe(1);
    expect(payload.role).toBe(ROLES.USER);
  });

  it("should create refresh token", () => {
    const token = TokenService.createRefreshToken({ role: ROLES.USER, _id: 1, username: "username" });
    expect(token.length > 20).toBeTruthy();

    const payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    expect(payload.userId).toBe(1);
  });

  it("should send refreshToken in cookie", () => {
    const cookie = jest.fn();

    TokenService.sendRefreshToken({ cookie });
    expect(cookie).toBeCalled();
  });
});
