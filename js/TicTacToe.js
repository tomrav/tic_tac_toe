"use strict";

function TicTacToe(board) {

    // sanitize board
//    board = board.toLowerCase();

    // determine optimal play
    //    this.validateBoard(board);


    // empty board
    var game = {
        newBoard: "#########",
//        newBoard: "x###x###o",
        gameOver: false
        };
//    board = "####o#x##";

    SEQUENCES = this.getSequences(game.newBoard);

    // winning board
//    board = "o#oxx##ox";

    // almost losing board
//    board = "o#x#####x";

    // mid game board
//    board = "o#x#xoo#x";

    // possible fork
//    board = "o#xx#o#ox";
//    board = "x###o#o#x";
//    board = "o###x##ox";
//    board = "##x##xoxo";
//    board = "o#x##xoxo";
//    board = "o#x#xxoxo";

//    var game = this.determinePlay(board);
    var currentPlayer = this.getCurrentPlayer(game.newBoard);
    var indexBoard = this.getIndexBoard(game.newBoard);
    this.drawBoard(indexBoard);

    console.log('To play as x, enter x. \nTo play as o enter o.');
    var player = prompt();
//    var player = 'o';
    var opponent = (player == 'x') ? 'o' : 'x';

    if (player == 'o') {
        while (!game.gameOver) {
            currentPlayer = this.getCurrentPlayer(game.newBoard);
            if (currentPlayer == 'x') {
                game = this.determinePlay(game.newBoard);
            } else {
                console.log('You play as: ' + currentPlayer);
                var move = prompt('Please enter move index: ');
                while (game.newBoard[move] != '#') {
                    this.drawBoard(indexBoard);
                    move = prompt('Please provide a valid empty index: ');
                }
                game.newBoard = this.replaceChar(game.newBoard, move, currentPlayer);
            }
            indexBoard = this.getIndexBoard(game.newBoard);
            this.drawBoard(indexBoard);

            game.gameOver = this.getGameStatus(game, player, opponent);
        }
    } else if (player == 'x') {
        while (!game.gameOver) {
            currentPlayer = this.getCurrentPlayer(game.newBoard);
            if (currentPlayer == 'o') {
                game = this.determinePlay(game.newBoard);
            } else {
                console.log('You play as: ' + currentPlayer);
                var move = prompt('Please enter move index: ');
                while (game.newBoard[move] != '#') {
                    this.drawBoard(indexBoard);
                    console.log('Please provide a valid empty index.');
                    move = prompt();
                }
                game.newBoard = this.replaceChar(game.newBoard, move, currentPlayer);
            }
            indexBoard = this.getIndexBoard(game.newBoard);
            this.drawBoard(indexBoard);

            game.gameOver = this.getGameStatus(game, player, opponent);
        }
    } else {
        console.log("You can only play as X or O. Please re-run the program.");
    }


}

//var prompt = require('prompt');
var prompt = require('sync-prompt').prompt;
var _ = require('lodash');

var EXIT_CODES = {
    "otherPlayerMove": 0,
    "victory": 1,
    "loss": 2,
    "draw": 3
};

var SEQUENCES_MAP = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

var CORNER_INDEX = [8, 6, 2, 0];

var SIDE_MIDDLE_INDEX = [1, 3, 5, 7];

var SEQUENCES = [];

