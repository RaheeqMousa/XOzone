import { currentPlayer, setCurrentPlayer, board, gameBoard, makeMove, checkGame, checkStatus } from "./ui.js";
/*..........................Add an event listener to know who clicked and update the board...............................*/

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