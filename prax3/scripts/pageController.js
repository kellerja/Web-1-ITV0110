var body = document.body;
var menuDuringGameplay = '<div class="menu">\
<button onclick="returnToHomeScreen()">Main screen</button>\
<button onclick="makeGameAdvertisable()">Make advertisable</button>\
</div>';
var menuBeforeGameplay = '<div class="menu">\
<button onclick="placeFormToPreGameMenu()">Create</button>\
<button onclick="placeFormToJoinOngoingGame()">Join</button>\
<button onclick="placeAdsToJoinIngoingGame()">Ads</button>\
<button onclick="placeFormOfSearch()">Search</button>\
</div>';
var beforeGameplayForm = '<form id="newGameForm">\
<label>Name: <input type="text" id="nameInput" placeholder="Name" autocomplete="off" onkeydown="verifyNameInputLive(this)"></label><br>\
<label>Play against:<br>\
<input type="radio" name="type" value="vsAI" id="singelplayer" checked>Computer<br>\
<input type="radio" name="type" value="vsPlayer" id="multiplayer">Player\
</label><br>\
<label>Turns ahead:<br>\
<input type="number" id="turnsAheadInput" placeholder="1" autocomplete="off"></input>\
</label><br>\
<button type="button" onclick=verifySubmitButton("create") class="submit">Submit</button></form>';
var joinOngoingGameForm = '<form id="joinGameForm">\
<label>Name: <input type="text" id="nameInput" placeholder="Name" autocomplete="off" onkeydown="verifyNameInputLive(this)"></label><br>\
<label>Id: <input type="text" id="idInput" placeholder="Game ID" autocomplete="off"></label><br>\
<button type="button" onclick=verifySubmitButton("join") class="submit">Submit</button>\
</form>';
var searchForm = '<form id="searchForm">\
<label>Name to filter: \
<input type="text" id="searchName1Input" autocomplete="off" placeholder="Name 1"></input>\
</label>\
<label>Other name to filter: \
<input type="text" id="searchName2Input" autocomplete="off" placeholder="Name 2"></input>\
</label><br>\
<label>Time range start: \
<input type="text" id="searchTimeStartInput" autocomplete="off" placeholder="Start time"></input>\
</label>\
<label>Time range end: \
<input type="text" id="searchTimeEndInput" autocomplete="off" placeholder="End time"></input>\
</label><br>\
<label>Type filter: \
<select id="searchTypeInput">\
<option value="">Any</option>\
<option value="0">Singelplayer</option>\
<option value="1">Multiplayer</option>\
</select>\
</label><br>\
<button type="button" onclick=verifySubmitButton("search") class="submit">Submit</button>\
</form>';
var joinGameWithAdsForm = '<form id="joinGameForm">\
<label>Name: <input type="text" id="nameInput" placeholder="Name" autocomplete="off" onkeydown="verifyNameInputLive(this)"></label><br>\
<label style="display: none">Id: <input style="display: none" type="text" id="idInput" placeholder="Game ID"></label><br>\
<button type="button" onclick=verifySubmitButton("join") class="submit">Submit</button>\
</form>';
var playerDisplay = '<div class="playerDisplay">\
<h3 id="playerNameDisplay">Player 1</h3>\
<img src="images/rock.png" alt="Kivi" class="choiceHolder player" id="playerRock" onclick="sendChoiceToServer(\'rock\')" onmouseover="changePictureOnHover(this)" onmouseout="changePictureOnHover(this)"/>\
<img src="images/paper.png" alt="Paber" class="choiceHolder player" id="playerPaper" onclick="sendChoiceToServer(\'paper\')" onmouseover="changePictureOnHover(this)" onmouseout="changePictureOnHover(this)"/>\
<img src="images/scissors.png" alt="Käärid" class="choiceHolder player" id="playerScissors" onclick="sendChoiceToServer(\'scissors\')" onmouseover="changePictureOnHover(this)" onmouseout="changePictureOnHover(this)"/>\
<div class="timerHolder">\
<p>Timer:</p>\
<div id="playerTimer">\
<p>00:00</p>\
</div>\
</div>\
</div>';
var enemyDisplay = '<div class="enemyDisplay">\
<h3 id="enemyDisplayName">Player 2</h3>\
<img src="images/rock.png" alt="Kivi" id="enemyRock" class="choiceHolder"/>\
<img src="images/paper.png" alt="Paber" id="enemyPaper" class="choiceHolder"/>\
<img src="images/scissors.png" alt="Käärid" id="enemyScissors" class="choiceHolder"/>\
<div class="timerHolder">\
<p>Timer:</p>\
<div id="enemyTimer">\
<p>00:00</p>\
</div>\
</div>\
</div>';
var scoreDisplay = '<div class="scoreDisplay">\
<div>\
<h3>Skoor</h3>\
<div id="gameTotalStatus"></div>\
</div>\
</div>';
var totalTimeDisplay = '<div class="totalTimeDisplay">\
<h3>Aega kulunud</h3>\
<div id="totalTimer">\
<p>00:00</p>\
</div>\
</div>';
var resultDisplay = '<div class="resultDisplay">\
<div>\
<h3>Tulemused</h3>\
<div id="scoreHistoryDisplay"></div>\
</div>\
</div>';
var content = '<div class="content">' +
playerDisplay + 
enemyDisplay + 
scoreDisplay + 
totalTimeDisplay + 
resultDisplay +
'</div>';
var script = '<script src="scripts/pageController.js"></script>';
var preGameScreen = menuBeforeGameplay + script;
var gameScreen = menuDuringGameplay + content + script;

