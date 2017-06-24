/* jslint node: true */
'use strict';

const loadJsonFile = require('load-json-file');
const writeJsonFile = require('write-json-file');
const packIntoGrid = require('./helper/packIntoGrid');

const config = loadJsonFile.sync('data/config.json');
const pixelArt = loadJsonFile.sync('data/pixel-art.json');

let pixelArtPackings = {};
for (let numCols = config.grid.minColumns; numCols <= config.grid.maxColumns; numCols++) {
	pixelArtPackings[numCols] = packIntoGrid(pixelArt, numCols);
}

writeJsonFile.sync('build/data/pixel-art-grid.json', pixelArtPackings);