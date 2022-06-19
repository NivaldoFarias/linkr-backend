export function validateSchema(schema) {
  return (req, _res, next) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        throw new CustomError(
          422,
          'Alguma mensagem',
          error.details.map((detail) => detail.message),
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}
