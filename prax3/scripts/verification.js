function verifyNameInputLive(element) {
}

function isNotUndefined(ob) {
    return !(ob == null || ob == undefined);
}

function isNameCorrect() {
    var name = document.getElementById("nameInput");
    return isNotUndefined(name) && name.value != "";
}

function isTypeChosen() {
    var typeSP = document.getElementById("singelplayer");
    var typeMP = document.getElementById("multiplayer");
    return isNotUndefined(typeSP) && isNotUndefined(typeMP) && (typeSP.checked || typeMP.checked);
}

function isIdCorrect() {
    var id = document.getElementById("idInput");
    return isNotUndefined(id) && /^[0-9]+$/.test(id.value);
}

function isTurnsAheadNumber() {
    var turnsAhead = document.getElementById("turnsAheadInput");
    return turnsAhead.value == "" || !isNaN(parseInt(turnsAhead.value));
}

function isCreateCorrect() {
    return isNameCorrect() && isTypeChosen() && isTurnsAheadNumber();
}

function isJoinCorrect() {
    return isNameCorrect() && isIdCorrect();
}

function isSearchCorrect() {
    var timeStartVerify = document.getElementById("searchTimeStartInput");
    var timeEndVerify = document.getElementById("searchTimeEndInput");
    if (parseFloat(timeStartVerify.value) == timeStartVerify.value) {
        var timeStartInMillis = parseInt(Math.log10(timeStartVerify.value)) === parseInt(Math.log10(new Date().getTime())) ? timeStartVerify.value : timeStartVerify.value * 1000;
    } else {
        var timeStartInMillis = Date.parse(timeStartVerify.value);
    }
    if (parseFloat(timeEndVerify.value) == timeEndVerify.value) {
        var timeEndInMillis = parseInt(Math.log10(timeEndVerify.value)) === parseInt(Math.log10(new Date().getTime())) ? timeEndVerify.value : timeEndVerify.value * 1000;
    } else {
        var timeEndInMillis = Date.parse(timeEndVerify.value);
    }
    if (timeStartVerify.value != "") {
        timeStartVerify.value = timeStartInMillis / 1000;
    }
    if (timeEndVerify.value != "") {
        timeEndVerify.value = timeEndInMillis / 1000;
    }
    return true;
}

function verifySubmitButton(button) {
    if (button === "create") {
        if (isCreateCorrect()) {
            makeBodyGameScreen();
        }
    } else if (button === "join") {
        if (isJoinCorrect()) {
            joinGameInProgress();
        }
    } else if (button === "search") {
        if (isSearchCorrect()) {
            makeSearch();
        }
    }
}
