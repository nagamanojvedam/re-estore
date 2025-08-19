const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Product = require("../src/models/Product");
const { generateAuthTokens } = require("../src/utils/jwt");

describe("Product Endpoints", () => {
  let userToken;
  let adminToken;
  let user;
  let admin;

  beforeEach(async () => {
    // Create test user
    user = await User.create({
      name: "Test User",
      email: "user@example.com",
      password: "password123",
    });

    // Create admin user
    admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    // Generate tokens
    const userTokens = await generateAuthTokens(user);
    const adminTokens = await generateAuthTokens(admin);

    userToken = userTokens.access.token;
    adminToken = adminTokens.access.token;
  });

  describe("POST /api/products", () => {
    it("should create a product when authenticated", async () => {
      const productData = {
        name: "Test Product",
        description: "This is a test product",
        price: 99.99,
        category: "Electronics",
        stock: 10,
      };

      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send(productData)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.data.product.name).toBe(productData.name);
      expect(res.body.data.product.owner._id).toBe(user._id.toString());
    });

    it("should not create a product without authentication", async () => {
      const productData = {
        name: "Test Product",
        description: "This is a test product",
        price: 99.99,
        category: "Electronics",
      };

      await request(app).post("/api/products").send(productData).expect(401);
    });
  });

  describe("GET /api/products", () => {
    beforeEach(async () => {
      await Product.create({
        name: "Product 1",
        description: "Description 1",
        price: 50,
        category: "Electronics",
        owner: user._id,
      });

      await Product.create({
        name: "Product 2",
        description: "Description 2",
        price: 100,
        category: "Books",
        owner: user._id,
      });
    });

    it("should get all products", async () => {
      const res = await request(app).get("/api/products").expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data.products).toHaveLength(2);
      expect(res.body.data.pagination.total).toBe(2);
    });

    it("should filter products by category", async () => {
      const res = await request(app)
        .get("/api/products?category=Electronics")
        .expect(200);

      expect(res.body.data.products).toHaveLength(1);
      expect(res.body.data.products[0].category).toBe("Electronics");
    });

    it("should search products", async () => {
      const res = await request(app)
        .get("/api/products?search=Product 1")
        .expect(200);

      expect(res.body.data.products).toHaveLength(1);
      expect(res.body.data.products[0].name).toBe("Product 1");
    });
  });
});
