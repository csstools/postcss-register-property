# PostCSS Register Property [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[PostCSS Register Property] lets you register properties in CSS.

```pcss
@property --highlight-color {
  inherits: true;
  initial-value: red;
  syntax: "<color>";
}

@property --gap-spacing {
  inherits: false;
  initial-value: 1em;
  syntax: "<length-percentage>";
}
```

These properties are transformed into JSON.

```json
[
  {
    "name": "--highlight-color",
    "inherits": true,
    "initialValue": "red",
    "syntax": "<color>"
  },
  {
    "name": "--gap-spacing",
    "initialValue": "1em",
    "syntax": "<length-percentage>"
  }
]
```

These properties can be imported and registered in a browser.

```js
import properties from './styles.css.properties.json';

if (window.CSS && CSS.registerProperty) {
  for (const descriptor of properties) {
    CSS.registerProperty(descriptor);
  }
}
```

Optionally, you can even detect registrations from custom properties:

```pcss
:root {
  --some-border: 5px solid rebeccapurple;
  --some-image: url("image.webp");
  --some-transform: scale(1.25, 1.25);
}
```

```json
[
  {
    "name": "--some-border",
    "syntax": "<length> <custom-ident> <color>"
  },
  {
    "name": "--some-image",
    "syntax": "<image>"
  },
  {
    "name": "--some-transform",
    "syntax": "<transform-function>"
  }
]
```

## Usage

Add [PostCSS Register Property] to your project:

```bash
npm install postcss-register-property --save-dev
```

Use [PostCSS Register Property] to process your CSS:

```js
const postcssRegisterProperty = require('postcss-register-property');

postcssRegisterProperty.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssRegisterProperty = require('postcss-register-property');

postcss([
  postcssRegisterProperty(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Register Property] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### detect

The `detect` option determines whether registrations will be detected from
Custom Properties. By default, they are not detected.

```js
postcssRegisterProperty({ detect: true }) // detect custom property registrations
```

### getJSON

The `getJSON` option defines the function that handles all of the collected
properties from CSS. If not specified, these properties will be written as JSON
to a file determined by the `to` option.

If specified, the `getJSON` function is passed 3 arguments; the path to the
source CSS, an object of all the collected properties, and the path to the
destination JSON. Asynchronous functions should return promise-like values.

```js
postcssRegisterProperty({
  getJSON(cssFileName, properties, jsonFileName) {
    /* do something with cssFileName, properties, and jsonFileName */
  }
)
```

### to

The `to` option determines the destination path where the properties will be
written to as JSON. If not specified, the destination will be the input source
filename appended with `.properties.json`.

[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-register-property.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-register-property
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-register-property.svg
[npm-url]: https://www.npmjs.com/package/postcss-register-property

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Register Property]: https://github.com/jonathantneal/postcss-register-property
