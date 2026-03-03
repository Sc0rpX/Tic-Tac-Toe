const Gameboard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const placeMark = function(mark, index) {
        if(board[index] === ""){
            board[index] = `${mark}`;
            return true;
        }
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

    let player1 = createPlayer("Player X", "X");
    let player2 = createPlayer("Player O", "O");
    const setPlayerNames = function(player1Name, player2Name){
        player1.name = player1Name === "" ? "Player X" : player1Name;
        player2.name = player2Name === "" ? "Player O" : player2Name;
    }

    let activePlayer = player1;
    const swipePlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const getActivePlayer = () => activePlayer;

    const evaluateBoard = function() {
        let gameboard = Gameboard.getBoard();

        return winningSequences.some((sequence) => 
            sequence.every((currentValue) => gameboard[currentValue] === activePlayer.mark)
        );
    }

    let isGameOver = false;
    const playRound = function(boardIndex) {
        if(isGameOver){
            return;
        }

        let markPlaced = Gameboard.placeMark(activePlayer.mark, boardIndex);
        if(markPlaced) {
            if(evaluateBoard()){
                isGameOver = true;
                displayController.updateStatus(`${activePlayer.name} wins the game!\n Play again.`);
            } else if(!Gameboard.getBoard().includes("")) {
                isGameOver = true;
                displayController.updateStatus("It's a tie! Play again");
            } else {
                swipePlayerTurn();
                displayController.updateStatus(`It's ${activePlayer.name}'s turn`)
            }
        } else {
            displayController.updateStatus("The place is taken! Try again!");
        }
    }

    const newGame = function() {
        isGameOver = false;
        activePlayer = player1;
    }

    return {playRound, newGame, getActivePlayer, setPlayerNames};
})();

const displayController = (function() {
    const cells = document.querySelectorAll(".cell");
    const statusTxt = document.querySelector("#status-text");
    const resetBtn = document.querySelector("#reset-btn");
    const newGameBtn = document.querySelector("#new-game-btn");
    const dialog = document.querySelector("#name-entry-dialog");
    const startBtn = document.querySelector("#start-game");

    const render = function() {
        Gameboard.getBoard().forEach((element, index) => {
            cells[index].textContent = element;
        })
    }

    const updateStatus = function(str) {
        statusTxt.textContent = str;
    }

    cells.forEach((element, index) => {
        element.addEventListener("click", () => {
            GameController.playRound(index);
            render();
        })
    });

    const resetGame = function() {
        Gameboard.resetBoard();
        GameController.newGame();
        updateStatus(`It's ${GameController.getActivePlayer().name}'s turn!`);
        render();
    }

    resetBtn.addEventListener("click", resetGame);

    newGameBtn.addEventListener("click", () => {
        resetGame();
        dialog.showModal();
    })

    startBtn.addEventListener("click", () => {
        const player1Name = document.getElementById("player1-name");
        const player2Name = document.getElementById("player2-name");

        GameController.setPlayerNames(player1Name.value, player2Name.value);
        updateStatus(`It's ${GameController.getActivePlayer().name}'s turn!`);
        dialog.close();
        player1Name.value = "";
        player2Name.value = "";
    })

    updateStatus(`It's ${GameController.getActivePlayer().name}'s turn!`);
    dialog.showModal();

    return {render, updateStatus};
})();
