import { body } from "express-validator";

const va = [
  body("password")
    .isLength({ min: 50 })
    .withMessage("Password must be 50 characters long")
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain lowercase letters, uppercase letters, numbers and symbols"
    ),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("username")
    .isLength({ max: 35 })
    .withMessage("Username can only contain 35 characters or less"),
  body("about")
    .isLength({ min: 30 })
    .withMessage("About me must be 30 characters long")
];

const v = [
  body("title")
    .isLength({ min: 10 })
    .withMessage("Title must be at least 10 characters long"),
  body("des")
    .isLength({ min: 300 })
    .withMessage("Description must be at least 300 characters long"),
];

export { va, v };