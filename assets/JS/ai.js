import { currentPlayer, setCurrentPlayer, board, gameBoard, makeMove, checkGame, checkWinning, checkStatus } from "./ui.js";
/*...........................PLayer vs Computer board's event lisetener..............................*/

if (board && sessionStorage.getItem("choice") == "OnePlayer") {
    board.addEventListener("click", (event) => {
        if (!event.target.classList.contains('cell')) return;
        
        document.querySelector('.board').style.pointerEvents = 'none';
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        const n = sessionStorage.getItem("boardSize");
  
        if (makeMove(row, col, currentPlayer)) {
            event.target.textContent = currentPlayer === 1 ? "X" : "O";
            checkStatus();
            const result = checkGame();
            
            if (result=="play" && sessionStorage.getItem("difficultly") === "Easy") {           
                easyMove();    
                                 
            } else if (result=="play" && sessionStorage.getItem("difficultly") === "Mid") {
                midMove(n);
                 
            }else if (result=="play" && sessionStorage.getItem("difficultly") === "Hard"){     
                bestMove(n,n);
               
            }

            checkWinning("OnePlayer",checkGame());     
        }
    });
}


/*.........................Easy level of Player vs Computer...........................*/


function easyMove() {
        let computerMoved = false;
        while (!computerMoved) {
            let row = Math.floor(Math.random() * sessionStorage.getItem("boardSize"));
            let col = Math.floor(Math.random() * sessionStorage.getItem("boardSize"));
            computerMoved = makeMove(row,col,1);
            if (computerMoved) {
                const turnHeading = document.querySelector(".turn-heading");
                    setTimeout(() => {
                        document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`).textContent = "X";
                        turnHeading.textContent = "Your Turn";
                        document.querySelector('.board').style.pointerEvents = 'auto';
                    }, 500);
            }
        }
        setCurrentPlayer(2);
}


/*.................................Medium level of Player vs Computer........................................*/


function midMove(n){
    console.log(n,Math.floor(n*n/3));
    bestMove(n,Math.floor(n*n/3));
}

function isBoardFull(n) {
  for (let i = 0; i <n; i++) {
    for (let j = 0; j < n; j++) {
      if (gameBoard[i][j] !== 0) return false;
    }
  }
  return true;
}


/*..................................Minimax Algorithm......................................*/


function minimax(depth, maxDepth, isMaximizing, boardSize) {
  let result = checkGame();

  console.log(depth);
  if (result === 1) return 10 - depth;  // computer wins
  if (result === 2) return depth - 10;  // Human wins
  if (result === "tie") return 0;       // Tie
  if (depth === maxDepth) return 0;

  if (result === "play") {
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (gameBoard[i][j] === 0) {
            gameBoard[i][j] = 1;
            let evalScore = minimax(depth + 1,maxDepth, false, boardSize);
            gameBoard[i][j] = 0;
            maxEval = Math.max(maxEval, evalScore);
          }
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (gameBoard[i][j] === 0) {
            gameBoard[i][j] = 2;
            let evalScore = minimax(depth + 1,maxDepth, true, boardSize);
            gameBoard[i][j] = 0;
            minEval = Math.min(minEval, evalScore);
          }
        }
      }
      return minEval;
    }
  }
}


/*...........................This function returns teh best move accoarding to the minimax algorithm...................................*/

function bestMove(n,maxDepth) {

  let bestScore = -Infinity;
  let move = null;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (gameBoard[i][j] === 0) {
        gameBoard[i][j] = 1;
        let score = minimax(0, maxDepth, false, n);
        gameBoard[i][j] = 0;
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }

  if (move) {
    const turnHeading = document.querySelector(".turn-heading");
    gameBoard[move.i][move.j] = 1;
    setTimeout(() => {
      document.querySelector(`.cell[data-row="${move.i}"][data-col="${move.j}"]`).textContent = "X";
      turnHeading.textContent = "Your Turn";
      document.querySelector('.board').style.pointerEvents = 'auto';
    }, 500);

    setCurrentPlayer(2);   
  }
}