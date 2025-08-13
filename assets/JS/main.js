
/*..............................Action for the clicked Mode button..................................*/

document.querySelectorAll(".ModeBtn").forEach(btn => {
    btn.addEventListener('click', (event) => {
        const mode = event.currentTarget.id;
        const options = document.querySelector(".modal .options");

        let html = `
            <div class="row">
                <label for='BoardSize'>Choose board size</label>
                <select id='BoardSize'>`;

        for (let i = 3; i <= 10; i++) {
            html += `<option value='${i}'>${i}</option>`;
        }

        html += `   </select>
                </div>`;

        if (event.target.id == "OnePlayer") {
            const difficult = ["Easy", "Mid", "Hard"];
            html += `<div>
                    <label>Choose Difficultly</label>
                    <select id="GameDifficult">`;
            for (let i = 0; i < 3; i++) {
                html += `<option value='${difficult[i]}'>${difficult[i]}</option>`;
            }
            html += `</select>
                    </div>`;
        }

        html += `<button onclick="setBoardSize('${mode}')" class='button'>Done</button>`;

        options.innerHTML = html;

        const modal = document.querySelector(".modal");
        modal.classList.remove("DisplayNone");
    });


});

const closeBtn = document.querySelector('.CloseButtonWrapper button');
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        document.querySelector(".modal").classList.add("DisplayNone");
    });
}

/*................................Action After choosing the size..................................*/
let gameBoard = [];

function setBoardSize(choice) {

    const modal = document.querySelector(".modal");
    modal.classList.add("DisplayNone");

    const boardSize = document.querySelector("#BoardSize").value;

    sessionStorage.setItem("boardSize", boardSize);
    sessionStorage.setItem("choice", choice);

    const gameDifficult = document.querySelector("#GameDifficult");
    if (gameDifficult)
        sessionStorage.setItem("difficultly", gameDifficult.value);

    window.open(`${choice}.html`, "_self");
}

/*........................................Build game board.....................................*/
let currentPlayer = 2;

function buildBoard() {

    const size = parseInt(sessionStorage.getItem('boardSize'));
    const boardElement = document.querySelector('.board');

    if (!boardElement) return;

    boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    boardElement.innerHTML = ``;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        cell.dataset.row = Math.floor(i / size);
        cell.dataset.col = i % size;

        boardElement.appendChild(cell);
    }

    gameBoard = [];
    for (let i = 0; i < size; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < size; j++) {
            gameBoard[i][j] = 0;
        }
    }


}

/*..........................This function checks if the currect move is available...............................*/

function makeMove(r, c, player) {
    if (gameBoard[r][c] == 0) {
        gameBoard[r][c] = player;
        return true;
    }
    return false;
}

/*.............This checks if all elements in the array are equal...........................*/

function equalCells(array) {
    return array.every(cell => cell === array[0] && cell !== 0);
}


/*...................This function checks if the Game has been finished or yet, if it has been finished it returnes the result...............................*/

let positions = [];
function checkGame() {
    const n = gameBoard.length;
    
    // Check rows
    positions=[];
    for (let i = 0; i < n; i++) {

        if (equalCells(gameBoard[i])) {
            positions.push(i);
            return gameBoard[i][0];
        }
    }

    positions = [];
    // Check columns
    for (let j = 0; j < n; j++) {
        let col = [];
        positions = [];
        for (let i = 0; i < n; i++) {
            col.push(gameBoard[i][j]);
            positions.push(`${i} ${j}`);
        }
        if (equalCells(col)) {
            return col[0];
        }
    }

    positions = [];
    // Check main diagonal
    let diagonal1 = [];
    for (let i = 0; i < n; i++) {
        diagonal1.push(gameBoard[i][i]);
        positions.push(`${i} ${i}`);
    }
    if (equalCells(diagonal1)) {
        return diagonal1[0];
    }

    positions = [];
    // Check anti-diagonal
    let diagonal2 = [];
    for (let i = 0; i < n; i++) {
        diagonal2.push(gameBoard[i][n - 1 - i]);
        positions.push(`${i} ${n - 1 - i}`);
    }
    if (equalCells(diagonal2)) {
        return diagonal2[0];
    }

    if (gameBoard.flat().every(cell => cell !== 0)){
        positions=[];
         return "tie";
    }

    positions=[];
    return "play";
}

//Initialize the board on page load
buildBoard();

/*......................Reset Button...........................*/

const resetBoardBtn = document.querySelector('.ResetBoard');
if (resetBoardBtn) {
    resetBoardBtn.addEventListener("click", function () {
        buildBoard();
        currentPlayer = 2;

        const TurnHeading = document.querySelector(".TurnHeading");
        TurnHeading.classList.remove("LeftRight");
        void TurnHeading.offsetWidth;
        if (sessionStorage.getItem("choice") === "TwoPlayer") {
            TurnHeading.textContent = currentPlayer === 2 ? "Tails's Turn" : "Sonic's Turn";
        } else if (sessionStorage.getItem("choice") === "OnePlayer") {
            TurnHeading.textContent = currentPlayer === 2 ? "Your Turn" : "Computer's Turn";
        }
        TurnHeading.classList.add("LeftRight");

        document.querySelector('.board').style.pointerEvents = 'auto'; //enable clicking on the board
    });
}

/*..........................Add an event listener to know who clicked and update the board...............................*/

