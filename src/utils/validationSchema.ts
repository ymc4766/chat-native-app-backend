import { isValidObjectId } from "mongoose";
import * as yup from "yup";

// Custom Email Regex - Update this with your desired email pattern
const myEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Define the password regex
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

yup.addMethod(yup.string, "email", function validateEmail(message) {
  return this.matches(myEmailRegex, {
    message,
    name: "email",
    excludeEmptyString: true,
  });
});

export const newUserSchema = yup.object({
  name: yup.string().required("name is required "),
  email: yup.string().email("Invalid Email").required("email is  required"),
  password: yup.string().required("Password is required"),
  // .min(8, "Password must be at least 8 characters") // Ensure password has minimum length of 8
  //     .matches(
  //       passwordRegex,
  //       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  //     ),
});

export const verifyTokenSchema = yup.object({
  id: yup.string().test({
    name: "valid-id ",
    message: "invalid user id",
    test: (value) => {
      return isValidObjectId(value);
    },
  }),
  token: yup.string().required("Token is Not Available!"),
});
