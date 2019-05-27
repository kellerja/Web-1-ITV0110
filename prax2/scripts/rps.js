/*game logic*/
var Choice = function(name, value) {
    this.name = name;
    this.value = value;
};
var Move = function(player, enemy, result) {
    this.player = player;
    this.enemy = enemy;
    this.result = result;
}
var Contestant = function(name, choice) {
    this.name = name;
    this.choice = choice;
    this.turnDuration;
}

var Timer = function(timerHTMLElementID) {
    this.value = 0;
    this.initialTime = new Date().getTime();
    this.timerHTMLElement = document.getElementById(timerHTMLElementID);
    this.pauseTime = 0;

    this.updateValue = function() {
        this.value = new Date().getTime() - this.initialTime - this.pauseTime;
        var seconds = Math.floor(this.value / 1000 % 60);
        var minutes = Math.floor(this.value / 60000 % 60);
        var hours = Math.floor(this.value / 3600000);
        var message = this.value > 3600000 ? hours + ":" : "";
        message += minutes < 10 ? "0" + minutes : minutes;
        message += ":";
        message += seconds < 10 ? "0" + seconds : seconds;
        this.timerHTMLElement.innerHTML = "<p>" + message + "</p>";
    }

    this.changeTimerToZero = function() {
        this.timerHTMLElement.innerHTML = "<p>00:00</p>";
    }

    this.continueTimer = function() {
        this.pauseTime = new Date().getTime() - this.value - this.initialTime;
    }
}

var rock = new Choice("Kivi", 1);
var paper = new Choice("Paber", 2);
var scissors = new Choice("Käärid", 3);
var choices = [rock, paper, scissors];

var player = new Contestant("Mängija", undefined);
var enemy = new Contestant("Arvuti", undefined);
var drawState = {name:"Viik"};

/* 1 - ongoing, 0 - not ongoing */
var gameState = 0;

var winsCount = {player:0, enemy:0, draw:0};

var moveHistory = new Array();

var timer;
var timerInterval;

var totalTimer;
var totalTimerInterval;

var updateTimersInMillis = 100;

function getWinner(a, b) {
    var choiceOfA = a.choice.value;
    var choiceOfB = b.choice.value;
    if (choiceOfA == choiceOfB) {
        return drawState;
    }
    if (choiceOfA == 1 && choiceOfB == 2) {
        return b;
    } else if (choiceOfA == 2 && choiceOfB == 3) {
        return b;
    } else if (choiceOfA == 3 && choiceOfB == 1) {
        return b;
    } else {
        return a;
    }
    /*
    if (choiceOfA == choiceOfB) {
        return drawState;
    } else if (choiceOfA % 2 == 0 && choiceOfB % 2 != 0 
    || choiceOfA % 2 != 0 && choiceOfB % 2 == 0) {
        return choiceOfA > choiceOfB ? a : b;
    } else {
        return choiceOfA > choiceOfB ? b : a;
    }
    */
}

function getPlayerChoice(choice) {
    if (gameState == 0) {
        return;
    }
    player.choice = choice;
    clearInterval(timerInterval);
    player.turnDuration = timer.value;
    timer.changeTimerToZero();
    mainAction();
}

function getComputerChoice() {
    enemy.choice = veryBasicCounter();
    clearInterval(timerInterval);
    enemy.turnDuration = timer.value;
    timer.changeTimerToZero();
}

function updateWins(winner) {
    switch(winner) {
        case "Mängija":
            winsCount.player += 1;
            break;
        case "Arvuti":
            winsCount.enemy += 1;
            break;
        case "Viik":
            winsCount.draw += 1;
            break;
    }
}

function mainAction() {
    startNewTimer("enemyTimer");
    getComputerChoice();
    var winner = getWinner(player, enemy).name;
    clearEnemyMoveHighlight();
    highlightEnemyMove();
    updateWins(winner);
    moveHistory.push(new Move(player, enemy, winner));
    player = new Contestant(player.name, undefined);
    enemy = new Contestant(enemy.name, undefined);
    updateGameStatus();
    updateScoreHistoryDisplay();
    startNewTimer("playerTimer");
}

