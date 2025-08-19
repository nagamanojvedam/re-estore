const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Auth Endpoints", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const res = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.data.user.email).toBe(userData.email);
      expect(res.body.data.tokens).toBeDefined();
    });

    it("should not register user with existing email", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      await User.create(userData);

      const res = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(res.body.message).toBe("User already exists with this email");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      await User.create(userData);

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data.user.email).toBe(userData.email);
      expect(res.body.data.tokens).toBeDefined();
    });

    it("should not login with invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(res.body.message).toBe("Invalid email or password");
    });
  });
});