const board = document.querySelector('.board');
if (board && sessionStorage.getItem("choice") == "TwoPlayer") {
    board.addEventListener('click', (event) => {
        if (!event.target.classList.contains('cell')) return;

        const modal = document.querySelector('.modal');
        const winner = document.querySelector('.modal .winner');

        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        
        if (makeMove(row, col, currentPlayer)) {
            
            event.target.textContent = currentPlayer === 1 ? "X" : "O";
            checkStatus();
            
        }
    });
}

/*............................Light up the winning line..................................*/

function lightUp(array) {

    document.querySelector('.board').style.pointerEvents = 'none'; //disable clicking on the board's divs

    if (array.length == 1) {
        for (let i = 0; i < gameBoard.length; i++) {
            document.querySelector(`.cell[data-row="${array[0]}"][data-col="${i}"]`).style.backgroundColor = '#04d9ff';
        }
    } else {
        for (let i = 0; i < array.length; i++) {
            let positions = array[i].split(" ");
            document.querySelector(`.cell[data-row="${positions[0]}"][data-col="${positions[1]}"]`).style.backgroundColor = '#04d9ff';
        }
    }

}

/*...........................PLayer vs Computer board's event lisetener..............................*/


if (board && sessionStorage.getItem("choice") == "OnePlayer") {
    board.addEventListener("click", (event) => {
        if (!event.target.classList.contains('cell')) return;
        

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
                bestMove(n);
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
                const TurnHeading = document.querySelector(".TurnHeading");
                    setTimeout(() => {
                        document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`).textContent = "X";
                        TurnHeading.textContent = "Your Turn";
                    }, 500);
            }
        }
        currentPlayer=2;
}


/*.................................Medium level of Player vs Computer........................................*/

function midMove(n){

    if (Math.random() < 0.5) {
        bestMove(n);
    } else {
        easyMove();
    }
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


function minimax(depth, isMaximizing, boardSize) {
  let result = checkGame();

  if (result === 1) return 10 - depth;  // computer wins
  if (result === 2) return depth - 10;  // Human wins
  if (result === "tie") return 0;       // Tie
  
  if (result === "play") {
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (gameBoard[i][j] === 0) {
            gameBoard[i][j] = 1;
            let evalScore = minimax(depth + 1, false, boardSize);
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
            let evalScore = minimax(depth + 1, true, boardSize);
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


function bestMove(n) {

  let bestScore = -Infinity;
  let move = null;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (gameBoard[i][j] === 0) {
        gameBoard[i][j] = 1;
        let score = minimax(0, false, n);
        gameBoard[i][j] = 0;
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }

  if (move) {
    const TurnHeading = document.querySelector(".TurnHeading");
    gameBoard[move.i][move.j] = 1;
    setTimeout(() => {
      document.querySelector(`.cell[data-row="${move.i}"][data-col="${move.j}"]`).textContent = "X";
      TurnHeading.textContent = "Your Turn";
    }, 500);

    currentPlayer=2;
    
  }
}


/*....................................................................................*/


function checkStatus(){
    const choice=sessionStorage.getItem("choice");
    const res=checkGame();

    if(res=="play"){
        if(choice=="TwoPlayer"){ 
            currentPlayer = currentPlayer === 1 ? 2 : 1;     
            if(currentPlayer==2){
                updateHeading("Tails's Turn");
            } else if(currentPlayer==1){
                updateHeading("Sonic's Turn");
            }
            
        }else if(choice=="OnePlayer"){
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            if(currentPlayer==2){
                updateHeading("Your Turn");
            } else if(currentPlayer==1){
                updateHeading("Computer's Turn");
            }         
        }
    }else
        checkWinning(choice,res);
}

/*.....................................................*/


function checkWinning(choice,res){ 

    if(res==1){
        lightUp(positions);
        if(choice=="TwoPlayer"){
            updateHeading("Sonic is the WINNER!");
            displayModal("Sonic is the WINNER!");
        }else if(choice=="OnePlayer"){
            console.log("computer");
            updateHeading("Computer is the WINNER!");
            displayModal("Computer is the WINNER!" );
        }    
    }
    else if(res==2){
        lightUp(positions);
        if(choice=="TwoPlayer"){
            updateHeading("Tails is the WINNER!");
            displayModal("Tails is the WINNER!");
        }else if(choice=="OnePlayer"){
            updateHeading("You are the WINNER!");
            displayModal("You are the WINNER!");
        }          
    }else if(res=="tie"){
        updateHeading("It is a tie!");
        displayModal("It is a tie!");
    }  
}


/*.................................................................*/


function updateHeading(heading){
    const TurnHeading = document.querySelector(".TurnHeading");
    TurnHeading.classList.remove("LeftRight");
    void TurnHeading.offsetWidth;
    TurnHeading.textContent = heading;
    console.log(document.querySelector(".TurnHeading").textContent);
    TurnHeading.classList.add("LeftRight");
}


/*.....................Modal to display the winner............................*/


function displayModal(text){
    const modal = document.querySelector('.modal');
    const winner = document.querySelector('.modal .winner');
    modal.classList.remove('DisplayNone');
    winner.innerHTML = `
        <h2>${text}!</h2>
    `;

    document.querySelector('.CloseButtonWrapper button').addEventListener("click", () => {
        document.querySelector(".modal").classList.add("DisplayNone");
    });
}

/*.........................................*/

const musicBtn=document.querySelector("#MusicBtn");
const music=new Audio("assets/Audios/8bit Dungeon Boss.mp3");
musicBtn.addEventListener("click",()=>{
    
    if(music.paused){
        music.play();
        music.loop=true;
    }else{
        music.pause();
    }
});
