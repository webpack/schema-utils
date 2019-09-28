const left = Symbol('left');
const right = Symbol('right');

function getOperator(side, exclusive) {
  if (side === 'left') {
    return exclusive ? '>' : '>=';
  }

  return exclusive ? '<' : '<=';
}

function formatRight(value, logic, exclusive) {
  if (logic === false) {
    return formatLeft(value, !logic, !exclusive);
  }

  return `should be ${getOperator('right', exclusive)} ${value}`;
}

function formatLeft(value, logic, exclusive) {
  if (logic === false) {
    return formatRight(value, !logic, !exclusive);
  }

  return `should be ${getOperator('left', exclusive)} ${value}`;
}

function formatRange(start, end, startExclusive, endExclusive, logic) {
  let result = 'should be';

  result += ` ${getOperator(
    logic ? 'left' : 'right',
    logic ? startExclusive : !startExclusive
  )} ${start} `;
  result += logic ? 'and' : 'or';
  result += ` ${getOperator(
    logic ? 'right' : 'left',
    logic ? endExclusive : !endExclusive
  )} ${end}`;

  return result;
}

function getRangeValue(values, logic) {
  let minMax = logic ? Infinity : -Infinity;
  let j = -1;
  const predicate = logic
    ? ([value]) => value <= minMax
    : ([value]) => value >= minMax;

  for (let i = 0; i < values.length; i++) {
    if (predicate(values[i])) {
      minMax = values[i][0];
      j = i;
    }
  }

  if (j > -1) {
    return values[j];
  }

  return [Infinity, true];
}

class Range {
  constructor() {
    this[left] = [];
    this[right] = [];
  }

  left(value, exclusive = false) {
    this[left].push([value, exclusive]);
  }

  right(value, exclusive = false) {
    this[right].push([value, exclusive]);
  }

  format(logic = true) {
    const [start, leftExclusive] = getRangeValue(this[left], logic);
    const [end, rightExclusive] = getRangeValue(this[right], !logic);

    if (!Number.isFinite(start) && !Number.isFinite(end)) {
      return '';
    }

    if (leftExclusive === rightExclusive) {
      // e.g. 5 <= x <= 5
      if (leftExclusive === false && start === end) {
        return `should be ${logic ? '' : '!'}= ${start}`;
      }

      // e.g. 4 < x < 6
      if (leftExclusive === true && start + 1 === end - 1) {
        return `should be ${logic ? '' : '!'}= ${start + 1}`;
      }
    }

    if (Number.isFinite(start) && !Number.isFinite(end)) {
      return formatLeft(start, logic, leftExclusive);
    }

    if (!Number.isFinite(start) && Number.isFinite(end)) {
      return formatRight(end, logic, rightExclusive);
    }

    return formatRange(start, end, leftExclusive, rightExclusive, logic);
  }
}

module.exports = Range;
