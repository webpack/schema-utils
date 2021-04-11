import { getLoaderOptions } from '../src';

import schemaTitle from './fixtures/schema-title.json';

describe('getLoaderOptions', () => {
  it('returns given object as-is', () => {
    const options = getLoaderOptions({ name: false });
    expect(options).toEqual({ name: false });
  });

  it('returns and validates given object as-is', () => {
    const options = getLoaderOptions({ name: false }, schemaTitle);
    expect(options).toEqual({ name: false }, schemaTitle);
    expect(() =>
      getLoaderOptions({ namee: false }, schemaTitle)
    ).toThrowErrorMatchingSnapshot();
  });

  it('parses given JSON string', () => {
    const options = getLoaderOptions('{"name":false}');
    expect(options).toEqual({ name: false });
  });

  it('parses and validates given JSON string', () => {
    const options = getLoaderOptions('{"name":false}', schemaTitle);
    expect(options).toEqual({ name: false }, schemaTitle);
    expect(() =>
      getLoaderOptions('{"namee":false}', schemaTitle)
    ).toThrowErrorMatchingSnapshot();
  });

  it('throws an error for invalid JSON', () => {
    expect(() =>
      getLoaderOptions('{"name":faulse}')
    ).toThrowErrorMatchingSnapshot();
  });

  it('parses given query string', () => {
    const options = getLoaderOptions('name=false');
    expect(options).toEqual({ name: 'false' });
  });

  it('parses and validates given query string', () => {
    expect(() =>
      getLoaderOptions('namee=false', schemaTitle)
    ).toThrowErrorMatchingSnapshot();
  });

  it('returns an empty object for null', () => {
    const options = getLoaderOptions(null);
    expect(options).toEqual({});
  });

  it('returns an empty object for undefined', () => {
    // eslint-disable-next-line no-undefined
    const options = getLoaderOptions(undefined);
    expect(options).toEqual({});
  });
});
