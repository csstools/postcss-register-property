const fs = require('fs');
const expectJSON = JSON.stringify([
	{ name: '--highlight-color', inherits: true, initialValue: 'red', syntax: '<color>' },
	{ name: '--gap-spacing', initialValue: '1em', syntax: '<length-percentage>' }
], null, '  ');
const expectDetectJSON = JSON.stringify([
	{ name: '--highlight-color', inherits: true, initialValue: 'red', syntax: '<color>' },
	{ name: '--gap-spacing', initialValue: '1em', syntax: '<length-percentage>' },
	{ name: '--detect-color', syntax: '<color>' },
	{ name: '--detect-length', syntax: '<length>' },
	{ name: '--detect-percentage', syntax: '<percentage>' },
	{ name: '--detect-number', syntax: '<number>' },
	{ name: '--detect-image', syntax: '<image>' },
	{ name: '--detect-url', syntax: '<url>' },
	{ name: '--detect-integer', syntax: '<integer>' },
	{ name: '--detect-angle', syntax: '<angle>' },
	{ name: '--detect-time', syntax: '<time>' },
	{ name: '--detect-resolution', syntax: '<resolution>' },
	{ name: '--detect-transform-function', syntax: '<transform-function>' },
	{ name: '--detect-string', syntax: '<string>' },
	{ name: '--detect-border', syntax: '<length> <custom-ident> <color>' }
], null, '  ');
let resultGetJSON = '';

module.exports = {
	'postcss-register-property': {
		'basic': {
			message: 'supports basic usage',
			after() {
				const pathname = './test/basic.css.properties.json';
				const resultJSON = fs.readFileSync(pathname, 'utf8');

				if (expectJSON !== resultJSON) {
					console.error('\nexpected:', JSON.stringify(expectJSON));
					console.error('\nreceived:', JSON.stringify(resultJSON));
					throw new Error('JSON did not match expected output');
				}

				fs.unlinkSync(pathname);
			}
		},
		'basic:getJSON': {
			message: 'supports { getJSON() } usage',
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			options: {
				getJSON(cssFileName, descriptors, jsonFileName) {
					resultGetJSON = JSON.stringify(descriptors, null, '  ');
				}
			},
			after() {
				if (expectJSON !== resultGetJSON) {
					console.error('\nexpected:', JSON.stringify(expectJSON));
					console.error('\nreceived:', JSON.stringify(resultGetJSON));
					throw new Error('JSON did not match expected output');
				}
			}
		},
		'basic:to': {
			message: 'supports { to } usage',
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			options: {
				to: './test/basic.custom.json'
			},
			after() {
				const pathname = './test/basic.custom.json';
				const resultJSON = fs.readFileSync(pathname, 'utf8');

				if (expectJSON !== resultJSON) {
					console.error('\nexpected:', JSON.stringify(expectJSON));
					console.error('\nreceived:', JSON.stringify(resultJSON));
					throw new Error('JSON did not match expected output');
				}

				fs.unlinkSync(pathname);
			}
		},
		'basic:detect': {
			message: 'supports { detect: true } usage',
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			options: {
				detect: true
			},
			after() {
				const pathname = './test/basic.css.properties.json';
				const resultJSON = fs.readFileSync(pathname, 'utf8');

				if (expectDetectJSON !== resultJSON) {
					console.error('\nexpected:', JSON.stringify(expectDetectJSON));
					console.error('\nreceived:', JSON.stringify(resultJSON));
					throw new Error('JSON did not match expected output');
				}

				fs.unlinkSync(pathname);
			}
		},
		'basic:detect:getJSON': {
			message: 'supports { detect: true, getJSON() } usage',
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			options: {
				detect: true,
				getJSON(cssFileName, descriptors, jsonFileName) {
					resultGetJSON = JSON.stringify(descriptors, null, '  ');
				}
			},
			after() {
				if (expectDetectJSON !== resultGetJSON) {
					console.error('\nexpected:', JSON.stringify(expectDetectJSON));
					console.error('\nreceived:', JSON.stringify(resultGetJSON));
					throw new Error('JSON did not match expected output');
				}
			}
		},
		'basic:detect:to': {
			message: 'supports { detect: true, to } usage',
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			options: {
				detect: true,
				to: './test/basic.custom.json'
			},
			after() {
				const pathname = './test/basic.custom.json';
				const resultJSON = fs.readFileSync(pathname, 'utf8');

				if (expectDetectJSON !== resultJSON) {
					console.error('\nexpected:', JSON.stringify(expectDetectJSON));
					console.error('\nreceived:', JSON.stringify(resultJSON));
					throw new Error('JSON did not match expected output');
				}

				fs.unlinkSync(pathname);
			}
		}
	}
};
