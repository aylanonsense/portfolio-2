/* jslint node: true */
'use strict';

const loadJsonFile = require('load-json-file');
const writeJsonFile = require('write-json-file');
const sizeOf = require('image-size');

const config = loadJsonFile.sync('data/config.json');
const pixelArt = loadJsonFile.sync('data/pixel-art.json');

const MONTHS = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

function generateHumanReadableDate(date) {
	let humanReadableDate = null;
	let time = 0;
	if (date) {
		if(date.end) {
			if(date.end.indexOf('/') >= 0) {
				let start = date.start.split('/');
				let end = date.end.split('/');
				//e.g. November - December 2015
				if(start[0] === end[0]) {
					humanReadableDate = MONTHS[+start[1] - 1] + ' - ' + MONTHS[+end[1] - 1] + ' ' + end[0];
				}
				//e.g. November 2015 - December 2016
				else {
					humanReadableDate = MONTHS[+start[1] - 1] + ' ' + start[0] + ' - ' + MONTHS[+end[1] - 1] + ' ' + end[0];
				}
			}
			else {
				//e.g. 2015 - 2016
				humanReadableDate = date.start + ' - ' + date.end;
			}
			time = (new Date(date.end)).getTime();
		}
		else {
			//e.g. November 2015
			if(date.indexOf('/') >= 0) {
				let parts = date.split('/');
				humanReadableDate = MONTHS[+parts[1] - 1] + ' ' + parts[0];
			}
			//e.g. 2015
			else {
				humanReadableDate = date;
			}
			time = (new Date(date)).getTime();
		}
	}
	return { date: humanReadableDate, time: time };
}

let pixelArtMetadata = {};
for (let k in pixelArt) {
	let entry = pixelArt[k];
	let dateData = generateHumanReadableDate(entry.date);
	let imagePath = 'images/pixel-art/' + entry.image;
	let imageSize = sizeOf(imagePath);
	let cols = entry.grid && entry.grid.cols ? entry.grid.cols : 1;
	let rows = entry.grid && entry.grid.rows ? entry.grid.rows : 1;
	pixelArtMetadata[k] = {
		date: dateData.date,
		time: dateData.time,
		image: {
			path: imagePath,
			width: imageSize.width,
			height: imageSize.height
		},
		grid: {
			width: cols * config.grid.tileSize + (cols - 1) * config.grid.tileGap,
			height: rows * config.grid.tileSize + (rows - 1) * config.grid.tileGap,
			scale: entry.grid && entry.grid.scale ? entry.grid.scale : 1
		},
		thumbnail: {
			path: imagePath,
			x: entry.thumbnail && entry.thumbnail.x ? entry.thumbnail.x : 0,
			y: entry.thumbnail && entry.thumbnail.y ? entry.thumbnail.y : 0,
			width: entry.thumbnail && entry.thumbnail.width ? entry.thumbnail.width : imageSize.width,
			height: entry.thumbnail && entry.thumbnail.height ? entry.thumbnail.height : imageSize.height
		}
	};
}

writeJsonFile.sync('build/data/pixel-art-metadata.json', pixelArtMetadata);