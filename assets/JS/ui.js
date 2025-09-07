export class UI {

    constructor() {
        this.modal = document.querySelector(".modal");
        this.board = document.querySelector(".board");
        this.gameBoard = [];
        this.currentPlayer = 2;
        this.positions = [];

        this.clickEventListeners();
        this.buildBoard();
        this.preventDirectAccess();
    }

    setCurrentPlayer(turn) {
        this.currentPlayer = turn;
    }

    /*................................Action After choosing the size..................................*/
    setBoardSize(choice) {
        this.modal.classList.add("display-none");

        const boardSize = document.querySelector("#BoardSize").value;
        sessionStorage.setItem("boardSize", boardSize);
        sessionStorage.setItem("choice", choice);

        const gameDifficult = document.querySelector("#GameDifficult");
        if (gameDifficult)
            sessionStorage.setItem("difficulty", gameDifficult.value);

        window.open(`${choice}.html`, "_self");
    }

    /*...........................Build Game Board.....................................*/
    buildBoard() {
        const size = parseInt(sessionStorage.getItem('boardSize'));
        const boardElement = document.querySelector('.board');

        if (!boardElement) return;

        this.board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        this.board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        this.board.innerHTML = ``;

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            cell.dataset.row = Math.floor(i / size);
            cell.dataset.col = i % size;

            boardElement.appendChild(cell);
        }

        this.gameBoard = [];
        for (let i = 0; i < size; i++) {
            this.gameBoard[i] = [];
            for (let j = 0; j < size; j++) {
                this.gameBoard[i][j] = 0;
            }
        }
    }

    /*................................Make Move................................*/

    makeMove(r, c, player) {
        if (this.gameBoard[r][c] === 0) {
            this.gameBoard[r][c] = player;
            return true;
        }
        return false;
    }

    /*...............................Check Game.................................*/

    equalCells(array) {
        return array.every(cell => cell === array[0] && cell !== 0);
    }


    checkGame() {
        const n = this.gameBoard.length;

        // Check rows
        this.positions = [];
        for (let i = 0; i < n; i++) {

            if (this.equalCells(this.gameBoard[i])) {
                this.positions.push(i);
                return this.gameBoard[i][0];
            }
        }

        this.positions = [];
        // Check columns
        for (let j = 0; j < n; j++) {
            let col = [];
            this.positions = [];
            for (let i = 0; i < n; i++) {
                col.push(this.gameBoard[i][j]);
                this.positions.push(`${i} ${j}`);
            }
            if (this.equalCells(col)) {
                return col[0];
            }
        }

        this.positions = [];
        // Check main diagonal
        let diagonal1 = [];
        for (let i = 0; i < n; i++) {
            diagonal1.push(this.gameBoard[i][i]);
            this.positions.push(`${i} ${i}`);
        }
        if (this.equalCells(diagonal1)) {
            return diagonal1[0];
        }

        this.positions = [];
        // Check anti-diagonal
        let diagonal2 = [];
        for (let i = 0; i < n; i++) {
            diagonal2.push(this.gameBoard[i][n - 1 - i]);
            this.positions.push(`${i} ${n - 1 - i}`);
        }
        if (this.equalCells(diagonal2)) {
            return diagonal2[0];
        }

        if (this.gameBoard.flat().every(cell => cell !== 0)) {
            this.positions = [];
            return "tie";
        }

        this.positions = [];
        return "play";
    }

    /*............................Check status...................................*/

    checkStatus() {
        const choice = sessionStorage.getItem("choice");
        const res = this.checkGame();

        if (res == "play") {
            if (choice == "TwoPlayer") {
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                if (this.currentPlayer == 2) {
                    this.updateHeading("Tails's Turn");
                } else if (this.currentPlayer == 1) {
                    this.updateHeading("Sonic's Turn");
                }

            } else if (choice == "OnePlayer") {
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                if (this.currentPlayer == 2) {
                    this.updateHeading("Your Turn");
                } else if (this.currentPlayer == 1) {
                    this.updateHeading("Computer's Turn");
                }
            }
        } else
            this.checkWinning(choice, res);
    }

    /*.................................Check Winning........................*/

    checkWinning(choice, res) {

        if (res == 1) {
            this.lightUp(this.positions);
            if (choice == "TwoPlayer") {
                this.updateHeading("Sonic is the WINNER!");
                setTimeout(() => {
                    this.displayModal("Sonic is the WINNER!")
                }, 2000);
            } else if (choice == "OnePlayer") {
                this.updateHeading("Computer is the WINNER!");
                setTimeout(() => {
                    this.displayModal("Computer is the WINNER!")
                }, 2000);
            }

        }
        else if (res == 2) {
            this.lightUp(this.positions);
            if (choice == "TwoPlayer") {
                this.updateHeading("Tails is the WINNER!");
                setTimeout(() => {
                    this.displayModal("Tails is the WINNER!");
                }, 1500);
            } else if (choice == "OnePlayer") {
                this.updateHeading("You are the WINNER!");
                setTimeout(() => {
                    this.displayModal("You are the WINNER!");
                }, 1500);
            }

        } else if (res == "tie") {
            this.updateHeading("It is a tie!");
            setTimeout(() => {
                this.displayModal("It is a tie!");
            }, 1500);
        }
    }

    /*...........................Light up the winning line..........................*/

    lightUp(array, timeout = 1500) {
        this.board.style.pointerEvents = 'none';

        setTimeout(() => {
            if (array.length === 1) {
                for (let i = 0; i < this.gameBoard.length; i++) {
                    document.querySelector(`.cell[data-row="${array[0]}"][data-col="${i}"]`).style.backgroundColor = '#04d9ff';
                }
            } else {
                array.forEach(pos => {
                    const [r, c] = pos.split(" ");
                    document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`).style.backgroundColor = '#04d9ff';
                });
            }
        }, timeout);

    }

    /*....................Update Heading......................*/

    updateHeading(text) {
        const turnHeading = document.querySelector(".turn-heading");
        turnHeading.classList.remove("left-right");
        void turnHeading.offsetWidth;
        turnHeading.textContent = text;
        turnHeading.classList.add("left-right");
    }

    /*.......................Display modal........................*/
    displayModal(text) {
        this.modal.classList.remove('display-none');
        const winner = document.querySelector('.modal .winner');
        winner.innerHTML = `<h2>${text}!</h2>`;

        document.querySelector('.close-button-wrapper button').addEventListener("click", () => {
            this.modal.classList.add("display-none");
        });
    }

    /*.........................Reset board button action.........................*/

    resetBoard() {
        this.buildBoard();
        this.currentPlayer = 2;
        const turnHeading = document.querySelector(".turn-heading");
        turnHeading.classList.remove("left-right");
        void turnHeading.offsetWidth;

        const choice = sessionStorage.getItem("choice");
        if (choice === "TwoPlayer") {
            turnHeading.textContent = "Tails's Turn";
        } else if (choice === "OnePlayer") {
            turnHeading.textContent = "Your Turn";
        }

        turnHeading.classList.add("left-right");
        this.board.style.pointerEvents = 'auto';
    }

    /*...........................Prevent Direct Page Access to the game pages...................................*/
    preventDirectAccess() {
        const boardSize = sessionStorage.getItem("boardSize");
        if (!boardSize && (window.location.pathname.endsWith('TwoPlayer.html') || window.location.pathname.endsWith('OnePlayer.html'))) {
            window.open("index.html", "_self");
        }
    }

    /*...........................Initialize Event Listeners............................*/
    clickEventListeners() {
        //Mode buttons
        document.querySelectorAll(".ModeBtn").forEach(btn => {
            btn.addEventListener('click', (event) => this.displayOptions(event));
        });

        //Reset button
        const resetBoardBtn = document.querySelector('.reset-board');
        if (resetBoardBtn) {
            resetBoardBtn.addEventListener("click", () => this.resetBoard());
        }

        //close modal ctions
        const closeBtn = document.querySelector('.close-button-wrapper button');
        if (closeBtn) {
            closeBtn.addEventListener("click", () => this.modal.classList.add("display-none"));
        }

        document.addEventListener("keydown", (e) => {
            if (e.code === 'Escape') this.modal.classList.add('display-none');
        });

        window.addEventListener("click", (event) => {
            if (event.target === this.modal) this.modal.classList.add("display-none");
        });

        //Add an event listener to know who clicked and update the board
        if (this.board && sessionStorage.getItem("choice") === "TwoPlayer") {
            this.board.addEventListener('click', (event) => {
                if (!event.target.classList.contains('cell')) return;
                const row = parseInt(event.target.dataset.row);
                const col = parseInt(event.target.dataset.col);
                if (this.makeMove(row, col, this.currentPlayer)) {
                    event.target.textContent = this.currentPlayer === 1 ? "X" : "O";
                    this.checkStatus();
                }
            });
        }
    }

    /*..............................Action for the clicked Mode button..................................*/
    displayOptions(event) {
        const mode = event.currentTarget.id;
        const options = document.querySelector(".modal .options");

        let html = `
            <div class="row">
                <label for='BoardSize'>Choose board size</label>
                <select id='BoardSize'>`;

        for (let i = 3; i <= 10; i++) {
            html += `<option value='${i}'>${i}</option>`;
        }
        html += `</select></div>`;

        if (mode === "OnePlayer") {
            const difficult = ["Easy", "Mid", "Hard"];
            html += `<div><label>Choose Difficulty</label><select id="GameDifficult">`;
            for (let i = 0; i < 3; i++) {
                html += `<option value='${difficult[i]}'>${difficult[i]}</option>`;
            }
            html += `</select></div>`;
        }

        html += `<button id='board-size-btn' class='button'>Done</button>`;
        options.innerHTML = html;
        this.modal.classList.remove("display-none");

        const sizeBtn = document.querySelector('#board-size-btn');
        sizeBtn.addEventListener('click', () => this.setBoardSize(mode));
    }

}