<div align="center">
  <a href="http://json-schema.org">
    <img width="160" height="160"
      src="https://raw.githubusercontent.com/webpack-contrib/schema-utils/master/.github/assets/logo.png">
  </a>
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# schema-utils

Package for validate options in loaders and plugins.

## Getting Started

To begin, you'll need to install `schema-utils`:

```console
npm install schema-utils
```

## API

### validateOptions

**schema.json**

```json
{
  "type": "object",
  "properties": {
    "option": {
      "type": ["boolean"]
    }
  },
  "errorMessage": {
    "option": "should be {Boolean} (https:/github.com/org/repo#anchor)"
  },
  "additionalProperties": false
}
```

```js
import schema from './path/to/schema.json';
import validateOptions from 'schema-utils';

const options = { option: true };

validateOptions(schema, options, 'Loader/Plugin Name');
```

## Examples

**schema.json**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "test": {
      "anyOf": [
        { "type": "array" },
        { "type": "string" },
        { "instanceof": "RegExp" }
      ]
    },
    "transform": {
      "instanceof": "Function"
    },
    "sourceMap": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

### `Loader`

```js
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

import schema from 'path/to/schema.json';

function loader(src, map) {
  const options = getOptions(this) || {};

  validateOptions(schema, options, 'Loader Name');

  // Code...
}
```

### `Plugin`

```js
import validateOptions from 'schema-utils';

import schema from 'path/to/schema.json';

class Plugin {
  constructor(options) {
    validateOptions(schema, options, 'Plugin Name');

    this.options = options;
  }

  apply(compiler) {
    // Code...
  }
}
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/schema-utils.svg
[npm-url]: https://npmjs.com/package/schema-utils
[node]: https://img.shields.io/node/v/schema-utils.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/schema-utils.svg
[deps-url]: https://david-dm.org/webpack-contrib/schema-utils
[tests]: https://dev.azure.com/webpack-contrib/schema-utils/_apis/build/status/webpack-contrib.schema-utils?branchName=master
[tests-url]: https://dev.azure.com/webpack-contrib/schema-utils/_build/latest?definitionId=2&branchName=master
[cover]: https://codecov.io/gh/webpack-contrib/schema-utils/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/schema-utils
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=schema-utils
[size-url]: https://packagephobia.now.sh/result?p=schema-utils
