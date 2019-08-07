import schemaUtils from '../src/index';

describe('api', () => {
  it('should export validate and ValidateError', () => {
    expect(typeof schemaUtils).toBe('function');
    expect(typeof schemaUtils.ValidateError).toBe('function');
  });
});
