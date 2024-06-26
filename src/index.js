'use strict';

const path = require('path');
const {
  processFile,
  readFile,
  createNewFile,
  listSavedFiles,
  rebuildExampleFile,
} = require('./lib/fileOperator');
const { flowResult } = require('./utils/result');
const {
  addDataToTrainingFile,
  trainNet,
  analiceFile,
} = require('./lib/mlNetOperator');

const EXAMPLE_FILE_NAME = 'config/ExampleFile.txt';
const EXAMPLE_FILE_PATH = path.normalize(
  `${__dirname}/../${EXAMPLE_FILE_NAME}`
);

const evaluateResult = result => {
  if (result.flow === flowResult.failed) {
    console.error(`Error: ${result.message}`);
  }
};

exports.executeExample = () => {
  let result = processFile(EXAMPLE_FILE_PATH);
  if (result.flow == flowResult.failed) {
    result = rebuildExampleFile(EXAMPLE_FILE_NAME);
    if (result.flow == flowResult.success) {
      result = processFile(EXAMPLE_FILE_PATH);
      console.log('The example file had to be rebuilt by the system change.');
    }
  }
  evaluateResult(result);
  return result.data;
};

exports.processFile = filePath => {
  const result = processFile(filePath);
  evaluateResult(result);
  return result.data;
};

exports.readFile = filePath => {
  const result = readFile(filePath);
  evaluateResult(result);
  return result.data;
};

exports.createNewFile = (inputFileName, inputNumber) => {
  const result = createNewFile(inputFileName, inputNumber);
  evaluateResult(result);
  return result.data;
};

exports.listFiles = () =>
  new Promise((resolve, reject) => {
    listSavedFiles()
      .then(result => {
        resolve(result.data);
      })
      .catch(error => {
        evaluateResult(error);
        reject(new Error('Error listing files.'));
      });
  });

exports.addDataForTraining = inputNumber => {
  const result = addDataToTrainingFile(inputNumber);
  evaluateResult(result);
  return result;
};

exports.doTraining = (iterations, errorThresh) => {
  const result = trainNet(iterations, errorThresh);
  evaluateResult(result);
  return result;
};

exports.analiceFile = filePath => {
  const result = analiceFile(filePath);
  evaluateResult(result);
  return result.data;
};
