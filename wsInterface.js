'use strict';

const lib = require('./src/index');
const emojis = require('node-emoji');
const path = require('path');

const HELP_FILE = '/config/help.txt';
const HELP_FILE_PATH = `${__dirname}${HELP_FILE}`;
const defaultMessage = `${emojis.get(
  'no_entry'
)} \x20please send a valid command or try with 'hi' or 'example'`;
const cancelOption = `CANCEL. ${emojis.get('back')}`;

const launchErrorMessage = message => {
  message = `${emojis.get('warning')}\x20 ${message}`;
  return message;
};

const checkFileName = fileName => {
  const pattern = /^[0-9a-zA-Z_]+$/;
  if (!pattern.test(fileName)) {
    return launchErrorMessage(
      'the file name can only contain alpha-numeric characters for example "FileName_1"'
    );
  }
  return true;
};

const help = () => {
  let helpFileData = lib.readFile(HELP_FILE_PATH);
  const params = helpFileData.match(/(\{\{)(.*?)(\}\})/g).map(word => {
    return word.replace(/{{|}}/g, '');
  });
  for (let index in params) {
    helpFileData = helpFileData.replace(
      `{{${params[index]}}}`,
      `${emojis.get(params[index])}\x20`
    );
  }
  return helpFileData;
};

const showMe = () => {
  const result = lib.executeExample();
  const response = {
    message: `Executing with EXAMPLE file... ${
      emojis.random().emoji
    }\rFile data:\r${result.fileData}\rString number: ${result.stringNumber}`,
    flow: 'success',
  };
  return response;
};

const createFile = options => {
  if (!options.name) {
    return launchErrorMessage(
      'this option require file "--name" as parameter (without extension file)'
    );
  }
  if (checkFileName(options.name)) {
    if (options.name.toLowerCase().includes('cancel')) {
      return '"Cancel" is a reserved work and it can´t be used';
    }
    const result = lib.createNewFile(options.name, options.number || null);
    const response = {
      message: `File ${options.name} created and added to list:\r${result}\rtry run "sspe list" for see the files list`,
      flow: 'success',
    };
    return response;
  }
};

const listFiles = async () => {
  let filesList = await lib.listFiles();
  if (!filesList || filesList.length === 0) {
    return launchErrorMessage(
      'There are no previously generated files. Try to generate one with "sspe create --name MyFileName"!'
    );
  }
  filesList = filesList.map((file, index) => `\r${index + 1}: ${file}`);
  filesList.push(`\r${filesList.length + 1}: ${cancelOption}`);
  const response = {
    message: `Write the number of file you want to process and press ENTER ${filesList.join(
      ''
    )}`,
    flow: 'success',
  };
  return response;
};

const processSelectedFile = options => {
  if (!options.path) {
    return launchErrorMessage('this option require file "--path" as parameter');
  }
  const filePath = path.join(__dirname, `/files/${options.path}`);
  const result = lib.processFile(filePath);
  const response = {
    message: `Executing with file ${options.path} ${emojis.get('coffee')}
    File data:\r${result.fileData}\rString number: ${result.stringNumber}`,
    flow: 'success',
  };
  return response;
};

const addDataForTraining = options => {
  const result = lib.addDataForTraining(options.add);
  const response = {
    message: `Added number ${options.add ||
      'aleatory'} to training file ${emojis.get('robot_face')}\r${
      result.message
    }\rFile data:\r${result.data}`,
    flow: 'success',
  };
  return response;
};

const doTraining = options => {
  const result = lib.doTraining(options.iter, options.error);
  const response = {
    message: result.message,
  };
  return response;
};

const analizeFile = filePath => {
  console.log(`Executed net with file ${filePath} ${emojis.get('coffee')}`);
  const result = lib.analizeFile(filePath);
  const response = {
    message: `Executed net with file ${filePath} ${emojis.get(
      'coffee'
    )}\rFile data:\r${result.fileData}\rString number:\r${result.stringNumber}`,
  };
  return response;
};

const neuralNetWork = options => {
  if (options.add === 0 || options.add) {
    return addDataForTraining(options);
  } else if (options.path) {
    const filePath = path.join(__dirname, `/files/${options.path}`);
    return analizeFile(filePath);
  } else if (Object.keys(options).length === 1 || options.iter) {
    return doTraining(options);
  }
  return launchErrorMessage(
    'the option for the "ml" action are not recognized.'
  );
};

const noEntry = () => {
  return launchErrorMessage(defaultMessage);
};

const isValidCommand = command => {
  if (!command[0] || command[0].toLowerCase() !== 'sspe') {
    return { message: 'The action are not recognized.', valid: false };
  }
  if (!command[1]) {
    return { message: 'The command must have options', valid: false };
  }
  const options = {};
  for (let index = 2; index < command.length; index += 2) {
    options[command[index].replace('--', '')] = command[index + 1];
  }
  return { valid: true, options };
};

exports.processCommand = async options => {
  const isValid = isValidCommand(options);
  if (!isValid.valid) {
    return launchErrorMessage(isValid.message);
  }
  const command = options[1].toLowerCase();
  const selected = {
    hi: help,
    showme: showMe,
    create: createFile,
    list: listFiles,
    select: processSelectedFile,
    ml: neuralNetWork,
    default: noEntry,
  };
  return selected[command]
    ? selected[command](isValid.options)
    : selected.default();
};