var resultsHistory;
var playerNames = ["Player1", "Player2"];
var timers = [0, 0, 0];
var resultMap = {"p1": playerNames[0] + " wins", "p2": playerNames[1] + " wins", "draw": "draw"}
var totalScores = [0, 0, 0];

function printResultsTable() {
    document.getElementById("scoreHistoryDisplay").innerHTML = createResultsTable(resultsHistory);
}

function parseTimeFromSeconds(seconds) {
    return {"hours": parseInt(seconds / 3600), "minutes": parseInt(seconds / 60 % 60), "seconds": parseInt(seconds % 60)};
}

function showHours(hours) {
    return hours >= 3600;
}

function isZeroRequired(time) {
    return time < 10;
}

function makeTimeFormat(idx) {
    var display = "";
    if (showHours(timers[idx].hours)) {
        display += timers[idx].hours + ":";
    }
    display += isZeroRequired(timers[idx].minutes) ? "0" : "";
    display += timers[idx].minutes + ":";
    display += isZeroRequired(timers[idx].seconds) ? "0" : "";
    display += timers[idx].seconds;
    return display;
}

function updateTimers() {
    var player1Timer = name == playerNames[0] ? "playerTimer" : "enemyTimer";
    var player2Timer = player1Timer == "playerTimer" ? "enemyTimer" : "playerTimer";
    var display = makeTimeFormat(1);
    document.getElementById(player1Timer).innerHTML = "<p>" + display + "</p>";
    display = makeTimeFormat(2);
    document.getElementById(player2Timer).innerHTML = "<p>" + display + "</p>";
    display = makeTimeFormat(0);
    document.getElementById("totalTimer").innerHTML = "<p>" + display + "</p>";
}

function updateTotalScores() {
    var scores = name + ": ";
    var player1Score = name == playerNames[0] ? totalScores[0] : totalScores[1];
    scores += player1Score;
    var player2Score = name == playerNames[0] ? totalScores[1] : totalScores[0];
    var enemyName = name == playerNames[0] ? playerNames[1] : playerNames[0];
    scores += " " + enemyName + ": " + player2Score + " Draws: " + totalScores[2];
    document.getElementById("gameTotalStatus").innerHTML = "<p>"+scores+"</p>";
}

function saveResultsHistory(resultsHistoryFromServer) {
    resultsHistory = resultsHistoryFromServer.moves;
    playerNames = [resultsHistoryFromServer.player1, resultsHistoryFromServer.player2];
    totalScores = [resultsHistoryFromServer.p1Wins, resultsHistoryFromServer.p2Wins, resultsHistoryFromServer.draws];
    if (playerNames[1] != null) {
        document.getElementById("enemyDisplayName").innerHTML = playerNames[0] == name ? playerNames[1] : playerNames[0];
        resultMap.p1 = playerNames[0] + " wins";
        resultMap.p2 = playerNames[1] + " wins";
    }
    timers = [
        parseTimeFromSeconds(parseInt(resultsHistoryFromServer.totalTime)),
         parseTimeFromSeconds(parseInt(resultsHistoryFromServer.player1Time)),
          parseTimeFromSeconds(parseInt(resultsHistoryFromServer.player2Time))
          ];
}

