let word = {
    name: ".",
    listOfLetter: [],
    listForRep: [],
    listOfPos: []
};
let cptRow = 1;
let cptCol = 0;
var userInput;
var keyboardTouchVar;
var deleteVar;
var enterVar;
let win = false;
let nbWin = parseInt(localStorage.getItem('nbOfWin')) || 0;
let winningStreak = parseInt(localStorage.getItem('winningStreak')) || 0;


$(document).ready(function () {
    /** Set up the game by taking a random word in the DICO object
     * Make the word upperCase
     * Create cases for every row
     * Placing the first letter in the first case
     */
    go();
    $("#restart").on('click', resetGame);
});

function go() {
    scoreDisplay();
    setNbOfWin();
    setWinningStreak();
    setResultFromPreviousGame();
    turnUserInputOn();
    $('#restart').hide();
    var randomPosition = Math.floor(Math.random() * DICO.length);
    word.name = DICO[randomPosition];
    word.name = word.name.toUpperCase();
    fillTableOfLetter();
    let wordLength = word.name.length;
    table(wordLength);
    $('.first').children().eq(0).html(word.name.charAt(0));

}

keyboardTouchVar = function () {
    if (cptCol < word.name.length) {
        cptCol++;
    }
    userInput = $(this).text();
    let square = rightCase(cptCol);
    square.html(userInput);

}

deleteVar = function () {
    if (cptCol > 0) {
        let square = rightCase(cptCol);
        square.html(".");
        cptCol--;
    };
}

enterVar = function () {
    let message;
    if (cptCol < word.name.length - 1) {
        message = "Mot incomplet!"
    } else if (equals()) {
        message = "Vous avez gagné!"
        turnUserInputOff();
        win = true;
        nbOfWin();
        localStorage.setItem('previousGameResult', 'true');
        winningStreakNumber();
        colorMaker();
    } else {
        colorMaker();
        if (!isGameOver()) {
            message = "pas le bon mot!";
        } else {
            message = "GAME OVER!";
            localStorage.setItem('previousGameResult', 'false');
            winningStreakNumber();
        }
    }
    popMessage(message);
}


function popMessage(message) {
    let length = word.name.length;
    $('#com').text(message);
    $("#com").fadeIn();
    setTimeout(function () {
        $("#com").fadeOut();
    }, 2000);
}

/** Fill the two tables attributs of the object name*/
function fillTableOfLetter() {
    let letter;
    for (let i = 0; i < word.name.length; i++) {
        letter = word.name.charAt(i);
        word.listOfLetter.push(letter);
        word.listForRep.push(letter);
    }
}

/**Create the exact needed numbers of cases for the game
* It also center the gameBoard in the window
*/
function table(length) {
    for (let i = 1; i <= length; i++) {
        $('.row').append('<td class="case">.</td>');
    }
}
/** Return the right element of the DOM for a specific case */
function rightCase(col) {
    let target;
    if (cptRow == 1) {
        target = $('.first').children().eq(col);
    } else if (cptRow == 2) {
        target = $('.second').children().eq(col);
    } else if (cptRow == 3) {
        target = $('.third').children().eq(col);
    } else if (cptRow == 4) {
        target = $('.four').children().eq(col);
    } else if (cptRow == 5) {
        target = $('.five').children().eq(col);
    } else {
        target = $('.six').children().eq(col);
    }

    return target;

}
/** Check for every case of a specific row of the gameBoard if it equals
* the charachter at the same position in the word.
*/
function equals() {
    let target;
    if (cptRow == 1) {
        for (let i = 0; i <= word.name.length; i++) {
            target = $('.first').children().eq(i).text();
            if (target !== word.name.charAt(i)) {
                return false;
            }
        }
    } else if (cptRow == 2) {
        for (let i = 0; i <= word.name.length; i++) {
            target = $('.second').children().eq(i).text();
            if (target !== word.name.charAt(i)) {
                return false;
            }
        }
    }
    else if (cptRow == 3) {
        for (let i = 0; i <= word.name.length; i++) {
            target = $('.third').children().eq(i).text();
            if (target !== word.name.charAt(i)) {
                return false;
            }
        }
    }
    else if (cptRow == 4) {
        for (let i = 0; i <= word.name.length; i++) {
            target = $('.four').children().eq(i).text();
            if (target !== word.name.charAt(i)) {
                return false;
            }
        }
    } else if (cptRow == 5) {
        for (let i = 0; i <= word.name.length; i++) {
            target = $('.five').children().eq(i).text();
            if (target !== word.name.charAt(i)) {
                return false;
            }
        }
    } else {
        for (let i = 0; i <= word.name.length; i++) {
            target = $('.six').children().eq(i).text();
            if (target !== word.name.charAt(i)) {
                return false;
            }
        }
    }
    return true;
}

