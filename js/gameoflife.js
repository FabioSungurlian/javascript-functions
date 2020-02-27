function seed() {
  return Array.from(arguments);
}

function same([x, y], [j, k]) {
  return x == j && y == k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {

  if(this.some != undefined){
    return this.some((el) => same(el, cell));
  }
  return false;
}

const printCell = (cell, state) => {
  return contains.call(state, cell)? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {
  const minCorners = {topRight: [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY], bottomLeft: [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]};
  if(state.length === 0){
    return {topRight: [0, 0], bottomLeft: [0, 0]}
  }
  else {
    const corners = state.reduce((prev, cur) => {
      const topRight = [
        Math.max(prev.topRight[0], cur[0]),
        Math.max(prev.topRight[1], cur[1])
      ];

      const bottomLeft = [
        Math.min(prev.bottomLeft[0], cur[0]),
        Math.min(prev.bottomLeft[1], cur[1])
      ];

      return {topRight, bottomLeft};
      
    }, minCorners);

    return corners;
  }
};

const printCells = (state) => {
  const {bottomLeft, topRight} = corners(state);

  let grid = "";
  for(y = bottomLeft[1]; y <= topRight[1]; y++){
    for(x = bottomLeft[0]; x <= topRight[0]; x++){
      grid += printCell([x, y], state);
      if(x != topRight[0]){
        grid += " ";
      }
    }
    if(y != topRight[1]){
      grid += "\n";
    }
  }
  console.log(grid);
  return grid;
};

const getNeighborsOf = ([x, y]) => {
  
  return [
    [x + 1, y + 1],
    [x + 1, y],
    [x + 1, y - 1],
    [x, y - 1],
    [x, y + 1],
    [x - 1, y + 1],
    [x - 1, y],
    [x - 1, y - 1],
  ]
};

const getLivingNeighbors = (cell, state) => {
  const neighbors = getNeighborsOf(cell);
  const livingCells = neighbors.filter(el => contains.bind(state, el)());
  return livingCells;
};

const willBeAlive = (cell, state) => {
  const livingNeighbors = getLivingNeighbors(cell, state);
  //let cellWillBeAlive = false;
  console.table({
    livingNeighbors, 
    cell,
    state
  });
    
  if(contains.call(state, cell)){
    return livingNeighbors.length >= 2;
  }
  else {
    return livingNeighbors.length >= 3;
  }
};

const calculateNext = (state) => {
  const {topRight, bottomLeft} = corners(state);
  const leftSide = bottomLeft[0] - 1,
        rightSide = topRight[0] + 1;
        bottomSide = bottomLeft[1] - 1;
        topSide = topRight[1] + 1;
  let newState = [];
  for(let y = bottomSide; y <= topSide; y++){
    for(let x = leftSide; x <= rightSide; x++){
      if(willBeAlive([x, y], state)){
        newState.push([x, y]);
      }
    }
  }

};

const iterate = (state, iterations) => {
  let gameStates = [state];
  for(let i = 0; i < iterations; i++){
    gameStates.push(calculateNext(state));
  }
  return gameStates;
};

const main = (pattern, iterations) => {
  const gameStates = iterate(startPatterns.pattern, iterations);
  let output = "";
  let outputStates = gameStates.forEach((state, i) => {
    printCells(state);
    if(i != gameStates.length - 1){
      console.log("\n");
    }
  });
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;