[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![test][test]][test-url]
[![coverage][cover]][cover-url]
[![quality][quality]][quality-url]
[![chat][chat]][chat-url]

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" vspace="" hspace="25"
      src="https://worldvectorlogo.com/logos/webpack.svg">
  </a>
  <h1>Webpack Schema Utilities</h1>
  <p>Schema validation utilities for Ajv<p>
</div>

<h2 align="center">Install</h2>

```bash
npm i schema-utils@latest
```
asdf
<h2 align="center">Usage</h2>

### Validate Options


<h2 align="center">Examples</h2>

```javascript
const { validateSchema } = require('schema-utils');

...

// This injects possible default values to options
const validation = validateSchema(jsonSchema, options);

if(validation.isValid) {
  throw new Error(validation.error);
}

// options are ok to use now
```


<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/166921?v=3&s=150">
        </br>
        <a href="https://github.com/bebraw">Juho Vepsäläinen</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars2.githubusercontent.com/u/8420490?v=3&s=150">
        </br>
        <a href="https://github.com/d3viant0ne">Joshua Wiens</a>
      </td>
    </tr>
  <tbody>
</table>

[npm]: https://img.shields.io/npm/v/schema-utils.svg
[npm-url]: https://npmjs.com/package/schema-utils

[deps]: https://david-dm.org/webpack-contrib/schema-utils.svg
[deps-url]: https://david-dm.org/webpack-contrib/schema-utils

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: http://img.shields.io/travis/webpack-contrib/schema-utils.svg
[test-url]: https://travis-ci.org/webpack-contrib/schema-utils

[cover]: https://codecov.io/gh/webpack-contrib/schema-utils/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/schema-utils

[quality]: https://www.bithound.io/github/webpack-contrib/schema-utils/badges/score.svg
[quality-url]: https://www.bithound.io/github/webpack-contrib/schema-utils
