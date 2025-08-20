const modal=document.querySelector(".modal");

/*................................Action After choosing the size..................................*/
export let gameBoard = [];

window.setBoardSize= function(choice) {

    // const modal = document.querySelector(".modal");
    modal.classList.add("display-none");

    const boardSize = document.querySelector("#BoardSize").value;

    sessionStorage.setItem("boardSize", boardSize);
    sessionStorage.setItem("choice", choice);

    const gameDifficult = document.querySelector("#GameDifficult");
    if (gameDifficult)
        sessionStorage.setItem("difficultly", gameDifficult.value);

    window.open(`${choice}.html`, "_self");
}

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

        html += `<button onclick="setBoardSize('${mode}')" id='board-size-btn' class='button'>Done</button>`;

        options.innerHTML = html;

        modal.classList.remove("display-none");
    });
});

/*........................................Build game board.....................................*/
export let currentPlayer = 2;

export function setCurrentPlayer(turn){
    currentPlayer=turn;
}

/*...................................................*/

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

export function makeMove(r, c, player) {
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
export function checkGame() {
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

const resetBoardBtn = document.querySelector('.reset-board');
if (resetBoardBtn) {
    resetBoardBtn.addEventListener("click", function () {
        buildBoard();
        setCurrentPlayer(2);

        const turnHeading = document.querySelector(".turn-heading");
        turnHeading.classList.remove("left-right");
        void turnHeading.offsetWidth;
        if (sessionStorage.getItem("choice") === "TwoPlayer") {
            turnHeading.textContent = currentPlayer === 2 ? "Tails's Turn" : "Sonic's Turn";
        } else if (sessionStorage.getItem("choice") === "OnePlayer") {
            turnHeading.textContent = currentPlayer === 2 ? "Your Turn" : "Computer's Turn";
        }
        turnHeading.classList.add("left-right");

        document.querySelector('.board').style.pointerEvents = 'auto'; //enable clicking on the board
    });
}

/*..........................Add an event listener to know who clicked and update the board...............................*/

export const board = document.querySelector('.board');
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


/*....................................................................................*/


export function checkStatus(){
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

export function checkWinning(choice,res){ 

    if(res==1){
        lightUp(positions);
        if(choice=="TwoPlayer"){
            updateHeading("Sonic is the WINNER!");
            setTimeout(()=>{
                displayModal("Sonic is the WINNER!")
            },1500);
        }else if(choice=="OnePlayer"){
            updateHeading("Computer is the WINNER!");
            setTimeout(()=>{
                displayModal("Computer is the WINNER!" )
            },1500);   
        }    
    }
    else if(res==2){
        lightUp(positions);
        if(choice=="TwoPlayer"){
            updateHeading("Tails is the WINNER!");
            setTimeout(()=>{
                displayModal("Tails is the WINNER!");
            },1500);
        }else if(choice=="OnePlayer"){
            updateHeading("You are the WINNER!");
            setTimeout(()=>{
                displayModal("You are the WINNER!");
            },1500);
        }          
    }else if(res=="tie"){
        updateHeading("It is a tie!");
        setTimeout(()=>{
            displayModal("It is a tie!");
        },1500);
    }  
}

/*.................................................................*/

function updateHeading(heading){
    const turnHeading = document.querySelector(".turn-heading");
    turnHeading.classList.remove("left-right");
    void turnHeading.offsetWidth;
    turnHeading.textContent = heading;
    turnHeading.classList.add("left-right");
}

/*.....................Modal to display the winner............................*/

function displayModal(text){
    //const modal = document.querySelector('.modal');
    const winner = document.querySelector('.modal .winner');
    modal.classList.remove('display-none');
    winner.innerHTML = `
        <h2>${text}!</h2>
    `;

    document.querySelector('.close-button-wrapper button').addEventListener("click", () => {
        document.querySelector(".modal").classList.add("display-none");
    });

}

const closeBtn = document.querySelector('.close-button-wrapper button');
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        modal.classList.add("display-none");
    });
}

document.addEventListener("keydown",(e)=>{
        if(e.code==='Escape'){
            modal.classList.add('display-none');
        }
    });

window.addEventListener("click",(event)=>{
    if(event.target==modal){
        modal.classList.add("display-none");
    }
});

/*........................This to prevent the user from opening the playing page without the prev step.............................*/

window.addEventListener("DOMContentLoaded",()=>{
     const boardSize=sessionStorage.getItem("boardSize");
    if(!boardSize && 
        (window.location.pathname.endsWith('TwoPlayer.html') || window.location.pathname.endsWith('OnePlayer.html'))){

        window.open("index.html","_self");
    }
});