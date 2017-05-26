/* jslint node: true */
'use strict';

const GrowingPacker = require('binpacking').GrowingPacker;
const fs = require('fs');
const loadJsonFile = require('load-json-file');
const writeJsonFile = require('write-json-file');
const Canvas = require('canvas');
const loadImage = require('./helper/loadImage');
const saveImage = require('./helper/saveImage');

const config = loadJsonFile.sync('data/config.json');
const pixelArt = loadJsonFile.sync('data/pixel-art.json');
const pixelArtMetadata = loadJsonFile.sync('build/data/pixel-art-metadata.json');

//figure out how many sprite sheets we'll need
let area = 0;
for (let k in pixelArtMetadata) {
	area += pixelArtMetadata[k].thumbnail.width * pixelArtMetadata[k].thumbnail.height;
}
let numSpriteSheets = Math.ceil(area / (3500 * 3500));

//prep them for packing
let spriteSheetBlocks = [];
for (let i = 0; i < numSpriteSheets; i++) {
	spriteSheetBlocks[i] = [];
}
let bucket = 0;
for (let k in pixelArtMetadata) {
	let scale = pixelArtMetadata[k].grid.scale;
	spriteSheetBlocks[bucket].push({
		key: k,
		w: Math.ceil(pixelArtMetadata[k].grid.width / scale),
		h: Math.ceil(pixelArtMetadata[k].grid.height / scale)
	});
	bucket = (bucket + 1) % numSpriteSheets;
}
for (let i = 0; i < numSpriteSheets; i++) {
	spriteSheetBlocks[i].sort((a, b) => b.h - a.h);
}

//pack them
let packer = new GrowingPacker();
for (let i = 0; i < numSpriteSheets; i++) {
	packer.fit(spriteSheetBlocks[i]);
}

//put the data into a usable format
let pixelArtSpriteSheets = {
	locations: {},
	spriteSheets: {}
};
for (let i = 0; i < numSpriteSheets; i++) {
	let spriteSheetName = 'pixel-art-' + (i + 1);
	let spriteSheetWidth = 0;
	let spriteSheetHeight = 0;
	for (let j = 0; j < spriteSheetBlocks[i].length; j++) {
		let block = spriteSheetBlocks[i][j];
		let x = block.fit ? block.fit.x : null;
		let y = block.fit ? block.fit.y : null;
		if (x !== null && y !== null) {
			spriteSheetWidth = Math.max(spriteSheetWidth, x + block.w);
			spriteSheetHeight = Math.max(spriteSheetHeight, y + block.h);
			pixelArtSpriteSheets.locations[block.key] = {
				spriteSheet: spriteSheetName,
				x: x,
				y: y,
				width: block.w,
				height: block.h
			};
		}
	}
	pixelArtSpriteSheets.spriteSheets[spriteSheetName] = {
		name: spriteSheetName,
		image: 'build/images/' + spriteSheetName + '.png',
		width: spriteSheetWidth,
		height: spriteSheetHeight
	};
}

//save the data to a json file
writeJsonFile.sync('build/data/pixel-art-sprite-sheets.json', pixelArtSpriteSheets);

//create the sprite sheets
for (let spriteSheetName in pixelArtSpriteSheets.spriteSheets) {
	let spriteSheet = pixelArtSpriteSheets.spriteSheets[spriteSheetName];
	let canvas = new Canvas(spriteSheet.width, spriteSheet.height);
	let ctx = canvas.getContext('2d');
	for (let k in pixelArtSpriteSheets.locations) {
		let loc = pixelArtSpriteSheets.locations[k];
		if (spriteSheetName === loc.spriteSheet) {
			let thumbnail = pixelArtMetadata[k].thumbnail;
			let image = loadImage(thumbnail.path);
			ctx.drawImage(image,
				thumbnail.x, thumbnail.y,
				thumbnail.width, thumbnail.height,
				loc.x + Math.floor((loc.width - thumbnail.width) / 2),
				loc.y + Math.floor((loc.height - thumbnail.height) / 2),
				thumbnail.width, thumbnail.height);
		}
	}
	saveImage(canvas, spriteSheet.image);
}