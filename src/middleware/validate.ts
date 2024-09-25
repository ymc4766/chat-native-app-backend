import { RequestHandler } from "express";
import { sendError } from "utils/helpers";
import * as yup from "yup";

export const validate = (schema: yup.Schema): RequestHandler => {
  return async (req, res, next) => {
    try {
      await schema.validate(
        {
          ...req.body,
        },
        { strict: true, abortEarly: true }
      );
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        sendError(res, error.message, 422);
      } else {
        next(error);
      }
    }
  };
};

// try {
//   await newUserSchema.validate({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//   });
// } catch (error) {}