function createResultsTable(resultHistory) {
    return "<table style=\"margin-left: auto; margin-right: auto;\">" + createResultsRows(resultHistory) + "</table>";
}

function createResultsRows(resultHistory) {
    var color = "#20CC20";
    var numberOfEntriesToDisplay = resultHistory.length <= 5 ? 0 : resultHistory.length - 5;
    var rows = "<tr style=\"background: #109910\"><td>Nr</td><td>"+playerNames[0]+"</td><td></td><td>"+playerNames[1]+"</td><td></td><td>Result</td></tr>";
    for (var i = resultHistory.length - 1; i >= numberOfEntriesToDisplay; i--) {
        rows += "<tr style=\"background: "+color+"\">" + createRowData(resultHistory[i], i+1) + "</tr>";
        color = color == "#20CC20" ? "#109910" : "#20CC20";
    }
    return rows;
}

function createRowData(row, turnNumber) {
    return "<td>"+turnNumber+
    "</td><td onmouseover=\"switchResultsHistoryTableDataCellValue(this, 'player1', "+(turnNumber-1)+", 'turnTime')\" onmouseout=\"switchResultsHistoryTableDataCellValue(this, 'player1', "+(turnNumber-1)+", 'choice')\">"+
    row.player1.choice+
    "</td><td>+</td><td onmouseover=\"switchResultsHistoryTableDataCellValue(this, 'player2', "+(turnNumber-1)+", 'turnTime')\" onmouseout=\"switchResultsHistoryTableDataCellValue(this, 'player2', "+(turnNumber-1)+", 'choice')\">"+
    row.player2.choice+
    "</td><td>=</td><td>"+ resultMap[row.result] +"</td>";
}

function switchResultsHistoryTableDataCellValue(element, invoker, turnNumber, call, index) {
    if (index === undefined) {
        element.innerHTML = resultsHistory[parseInt(turnNumber)][invoker][call];
    } else {
        element.innerHTML = resultsHistory[parseInt(index)].moves[parseInt(turnNumber)][invoker][call];
    }
}

function makeBodyPreGameScreen() {
    body.innerHTML = preGameScreen;
}

function makeBodyGameScreen() {
    initializePlayer();
    body.innerHTML = gameScreen;
    startUpdateInfo();
    document.getElementById("playerNameDisplay").innerHTML = name;
}

function joinGameInProgress() {
    initializePlayer2();
}

function makeSearch() {
    sendSearchToServer();
}

function changeEnemyMovePicture() {
    changeEnemyMovePictureToDefault();
    if (resultsHistory.length > 0) {
        var move = name == playerNames[0] ? resultsHistory[resultsHistory.length - 1].player2.choice : resultsHistory[resultsHistory.length - 1].player1.choice;
    } else {
        var move = "";
    }
    if (move == "rock") {
        document.getElementById("enemyRock").src="images/rockHand.png";
    } else if (move == "paper") {
        document.getElementById("enemyPaper").src="images/paperHand.png";
    } else if (move == "scissors") {
        document.getElementById("enemyScissors").src="images/scissorsHand.png";
    }
}

function changeEnemyMovePictureToDefault() {
    document.getElementById("enemyRock").src="images/rock.png";
    document.getElementById("enemyPaper").src="images/paper.png";
    document.getElementById("enemyScissors").src="images/scissors.png";
}

function createSearchTable(response) {
    resultsHistory = response;
    table = "<table style=\"margin-right: auto; margin-left: auto;\">";
    table += createSearchTableRows(response);
    table += "</table>"
    document.getElementById("searchResult").innerHTML = table;
}

function createSearchTableRows(response) {
    var color = "#20CC20";
    var rows = "<tr style=\"background: #109910;\"><td>Id</td><td>Type</td><td>Player 1</td><td>Player 2</td><td>Start date</td></tr>";
    for (row in response) {
        rows += "<tr style=\"background: "+color+";\" onclick=\"createMovesTable("+row+")\">"+createSearchTableDataCell(response[row])+"</tr>";
        color = color == "#20CC20" ? "#109910" : "#20CC20";
    }
    return rows;
}

