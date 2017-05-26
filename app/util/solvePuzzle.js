import instructions from '../game/instructions';

let invalidSequences = [
	'lr', 'la', 'le',
	'rl', 'ra', 're',
	'al', 'ar', 'ae',
	'el', 'er', 'ea',
	'ff', 'sls', 'up'
];

export default (puzzle, maxSolutionLength) => {
	let stack = [ puzzle ];
	//find solutions
	let solutions = [];
	while (stack.length > 0) {
		let puzzle1 = stack.shift();
		let prevInstruction = puzzle1.instructions[puzzle1.instructions.length - 1];
		for (let key in instructions) {
			let puzzle2 = puzzle1.clone();
			if (puzzle2.applyInstruction(key)) {
				let isValid = true;
				for (let i = 0; i < invalidSequences.length; i++) {
					if (puzzle2.instructions.indexOf(invalidSequences[i]) >= 0) {
						isValid = false;
						break;
					}
				}
				if (isValid) {
					if (puzzle2.isSolved()) {
						solutions.push(puzzle2);
					} else if (puzzle2.instructions.length < maxSolutionLength) {
						stack.push(puzzle2);
					}
				}
			}
		}
	}
	return solutions;
};