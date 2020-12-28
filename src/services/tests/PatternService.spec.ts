import PatternService from "../PatternService";

describe("Pattern Service", () => {
  describe("containsNumber", () => {
    it("should return true if string contains number", () => {
      expect(PatternService.constainsNumber("string1")).toBeTruthy();
    });

    it("should return false if string do  contains no number", () => {
      expect(PatternService.constainsNumber("string")).toBeFalsy();
    });
  });

  describe("isEmailValid", () => {
    it("should return true on valid email", () => {
      expect(PatternService.isEmailValid("valid@mail.com")).toBeTruthy();
    });

    it("should return false on invalid email", () => {
      expect(PatternService.isEmailValid("valid@com")).toBeFalsy();
    });
  });

  describe("isNameValid", () => {
    it("should return false on invalid name", () => {
      expect(PatternService.isNameValid("Name1")).toBeFalsy();
    });

    it("should return true on valid name", () => {
      expect(PatternService.isNameValid("Name")).toBeTruthy();
    });
  });

  describe("checkPasswordStrength", () => {
    it("should return `Weak` on weak password", () => {
      expect(PatternService.checkPasswordStrength("123")).toBe("Weak");
    });

    it("should return `Medium` on medium password", () => {
      expect(PatternService.checkPasswordStrength("passwordQWE")).toBe("Medium");
    });

    it("should return `Strong` on strong password", () => {
      expect(PatternService.checkPasswordStrength("passaQWE12@!")).toBe("Strong");
    });
  });

  it("should check if the password is weak", () => {
    expect(PatternService.isPasswordWeak("pass")).toBeTruthy();
    expect(PatternService.isPasswordWeak("password12")).toBeFalsy();
  });

  it("should check if the password is medium", () => {
    expect(PatternService.isPasswordMedium("password12")).toBeTruthy();
    expect(PatternService.isPasswordMedium("pass")).toBeFalsy();
  });

  it("should check if the password is strong", () => {
    expect(PatternService.isPasswordStrong("passwordQWE12@!")).toBeTruthy();
    expect(PatternService.isPasswordStrong("pass")).toBeFalsy();
  });
});
