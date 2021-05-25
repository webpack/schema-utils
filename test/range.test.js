import Range from "../src/util/Range";

it("5 <= x <= 5", () => {
  const range = new Range();
  range.left(5);
  range.right(5);

  expect(range.format()).toEqual("should be = 5");
});

it("not 5 <= x <= 5", () => {
  const range = new Range();
  range.left(5);
  range.right(5);

  expect(range.format(false)).toEqual("should be != 5");
});

it("5 < x <= 6", () => {
  const range = new Range();
  range.left(5, true);
  range.right(6);

  expect(range.format()).toEqual("should be = 6");
});

it("-1 < x < 1", () => {
  const range = new Range();
  range.left(-1, true);
  range.right(1, true);

  expect(range.format()).toEqual("should be = 0");
});

it("not -1 < x < 1", () => {
  const range = new Range();
  range.left(-1, true);
  range.right(1, true);

  expect(range.format(false)).toEqual("should be != 0");
});

it("not 0 < x <= 10", () => {
  const range = new Range();
  range.left(0, true);
  range.right(10, false);

  expect(range.format(false)).toEqual("should be <= 0 or > 10");
});

it("x > 1000", () => {
  const range = new Range();
  range.left(10000, false);
  range.left(1000, true);

  expect(range.format(true)).toEqual("should be > 1000");
});

it("x < 0", () => {
  const range = new Range();
  range.right(-1000, true);
  range.right(-0, true);

  expect(range.format()).toEqual("should be < 0");
});

it("x >= -1000", () => {
  const range = new Range();
  range.right(-1000, true);
  range.right(0, false);

  // expect x >= -1000 since it covers bigger range. [-1000, Infinity] is greater than [0, Infinity]
  expect(range.format(false)).toEqual("should be >= -1000");
});

it("x <= 0", () => {
  const range = new Range();
  range.left(0, true);
  range.left(-100, false);

  // expect x <= 0 since it covers bigger range. [-Infinity, 0] is greater than [-Infinity, -100]
  expect(range.format(false)).toEqual("should be <= 0");
});

it("Empty string for infinity range", () => {
  const range = new Range();

  expect(range.format(false)).toEqual("");
});

it("0 < x < 122", () => {
  const range = new Range();
  range.left(0, true);
  range.right(12, false);
  range.right(122, true);

  expect(range.format()).toEqual("should be > 0 and < 122");
});

it("-1 <= x < 10", () => {
  const range = new Range();
  range.left(-1, false);
  range.left(10, true);
  range.right(10, true);

  expect(range.format()).toEqual("should be >= -1 and < 10");
});

it("not 10 < x < 10", () => {
  const range = new Range();
  range.left(-1, false);
  range.left(10, true);
  range.right(10, true);

  // expect x <= 10 since it covers bigger range. [-Infinity, 10] is greater than [-Infinity, -1]
  expect(range.format(false)).toEqual("should be <= 10 or >= 10");
});
