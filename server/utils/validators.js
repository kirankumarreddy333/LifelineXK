const { body, validationResult } = require("express-validator");

// Centralized validation result handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateDonor = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("bloodGroup").notEmpty().withMessage("Blood group is required"),
  body("phone")
    .isLength({ min: 10, max: 15 })
    .withMessage("A valid phone number is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
];

const validateRequest = [
  body("patientName").trim().notEmpty().withMessage("Patient name is required"),
  body("bloodGroup").notEmpty().withMessage("Blood group is required"),
  body("contactName").trim().notEmpty().withMessage("Contact name is required"),
  body("contactPhone")
    .isLength({ min: 10, max: 15 })
    .withMessage("A valid contact phone is required"),
];

module.exports = {
  handleValidation,
  validateRegister,
  validateLogin,
  validateDonor,
  validateRequest,
};

