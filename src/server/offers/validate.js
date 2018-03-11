const TYPES = [`flat`, `house`, `bungalo`, `palace`];
const NAMES = [`Keks`, `Pavel`, `Nikolay`, `Alex`, `Ulyana`, `Anastasyia`, `Julia`];
const FEATURES = [`dishwasher`, `elevator`, `conditioner`, `parking`, `washer`, `wifi`];
const IMAGE_MIME_TYPES = [`image/jpeg`, `image/png`];

const REQUIRED_MESSAGE = `это поле обязательно`;
const BAD_VALUE = `не верное значение`;

const isTimeStringValid = (time) => {
  try {
    const [hours, minutes] = time.split(`:`);

    if (time.length !== 5) {
      return false;
    }

    if (isNaN(hours) || isNaN(minutes)) {
      return false;
    }

    if (hours > 24 || hours < 0) {
      return false;
    }

    if (minutes > 60 || minutes < 0) {
      return false;
    }
  } catch (err) {
    return false;
  }

  return true;
};

const errorCheckers = {
  title: (title) => {
    try {
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
    } catch (err) {
      return BAD_VALUE;
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
      if (isNaN(price)) {
        return BAD_VALUE;
      }

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
  },

  address: (address) => {
    try {
      if (address) {
        if (address.length > 1000) {
          return `должно быть короче 1000 символов`;
        }
      } else {
        return REQUIRED_MESSAGE;
      }
    } catch (err) {
      return BAD_VALUE;
    }

    return false;
  },

  rooms: (rooms) => {
    if (rooms || rooms === 0) {
      if (isNaN(rooms)) {
        return BAD_VALUE;
      }
      if (rooms < 0) {
        return `должно быть больше или равно 0`;
      }

      if (rooms > 1000) {
        return `должно быть не больше 1000`;
      }
    } else {
      return REQUIRED_MESSAGE;
    }

    return false;
  },

  name: (name) => {
    if (name) {
      if (NAMES.indexOf(name) === -1) {
        return BAD_VALUE;
      }
    }

    return false;
  },

  checkin: (checkin) => {
    if (checkin) {
      if (!isTimeStringValid(checkin)) {
        return BAD_VALUE;
      }
    } else {
      return REQUIRED_MESSAGE;
    }

    return false;
  },

  checkout: (checkout) => {
    if (checkout) {
      if (!isTimeStringValid(checkout)) {
        return BAD_VALUE;
      }
    } else {
      return REQUIRED_MESSAGE;
    }

    return false;
  },

  features: (features) => {
    try {
      if (features) {
        if ((new Set(features)).size !== features.length) {
          return BAD_VALUE;
        }

        const unregisteredFeatures = features.filter((feature) => FEATURES.indexOf(feature) === -1);

        if (unregisteredFeatures.length) {
          return BAD_VALUE;
        }
      }
    } catch (err) {
      return BAD_VALUE;
    }

    return false;
  },

  avatar: (avatar) => {
    try {
      if (avatar) {
        if (IMAGE_MIME_TYPES.indexOf(avatar.mimetype) === -1) {
          return BAD_VALUE;
        }
      }
    } catch (err) {
      return BAD_VALUE;
    }

    return false;
  },

  preview: (preview) => {
    try {
      if (preview) {
        if (IMAGE_MIME_TYPES.indexOf(preview.mimetype) === -1) {
          return BAD_VALUE;
        }
      }
    } catch (err) {
      return BAD_VALUE;
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
