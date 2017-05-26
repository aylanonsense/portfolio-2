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

// console.log(pixelArtPackings);
//let packing = packIntoGrid(pixelArt, 4);

// let page = Mustache.render(base, {
// 	content: 'blah'
// });



/*
	Load in the pixel art data
	Pack the pixel art into a grid 4-columns wide
		packIntoGrid(pixelArt, 4)
			returns a map of col/row pairs
	Add that onto the pixel art data
	...
	Create HTML from the pixel art data
	Prepare client-side data
	Boom!
*/

/*
strategy
	take a loot at the pixel art data
	...
	thoughts:
		we have .html files for X to Y columns
			320px: 30 + 80 + 10 + 80 + 10 + 80 + 30
			1080px: 10 columns
			so that's 3 to 10 columns, maybe 3 to 9 of 80px with 10px gap
		there is an uneven grid of rectangular cells
		there are a minimum number of images for the thumbnails
		the cells link to individual pages per pixel art
		OH SNAP could we use media queries to style the thumbnails?
			would mean not having them be in the correct place on pageload
			also those cache for quite a while...
			they could just have classes like col-xs-1 col-md-3 etc
				so each item would have 14 classes on it?
				ooh and our stylesheet would have to define row-xs-1 row-xs-2 etc etc... I don't like that
				yeah nevermind this idea
		assume 3 columns, always deliver 3 columns, javascript can adjust from there
		so no pixel art is allowed to be wider than 260px
			and that's only 3x wider than the smallest
			could also have
				minimum 4 columns
				70px tiles or 65px tiles
				10px gaps
			or stick with what we had
				60px tiles
				12px gaps
				4 columns min
		also I don't know if I have enough pixel art for 10 columns
			maybe 8? or 7?
			also wait, if I ALWAYS deliver 4 column, I don't need to compile anything other than that
	results:
		a single .html file for pixel-art
		it is a grid of tiles 60px wide and 12px gaps
		the tiles are not equally sized
		the html file is fixed in 4 columns
		the thumbnails are arranged optimally for 4 columns
		the thumbnails for the tiles use a sprite sheet - the minimum number of sprite sheets are used
		hovering over a thumbnail shows an image
			can this be done without javascript?
			maybe if there's no javascript... we just skip this step
		click a thumbnail takes you to an individual project page
	note:
		320px is the min width we should support
		different pixel densities
*/