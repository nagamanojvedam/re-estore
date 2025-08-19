const Joi = require("joi");
const ApiError = require("../utils/ApiError");

const validate = (schema) => {
  return (req, res, next) => {
    const validSchema = {};

    if (schema.body) validSchema.body = req.body;
    if (schema.query) validSchema.query = req.query;
    if (schema.params) validSchema.params = req.params;

    const { error } = Joi.object(schema).validate(validSchema);

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      throw new ApiError(400, errorMessage);
    }

    next();
  };
};

module.exports = validate;
