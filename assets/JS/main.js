/*..............................Action for the clicked Mode button..................................*/

document.querySelectorAll(".ModeBtn").forEach(btn => {
    btn.addEventListener('click', (event) => {
        const mode = event.currentTarget.id;
        const options = document.querySelector(".modal .options");

        let html = `
            <label for='BoardSize'>Choose board size</label>
            <select id='BoardSize'>`;

        for (let i = 3; i <= 10; i++) {
            html += `<option value='${i}'>${i}</option>`;
        }

        html += `</select>
        <button onclick="setBoardSize('${mode}')" class='button'>Choose size</button>`;

        options.innerHTML = html;

        const modal = document.querySelector(".modal");
        modal.classList.remove("DisplayNone");
    });

    
});

const closeBtn=document.querySelector('.CloseButtonWrapper button');
if(closeBtn){
    closeBtn.addEventListener("click", () => {
    document.querySelector(".modal").classList.add("DisplayNone"); });
}

/*................................Action After choosing the size..................................*/

function setBoardSize(choice) {

    const modal = document.querySelector(".modal");
    modal.classList.add("DisplayNone");

    const boardSize = document.querySelector("#BoardSize").value;
    sessionStorage.setItem("boardSize", boardSize);
    sessionStorage.setItem("choice", choice);
    window.open(`${choice}.html`, "_self");
}

/*........................................Build game board.....................................*/
let gameBoard = [];
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

function makeMove(board, r, c, player) {
    if (board[r][c] === 0) {
        board[r][c] = player;
        return true;
    }
    return false;
}

/*.............This checks if all elements in the array are equal...........................*/

function equalCells(array) {
    return array.every(cell => cell === array[0] && cell !== 0);
}

/*...................This function checks if the Game has been finished or yet, if it has been finished it returnes the result...............................*/

function checkGame(board) {
    const n = board.length;

    let positions=[];
    // Check rows
    for (let i = 0; i < n; i++) {
        
        if (equalCells(board[i])){
            positions.push(i);
            lightUp(positions,n);
            return board[i][0];
        }
    }

    positions=[];
    // Check columns
    for (let j = 0; j < n; j++) {
        let col = [];
        for (let i = 0; i < n; i++) {
            col.push(board[i][j]);
            positions.push(`${i} ${j}`);
        }
        if (equalCells(col)){
            lightUp(positions,n);
            return col[0];
        } 
    }

    positions=[];
    // Check main diagonal
    let diagonal1 = [];
    for (let i = 0; i < n; i++) {
        diagonal1.push(board[i][i]);
        positions.push(`${i} ${i}`);
    }
    if (equalCells(diagonal1)){
        lightUp(positions,n);
        return diagonal1[0];
    }

    positions=[];
    // Check anti-diagonal
    let diagonal2 = [];
    for (let i = 0; i < n; i++) {
        diagonal2.push(board[i][n - 1 - i]);
        positions.push(`${i} ${n - 1 - i}`);
    }
    if (equalCells(diagonal2)){
        lightUp(positions,n);
        return diagonal2[0];
    }

    if (board.flat().every(cell => cell !== 0)) return "tie";

    return "play";
}

//Initialize the board on page load
buildBoard();

/*......................Reset Button...........................*/

const resetBoardBtn=document.querySelector('.ResetBoard');
if(resetBoardBtn){
    resetBoardBtn.addEventListener("click",function(){
        buildBoard();
        currentPlayer=2;

        const TurnHeading=document.querySelector(".TurnHeading");
        TurnHeading.classList.remove("LeftRight");
        void TurnHeading.offsetWidth;
        TurnHeading.textContent= currentPlayer === 2 ? "Tails's Turn" : "Sonic's Turn";
        TurnHeading.classList.add("LeftRight");

        document.querySelector('.board').style.pointerEvents='auto'; //enable clicking on the board
    });
}

/*..........................Add an event listener to know who clicked and update the board...............................*/

const board=document.querySelector('.board');
if(board){
    board.addEventListener('click', (event) => {
        if (!event.target.classList.contains('cell')) return;

        const modal=document.querySelector('.modal');
        const winner=document.querySelector('.modal .winner');

        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (makeMove(gameBoard, row, col, currentPlayer)) {
            console.log(currentPlayer);
            event.target.textContent = currentPlayer === 1 ? "X" : "O";

            const TurnHeading=document.querySelector(".TurnHeading");
            TurnHeading.classList.remove("LeftRight");
            void TurnHeading.offsetWidth;
            TurnHeading.textContent= currentPlayer === 1 ? "Tails's Turn" : "Sonic's Turn";
            TurnHeading.classList.add("LeftRight");

            const result = checkGame(gameBoard);
            if (result === 1) {
                modal.classList.remove('DisplayNone');
                winner.innerHTML=`
                    <h2>Sonic Wins!</h2>;
                `;

                document.querySelector('.CloseButtonWrapper button').addEventListener("click", () => {
                document.querySelector(".modal").classList.add("DisplayNone"); });

                TurnHeading.textContent="Sonic is the WINNER!"
            } else if (result === 2) {
                modal.classList.remove('DisplayNone');
                winner.innerHTML=`
                    <h2>Tails Wins!</h2>
                `;

                document.querySelector('.CloseButtonWrapper button').addEventListener("click", () => {
                document.querySelector(".modal").classList.add("DisplayNone"); });

                TurnHeading.textContent="Tails is the WINNER!"
            } else if (result === "tie") {
                modal.classList.remove('DisplayNone');
                winner.innerHTML=`
                    <h2>It is Tie!</h2>
                `;

                document.querySelector('.CloseButtonWrapper button').addEventListener("click", () => {
                document.querySelector(".modal").classList.add("DisplayNone"); });
                TurnHeading.textContent="It is a tie!"
            } else {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                
            }
        }
    });
}

/*............................Light up the winning line..................................*/

function lightUp(array,n){

    if(array.length==1){
        for(let i=0;i<n;i++){
            document.querySelector(`.cell[data-row="${array[0]}"][data-col="${i}"]`).style.backgroundColor='#04d9ff';
        }
    }else{
        for(let i=0;i<n;i++){
            let positions=array[i].split(" ");
            document.querySelector(`.cell[data-row="${positions[0]}"][data-col="${positions[1]}"]`).style.backgroundColor='#04d9ff';
        }
    }

    document.querySelector('.board').style.pointerEvents='none'; //disable clicking on the board's divs
}