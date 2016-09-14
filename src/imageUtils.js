const sharp = require("sharp");

const shrink = (image) => {
  return sharp(image).resize(300).toBuffer();
};

const copyAndSave = (image, location) => {
  return sharp(image).toFile(location);
};

module.exports = {
  copyAndSave,
  shrink,
};
