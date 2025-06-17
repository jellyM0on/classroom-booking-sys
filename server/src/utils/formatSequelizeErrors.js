export function formatSequelizeErrors(error, res) {
  if (error.name === "SequelizeValidationError") {
    res.status(400).json({
      errors: error.errors.map((e) => ({ path: e.path, message: e.message })),
    });
    return true;
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    res.status(400).json({
      errors: error.errors.map((e) => ({
        path: e.path,
        message: `${e.path} must be unique`,
      })),
    });
    return true;
  }

  return false;
}
