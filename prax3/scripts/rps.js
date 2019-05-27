var id = -1;
var name = 0;
var turnNumber = 1;
var updateInfoAndElements;

function startUpdateInfo() {
    updateInfoAndElements = setInterval(function() {
        updateElementsAndInfo();
    }, 1000);
}

function initializePlayer() {
    name = document.getElementById("nameInput").value;
    var type = document.getElementById("singelplayer").checked ? 0 : 1;
    var turnsAhead = document.getElementById("turnsAheadInput").value == "" ? 1 : parseInt(document.getElementById("turnsAheadInput").value);
    speakToServer("../cgi-bin/prax3/newEntry.py?name=" + name + "&type=" + type + "&turnsAhead=" + turnsAhead, saveId);
}

function initializePlayer2() {
    name = document.getElementById("nameInput").value;
    var id = parseInt(document.getElementById("idInput").value);
    speakToServer("../cgi-bin/prax3/joinEntry.py?id=" + id + "&name=" + name, changeToGameInProgressScreen);
}

function deleteAd(){
    speakToServer("../cgi-bin/prax3/deleteAd.py?id=" + id);
}

function saveId(newId) {
    id = parseInt(newId);
}

function saveTurnNumber(newTurnNumber) {
    turnNumber = newTurnNumber;
}

function sendChoiceToServer(choice) {
    speakToServer("../cgi-bin/prax3/updateEntry.py?id=" + id + "&name=" + name + "&choice=" + choice + "&turnNumber=" + turnNumber + "&time=" + 0, updateTurn);
}

function updateTurn(response) {
    response = JSON.parse(response);
    if (response.turnNumber != undefined) {
        turnNumber = parseInt(response.turnNumber);
    }
}

function getGameResultList() {
    speakToServer("../cgi-bin/prax3/getMoves.py?id=" + id, placeResultsToHTML)
}

function updateElementsAndInfo() {
    if (id != -1){
        getGameResultList();
    }
}

function placeResultsToHTML(results) {
    saveResultsHistory(JSON.parse(results));
    printResultsTable();
    updateTimers();
    updateTotalScores();
    changeEnemyMovePicture();
}

function getAdsFromServer() {
    speakToServer("../cgi-bin/prax3/getAds.py", placeAdsToHTML);
}

function placeAdsToHTML(response) {
    createAdsTable(JSON.parse(response));
}

function createNewAd() {
    speakToServer("../cgi-bin/prax3/createAd.py?id=" + id);
}

function stopOngoingGame() {
    id = -1;
    name = 0;
    turnNumber = 1;
    clearInterval(updateInfoAndElements);
}

function sendSearchToServer() {
    settings = "name1=" + document.getElementById("searchName1Input").value;
    settings += "&name2=" + document.getElementById("searchName2Input").value;
    settings += "&timeStart=" + document.getElementById("searchTimeStartInput").value;
    settings += "&timeEnd=" + document.getElementById("searchTimeEndInput").value;
    settings += "&type=" + document.getElementById("searchTypeInput").value;
    speakToServer("../cgi-bin/prax3/search.py?" + settings, placeSeachResultsToHTML);
}

function placeSeachResultsToHTML(response) {
    createSearchTable(JSON.parse(response));
}

function speakToServer(url, onReadyStateFunction) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 && onReadyStateFunction != undefined) {
            onReadyStateFunction(xhttp.responseText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
