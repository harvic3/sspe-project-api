'use strict';

const {
  readFileSync,
  existsSync,
  writeFileSync,
  readdir,
  appendFileSync,
} = require('fs');
const path = require('path');

exports.readFile = filePath => {
  if (!existsSync(filePath)) {
    throw new Error(`The file "${filePath}" don´t exists.`);
  }
  const data = readFileSync(filePath, 'utf-8');
  return data;
};

exports.saveFile = (fileData, fileName, fromRootPath) => {
  const filePath = `${path.resolve(__dirname, '../../')}${
    fromRootPath || ''
  }/${fileName}.txt`;
  if (existsSync(filePath)) {
    throw new Error(
      `The file "${fileName}" that you are trying to create already exists.`
    );
  }
  writeFileSync(filePath, fileData, 'utf8');
};

exports.saveApplicationFile = (fileData, fileName, fromRootPath) => {
  const filePath = `${path.resolve(__dirname, '../../')}${
    fromRootPath || ''
  }/${fileName}`;
  appendFileSync(filePath, fileData, { encoding: 'utf-8', flag: 'w' });
};

exports.readDirectory = directoryPath =>
  new Promise((resolve, reject) => {
    const dirPath = path.resolve(__dirname, directoryPath);
    if (!existsSync(dirPath)) {
      throw new Error(
        `The directory "${dirPath}" does not exists. You must create it in root directory.`
      );
    }
    readdir(dirPath, (error, list) => {
      if (error) {
        reject(error);
      }
      resolve(list);
    });
  });
