/** Connect Four
 * 
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


const WIDTH = 7
const HEIGHT = 6


let currPlayer = 1;  // active player: 1 or 2
let board = [];      // array of rows, each row is array of cells  (board[y][x])
let difficultyLevel=1;

/** makeBoard: create in-JS board structure: 
 *    board = array of rows, each row is array of cells  (board[y][x]) 
 */

function makeBoard(w,h) {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for(let i=0;i<h;i++){
    board.push(Array.from({length:w}));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "board" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById('board');
  // TODO: creates head table with column as id elements

  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);  
    headCell.addEventListener("pointerover",handleHover)
    headCell.addEventListener("pointerleave",handleHoverLeave)
    
    let tdCell = document.createElement('div');
    tdCell.setAttribute('id',x);
    
    headCell.appendChild(tdCell);
    
    top.append(headCell);

  }
  htmlBoard.append(top);

  // TODO: creates table with id coordinates
  for (let y = 0; y < HEIGHT; y++) {
    let row = document.createElement("tr")
    for (let x = 0; x < WIDTH; x++) {
      let cell = document.createElement('td');
      cell.setAttribute('id',`${y}-${x}`)
      row.append(cell);
    }
    htmlBoard.append(row)
  }
}
//hover function for which player is current player

function handleHover(evt){
  if(evt.target.nodeName==='TD'){
    let z = evt.target;
    let headPiece = z.childNodes[0];
    headPiece.setAttribute("class", `p${currPlayer} headPiece`);
  }
}

function handleHoverLeave(evt){
  let m = evt.target;
  let headPiece = m.childNodes[0];
  headPiece.removeAttribute("class");


}

// /** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: finds lowest y based on x value
  for(let i=board.length-1;i>=0;i--){
    if(board[i][x]===undefined){
      
      return i;
    }
  }
}

// /** placeInTable: update DOM to place piece into HTML board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  if(y===undefined){
    alert("can't place here")
    return null;
  }
  let piece = document.createElement('div');
      

  piece.setAttribute("class", `p${currPlayer} piece`);

  let cell = document.getElementById(`${y}-${x}`);

  cell.appendChild(piece);
}

// /** endGame: announce game end */

function endGame(msg) {
  alert(msg);
  document.location.reload(true);
}

// /** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  let x;
  // get x from ID of clicked cell
  if(currPlayer===1 && difficultyLevel!==4){
    x = +evt.target.id;
  } else{
    x = robotAiChoice(difficultyLevel);
  }


  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if(y!==undefined){
    board[y][x]=currPlayer;
  }
  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board (done in placeInTable);
  placeInTable(y, x)

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if(board.every(x=> x.every(y=>y===1))){
    endGame(`It's a Tie!`);
  };


  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer=currPlayer===1 ? 2:1;

  if(currPlayer===2 && difficultyLevel !==4){
    setTimeout(()=>handleClick(),500);
  }
}

function robotAiChoice(level){
  if(level===1){
    return easyAi();
  } else if(level===2){
    return mediumAi();
  } else{
    return hardAi();
  }
}

function easyAi(){
  let guess = Math.floor(Math.random() * Math.floor(6));
  while(findSpotForCol(guess)===undefined){
    guess= Math.floor(Math.random() * Math.floor(6));
  }
  console.log(guess);
  return guess;
}

function mediumAi(){
  let guess = Math.floor(Math.random() * Math.floor(6));
  while(findSpotForCol(guess)===undefined){
    guess= Math.floor(Math.random() * Math.floor(6));
  }
  console.log(guess);
  return guess;
}

// /** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(([y, x]) =>
      y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer
    )
  }

  // TODO: checks for winner horizontal, vert and both diags

  //checks for 4 rows on every piece placed using two nested for loops
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard(WIDTH,HEIGHT);
makeHtmlBoard()
