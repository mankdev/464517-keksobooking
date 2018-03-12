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

class NotFoundError extends Error {
  constructor(message) {
    super();
    this.error = `Not Found`;
    this.errorMessage = message;
  }
}

module.exports = {
  ValidationError,
  NotFoundError
};

