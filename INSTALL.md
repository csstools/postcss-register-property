# Installing PostCSS Register Property

[PostCSS Register Property] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

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

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Register Property] in your `postcss.config.js` configuration file:

```js
const postcssRegisterProperty = require('postcss-register-property');

module.exports = {
  plugins: [
    postcssRegisterProperty(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Register Property] in your Webpack configuration:

```js
const postcssRegisterProperty = require('postcss-register-property');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: {
            ident: 'postcss',
            plugins: () => [
              postcssRegisterProperty(/* pluginOptions */)
            ]
          } }
        ]
      }
    ]
  }
}
```

## Create React App

Add [React App Rewired] and [React App Rewire PostCSS] to your project:

```bash
npm install react-app-rewired react-app-rewire-postcss --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Register Property] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssRegisterProperty = require('postcss-register-property');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssRegisterProperty(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Register Property] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssRegisterProperty = require('postcss-register-property');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssRegisterProperty(/* pluginOptions */)
  ])
).pipe(
  gulp.dest('.')
));
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS Register Property] in your Gruntfile:

```js
const postcssRegisterProperty = require('postcss-register-property');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssRegisterProperty(/* pluginOptions */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS CLI]: https://github.com/postcss/postcss-cli
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Register Property]: https://github.com/jonathantneal/postcss-register-property
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
