import fs from 'fs';
import postcss from 'postcss';

export default postcss.plugin('postcss-register-property', opts => {
	// initialize options
	const detect = 'detect' in Object(opts) ? Boolean(opts.detect) : false;
	const getJSON = 'getJSON' in Object(opts) ? opts.getJSON : defaultGetJSON;
	const to = 'to' in Object(opts) ? opts.to : null;

	return (root, result) => {
		// determine the input CSS filename
		const cssFileName = Object(Object(root.source).input).file || Object(result.opts).from;

		// determine the output JSON filename
		const outputFileName = to || `${cssFileName || 'index.css'}.properties.json`;

		// initialize the descriptors
		const descriptorsByName = {};

		// walk the @property atrule children of the root
		root.walk(node => {
			if (isValidProperty(node, root)) {
				// determine the name of the property from the atrule params
				const [, name ] = node.params.match(validPropertyRegExp);

				// initialize the property descriptor
				const descriptor = descriptorsByName[name] = { name };

				// walk the descriptor children of the root
				node.nodes.forEach(child => {
					if (isValidDecl(child)) {
						// determine the descriptor property
						const prop = kebabCaseToCamelCase(child.prop);

						// determine the descriptor value
						const value = validOptions[prop](child.value);

						// conditionally write a non-default value to the descriptor
						if (value !== defaultValidOptions[prop]) {
							descriptor[prop] = value;
						}
					}
				});

				// conditionally remove a fully "default" descriptor
				if (Object.keys(descriptor).length === 1) {
					delete descriptorsByName[name];
				}

				// remove the @property atrule
				node.remove();
			} else if (detect && isValidCustomProperty(node)) {
				// conditionally detect property syntaxes by custom properties
				const name = node.prop;
				const syntaxStrings = postcss.list.space(node.value).map(getSyntaxString);

				if (syntaxStrings.some(syntaxString => syntaxString !== '<custom-ident>')) {
					const syntax = syntaxStrings.join(' ');

					descriptorsByName[name] = { name, syntax };
				}
			}
		});

		// process the descriptors using the getJSON function
		if (typeof getJSON === 'function') {
			// determine the descriptors
			const descriptors = Object.keys(descriptorsByName).map(
				name => descriptorsByName[name]
			);

			// forward the return value of getJSON to support asyncronous operations
			return getJSON(cssFileName, descriptors, outputFileName);
		}

		return undefined;
	};
});

// determine valid @property atrules
const validPropertyRegExp = /^\s*(--[\w-]+)\s*$/;
const isValidProperty = (node, root) => Object(node).type === 'atrule' && node.parent === root && validPropertyRegExp.test(node.params);

// determine valid @property child declarations
const validOptions = {
	syntax(value) {
		return isValidSyntax(value)
			? value.replace(validSyntaxRegExp, '$2') || defaultValidOptions.syntax
		: defaultValidOptions.syntax;
	},
	inherits(value) {
		return value === 'true';
	},
	initialValue(value) {
		return value || defaultValidOptions.initialValue;
	},
};
const defaultValidOptions = {
	syntax: '*',
	inherits: false,
	initialValue: ''
}
const isValidDecl = node => node.type === 'decl' && Object.keys(defaultValidOptions).includes(kebabCaseToCamelCase(node.prop));
const validSyntaxRegExp = /^(["'])(.*)\1$/;
const isValidSyntax = value => validSyntaxRegExp.test(value);
const validCustomProperty = /^--[\w-]+$/;
const isValidCustomProperty = node => node.type === 'decl' && validCustomProperty.test(node.prop);
const kebabCaseToCamelCase = string => string.replace(/-[a-z]/g, $0 => $0[1].toUpperCase());

// define default getJSON functionality
const defaultGetJSON = (cssFileName, descriptors, jsonFileName) => new Promise((resolve, reject) => {
	const descriptorsJSON = JSON.stringify(descriptors, null, '  ');

	fs.writeFile(jsonFileName, descriptorsJSON, (error, ...results) => {
		if (error) {
			reject(error);
		} else {
			resolve(...results);
		}
	});
});

// any valid <color> value
const colorRegExp = /^(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|currentColor|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|inherit|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|transparent|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|#(?:([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])?|([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})?)|(color-mod|(hsl|rgb)a?)\(.+\))$/i;

// any valid <length> value
const lengthRegExp = /^(0|[-+]?[0-9]*\.?[0-9]+(%|ch|cm|em|ex|in|mm|pc|pt|px|q|rem|vh|vmax|vmin|vw))/i;

// any valid <percentage> value
const percentageRegExp = /^([-+]?[0-9]*\.?[0-9]+%)$/;

// any valid <number> value
const numberRegExp = /^([-+]?[0-9]*\.?[0-9]+)$/;

// any valid <image> value
const imageRegExp = /^((cross-fade|image-set|(repeating-)?(linear|radial)-gradient)\(.*\)|url\(.*\.(bmp|gif|jpe?g|png|svg|webp).*\))$/i;

// any valid <url> value
const urlRegExp = /^url\(.+\)$/i;

// any valid <integer> value
const integerRegExp = /^[0-9]+$/i;

// any valid <angle> value
const angleRegExp = /[-+]?[0-9]*\.?[0-9]+(deg|grad|rad|turn)$/i;

// any valid <time> value
const timeRegExp = /^(0|[-+]?[0-9]*\.?[0-9]+m?s)$/i;

// any valid <resolution> value
const resolutionRegExp = /^(0|[-+]?[0-9]*\.?[0-9]+(dpi|dpcm|dppx))$/i;

// any valid <transform-function> value
const transformFunctionRegExp = /^(matrix|translate(X|Y)?|scale(X|Y|Z)?|rotate|skew(X|Y)?)\(.*\)$/i;

// any valid <string> value
const stringRegExp = /^("|').*\1$/i;

// any supported syntax string
const getSyntaxString = string => colorRegExp.test(string)
	? '<color>'
: transformFunctionRegExp.test(string)
	? '<transform-function>'
: imageRegExp.test(string)
	? '<image>'
: urlRegExp.test(string)
	? '<url>'
: angleRegExp.test(string)
	? '<angle>'
: timeRegExp.test(string)
	? '<time>'
: percentageRegExp.test(string)
	? '<percentage>'
: resolutionRegExp.test(string)
	? '<resolution>'
: lengthRegExp.test(string)
	? '<length>'
: integerRegExp.test(string)
	? '<integer>'
: numberRegExp.test(string)
	? '<number>'
: stringRegExp.test(string)
	? '<string>'
: '<custom-ident>';
