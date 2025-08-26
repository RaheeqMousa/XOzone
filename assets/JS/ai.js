
export class PlayerVSComputer{

    constructor(utils) {
        this.gameUtils=utils;
        this.clickEvents();
    }

    clickEvents(){
        if(!this.gameUtils.board) return;

        this.gameUtils.board.addEventListener("click",e=>this.handleCellClick(e));
    }

/*...........................PLayer vs Computer board's Click handler..............................*/

    handleCellClick(event){
      if (!event.target.classList.contains('cell')) return;
        
        document.querySelector('.board').style.pointerEvents = 'none';
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        const n = sessionStorage.getItem("boardSize");
  
        if (this.gameUtils.makeMove(row, col, this.gameUtils.currentPlayer)) {
            event.target.textContent = this.gameUtils.currentPlayer === 1 ? "X" : "O";

            this.gameUtils.checkStatus();
            let result = this.gameUtils.checkGame();
            
            if (result=="play" && sessionStorage.getItem("difficultly") === "Easy") {           
                this.easyMove();    
                                 
            } else if (result=="play" && sessionStorage.getItem("difficultly") === "Mid") {
                this.midMove(n);
                 
            }else if (result=="play" && sessionStorage.getItem("difficultly") === "Hard"){     
                this.bestMove(n,n);
               
            }

           this.gameUtils.checkWinning("OnePlayer",result);     
        }
    }

/*.........................Easy level of Player vs Computer...........................*/

    easyMove() {
        let computerMoved = false;
        while (!computerMoved) {
            let row = Math.floor(Math.random() * sessionStorage.getItem("boardSize"));
            let col = Math.floor(Math.random() * sessionStorage.getItem("boardSize"));
            computerMoved = this.gameUtils.makeMove(row,col,1);
            if (computerMoved) {
                const turnHeading = document.querySelector(".turn-heading");
                    setTimeout(() => {
                        document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`).textContent = "X";
                        let result = this.gameUtils.checkGame();
                        if(result==="play"){
                            turnHeading.textContent = "Your Turn";
                            document.querySelector('.board').style.pointerEvents = 'auto';
                        }
                        this.gameUtils.checkWinning("OnePlayer",result);
                    }, 500);
            }
        }
        this.gameUtils.setCurrentPlayer(2);
    }

/*.................................Medium level of Player vs Computer........................................*/

    midMove(n){
      this.bestMove(n,Math.floor(n*n/3));
    }

/*...........................This function returns teh best move accoarding to the minimax algorithm...................................*/


    bestMove(n,maxDepth) {
      let bestScore = -Infinity;
      let move = null;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (this.gameUtils.gameBoard[i][j] === 0) {
            this.gameUtils.gameBoard[i][j] = 1;
            let score = this.minimax(0, maxDepth, false, n);
            this.gameUtils.gameBoard[i][j] = 0;
            if (score > bestScore) {
              bestScore = score;
              move = { i, j };
            }
          }
        }
      }

      if (move) {
        const turnHeading = document.querySelector(".turn-heading");
        this.gameUtils.gameBoard[move.i][move.j] = 1;
        setTimeout(() => {
          document.querySelector(`.cell[data-row="${move.i}"][data-col="${move.j}"]`).textContent = "X";
          let result = this.gameUtils.checkGame();
          if(result==="play"){
              turnHeading.textContent = "Your Turn";
              document.querySelector('.board').style.pointerEvents = 'auto';
          }
          this.gameUtils.checkWinning("OnePlayer",result);
        }, 500);

        this.gameUtils.setCurrentPlayer(2);   
      }
    }

/*..................................Minimax Algorithm......................................*/
  
    minimax(depth, maxDepth, isMaximizing, boardSize) {
      let result = this.gameUtils.checkGame();

      if (result === 1) return 10 - depth;  // computer wins
      if (result === 2) return depth - 10;  // Human wins
      if (result === "tie") return 0;       // Tie
      if (depth === maxDepth) return 0;

      if (result === "play") {
        if (isMaximizing) {
          let maxEval = -Infinity;
          for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
              if (this.gameUtils.gameBoard[i][j] === 0) {
                this.gameUtils.gameBoard[i][j] = 1;
                let evalScore = this.minimax(depth + 1,maxDepth, false, boardSize);
                this.gameUtils.gameBoard[i][j] = 0;
                maxEval = Math.max(maxEval, evalScore);
              }
            }
          }
          return maxEval;
        } else {
          let minEval = Infinity;
          for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
              if (this.gameUtils.gameBoard[i][j] === 0) {
                this.gameUtils.gameBoard[i][j] = 2;
                let evalScore = this.minimax(depth + 1,maxDepth, true, boardSize);
                this.gameUtils.gameBoard[i][j] = 0;
                minEval = Math.min(minEval, evalScore);
              }
            }
          }
          return minEval;
        }
      }
    }


}