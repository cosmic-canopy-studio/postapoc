// Part: jest.setup.js
// Description: Jest setup file for Phaser 3.
// Code Reference:
// Documentation: https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array

const { createCanvas } = require('canvas');

// Provide a global implementation of the canvas to Phaser when running tests.
global['HTMLCanvasElement'].prototype.getContext = function () {
  const canvas = createCanvas(800, 600);
  return canvas.getContext('2d');
};
