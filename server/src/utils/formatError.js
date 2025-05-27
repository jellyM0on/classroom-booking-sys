import { ValidationError } from "../validators/userValidator.js";

// TODO: Refactor might be needed

export const formatError = (error) => {
  if (error instanceof ValidationError) {
    return { errors: error.errors };
  }

  if (error.errorInfo?.message) {
    return { errors: [{ message: error.errorInfo.message }] };
  }

  return {
    errors: [{ message: error.message || "An unknown error occurred" }],
  };
};
