const TYPES = [`flat`, `house`, `bungalo`, `palace`];
const REQUIRED_MESSAGE = `это поле обязательно`;
const BAD_VALUE = `не верное значение`;

const errorCheckers = {
  title: (title) => {
    if (title) {
      if (title.length > 100) {
        return `должно быть короче 100 символов`;
      }
      if (title.length < 30) {
        return `должно быть больше 30 символов`;
      }
    } else {
      return REQUIRED_MESSAGE;
    }

    return false;
  },

  type: (type) => {
    if (type) {
      if (TYPES.indexOf(type) === -1) {
        return BAD_VALUE;
      }
    } else {
      return REQUIRED_MESSAGE;
    }

    return false;
  },

  price: (price) => {
    if (price || price === 0) {
      if (price <= 0) {
        return `должно быть больше 0`;
      }

      if (price > 100000) {
        return `должно быть не больше 100 000`;
      }
    } else {
      return REQUIRED_MESSAGE;
    }

    return false;
  }
};

function validate(data) {
  let isValid = true;
  const errors = {};

  Object.keys(errorCheckers).forEach((fieldName) => {
    const errorCheckResult = errorCheckers[fieldName](data[fieldName]);

    if (errorCheckResult) {
      isValid = false;
      errors[fieldName] = errorCheckResult;
    }
  });

  return {
    isValid,
    errors
  };
}

module.exports = {
  validate
};
