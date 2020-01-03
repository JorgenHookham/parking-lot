// External test suite example

const solution = require("./index");

const lot = [
  [1, 1, 1, 1, 1,],
  [1, 1, 1, 1, 1,],
  [1, 1, 1, 1, 1,],
  [1, 1, 1, 0, 1,],
  [1, 1, 1, 1, 1,],
];

const closestSpot = solution(lot);

console.log(closestSpot === 6);
