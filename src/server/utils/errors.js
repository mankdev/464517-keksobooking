class ValidationError extends Error {
  constructor(errors) {
    super();
    this.errors = Object.keys(errors).map((fieldName) => ({
      error: `Validation Error`,
      fieldName,
      errorMessage: errors[fieldName],
    }));
  }
}

module.exports = {
  ValidationError
};