function createSearchTableDataCell(row) {
    var player2Name = row.p2Name == null ? "" : row.p2Name;
    var gameType = row.type == 0 ? "Against AI" : "Agains Player";
    var date = new Date(row.date * 1000);
    return "<td>"+row.id+"</td><td>"+gameType+"</td><td>"+row.p1Name+"</td><td>"+player2Name+"</td><td>"+date+"</td>";
}

function createMovesTable(index) {
    var table = "<table style=\"margin-right: auto; margin-left: auto;\">";
    table += createMovesTableRows(resultsHistory[index], index);
    table += "</table>";
    document.getElementById("movesHistory").innerHTML = table;
    createMovesTotalResultsTable(index);
}

function createMovesTableRows(results, index) {
    var moves = results.moves;
    var color = "#20CC20";
    var rows = "<tr style=\"background: #109910;\"><td>Nr</td><td>"+results.p1Name+"'s choice</td><td>"+results.p2Name+"'s choice</td><td>Result</td></tr>";
    var lastTurnP1Timestamp = resultsHistory[index].date;
    var currentTurnP1Timestamp;
    var lastTurnP2Timestamp = resultsHistory[index].date;
    var currentTurnP2Timestamp;
    for (row in moves) {
        if (resultsHistory[index].moves[row].player1.turnTime > (new Date().getTime() / 10000)) {
            currentTurnP1Timestamp = resultsHistory[index].moves[row].player1.turnTime;
            currentTurnP2Timestamp = resultsHistory[index].moves[row].player2.turnTime;
            resultsHistory[index].moves[row].player1.turnTime = parseInt(currentTurnP1Timestamp - lastTurnP1Timestamp) + " s";
            resultsHistory[index].moves[row].player2.turnTime = parseInt(currentTurnP2Timestamp - lastTurnP2Timestamp) + " s";
        }
        lastTurnP1Timestamp = currentTurnP1Timestamp;
        lastTurnP2Timestamp = currentTurnP2Timestamp;      
        rows += "<tr style=\"background: "+color+"\">"+createMovesTableDateCell(moves[row], row, results.p1Name, results.p2Name, index)+"</tr>";
        color = color == "#20CC20" ? "#109910" : "#20CC20";
    }
    return rows;
}

function createMovesTableDateCell(row, rowIdx, name1, name2, index) {
    var result = row.result == "draw" ? row.result : row.result == "p1" ? name1 + " wins" : name2 + " wins";
    return "<td>"+(parseInt(rowIdx)+1)+"</td><td onmouseover=\"switchResultsHistoryTableDataCellValue(this, 'player1', "+rowIdx+", 'turnTime', "+index+")\" \
    onmouseout=\"switchResultsHistoryTableDataCellValue(this, 'player1', "+rowIdx+", 'choice', "+index+")\">"
    +row.player1.choice+"</td><td onmouseover=\"switchResultsHistoryTableDataCellValue(this, 'player2', "+rowIdx+", 'turnTime', "+index+")\" \
    onmouseout=\"switchResultsHistoryTableDataCellValue(this, 'player2', "+rowIdx+", 'choice', "+index+")\">"
    +row.player2.choice+"</td><td>"
    +result+"</td>";
}

function createMovesTotalResultsTable(index) {
    var table = "<table style=\"margin-right: auto; margin-left: auto;\">";
    table += createMovesTotalResultsTableRows(resultsHistory[index], index);
    table += "</table>";
    document.getElementById("totalScoresFromHistory").innerHTML = table;
}

function createMovesTotalResultsTableRows(results, index) {
    var rows = "<tr style=\"background: #109910\"><td>"+results.p1Name+" wins</td><td>"+results.p2Name+" wins</td><td>Draws</td></tr>";
    var totalScores = getTotalScores(results);
    rows += "<tr><td>"+totalScores[0]+"</td><td>"+totalScores[1]+"</td><td>"+totalScores[2]+"</td></tr>";
    return rows;
}

