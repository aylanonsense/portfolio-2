function PuzzleSymbol(params) {
	this.char = params.char;
	this.packed = params.packed || '';
}
PuzzleSymbol.prototype.toString = function() {
	return this.char + (this.packed.length > 0 ? '(' + this.packed + ')' : '');
};

export default PuzzleSymbol;