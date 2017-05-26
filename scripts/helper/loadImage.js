/* jslint node: true */
'use strict';

const fs = require('fs');
const Canvas = require('canvas');

module.exports = function loadImage(filePath) {
	let imageData = fs.readFileSync(filePath);
	var img = new Canvas.Image();
	img.src = imageData;
	return img;
};