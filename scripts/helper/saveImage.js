/* jslint node: true */
'use strict';

const fs = require('fs');
// const path = require('path');
// const Canvas = require('canvas');

module.exports = function saveImage(image, filePath, callback) {
	let out = fs.createWriteStream(filePath);
	let stream = filePath.endsWith('.png') ? image.pngStream() : image.jpegStream();
	stream.on('data', chunk => out.write(chunk));
	stream.on('end', (callback || () => {}));
};