function toggleGame() {
    var gameToggleButton = document.getElementById("toggleGameState");
    var gameStatus = gameToggleButton.innerHTML;
    gameToggleButton.innerHTML = gameStatus == "Start" ? "Stop" : "Start";
    var playerRock = document.getElementById("playerRock");
    var playerPaper = document.getElementById("playerPaper");
    var playerScissors = document.getElementById("playerScissors");
    if (gameStatus == "Start") {
        if (timer === undefined) {
            startNewTimer("playerTimer");
            totalTimer = new Timer("totalTimer");
            totalTimerInterval = setInterval(function() {
                totalTimer.updateValue();
            }, updateTimersInMillis);
        } else {
            timer.continueTimer();
            timerInterval = setInterval(function() {
                timer.updateValue();
            }, updateTimersInMillis);
            totalTimer.continueTimer();
            totalTimerInterval = setInterval(function() {
                totalTimer.updateValue();
            }, updateTimersInMillis);
        }
        gameState = 1;
        playerRock.classList.remove("disabled");
        playerPaper.classList.remove("disabled");
        playerScissors.classList.remove("disabled");
    } else {
        clearInterval(timerInterval);
        clearInterval(totalTimerInterval);
        gameState = 0;
        playerRock.classList.add("disabled");
        playerPaper.classList.add("disabled");
        playerScissors.classList.add("disabled");
    }
}

function restart() {
    location.reload();
}

function startNewTimer(ID) {
    timer = new Timer(ID);
    timerInterval = setInterval(function() {
        timer.updateValue();
    }, updateTimersInMillis);
}
/*page design logic*/

/*counting starts from 0*/
var numberOfGameResultsToDisplay = 6;

function updateScoreHistoryDisplay() {
    var moveHistoryLastIdx = moveHistory.length - 1;
    var loopEndCondition = numberOfGameResultsToDisplay <= moveHistoryLastIdx ? moveHistoryLastIdx - numberOfGameResultsToDisplay : 0;
    /*var text = "";*/
    var text = "<table style=\"margin-left: auto; margin-right: auto;\"><tr style=\"background: green;\"><td>Nr</td><td>" + player.name + " valik</td><td></td> <td>" + enemy.name + " valik</td><td> </td><td>Võitija nimi</td></tr>";
    var opacity = 1;
    var color = "#20CC20";
    for (i = moveHistoryLastIdx; i >= loopEndCondition; i--) {
        var playerMove = moveHistory[i].player;
        var enemyMove = moveHistory[i].enemy;
        /*text += "<p style=\"opacity: " + opacity + ";\">" + playerMove.name + " " + playerMove.choice.name + " + " + enemyMove.name + " " + enemyMove.choice.name + " = " + moveHistory[i].result + "</p>";*/
        text += "<tr style=\"background: " + color + ";\"><td>" + (i + 1) + "</td><td onmouseover=\"showMoveTime(this, " + i + ", 'player')\" onmouseout=\"hideMoveTime(this, " + i + ", 'player')\">" + playerMove.choice.name + "</td><td>+</td><td onmouseover=\"showMoveTime(this, " + i + ", 'enemy')\" onmouseout=\"hideMoveTime(this, " + i + ", 'enemy')\">" + enemyMove.choice.name + "</td><td>=</td><td>" + moveHistory[i].result + "</td></tr>";
        opacity -= opacity / numberOfGameResultsToDisplay;
        color = color == "#20CC20" ? "#109910" : "#20CC20";
    }
    text += "</table>";
    document.getElementById("scoreHistoryDisplay").innerHTML = text;
}

function updateGameStatus() {
    document.getElementById("gameTotalStatus").innerHTML = "<p>" + player.name + ": "+ winsCount.player + " " + enemy.name + ": " + winsCount.enemy + " " + drawState.name + ": " + winsCount.draw + "</p>";
}

function highlightEnemyMove() {
    switch (enemy.choice.name) {
        case rock.name:
            document.getElementById("enemyRock").style.opacity = 0.7;
            break;
        case paper.name:
            document.getElementById("enemyPaper").style.opacity = 0.7;
            break;
        case scissors.name:
            document.getElementById("enemyScissors").style.opacity = 0.7;
            break;
    }
}

function clearEnemyMoveHighlight() {
    document.getElementById("enemyRock").style.opacity = 1;
    document.getElementById("enemyPaper").style.opacity = 1;
    document.getElementById("enemyScissors").style.opacity = 1;
}

function showMoveTime(element, index, contestant) {
    element.innerHTML = moveHistory[index][contestant].turnDuration + " ms";
}

function hideMoveTime(element, index, contestant) {
    element.innerHTML = moveHistory[index][contestant].choice.name;
}

/*AI*/
function veryBasicCounter() {
    if (moveHistory.length < 3) {
        return choices[Math.floor(Math.random() * choices.length)];
    }
    var playerChoice = moveHistory[moveHistory.length - 1].player.choice;
    var count = 0;
    for (var i = moveHistory.length - 2; i > moveHistory.length - 4; i--) {
        if (moveHistory[i].player.choice == playerChoice) {
            count++;
        } 
    }
    if (count >= 2) {
        return findCounter(playerChoice);
    }
    return choices[Math.floor(Math.random() * choices.length)];
}

function findCounter(choice) {
    var v = choice.value;
    switch (v) {
        case 1:
            return paper;
        case 2:
            return scissors;
        case 3:
            return rock;
        default:
            return rock;
    }
}
