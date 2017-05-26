/* jslint node: true */
'use strict';

function canPlaceIntoGrid(entry, grid, col, row) {
	if (col < 0 || col + entry.grid.cols - 1 >= grid.length || row < 0) {
		return false;
	}
	for (let c = col; c < col + entry.grid.cols; c++) {
		for (let r = row; r < row + entry.grid.rows; r++) {
			if (grid[c][r]) {
				return false;
			}
		}
	}
	return true;
}

function placeIntoGrid(entry, grid, col, row) {
	for (let c = col; c < col + entry.grid.cols; c++) {
		for (let r = row; r < row + entry.grid.rows; r++) {
			grid[c][r] = entry;
		}
	}
}

function findPlaceInGrid(entry, grid, numRows) {
	for (let r = 0; r <= numRows; r++) {
		for (let c = 0; c < grid.length; c++) {
			if (canPlaceIntoGrid(entry, grid, c, r)) {
				placeIntoGrid(entry, grid, c, r);
				return { col: c, row: r };
			}
		}
	}
}

module.exports = function packIntoGrid(data, numCols) {
	let locations = {};
	let grid = [];
	for (let c = 0; c < numCols; c++) {
		grid[c] = [];
	}
	let numRows = 0;
	for (let k in data) {
		let entry = data[k];
		let loc = findPlaceInGrid(entry, grid, numRows);
		if (!loc) {
			throw new Error('Could not find place for ' + k + ' in grid');
		}
		locations[k] = loc;
		numRows = Math.max(numRows, loc.row + entry.grid.rows);
	}
	return {
		locations: locations,
		numCols: numCols,
		numRows: numRows
	};
};