import User from "../models/UserModel.js";

export class ValidationError extends Error {
  constructor(errors) {
    super("Validation failed");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

export const validateUser = async (user) => {
  try {
    const tempUser = User.build({
      email: user.email,
      role: user.role,
      uid: "temp_uid",
      departmentId: user.departmentId,
      name: user.name,
    });
    await tempUser.validate();
  } catch (validationError) {
    console.error("Validation Error:", validationError.errors);
    const formattedErrors = validationError.errors.map((errorItem) => ({
      path: errorItem.path,
      message: errorItem.message,
    }));
    throw new ValidationError(formattedErrors);
  }
};
