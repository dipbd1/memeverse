const gradient = require('gradient-string');

const art = function () {
	console.log(
		gradient.instagram.multiline(
			[
				'███▄ ▄███▓▓█████  ███▄ ▄███▓▓█████ ██▒   █▓▓█████  ██▀███    ██████ ▓█████  ',
				'▓██▒▀█▀ ██▒▓█   ▀ ▓██▒▀█▀ ██▒▓█   ▀▓██░   █▒▓█   ▀ ▓██ ▒ ██▒▒██    ▒ ▓█   ▀ ',
				'▓██    ▓██░▒███   ▓██    ▓██░▒███   ▓██  █▒░▒███   ▓██ ░▄█ ▒░ ▓██▄   ▒███   ',
				'▒██    ▒██ ▒▓█  ▄ ▒██    ▒██ ▒▓█  ▄  ▒██ █░░▒▓█  ▄ ▒██▀▀█▄    ▒   ██▒▒▓█  ▄ ',
				'▒██▒   ░██▒░▒████▒▒██▒   ░██▒░▒████▒  ▒▀█░  ░▒████▒░██▓ ▒██▒▒██████▒▒░▒████▒',
				'░ ▒░   ░  ░░░ ▒░ ░░ ▒░   ░  ░░░ ▒░ ░  ░ ▐░  ░░ ▒░ ░░ ▒▓ ░▒▓░▒ ▒▓▒ ▒ ░░░ ▒░ ░',
				'░  ░      ░ ░ ░  ░░  ░      ░ ░ ░  ░  ░ ░░   ░ ░  ░  ░▒ ░ ▒░░ ░▒  ░ ░ ░ ░  ░',
				'░      ░      ░   ░      ░      ░       ░░     ░     ░░   ░ ░  ░  ░     ░   ',
				'	   ░      ░  ░       ░      ░  ░     ░     ░  ░   ░           ░     ░  ░',
				'										░                                   ',
				'',
			].join('\n'),
		),
	);
};

module.exports = { art };
