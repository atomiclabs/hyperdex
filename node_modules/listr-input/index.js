'use strict';
const through = require('through');
const inquirer = require('inquirer');
const Observable = require('rxjs').Observable;

module.exports = (question, options) => {
	options = Object.assign({
		secret: false,
		done: () => { }
	}, options);

	if (typeof question !== 'string') {
		throw new TypeError(`Expected \`question\` to be of type \`string\`, got \`${typeof question}\``);
	}

	const questions = [
		{
			type: options.secret ? 'password' : 'input',
			name: 'result',
			message: question,
			default: options.default,
			validate: options.validate
		}
	];

	return new Observable(observer => {
		let buffer = '';

		const outputStream = through(data => {
			if (/\u001b\[.*?(D|C)$/.test(data)) {
				if (buffer.length > 0) {
					observer.next(buffer);
					buffer = '';
				}
				return;
			}

			buffer += data;
		});

		const prompt = inquirer.createPromptModule({
			output: outputStream
		});

		prompt(questions)
			.then(answer => {
				// Clear the output
				observer.next();

				return options.done(answer.result);
			})
			.then(() => {
				observer.complete();
			})
			.catch(err => {
				observer.error(err);
			});

		return outputStream;
	});
};
