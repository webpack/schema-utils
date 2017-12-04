// TODO eventually move to `Error/format`
export default function (err) {
  // TODO Better messages, see
  // https://github.com/webpack-contrib/schema-utils/issues/18
  const message = {
    typeof: err => `options${err.dataPath} should be a {Function}\n`,
    instanceof: err => `options${err.dataPath} should be {RegExp}\n`,
  };

  // TODO handle all ajv.keywords
  switch (err.keyword) {
    case 'typeof':
      return message.typeof(err);
    case 'instanceof':
      return message.instanceof(err);
    default:
      return `options${err.dataPath} ${err.message}\n`;
  }
}
