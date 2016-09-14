const path = require("path");
const fs = require("fs");
const ora = require("ora");
const { kebabCase } = require("lodash");

const { copyAndSave, shrink } = require("./src/imageUtils");

// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.40.0/google-cloud
const vision = require("./src/vision")({
  projectId: "name-of-project", // CHANGE THIS
  keyFilename: path.resolve("./secrets.json"),
});

const spinner = ora({
  text: "Analyzing image(s)",
  spinner: "dots12",
}).start();

const inputDir = path.resolve(path.join("processing", "input"));
const outputDir = path.resolve(path.join("processing", "output"));

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const generateFilename = (labels) => {
  return labels
    .slice(0, 3)
    .map(label => kebabCase(label))
    .join("-")
    .concat(".jpg")
  ;
};

const createNewNamedImage = (filename) => {
  const imagePath = path.join(inputDir, filename);

  const copyOriginalImage = (newFilename) => {
    const destinationPath = path.join(outputDir, newFilename);
    return Promise.resolve(copyAndSave(imagePath, destinationPath));
  }

  return shrink(imagePath)
    .then(vision.detectLabels)
    .then(generateFilename)
    .then(copyOriginalImage)
  ;
}

fs.readdir(inputDir, (err, filenames) => {
  Promise.all(filenames.map(createNewNamedImage))
    .then((images) => {
      spinner.text = `${images.length} image(s) processed`
      spinner.succeed();
    })
  ;
});
