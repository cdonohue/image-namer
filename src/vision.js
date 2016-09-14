const gCloud = require("google-cloud");

module.exports = (config) => {
  const vision = gCloud(config).vision();

  return {
    detectLabels(imageBuffer) {
      return new Promise((resolve, reject) => {
        vision.detectLabels(imageBuffer, (err, labels, apiResponse) => {
          if (err) reject(err.message);

          resolve(labels);
        });
      });
    }
  }
};
