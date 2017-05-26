/* jslint node: true */
'use strict';

const Mustache = require('mustache');
const fs = require('fs');
const loadJsonFile = require('load-json-file');

const config = loadJsonFile.sync('data/config.json');
const baseHtml = fs.readFileSync('templates/base.mustache', 'utf8');
const gridHtml = fs.readFileSync('templates/grid.mustache', 'utf8');
const pixelArt = loadJsonFile.sync('data/pixel-art.json');
const pixelArtMetadata = loadJsonFile.sync('build/data/pixel-art-metadata.json');
const pixelArtGrid = loadJsonFile.sync('build/data/pixel-art-grid.json');
const pixelArtSpriteSheets = loadJsonFile.sync('build/data/pixel-art-sprite-sheets.json');

let pixelArtTemplateData = [];
for (let k in pixelArt) {
	let col = pixelArtGrid[config.grid.minColumns].locations[k].col;
	let row = pixelArtGrid[config.grid.minColumns].locations[k].row;
	let cols = pixelArt[k].grid.cols;
	let rows = pixelArt[k].grid.rows;
	let loc = pixelArtSpriteSheets.locations[k];
	let spriteSheet = pixelArtSpriteSheets.spriteSheets[loc.spriteSheet];
	let scale = pixelArtMetadata[k].grid.scale;
	let templateData = {
		key: k,
		title: pixelArt[k].title || 'Untitled',
		hasTitle: pixelArt[k].title !== null,
		description: pixelArt[k].description,
		date: pixelArtMetadata[k].date,
		time: pixelArtMetadata[k].time,
		grid: {
			x: col * (config.grid.tileSize + config.grid.tileGap),
			y: row * (config.grid.tileSize + config.grid.tileGap),
			width: pixelArtMetadata[k].grid.width,
			height: pixelArtMetadata[k].grid.height
		},
		thumbnail: {
			image: 'images/' + spriteSheet.name + '.png',
			x: -loc.x * scale,
			y: -loc.y * scale,
			width: spriteSheet.width * scale,
			height: spriteSheet.height * scale,
			pixelated: true,
			color: pixelArt[k].background || '#fff'
		}
	};
	pixelArtTemplateData.push(templateData);
}
pixelArtTemplateData.sort((a, b) => b.time - a.time);

let numCols = pixelArtGrid[config.grid.minColumns].numCols;
let numRows = pixelArtGrid[config.grid.minColumns].numRows;
let content = Mustache.render(gridHtml, {
	entries: pixelArtTemplateData,
	grid: {
		width: numCols * config.grid.tileSize + (numCols - 1) * config.grid.tileGap,
		height: numRows * config.grid.tileSize + (numRows - 1) * config.grid.tileGap
	}
});

let html = Mustache.render(baseHtml, {
	content: content
});

fs.writeFileSync('build/html/pixel-art.html', html);