function nextStep() {
    if (isGameOver()) {
        $('#restart').show();
    } else {
        turnUserInputOn();
        cptRow++;
        cptCol = 0;
        let square = rightCase(cptCol);
        square.html(word.name.charAt(0));
    }
}

function completeListOfPos() {
    let i = 0;
    let currentCase = rightCase(i);
    for (i; i < word.name.length; i++) {
        currentCase = rightCase(i);
        if (word.name.charAt(i) === currentCase.text()) {
            word.listOfLetter[i] = ".";
            word.listForRep[i] = ".";
            word.listOfPos.push(i);
        }
    }
}


/** Manage the color of the game and the user inputs */
function colorMaker() {
    turnUserInputOff();
    completeListOfPos();

    let i = 0; // Index initial
    let g = 0;

    let intervalId = setInterval(function () {
        if (i < word.name.length) {
            let currentCase = rightCase(i);
            if (g !== word.listOfPos.length) {
                if (i === word.listOfPos[g]) {
                    console.log(i);
            console.log(word.listOfPos[g]);
                    g++;
                    currentCase.addClass('red');
                    keyboardColor(currentCase.text(), 'red');
                }
            }
            if (word.listForRep.includes(currentCase.text())) {
                currentCase.addClass('yellow');
                keyboardColor(currentCase.text(), 'yellow');
                turnDown(currentCase.text());
            } else {
                keyboardColor(currentCase.text(), 'light');
            }

            i++; // Incrémentation de l'index
        } else {
            clearInterval(intervalId); // Arrêt de l'exécution répétée lorsque tous les indices ont été traités
            resetTable();
            fillTableOfLetter();
            if (!win) {
                nextStep();
            } else {
                $('#restart').show();
            }
        }
    }, 100); // Délai de 3000 millisecondes (3 secondes)
}


function keyboardColor(text, color) {
    let table = ['.letter-firstRow', '.letter-secondRow', '.letter-thirdRow'];
    for (i = 0; i < table.length; i++) {
        for (j = 0; j < $(table[i]).children().length; j++) {
            if ($(table[i]).children().eq(j).text() === text) {
                $(table[i]).children().eq(j).addClass(color);
            }
        }
    }
}


/**check on the second table to manage yellow case */
function turnDown(text) {
    for (let i = 0; i < word.listForRep.length; i++) {
        if (text === word.listForRep[i]) {
            word.listForRep[i] = ".";
        }
    }
}


function isGameOver() {
    return cptRow === 6;
}
/** Reset the game */
function resetTable() {
    word.listForRep.length = 0;
    word.listOfLetter.length = 0;
    word.listOfPos.length = 0;
}


function resetGame() {
    $('tr').children().remove();
    win = false;
    cptCol = 0;
    cptRow = 1;
    resetTable();
    resetKeyboardTouchColor();
    go();
}

function setNbOfWin() {
    let starter = 0;
    if (!localStorage.getItem('nbOfWin')) {
        localStorage.setItem('nbOfWin', starter.toString());
    }
}

function setWinningStreak() {
    let starter = 0;
    if (!localStorage.getItem('winningStreak')) {
        localStorage.setItem('winningStreak', starter.toString());
    }
}

function setResultFromPreviousGame() {
    if (!localStorage.getItem('previousGameResult')) {
        localStorage.setItem('previousGameResult', 'false');
    }
}

function nbOfWin() {
    nbWin++;
    localStorage.setItem('nbOfWin', nbWin.toString());
}

function winningStreakNumber() {
    if (isPreviousGameWon() === 'true') {
        winningStreak++;
        localStorage.setItem('winningStreak', winningStreak.toString());
    } else {
        winningStreak = 0;
        localStorage.setItem('winningStreak', winningStreak.toString());
    }
}
function isPreviousGameWon() {
    let result = localStorage.getItem('previousGameResult');
    return result;
}

function scoreDisplay() {
    $('#nbOfWin').text(localStorage.getItem('nbOfWin'));
    $('#winningStreak').text(localStorage.getItem('winningStreak'));
}

function resetKeyboardTouchColor() {
    let table = ['.letter-firstRow', '.letter-secondRow', '.letter-thirdRow'];
    for (i = 0; i < table.length; i++) {
        for (j = 0; j < $(table[i]).children().length; j++) {
            $(table[i]).children().eq(j).removeClass('light yellow red');
        }
    }
}


function turnUserInputOff() {
    $(".keyboardTouch").off("click", keyboardTouchVar);
    $(".delete").off("click", deleteVar);
    $(".enter").off("click", enterVar);
}


function turnUserInputOn() {
    $(".keyboardTouch").on("click", keyboardTouchVar);
    $(".delete").on("click", deleteVar);
    $(".enter").on("click", enterVar);
}

