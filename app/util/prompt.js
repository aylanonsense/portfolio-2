import process from 'process';

let stdin = process.openStdin();
let callbacks = [];

stdin.addListener('data', d => {
	if (callbacks.length > 0) {
		let input = d.toString().trim();
		let callback = callbacks.shift();
		callback(input);
	}
});

export default (prompt, callback) => {
	callbacks.push(callback);
	process.stdout.write(prompt);
};