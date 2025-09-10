const Joi = require("joi");

const createProduct = {
  body: Joi.object({
    name: Joi.string().required().min(2).max(100),
    description: Joi.string().required().min(10).max(1000),
    price: Joi.number().required().min(0),
    category: Joi.string().required().min(2).max(50),
    stock: Joi.number().min(0).default(0),
    images: Joi.array().items(Joi.string().uri()),
  }),
};

const getProducts = {
  query: Joi.object({
    exclude: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    // exclude: Joi.string().length(24).hex().optional(),
    search: Joi.string(),
    category: Joi.string(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    minRating: Joi.number().min(1).max(4),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid("name", "price", "rating", "createdAt"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
    isActive: Joi.boolean(),
  }),
};

const updateProduct = {
  params: Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  body: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().min(10).max(1000),
    price: Joi.number().min(0),
    category: Joi.string().min(2).max(50),
    stock: Joi.number().min(0),
    images: Joi.array().items(Joi.string().uri()),
    isActive: Joi.boolean(),
    specifications: Joi.object()
      .pattern(
        Joi.string(), // any key
        Joi.string()
      )
      .default({}),
  }),
};

const getProduct = {
  params: Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

const deleteProduct = {
  params: Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  getProduct,
  deleteProduct,
};
