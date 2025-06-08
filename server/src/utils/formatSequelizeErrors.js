export function formatSequelizeErrors(error) {
  if (error.name === "SequelizeValidationError" && Array.isArray(error.errors)) {
    return error.errors.map(({ message, path }) => ({
      message,
      path,
    }));
  }
  return [{ message: error.message || "An unexpected error occurred." }];
}