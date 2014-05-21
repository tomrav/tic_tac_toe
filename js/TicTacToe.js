"use strict";

function TicTacToe(board) {

    // perform play
    this.determinePlay(board);
}
    var _ = require('lodash');

    var EXIT_CODES = {
        "otherPlayerMove": "CONTINUE",
        "victory": "WIN",
        "loss": "LOSE",
        "draw": "DRAW"
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

            array.forEach(function (value, index) {
                if (value == content) {
                    result.push(index);
                }
            });
            return result;
        },

        determinePlay: function (board) {
            var turnOver = false;
            var arrBoard = board.split('');
            SEQUENCES = this.getSequences(board);

            // get current player
            var me = this.getCurrentPlayer(board);

            // assign opponent player
            var opponent = (me == 'X') ? 'O' : 'X';

            // check if already lost
            if (this.isWon(SEQUENCES, opponent)) {
                console.log(EXIT_CODES.loss);
                turnOver = true;
            }

            // make play
            var newBoard = this.makePlay(board, me, opponent, arrBoard);
            SEQUENCES = this.getSequences(newBoard);
            console.log(newBoard);

            // check for win
            if (this.isWon(SEQUENCES, me)) {
                console.log(EXIT_CODES.victory);
                turnOver = true;
            }

            // check for tie
            if (this.isTied(newBoard) && !turnOver) {
                console.log(EXIT_CODES.draw);
                turnOver = true;
            }
            if (!turnOver) {
                console.log(EXIT_CODES.otherPlayerMove);
            }
            process.exit(0);
        },

        checkAndPlayEmptyBoard: function (arrBoard, board, currentPlayer) {

            // check if board is empty - if so, change bottom right corner to currentPlayer
            var isSlotEmpty = function (element) {
                return (element == "#");
            };

            if (arrBoard.every(isSlotEmpty)) {
                return this.replaceChar(board, board.length - 1, currentPlayer);
            }

            return [];
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

            // check rows match fork rule (1 me, 2 empty) return indexes of matching rows
            sequences.forEach(function (array, index) {
                if ((array.filter(matchSlot).length == 1) && (array.filter(matchEmptySlot).length == 2)) {
                    possibleForkSequencesIndex.push(index);
                }
            });

            return possibleForkSequencesIndex;
        },

        makePlay: function (board, currentPlayer, opponentPlayer, arrBoard) {

            SEQUENCES = this.getSequences(board);

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
            var emptySlots = this.getIndexesOfContent(arrBoard, '#');
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

            var xLocations = this.getIndexesOfContent(arrBoard, 'X');
            var emptyMiddleIntersection = _.intersection(emptySlots, SIDE_MIDDLE_INDEX);
            var emptyCornerIntersection = _.intersection(emptySlots, CORNER_INDEX);


            if (currentPlayer == 'X') { // mark center
                // put in empty corner
                if (emptyCornerIntersection.length == 4) {
                    return this.replaceChar(board, emptyCornerIntersection.pop(), currentPlayer);
                }
                // check and respond to corner
                if (emptyCornerIntersection.length == 2) {
                    return this.replaceChar(board, emptyCornerIntersection.pop(), currentPlayer);
                }
                // check and respond to side middle
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
                    var cornerIndex = xLocations.pop();
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
                if (emptyCornerIntersection.length == 4 && board[4] == opponentPlayer) {
                    return this.replaceChar(board, emptyCornerIntersection.pop(), currentPlayer);
                }
                if (emptyCornerIntersection.length == 3 && emptyMiddleIntersection.length == 4 && board[4] == '#') {
                    return this.replaceChar(board, 4, currentPlayer);
                }
                if (emptyCornerIntersection.length == 2 && emptyMiddleIntersection.length == 4 && board[4] == currentPlayer) {
                    return this.replaceChar(board, emptyMiddleIntersection.pop(), currentPlayer);
                }
                if (emptyCornerIntersection.length == 2 && board[4] == opponentPlayer) {
                    return this.replaceChar(board, emptyCornerIntersection.pop(), currentPlayer);
                }
                // check and respond to corner
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
        },

        replaceChar: function (board, index, newChar) {

//        newChar = newChar == 'x' ? 'X' : 'O' || newChar;
            var strA = board.slice(0, index);
            var strB = board.slice(index + 1, board.length);
            return strA + newChar + strB;
        },

        getCurrentPlayer: function (board) {
//        return 'x';
            var xBoard = board.match(/X/g) || [];
            var oBoard = board.match(/O/g) || [];
            if (xBoard) {
                if (xBoard.length == oBoard.length) {
                    return 'X';
                } else {
                    return 'O';
                }
            } else {
                return 'X';
            }
        },

        isWon: function (sequences, player) {
            return sequences.some(function (sequence) {
                return sequence.every(function (value) {
                    return value == player;
                })
            });
        },

        isTied: function (board) {
            return (board.match(/#/g) == null)
        },

        drawBoard: function (board) {

            var str = "___________\n|";
            for (var i = 1; i < board.length + 1; i++) {
                str += (i % 3 != 0) ? board[i - 1] + " | " : board[i - 1];
                if ((i % 3 == 0) && i < 9) {
                    str += ("|\n" + "-----------" + "\n|");
                }

            }
            str += "|\n¯¯¯¯¯¯¯¯¯¯¯";
//        console.log(str);
        }
    };


    var board = process.argv[2];
    var ticTacToe = new TicTacToe(board);



