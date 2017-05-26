import PuzzleSymbol from './PuzzleSymbol';

export default {
	a: {
		name: 'start',
		exec: puzzle => {
			//can't move left if we're already at the leftmost symbol
			if (puzzle.cursor < 1) {
				return false;
			}
			puzzle.cursor = 0;
			return true;
		}
	},
	/*d: {
		name: 'delete',
		exec: puzzle => {
			//can't delete unless we have at least one symbol
			let numSymbols = puzzle.symbols.length;
			if (numSymbols < 1) {
				return false;
			}
			//create new symbols without the deleted one
			let symbols = '';
			for (let i = 0; i < puzzle.symbols.length; i++) {
				if (i !== puzzle.cursor) {
					symbols += puzzle.symbols[i];
				}
			}
			puzzle.symbols = symbols;
			puzzle.cursor = Math.max(0, puzzle.cursor - 1); //TODO should the cursor stay in the same spot?
			return true;
		}
	},*/
	e: {
		name: 'end',
		exec: puzzle => {
			//can't move right if we're already at the rightmost symbol
			let numSymbols = puzzle.symbols.length;
			if (puzzle.cursor >= numSymbols - 1) {
				return false;
			}
			puzzle.cursor = numSymbols - 1;
			return true;
		}
	},
	f: {
		name: 'flip',
		exec: puzzle => {
			//can't flip unless we have at least two symbols
			let numSymbols = puzzle.symbols.length;
			if (numSymbols < 2) {
				return false;
			}
			//reverse the symbols
			puzzle.symbols.reverse();
			return true;
		}
	},
	l: {
		name: 'left',
		exec: puzzle => {
			//can't move left if we're already at the leftmost symbol
			if (puzzle.cursor < 1) {
				return false;
			}
			puzzle.cursor -= 1;
			return true;
		}
	},
	p: {
		name: 'pack',
		exec: puzzle => {
			//can't pack unless we have at least two symbols
			let numSymbols = puzzle.symbols.length;
			if (numSymbols < 2) {
				return false;
			}
			//can't pack unless there's a symbol to the right
			if (puzzle.cursor >= puzzle.symbols.length - 1) {
				return false;
			}
			//can't pack if the current symbol has a packed character
			if (puzzle.symbols[puzzle.cursor].packed.length > 0) {
				return false;
			}
			//pack the symbol
			let symbols = [];
			for (let i = 0; i <= puzzle.cursor; i++) {
				symbols.push(puzzle.symbols[i]);
			}
			puzzle.symbols[puzzle.cursor].packed = puzzle.symbols[puzzle.cursor + 1].char;
			//unpack the other symbol's packed
			if (puzzle.symbols[puzzle.cursor + 1].packed.length > 0) {
				symbols.push(new PuzzleSymbol({
					char: puzzle.symbols[puzzle.cursor + 1].packed
				}));
			}
			for (let i = puzzle.cursor + 2; i < puzzle.symbols.length; i++) {
				symbols.push(puzzle.symbols[i]);
			}
			puzzle.symbols = symbols;
			return true;
		}
	},
	r: {
		name: 'right',
		exec: puzzle => {
			//can't move right if we're already at the rightmost symbol
			let numSymbols = puzzle.symbols.length;
			if (puzzle.cursor >= numSymbols - 1) {
				return false;
			}
			puzzle.cursor += 1;
			return true;
		}
	},
	s: {
		name: 'swap',
		exec: puzzle => {
			//can't swap unless we have at least two symbols
			let numSymbols = puzzle.symbols.length;
			if (numSymbols < 2) {
				return false;
			}
			//can't swap unless there's a symbol to the right
			if (puzzle.cursor >= puzzle.symbols.length - 1) {
				return false;
			}
			//perform the swap
			let temp = puzzle.symbols[puzzle.cursor];
			puzzle.symbols[puzzle.cursor] = puzzle.symbols[puzzle.cursor + 1];
			puzzle.symbols[puzzle.cursor + 1] = temp;
			puzzle.cursor += 1;
			return true;
		}
	},
	u: {
		name: 'unpack',
		exec: puzzle => {
			//can't unpack unless we have at least one symbol
			let numSymbols = puzzle.symbols.length;
			if (numSymbols < 1) {
				return false;
			}
			//can't unpack unless the current symbol has a packed character
			if (puzzle.symbols[puzzle.cursor].packed.length <= 0) {
				return false;
			}
			//unpack the symbol
			puzzle.symbols.splice(puzzle.cursor + 1, 0, new PuzzleSymbol({
				char: puzzle.symbols[puzzle.cursor].packed
			}));
			puzzle.symbols[puzzle.cursor].packed = '';
			return true;
		}
	}
};
/*
instructions:
	b
	c
	d delete
	g
	h
	i insert
	j
	k repeat instructions
	m
	n
	o
	q quit
	t next letter
	v vswap
	w
	x
	y
	z undo

challenges:
	multiple words with a cursor for each, controlled simultaneously
	wildcard characters the adopt the instruction used on them
	second row target for packed characters
	maximum symbol limit
	dominos that can be rotated
	swap symbol with packed symbol
	playing cards...?
	circuits...?
	math problems...?
	swap between tracks/groups
	locked symbols
	l - lock symbol?
	press s to swap s's, press f to flip f's... ?

learnings:
	i'm supposed to match the word with the letters below it
	i can run commands
	the cursor is where those commands get executed


Manipulation-based classifications:
	Keyboard-manipulated track: appended by pressing keys
	Instruction-manipulated track: changed by executing instructions
	Overflow track: contains packed symbols from another track
	Static track: does not change

Track connections:
	Insertion connection:

Track groups:
	Matching: when all tracks match within all matchings, the puzzle is solved
	Simultaneous: the cursor simultaneously manipulates all tracks within a group

Track properties:
	Hidden: track is not visibly displayed

Types of symbols:
	Letters
	Instructions

Can you manipulate overflow letters? they have special USEFUL rules (like swap)

Can groups cover just subsets of a track?
	So let's say we had  6+2=2+4*1
	And we grouped it as 6+2=2+4+1
	AND                    2=2

We could do a crossword sort of deal, but that seems so-so
        4-3
	4*2=2*1
	5+1

Do we want numeric groups to have
	static:       10
	manipulated:  2*3+4

	OR just:      2*3+4=10

	the former is probably better, uses and riffs on the same concept of equality

Basic puzzle layout:
	MS
	A  Static letters
	AA Instruction-manipulated letters
	   Overflow letters
	   Input-manipulated instructions

Overflow-matters puzzle layout
	MS
	A  Static letters
	AA Instruction-manipulated letters
	B  Overflow letters
	B  Static letters
	   Input-manipulated instructions

Overflow-must-be-identical layout
	MS
	A  Static letters
	AA Instruction-manipulated letters
	A  Overflow letters
       Input-manipulated instructions

Simultaneous puzzle layout:
	MS
	A  Static letters
	AA Instruction-manipulated letters
	   Overflow letters
	B  Static letters
	BA Instruction-manipulated letters
	   Overflow letters
	   Input-manipulated instructions

Simple riddle layout:
	MS
	A  Hidden static letters
	AA Instruction-manipulated letters
	   Overflow letters
	   Input-manipulated instructions

things to learn:
	general:
		1. trying to match the word
		2. execute instructions to do so
		3. there are a max number of instructions
		...
	s - swap:
		1. swaps two symbols
		2. swaps at the cursor
		3. swaps to the right of the cursor
		4. can't swap at the end

s  - swap
lr - move
pu - packing
v  - better packing
ae - move better
f  - flip
i  - insert
d  - delete
z
t  - transmute letter

	introduce: s
ab+			Ba+			s
abcd+		Dabc+		sss
	introduce: r
	introduce: z if you get to max moves (when do we introduce it again?)
abcdef+		acbedf+		rsrs	4 moves MAX
...
	introduce: l



*/