TicTacToe.prototype = {

    constructor: TicTacToe,

    getIndexesOfContent: function (array, content) {
        var result = [];

//        for (var i = 0; i < array.length; i++) {
//            if (array[i] == content) {
//                result.push(i);
//            }
//        }


        array.forEach(function (value, index) {
            if (value == content) {
                result.push(index);
            }
        });
        return result;
    },

    getGameStatus: function(game, player, opponent) {

        // check opponent victory
        if (this.isWon(game.newBoard, player)) {
            console.log(opponent + ' won!');
            return true;
        }

        // check computer victory
        if (this.isWon(game.newBoard, opponent)) {
            console.log(opponent + ' won!');
            return true;
        }

        // check tie
        if (this.isTied(game.newBoard)) {
            console.log("it's a draw!");
            return true;
        }

        return false;
    },

    determinePlay: function (board) {
        console.log(board);

        // generating object board and array board just to see whats up
        var arrBoard = board.split("");
        var gameOver = false;

        SEQUENCES = this.getSequences(board);

        // get current player
        var me = this.getCurrentPlayer(board);

        // assign opponent player
        var opponent = (me == 'x') ? 'o' : 'x';
//        console.log('you play: ' + me);
//
        // check if already lost
//        console.log("check loss:");
//        if (this.isWon(board, opponent)) {
//            console.log(opponent + ' won!');
//            gameOver = true;
////            process.exit(EXIT_CODES.loss);
//        }
//        console.log("false");

        // make play
//        console.log("make play");
        var newBoard = this.makePlay(board, me, opponent, arrBoard);
//        console.log("new board: " + newBoard);
        this.drawBoard(newBoard);

        // check for win
//        if (this.isWon(newBoard, me)) {
//            console.log(me + ' won!');
//            gameOver = true;
////            process.exit(EXIT_CODES.victory);
//        }
//        console.log("false");

        // check for tie
//        console.log("check for tie: ");
//        if (this.isTied(newBoard)) {
//            console.log("it's a draw!");
//            gameOver = true;
////            process.exit(EXIT_CODES.draw);
//        }

//        console.log("false");
//        console.log("other player move. \nnew board: " + newBoard);
        var turn = {
            "newBoard": newBoard,
            "gameOver": gameOver
        };
        return turn;
//        process.exit(EXIT_CODES.otherPlayerMove);
    },

    getSequences: function (board) {

        var sequences = _.map(SEQUENCES_MAP, function (sequence) {
            return _.map(sequence, function (index) {
                return board[index];
            });
        });

        return sequences;
    },

    getWinningIndex: function (player) {


        var winningIndexes = null;

        var matchSlot = function (value) {
            return (value == player)
        };

        var matchEmptySlot = function (value) {
            return (value == '#')
        };

        // check individual lines for possible victory
        SEQUENCES.forEach(function (array, index) {
            if ((array.filter(matchSlot).length == 2) && (array.filter(matchEmptySlot).length == 1)) {
                var slotIndex = this.getEmptySlotIndex(index);
                winningIndexes = this.getIndexToReplaceFromSequence(index, slotIndex);
            }
        }.bind(this));

        return winningIndexes;
    },

    getIndexToReplaceFromSequence: function (arrayIndex, charIndex) {
        return SEQUENCES_MAP[arrayIndex][charIndex];
    },

    getEmptySlotIndex: function (index) {

        var slotToReplace = _.indexOf(SEQUENCES[index], '#');

        // return 'empty' slot index
        return slotToReplace;

    },

    getForkIndex: function (possibleSequences, board) {
        var numberOfPossibles = possibleSequences.length;
        for (var i = 0; i < numberOfPossibles; i++) {
            for (var j = i + 1; j < numberOfPossibles; j++) {
                var intersection = _.intersection(SEQUENCES_MAP[possibleSequences[i]], SEQUENCES_MAP[possibleSequences[i + j]]).pop();
                if (intersection !== undefined && board[intersection] == '#') {
                    return intersection;
                }
            }
        }


//            var intersectingIndex = _.intersection(SEQUENCES_MAP[possibleSequences[i]], SEQUENCES_MAP[possibleSequences[i + 1]]);
//            if (intersectingIndex.length != 0 && board[intersectingIndex[0]] == '#') {
//                return intersectingIndex[0];
//            }
//        }

        return null;
    },


    getPossibleForks: function (sequences, player) {

        var possibleForkSequencesIndex = [];

        var matchSlot = function (value) {
            return (value == player)
        };

        var matchEmptySlot = function (value) {
            return (value == '#')
        };

        // get only rows sequences

        // check rows match fork rule (1 me, 2 empty) return indexes of matching rows
        sequences.forEach(function (array, index) {
            if ((array.filter(matchSlot).length == 1) && (array.filter(matchEmptySlot).length == 2)) {
                possibleForkSequencesIndex.push(index);
            }
        });

        return possibleForkSequencesIndex;
    },

    getPossibleThreatsSequences: function (sequences, player) {


    },

    makePlay: function (board, currentPlayer, opponentPlayer, arrBoard) {

        var emptySlots = this.getIndexesOfContent(arrBoard, '#');
        var xLocations = this.getIndexesOfContent(arrBoard, 'x');
        var oLocations = this.getIndexesOfContent(arrBoard, 'o');

        // check for possible win and make winning move
        var winningIndex = this.getWinningIndex(currentPlayer);
        if (winningIndex) {
            return this.replaceChar(board, winningIndex, currentPlayer)
        }

        // check for opponent win and block
        winningIndex = this.getWinningIndex(opponentPlayer);
        if (winningIndex) {
            return this.replaceChar(board, winningIndex, currentPlayer)
        }

        // return only valid possible forks (1 x me, 2 x empty)
        var possibleForks = this.getPossibleForks(SEQUENCES, currentPlayer);

        // return valid fork index
        var forkIntersection = this.getForkIndex(possibleForks, board);

        if (forkIntersection) {
            return this.replaceChar(board, forkIntersection, currentPlayer);
        }

        // check and block enemy fork
        var opponentPossibleForks = this.getPossibleForks(SEQUENCES, opponentPlayer);

        if (opponentPossibleForks.length !== 0) {

            for (var i = 0; i < emptySlots.length; i++) {
                var newBoard = this.replaceChar(board, emptySlots[i], currentPlayer);
                var tempSequences = this.getSequences(newBoard);

                var futureOpponentFork = this.getPossibleForks(tempSequences, opponentPlayer);
                if (futureOpponentFork.length == 0) {
                    return newBoard;
                }
            }
        }

        if (currentPlayer == 'x') { // mark center
            // put in empty corner
            var emptyCornerIntersection = _.intersection(emptySlots, CORNER_INDEX);
            if (emptyCornerIntersection.length == 4) {
                return this.replaceChar(board, emptyCornerIntersection.pop(), currentPlayer);
            }
            // check and respond to corner
            if (emptyCornerIntersection.length == 2) {
                return this.replaceChar(board, emptyCornerIntersection.pop(), currentPlayer);
            }
            // check and respond to side middle
            var emptyMiddleIntersection = _.intersection(emptySlots, SIDE_MIDDLE_INDEX);
            if (emptyMiddleIntersection.length == 3 && board[4] == '#') {
                return this.replaceChar(board, 4, currentPlayer);
            }

            // check and place center
            if (board[4] == opponentPlayer && xLocations.length == 1) {
                var oppositeCorners = {
                    "0": 8,
                    "2": 6,
                    "6": 2,
                    "8": 0
                };
                var cornerIndex = xLocations.pop()
                return this.replaceChar(board, oppositeCorners[cornerIndex], currentPlayer);
            }

            // make first available move
            var randomIndex = Math.floor(Math.random() * ((emptySlots.length - 1) + 1));
            return this.replaceChar(board, emptySlots[randomIndex], currentPlayer);

        } else {
            // check and place center
            if (board[4] == '#') {
                return this.replaceChar(board, 4, currentPlayer);
            }
            // check and respond to middle
            var emptyCornerIntersection = _.intersection(emptySlots, CORNER_INDEX);
            if (emptyCornerIntersection.length == 4 && board[4] == opponentPlayer) {
                return this.replaceChar(board, emptyCornerIntersection.pop(), currentPlayer);
            }
            if (emptyCornerIntersection.length == 2 && board[4] == opponentPlayer) {
                return this.replaceChar(board, emptyCornerIntersection.pop(), currentPlayer);
            }
            // check and respond to corner
            var emptyMiddleIntersection = _.intersection(emptySlots, SIDE_MIDDLE_INDEX);
            if (emptyMiddleIntersection.length == 4) {
                return this.replaceChar(board, emptyMiddleIntersection.pop(), currentPlayer);
            }
            // put in empty corner
            if (emptyCornerIntersection.length > 0) {
                return this.replaceChar(board, emptyCornerIntersection.pop(), currentPlayer);
            }
            // make a random available move
            var randomIndex = Math.floor(Math.random() * (emptySlots.length + 1));
            return this.replaceChar(board, randomIndex, currentPlayer);
        }

//        var newBoardIndex = this.getWinningIndex(board, currentPlayer);
//        if (newBoardIndex) {
//            return this.replaceChar(board, newBoardIndex, currentPlayer);
//        }

//        // check to prevent loss
//        newBoardIndex = this.getWinningIndex(board, opponentPlayer);
//        if (newBoardIndex) {
//            return this.replaceChar(board, newBoardIndex, currentPlayer);
//        }


        // very weak first play
//        for (var i = 0; i < board.length; i++) {
//            if (board[i] == '-') {
//                var newBoard = this.replaceChar(board, i, currentPlayer);
//                break;
//            }
//        }
//        return newBoard;
    },

    replaceChar: function (board, index, newChar) {
        var b = board.split('');
        b[index] = newChar;
        return b.join('');

//        index = Number(index);
//        var strA = board.slice(0, index);
//        var strB = board.slice(index + 1);
//        return strA + newChar + strB;
    },

    getCurrentPlayer: function (board) {
//        return 'x';
        var xBoard = board.match(/x/g) || [];
        var oBoard = board.match(/o/g) || [];
        if (xBoard) {
            if (xBoard.length == oBoard.length) {
                return 'x';
            } else {
                return 'o';
            }
        } else {
            return 'x';
        }
    },

    isWon: function (board, currentPlayer) {
        var rowWin = this.checkRowsForWin(board, currentPlayer);
        var colWin = this.checkColumnsForWin(board, currentPlayer);
        var diagWin = this.checkDiagWin(board, currentPlayer);
        return (rowWin || colWin || diagWin)

    },

    isTied: function (board) {
        return (board.match(/#/g) == null)
    },

//    isGameOver: function (board) {
//        return board.indexOf('-') === -1;
//    },

    checkRowsForWin: function (board, currentPlayer) {
        var status = false;
        if (currentPlayer == board[0] || currentPlayer == board[3] || currentPlayer == board[6]) {

            for (var i = 0; i < board.length; i += 3) {
                if (currentPlayer == board[i] && currentPlayer == board[i + 1] && currentPlayer == board[i + 2]) {
                    status = true
                }
            }
        }
        return status;
    },

    checkColumnsForWin: function (board, currentPlayer) {

        var status = false;

        if (currentPlayer == board[0] || currentPlayer == board[1] || currentPlayer == board[2]) {
            for (var i = 0; i < 3; i++) {
                if (currentPlayer == board[i] && currentPlayer == board[i + 3] && currentPlayer == board[i + 6]) {
                    status = true;
                }
            }
        }
        return status;
    },

    checkDiagWin: function (board, currentPlayer) {

        var status = false;

        if (currentPlayer == board[0] && currentPlayer == board[4] && currentPlayer == board[8]) {
            return true;
        } else if (currentPlayer == board[2] && currentPlayer == board[4] && currentPlayer == board[6]) {
            return true;
        }
        return status;
    },

//    getWinningIndex: function (board, currentPlayer) {
//        return this.checkRowPossibleWin(board, currentPlayer);
//    },

    drawBoard: function (board) {

        var str = "___________\n|";
        console.log("GAME BOARD: ");
        for (var i = 1; i < board.length + 1; i++) {
            str += (i % 3 != 0) ? board[i - 1] + " | " : board[i - 1];
            if ((i % 3 == 0) && i < 9) {
                str += ("|\n" + "-----------" + "\n|");
            }

        }
        str += "|\n¯¯¯¯¯¯¯¯¯¯¯";
        console.log(str);
    },

    getIndexBoard: function (board) {

//        var printBoard = board;
//        var emptySlots = this.getIndexesOfContent(arrBoard, '#');
//        for (var i = 0; i < emptySlots.length; i++) {
//            printBoard[i] = i;
//        }

//        var arrBoard = board.split('');
//        for (var i = 0; i < arrBoard.length; i++) {
//            if (arrBoard[i] == '#') {
//                arrBoard[i] = i;
//            }
//        }
//        var printBoard = arrBoard.join('');
//        return printBoard;


        function emptyCellsToIndex(value, index) {
            return value == '#'
                ? index
                : value;
        }

        return board.split('').map(emptyCellsToIndex).join('');
    }
}
;


var board = process.argv[2];
var ticTacToe = new TicTacToe(board);


//while (true) {
//    var ticTacToe = new TicTacToe(GAME_BOARD);
//}

////------
//
//var board = '---------';
//var playerX = new Player('x');
//var playerY = new Player('o');
//var currentPlayer = playerX;
//while(!isGameOver(board)) {
//    var index = currentPlayer.selectPlace(board);
//    var playerSign = currentPlayer.getSign();
//    board = board.splice(index, 1, playerSign);
//    currentPlayer = (playerSign === 'x') ? playerY : playerX;
//}
//
//
//function isGameOver(board) {
//    // ToDo: return result
//}

