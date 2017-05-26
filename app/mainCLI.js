import GameState from './game/GameState';
import Puzzle from './game/Puzzle';
import CLIRenderer from './render/CLIRenderer';
import prompt from './util/prompt';
import clc from 'cli-color';

//create game vars
let gameState = new GameState({
	puzzle: new Puzzle({
		target: 'morning',
		symbols: 'nmo(x)ri(y)ng'
	})
});
let renderer = new CLIRenderer({
	gameState: gameState
});

//create main functions
function renderGameState() {
	renderer.render();
}

function promptForInput() {
	prompt('> ' + clc.blackBright(gameState.puzzle.instructions), function(input) {
		handleInput(input.toLowerCase());
		renderGameState();
		promptForInput();
	});
}

function handleInput(input) {
	for (let i = 0; i < input.length; i++) {
		if (!gameState.puzzle.applyInstruction(input[i])) {
			console.log(clc.red('Could not apply instruction \'' + input[i] + '\''));
			break;
		}
	}
}

//begin basic game loop
renderGameState();
promptForInput();
