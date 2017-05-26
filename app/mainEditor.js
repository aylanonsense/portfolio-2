import Puzzle from './game/Puzzle';
import prompt from './util/prompt';
import solvePuzzle from './util/solvePuzzle';
import clc from 'cli-color';

function promptForInput() {
	prompt('> ', handleInput);
}

function handleInput(input) {
	//create the puzzle
	let parts = input.split(' ');
	let target = parts[0] || '';
	let symbols = parts[1] || target;
	let maxSolutionLength = parseInt(parts[2]) || 7;
	let puzzle = new Puzzle({
		target: target,
		symbols: symbols
	});
	//find solutions
	let solutions = solvePuzzle(puzzle, maxSolutionLength);
	console.log('Solutions: ' + solutions.map(x => x.instructions).join(', '));
	//prompt for more input
	promptForInput();
}

console.log('Enter puzzles');
console.log(clc.blackBright(' e.g. morning nmoring 10'));
promptForInput();
