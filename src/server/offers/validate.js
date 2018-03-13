const {oneOf} = require(`../../utils/collection.utils`);

const TYPES = [`flat`, `house`, `bungalo`, `palace`];
const NAMES = [`Keks`, `Pavel`, `Nikolay`, `Alex`, `Ulyana`, `Anastasyia`, `Julia`];
const FEATURES = [`dishwasher`, `elevator`, `conditioner`, `parking`, `washer`, `wifi`];
const IMAGE_MIME_TYPES = [`image/jpeg`, `image/png`];

const REQUIRED_MESSAGE = `это поле обязательно`;
const BAD_VALUE = `не верное значение`;

const TIME_STRING = {
  LENGTH: 5,
  MAX_HOURS: 24,
  MAX_MINUTES: 60,
  MIN_HOURS: 0,
  MIN_MINUTES: 0
};

const TITLE = {
  MAX_LENGTH: 100,
  MIN_LENGTH: 30
};

const PRICE = {
  MIN: 1,
  MAX: 100000
};

const ADDRESS_MAX_LENGTH = 1000;

const ROOMS = {
  MAX: 1000,
  MIN: 0
};

const GUESTS = {
  MAX: 100,
  MIN: 1
};

const isTimeStringValid = (time) => {
  try {
    const [hours, minutes] = time.split(`:`);

    if (time.length !== TIME_STRING.LENGTH) {
      return false;
    }

    if (isNaN(hours) || isNaN(minutes)) {
      return false;
    }

    if (hours > TIME_STRING.MAX_HOURS || hours < TIME_STRING.MIN_HOURS) {
      return false;
    }

    if (minutes > TIME_STRING.MAX_MINUTES || minutes < TIME_STRING.MIN_MINUTES) {
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
        if (title.length > TITLE.MAX_LENGTH) {
          return `должно быть короче 100 символов`;
        }
        if (title.length < TITLE.MIN_LENGTH) {
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
      if (!oneOf(type, TYPES)) {
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

      if (price < PRICE.MIN) {
        return `должно быть больше 0`;
      }

      if (price > PRICE.MAX) {
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
        if (address.length > ADDRESS_MAX_LENGTH) {
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
      if (rooms < ROOMS.MIN) {
        return `должно быть больше или равно 0`;
      }

      if (rooms > ROOMS.MAX) {
        return `должно быть не больше 1000`;
      }
    } else {
      return REQUIRED_MESSAGE;
    }

    return false;
  },

  name: (name) => {
    if (name) {
      if (!oneOf(name, NAMES)) {
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

        const unregisteredFeatures = features.filter((feature) => !oneOf(feature, FEATURES));

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
        if (!oneOf(avatar.mimetype, IMAGE_MIME_TYPES)) {
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
        if (!oneOf(preview.mimetype, IMAGE_MIME_TYPES)) {
          return BAD_VALUE;
        }
      }
    } catch (err) {
      return BAD_VALUE;
    }

    return false;
  },

  guests: (guests) => {
    if (guests || guests === 0) {
      if (isNaN(guests)) {
        return BAD_VALUE;
      }
      if (guests < GUESTS.MIN) {
        return `должно быть больше или равно 1`;
      }

      if (guests > GUESTS.MAX) {
        return `должно быть не больше 100`;
      }
    } else {
      return REQUIRED_MESSAGE;
    }

    return false;
  },
};

const validate = (data) => {
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
};

module.exports = {
  validate
};
