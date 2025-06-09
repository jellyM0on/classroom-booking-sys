export function formatErrors(error) {
  console.log(error); 
  if (
    error.name === "SequelizeValidationError" &&
    Array.isArray(error.errors)
  ) {
    return error.errors.map(({ message, path }) => ({
      message,
      path,
    }));
  }

  if (error.errorInfo && typeof error.errorInfo === "object") {
    const { code, message } = error.errorInfo;

    const pathMap = {
      "auth/invalid-password": "password",
      "auth/email-already-exists": "email",
    };

    const path = pathMap[code] || "general";

    return [{ message, path }];
  }

  return [{ message: error.message || "An unexpected error occurred." }];
}
