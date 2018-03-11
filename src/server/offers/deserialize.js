function deserialize(data, files) {
  const serializedData = Object.assign({}, data);

  if (files) {
    if (files.avatar) {
      serializedData.avatar = files.avatar[0];
    }

    if (files.preview) {
      serializedData.preview = files.preview[0];
    }
  }

  return serializedData;
}

module.exports = {
  deserialize
};
