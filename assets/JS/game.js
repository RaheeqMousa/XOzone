
export class TwoPlayer{

    constructor(utils) {
        this.gameUtils=utils;
        this.clickEvents();
    }

    clickEvents(){
        if(!this.board) return;

        this.gameUtils.board.addEventListener("click",e=>this.handleCellClick(e));
    }

    handleCellClick(event){
        if (!event.target.classList.contains('cell')) return;

        const modal = document.querySelector('.modal');
        const winner = document.querySelector('.modal .winner');

        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        
        if (makeMove(row, col, currentPlayer)) {
            
            event.target.textContent = currentPlayer === 1 ? "X" : "O";
            this.gameUtils.checkStatus();
        }
    }

}