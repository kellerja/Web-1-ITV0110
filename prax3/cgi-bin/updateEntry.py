#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, json, entry, move, contender, ai, time, utils, cgitb

cgitb.enable()

def getWinner(player1, player2):
    drawMessage = "draw"
    player1WinMessage = "p1"
    player2WinMessage = "p2"
    return drawMessage if player1 == player2 else player1WinMessage if player1 == "rock" and player2 == "scissors" or player1 == "paper" and player2 == "rock" or player1 == "scissors" and player2 == "paper" else player2WinMessage

def createNewContender(name):
    return contender.Contender(name)

def isPlayer1Turn(entry, name):
    return name == entry.p1_name

def isGameAgainstAI(entry):
    return entry.type == 0

def makeMove(correct_entry, c1, c2, turnNumber):
    if len(correct_entry.moves) < turnNumber:
        correct_entry.addMove(move.Move(c1, c2))
    else:
        selected_move = correct_entry.moves[turnNumber - 1]
        if isPlayer1Turn(correct_entry, name):
            selected_move.player1 = c1
        else:
            selected_move.player2 = c2
        selected_move.result = getWinner(selected_move.player1.choice, selected_move.player2.choice)
        correct_entry.moves[turnNumber - 1] = selected_move

def get_turns_ahead(entries, name):
    moves = entries.moves
    ahead = 1
    for move in moves:
        if move.result is None and (name == entries.p1_name and move.player2.choice is None) or (name == entries.p2_name and move.player1.choice is None):
            ahead += 1
    return ahead

print("Content-type: text/html\n")

form = cgi.FieldStorage()
url = "../../../data/prax3/results.txt"

if(not ("id" in form and "name" in form and "choice" in form and "turnNumber" in form)):
    print(json.dumps({"turnStatus": False}))
    exit()

id = int(form.getvalue("id"))
name = form.getvalue("name")
choice = form.getvalue("choice")
turnNumber = int(form.getvalue("turnNumber"))
time = time.time()

results = utils.getEntriesFromFile()

all_results = utils.makeJSONtoEntries(results)
row, correct_entry = utils.findEntryById(id, all_results)

c1 = createNewContender(correct_entry.p1_name)
c2 = createNewContender(correct_entry.p2_name)

turns_ahead = get_turns_ahead(correct_entry, name)
if  correct_entry.turns_ahead < turns_ahead or correct_entry.turns_ahead < 1:
    print(json.dumps({"turnStatus": False, "turnNumber": turnNumber}))
    exit() 

if isPlayer1Turn(correct_entry, name):
    c1.choice = choice
    c1.turn_time = time
    if isGameAgainstAI(correct_entry):
        c2.choice = ai.getAiMove()
        c2.turn_time = ai.getAiTime()
        r = getWinner(c1.choice, c2.choice)
        correct_entry.addMove(move.Move(c1, c2, r))
    else:
        makeMove(correct_entry, c1, c2, turnNumber)
else:
    c2.choice = choice
    c2.turn_time = time
    makeMove(correct_entry, c1, c2, turnNumber)

all_results[row] = correct_entry

utils.writeEntriesToFile(all_results)

print(json.dumps({"turnStatus": True, "turnNumber": turnNumber + 1}))
