// src/_middleware/validate-request.ts
import Joi from 'joi';

export default function validateRequest(req: any, next: any, schema: Joi.ObjectSchema) {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    next(`Validation error: ${error.details.map((x: any) => x.message).join(', ')}`);
  } else {
    req.body = value;
    next();
  }
}