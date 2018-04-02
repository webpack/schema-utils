import validate from '../src';

test('Valid', () => {
  const options = {
    type() {},
    array: ['a'],
    string: 'hello',
    object: {
      prop: false,
      object: {
        prop: false,
      },
    },
    boolean: true,
    instance: new RegExp(''),
  };
  const result = validate('test/fixtures/schema.json', options, 'Loader');

  expect(result).toBe(true);
});

// describe('Error', () => {
//   const options = {
//     type: null,
//     array: {},
//     string: false,
//     object: {
//       prop: 1,
//       object: {
//         prop: 1,
//       },
//     },
//     boolean: 'hello',
//     instance() {},
//   };
//
//   const validate = () =>
//     validateOptions('test/fixtures/schema.json', options, '{Name}');
//
//   test('should throw error', () => {
//     expect(validate).toThrowError();
//     expect(validate).toThrowErrorMatchingSnapshot();
//   });
//
//   test('should have errors for every option key', () => {
//     try {
//       validate();
//     } catch (err) {
//       const errors = err.errors.map((err) => err.dataPath);
//
//       const expected = [
//         '.string',
//         '.array',
//         '.object.prop',
//         '.object.object.prop',
//         '.boolean',
//         '.type',
//         '.instance',
//       ];
//
//       expect(errors).toMatchObject(expected);
//       expect(err.errors).toMatchSnapshot();
//     }
//   });
// });
