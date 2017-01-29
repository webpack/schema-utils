import Ajv from 'ajv';

const validateOptions = (schema, data) => {
  // This mutates the original data with defaults!
  const ajv = new Ajv({
    useDefaults: true,
    errorDataPath: 'property',
  });
  const isValid = ajv.validate(schema, data);

  return {
    isValid,
    error: ajv.errors && ajv.errorsText(),
  };
};

export default validateOptions;
