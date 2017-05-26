import PuzzleSymbol from './PuzzleSymbol';
import instructions from './instructions';

function Puzzle(params) {
	this.target = params.target;
	this.symbols = [];
	for (let i = 0; i < params.symbols.length; i++) {
		let char = params.symbols[i];
		let packed = '';
		if (params.symbols[i + 1] === '(') {
			i += 2;
			while(i < params.symbols.length && params.symbols[i] !== ')') {
				packed += params.symbols[i];
				i++;
			}
		}
		this.symbols.push(new PuzzleSymbol({
			char: char,
			packed: packed
		}));
	}
	this.cursor = params.cursor || 0;
	this.instructions = params.instructions || '';
}
Puzzle.prototype.clone = function() {
	return new Puzzle({
		target: this.target,
		symbols: this.symbols.map(x => x.toString()).join(''),
		cursor: this.cursor,
		instructions: this.instructions
	});
};
Puzzle.prototype.isSolved = function() {
	if (this.symbols.length !== this.target.length) {
		return false;
	}
	for (let i = 0; i < this.symbols.length; i++) {
		if (this.symbols[i].char !== this.target[i]) {
			return false;
		}
	}
	return true;
};
Puzzle.prototype.applyInstruction = function(key) {
	//make sure the instruction exists
	if (!instructions[key]) {
		return false;
	}
	//apply the transformation
	if (!instructions[key].exec(this)) {
		return false;
	}
	this.instructions += key;
	return true;
};

export default Puzzle;