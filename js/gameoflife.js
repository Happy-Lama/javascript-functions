function seed() {
  return [...arguments];
}

function same([x, y], [j, k]) {
  if(x === j){
    return y === k;
  }else{
    return false;
  }
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  let alive = false;
  this.forEach(element => {
    if(!alive){
      alive = same(cell, element);
    }
  });
  return alive;
}

const printCell = (cell, state) => {
  let alive = contains.call(state,cell);
  if(alive){
    return '\u25A3';
  }else{
    return '\u25A2';
  }
};

const corners = (state = []) => {

  if( state.length != 0){
    let row_max = state[0][0];
    let col_max = state[0][1];
    let row_min = state[0][0];
    let col_min = state[0][1];

    state.forEach(element => {
      row_max =  row_max < element[0] ? element[0] : row_max;
      row_min =  row_min > element[0] ? element[0] : row_min;
      col_max =  col_max < element[1] ? element[1] : col_max;
      col_min =  col_min > element[1] ? element[1] : col_min;
    });

    return {
      topRight: [row_max,col_max],
      bottomLeft: [row_min, col_min]
    };
  }

  return  {topRight: [0,0], bottomLeft: [0,0]};

};

const printCells = (state) => {
  let rect = corners(state);
  let res = "";

  for(let j = rect.topRight[1]; j >=  rect.bottomLeft[1]; j--){
    for(let i =  rect.bottomLeft[0]; i <= rect.topRight[0]; i++){
      res = res + printCell([i,j], state) + " " ;
    }
    res = res + "\n";
  }

  return res;
};

const getNeighborsOf = ([x, y]) => {return [[x-1,y-1],[x,y-1],[x+1,y-1],[x-1,y],[x+1,y],[x-1,y+1],[x,y+1],[x+1,y+1]]};

const getLivingNeighbors = (cell, state) => {
  let neighbours = getNeighborsOf(cell);

  let res = [];

  let contains = this.contains.bind(state);
  neighbours.forEach(element => {
    if(contains(element)){
      res.push(element);
    }
  })
  return res;
};

const willBeAlive = (cell, state) => {
  let livingNeighbours = getLivingNeighbors(cell,state);
  let alive = contains.call(state,cell);
  return (livingNeighbours.length == 3) || (livingNeighbours.length == 2 && alive);
};

const calculateNext = (state) => {
  let nextGameState = [];
  let rect = corners(state);
  let searchRadius = {
    topRight: [rect.topRight[0] + 1, rect.topRight[1] + 1],
    bottomLeft: [rect.bottomLeft[0] - 1, rect.bottomLeft[1] - 1]
  };

  for(let i = searchRadius.bottomLeft[0]; i <= searchRadius.topRight[0]; i++){
    for(let j = searchRadius.bottomLeft[1]; j <= searchRadius.topRight[1]; j++){
      if(willBeAlive([i,j],state)){
        nextGameState.push([i,j]);
      }
    }
  }

  return nextGameState;

};

const iterate = (state, iterations) => {
  let gameStates = [state];
  let currentState = state;
  for(let i = 0; i < iterations; i++){
    currentState = calculateNext(currentState);
    gameStates.push(currentState);
  }
  return gameStates

};

const main = (pattern, iterations) => {

  let states = iterate(startPatterns[pattern], iterations);
  let output = "";
  states.forEach(state => {
    output = output + printCells(state) + "\n";
  });

  console.log(output);
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