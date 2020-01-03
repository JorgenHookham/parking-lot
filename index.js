const isTestRun = process.argv.includes("--test");

// NOTE: Use SOLUTION if you want to import something into your own test suite.
// It will return the distance to the closest empty spot (as described in the spec).

const SOLUTION = (lot) => findTheBestSpot(lot)[0];

const findTheBestSpot = (lot) => {
  let complete = false;
  let distance = 0;
  let bestSpot;

  while (!complete) {
    
    // console.debug(`Searching for spots of distance ${distance}.`);

    if (!lot.length) {
      // console.debug("This lot has no rows.");
      complete = true;
    }

    for (let row = 0; row <= Math.min(distance, lot.length - 1); row++) {
      let col = Math.max(distance - row, 0);
      // console.debug(`Searching position [${row}, ${col}]: ${lot[row][col]}.`);

      if (lot[row][col] === 0) {
        bestSpot = [distance, [row, col]];
        complete = true;
        break;
      }

      if (row >= lot.length - 1 && col >= lot[row].length - 1) {
        // console.debug("We've reached the furthest spot in the lot");
        complete = true;
        break;
      }
    }
    distance++;
  }
  return bestSpot;
}

const makeLot = (w, h, spotConfig) => {
  let lot = [];
  for (let ih = 0; ih < h; ih++) {
    lot.push(makeRow(w, spotConfig, ih));
  }
  return lot;
};

const makeRow = (w, spotConfig, ih) => {
  let row = [];
  for (let iw = 0; iw < w; iw++) {
    row.push(makeSpot(spotConfig, [ih, iw]));
  }
  return row;
}

const makeSpot = (spotConfig, pos) => {
  if (spotConfig.isRandom) {
    return Math.random() > (spotConfig.randomThreshold || .5) ? 1 : 0;
  } else if (spotConfig.isFixed) {
    return spotConfig.fixedSpots.find(spot => spot[0] === pos[0] && spot[1] === pos[1]) ? 0 : 1;
  }
};

const dumpLot = (lot) => lot.map(x => x.join(" ")).join("\n");

const testRandom = (iterations = 5) => {
  console.log("TESTING RANDOM PARKING LOTS:\n");
  for (let i = 0; i < iterations; i ++) {
    let lot = makeLot(
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
      {
        isRandom: true,
        randomThreshold: .4 - Math.random() * .4
      }
    );
    console.log("Random lot:\n")
    console.log(dumpLot(lot), "\n");
    let spot = findTheBestSpot(lot);
    if (spot) {
      console.log(`The closest empty spot is ${spot[0]} away from the entrance (at ${spot[1]}).`);
    } else {
      console.log("There are no empty spots.");
    }
    console.log("\n--\n")
  }
  console.log("TESTING LARGE RANDOM PARKING LOTS:\n");
  for (let i = 0; i < iterations; i ++) {
    let lot = makeLot(
      Math.round(Math.random() * 10000),
      Math.round(Math.random() * 10000),
      {
        isRandom: true,
        randomThreshold: .00001
      }
    );
    console.log(`Random lot has ${lot.length} rows and ${lot[0].length} columns.\n`)
    let spot = findTheBestSpot(lot);
    if (spot) {
      console.log(`The closest empty spot is ${spot[0]} away from the entrance (at ${spot[1]}).`);
    } else {
      console.log("There are no empty spots.");
    }
    console.log("\n--\n")
  }
  console.log("TESTING FUNNY SHAPED PARKING LOTS:\n");
  const funnyLotConfig = {isRandom: true, randomThreshold: .05};
  const funnyLot1 = [];
  for (let i = 0; i < 5; i++) {
    funnyLot1.push(makeRow(Math.random() * 50, funnyLotConfig, i))
  }
  const funnyLot1Solution = findTheBestSpot(funnyLot1);
  console.log(dumpLot(funnyLot1));
  console.log(`The closest spot in funny lot 1 is ${funnyLot1Solution[0]} spots away rom the entrance (at ${funnyLot1Solution[1]})`);
  console.log("\n--\n")
  
  const funnyLot2 = [];
  for (let i = 0; i < 50; i++) {
    funnyLot2.push(makeRow(Math.random() * 5, funnyLotConfig, i))
  }
  const funnyLot2Solution = findTheBestSpot(funnyLot2);
  console.log(dumpLot(funnyLot2));
  console.log(`The closest spot in funny lot 2 is ${funnyLot2Solution[0]} spots away rom the entrance (at ${funnyLot2Solution[1]})`);
  console.log("\n--\n")

  const funnyLot3 = [];
  for (let i = 0; i < 100; i++) {
    funnyLot3.push(makeRow(Math.random() * 100, funnyLotConfig, i))
  }
  const funnyLot3Solution = findTheBestSpot(funnyLot3);
  console.log(dumpLot(funnyLot3));
  console.log(`The closest spot in funny lot 3 is ${funnyLot3Solution[0]} spots away rom the entrance (at ${funnyLot3Solution[1]})`);
  console.log("\n--\n")
}

const testVeryBig = () => {
  console.log("TESTING VERY BIG PARKING LOTS:\n");
  console.log("Testing a really wide parking lot (one million columns):")
  const reallyWideLot = makeLot(1000000, 2, {isFixed: true, fixedSpots: [[1, 999999]]});
  const reallyWideSolution = findTheBestSpot(reallyWideLot);
  console.log(`The closest spot in the really wide lot is ${reallyWideSolution[0]} spots away rom the entrance (at ${reallyWideSolution[1]})`);
  console.log("\n--\n")
  
  console.log("Testing a really tall parking lot (ten thousand rows):")
  const reallyTallLot = makeLot(2, 100000, {isFixed: true, fixedSpots: [[99999, 0]]});
  const reallyTallSolution = findTheBestSpot(reallyTallLot);
  console.log(`The closest spot in the really wide lot is ${reallyTallSolution[0]} spots away rom the entrance (at ${reallyTallSolution[1]})`);
  console.log("\n--\n")
}

if (isTestRun) {
  testRandom(5);
  testVeryBig();
} else {
  const input = JSON.parse(process.argv[2]);
  console.log(dumpLot(input));
  const spot = findTheBestSpot(input);
  console.log(`The closest open spot is ${spot[0]} (${spot[1]})`)
}
