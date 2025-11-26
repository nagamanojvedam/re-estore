import Joi from 'joi';
import ApiError from '@/lib/utils/ApiError';

type SchemaConfig = {
  body?: Joi.Schema;
  query?: Joi.Schema;
  params?: Joi.Schema;
};

export async function validate(req: Request, schema: SchemaConfig, params?: any) {
  const data: any = {};

  if (schema.body) {
    data.body = await req.json().catch(() => ({}));
  }

  if (schema.query) {
    const url = new URL(req.url);
    data.query = Object.fromEntries(url.searchParams.entries());
  }

  if (schema.params) {
    data.params = params ?? {};
  }

  const { error } = Joi.object(schema).validate(data, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((d) => d.message).join(', ');
    throw new ApiError(400, errorMessage);
  }

  return data; // validated data returned
}
