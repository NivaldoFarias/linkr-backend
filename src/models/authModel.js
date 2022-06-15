import Joi from 'joi';

const pattern = /^[a-zA-Z0-9]{3,30}$/;

const SignInSchema = Joi.object({
  username: Joi.string().min(3).max(24).required(),
  password: Joi.string().pattern(pattern).required(),
});
const SignUpSchema = Joi.object({
  username: Joi.string().min(3).max(24).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(pattern).required(),
  imageUrl: Joi.string().uri().required(),
});

export { SignInSchema, SignUpSchema };
