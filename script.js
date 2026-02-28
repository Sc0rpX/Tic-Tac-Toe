const Gameboard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const placeMark = function(mark, index) {
        if(board[index] === ""){
            board[index] = `${mark}`;
            return true;
        }
        console.log("The place is taken! Try again!")
        return false;
    }

    const resetBoard = function() {
        board = ["", "", "", "", "", "", "", "", ""];
    }

    return {getBoard, placeMark, resetBoard};
})();

function createPlayer(name, mark) {
    return {name, mark};
}

const GameController = (function() {
    const winningSequences = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

    const player1 = createPlayer("player1", "X");
    const player2 = createPlayer("player2", "O");

    let activePlayer = player1;
    const swipePlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const evaluateBoard = function() {
        let gameboard = Gameboard.getBoard();

            return winningSequences.some((sequence) => 
                sequence.every((currentValue) => gameboard[currentValue] === activePlayer.mark)
            );
    }

    const playRound = function(boardIndex) {
        let markPlaced = Gameboard.placeMark(activePlayer.mark, boardIndex);
        if(markPlaced) {
            console.log(Gameboard.getBoard());
            if(evaluateBoard()){
                console.log(`${activePlayer.name} wins the game!\n Play again.`);
                Gameboard.resetBoard();
            } else if(!Gameboard.getBoard().includes("")) {
                console.log("It's a tie! play again");
                Gameboard.resetBoard();
            }
            swipePlayerTurn();
        }
    }

    return {playRound};
})();
