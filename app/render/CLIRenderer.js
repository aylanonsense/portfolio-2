import clc from 'cli-color';

function CLIRenderer(params) {
	this.gameState = params.gameState;
}
CLIRenderer.prototype.render = function() {
	//draw the letters
	let target = this.gameState.puzzle.target;
	let symbols = this.gameState.puzzle.symbols;
	let text = '';
	let maxPacked = 0;
	for (let i = 0; i < symbols.length; i++) {
		if (i < target.length && symbols[i].char === target[i]) {
			text += clc.green(symbols[i].char);
		} else {
			text += symbols[i].char;
		}
		if (symbols[i].packed.length > maxPacked) {
			maxPacked = symbols[i].packed.length;
		}
	}
	console.log('  ' + text);
	//draw the packed letters
	for (let i = 0; i < maxPacked; i++) {
		let text = '';
		for (let j = 0; j < symbols.length; j++) {
			text += symbols[j].packed[i] || ' ';
		}
		console.log('  ' + text);
	}
	//draw the cursor
	let cursorText = '';
	while (cursorText.length < this.gameState.puzzle.cursor) {
		cursorText += ' ';
	}
	cursorText += '^';
	console.log('  ' + cursorText);
};

export default CLIRenderer;