function getTotalScores(results) {
    var moves = results.moves;
    var p1Wins = 0;
    var p2Wins = 0;
    var draws = 0;
    for (move in moves) {
        var m = moves[move];
        if (m.result == "p2") {
            p2Wins++;
        } else if (m.result == "p1") {
            p1Wins++;
        } else if (m.result == "draw") {
            draws++;
        }
    }
    return [p1Wins, p2Wins, draws];
}

function placeAdsToJoinIngoingGame() {
    makeBodyPreGameScreen();
    body.innerHTML += "<div id=\"ads\" class=\"resultDisplay\" style=\"width: 99.5%;\"></div>";
    body.innerHTML += "<div id=\"joinWithAds\" style=\"width: 99.5%;\"></div>";
    getAdsFromServer();
}

function createAdsTable(response) {
    var table = "<table style=\"margin-right: auto; margin-left: auto;\">";
    table += createAdsTableRows(response);
    table += "</table>";
    document.getElementById("ads").innerHTML = table;
}

function createAdsTableRows(response) {
    rows = "<tr style=\"background: #109910\"><td>Id</td><td>Opponent name</td><td>Turns ahead</td><td>Game creation date</td></tr>";
    color = "#20CC20";
    for (row in response) {
        record = response[row];
        rows += "<tr style=\"background: "+color+"\" onclick=\"makeJoinGameWithAdsForm("+record.id+")\">" + createAdsTableCellData(record) + "</tr>";
        color = color == "#20CC20" ? "#109910" : "#20CC20";
    }
    return rows;
}

function createAdsTableCellData(record) {
    return "<td>"+record.id+"</td><td>"+record.name+"</td><td>"+record.turnsAhead+"</td><td>"+new Date(record.date)+"</td>";
}

function makeJoinGameWithAdsForm(id) {
    document.getElementById("joinWithAds").innerHTML = joinGameWithAdsForm;
    document.getElementById("idInput").value = id;
}

function changeToGameInProgressScreen(response) {
    var data = response.split(" ");
    var turnNumber = parseInt(data[1]);
    var id = parseInt(document.getElementById("idInput").value);
    if (id === parseInt(data[0])) {
        saveId(id);
        saveTurnNumber(turnNumber);
        body.innerHTML = gameScreen;
        startUpdateInfo();
        document.getElementById("playerNameDisplay").innerHTML = name;
        deleteAd();
    } else {
        console.log("Game with id " + id + " not found");
    }
}

function placeFormToPreGameMenu() {
    makeBodyPreGameScreen();
    body.innerHTML += beforeGameplayForm;
}

function isInstanceOfFormInBody(form) {
    return document.getElementById(form) == undefined;
}

function placeFormToJoinOngoingGame() {
    makeBodyPreGameScreen();
    body.innerHTML += joinOngoingGameForm;
}

function placeFormOfSearch() {
    makeBodyPreGameScreen();
    body.innerHTML += searchForm;
    body.innerHTML += "<div id=\"searchResult\" class=\"resultDisplay\" style=\"width: 99.5%;\"></div>";
    body.innerHTML += "<div id=\"totalScoresFromHistory\" class=\"resultDisplay\" style=\"width: 99.5%\"></div>";
    body.innerHTML += "<div id=\"movesHistory\" class=\"resultDisplay\" style=\"width: 99.5%\"></div>";
}

function returnToHomeScreen() {
    stopOngoingGame();
    resultsHistory = undefined;
    playerNames = ["Player1", "Player2"];
    timers = [0, 0, 0];
    resultMap = {"p1": playerNames[0] + " wins", "p2": playerNames[1] + " wins", "draw": "draw"}
    totalScores = [0, 0, 0];
    makeBodyPreGameScreen();
}

function makeGameAdvertisable() {
    createNewAd();
}

function changePictureOnHover(element) {
    element.src = getImageSourceMapping()[parseImageSource(element.src)];
}

function parseImageSource(fullSource) {
    return "images" + fullSource.replace(/.+\/images/, "");
}

function getImageSourceMapping() {
    var imageSourceMapping = {
        "images/rock.png": "images/rockHand.png",
        "images/paper.png": "images/paperHand.png",
        "images/scissors.png": "images/scissorsHand.png"
    };
    for (key in imageSourceMapping) {
        imageSourceMapping[imageSourceMapping[key]] = key;
    }
    return imageSourceMapping;
}

makeBodyPreGameScreen();
