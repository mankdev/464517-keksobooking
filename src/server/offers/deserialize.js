const deserialize = (data, files) => {
  const serializedData = Object.assign({}, data);

  if (files) {
    if (files.avatar) {
      serializedData.avatar = files.avatar[0];
    }

    if (files.preview) {
      serializedData.preview = files.preview[0];
    }

    if (data.features) {
      serializedData.features = JSON.parse(data.features);
    }
  }

  return serializedData;
};

module.exports = {
  deserialize
};
