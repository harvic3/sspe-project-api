'use strict';

const cleaner = require('../src/utils/cleaner');
const os = require('os');

const removed = os.type() === 'Windows_NT' ? 2 : 1;
const lineBreak = os.type() === 'Windows_NT' ? '\r\n' : '\n';

let _fourLines = [
  `     _   _       _  ${lineBreak}`,
  `|  _|  _| |_| |_  ${lineBreak}`,
  `| |_   _|   |  _| ${lineBreak}`,
  `\x00`,
];

describe('When file lines is mayor to three', function() {
  it('Eliminate excess lines', function() {
    const threeLines = cleaner.deleteUnnecessaryLines(_fourLines);
    expect(threeLines.length).toBe(3);
  });
});

describe('When the lines contain the line break', function() {
  it('Delete line breaks index 0', function() {
    const beforeLenght = _fourLines[0].length;
    const linesWithoutBreaks = cleaner.removeLineBreak(_fourLines);
    expect(linesWithoutBreaks[0].length).toBe(beforeLenght - removed);
  });
  it('Delete line breaks index 1', function() {
    const beforeLenght = _fourLines[1].length;
    const linesWithoutBreaks = cleaner.removeLineBreak(_fourLines);
    expect(linesWithoutBreaks[1].length).toBe(beforeLenght - removed);
  });
  it('Delete line breaks index 2', function() {
    const beforeLenght = _fourLines[2].length;
    const linesWithoutBreaks = cleaner.removeLineBreak(_fourLines);
    expect(linesWithoutBreaks[2].length).toBe(beforeLenght - removed);
  });
});
