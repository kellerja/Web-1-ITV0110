#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, json, entry, move, time, cgitb, utils

cgitb.enable()

def getAsyncMoves():
    new_moves = []
    times = []
    for i in range(len(current_entry.moves)):
        move = current_entry.moves[i]
        if move.player1.choice == None or move.player2.choice == None:
            break
        prev_move_time_p1 = current_entry.moves[i-1].player1.turn_time if i != 0 else current_entry.date
        prev_move_time_p2 = current_entry.moves[i-1].player2.turn_time if i != 0 else current_entry.date
        time = [int(move.player1.turn_time - prev_move_time_p1)]
        time.append(int(move.player2.turn_time - prev_move_time_p2))
        times.append(time)
        new_moves.append(move)
    even_newer_moves = []
    for i in range(len(new_moves)):
        move = new_moves[i]
        move.player1.turn_time = times[i][0]
        move.player2.turn_time = times[i][1]
        even_newer_moves.append(move.getAsBasicObjects())
    return even_newer_moves

def findLatestDoneMoves(c_moves):
    p1 = -1
    p2 = -1
    for i in range(len(c_moves)):
        m = c_moves[i]
        if m.player1.choice != None:
            p1 += 1
        if m.player2.choice != None:
            p2 += 1
    return p1, p2

print("Content-type: text/html\n")

form = cgi.FieldStorage()
url = "../../../data/prax3/results.txt"

if (not "id" in form):
    exit()
id = int(form.getvalue("id"))

with (open(url, "r")) as file:
    for line in file:
        current_entry = entry.getAsObjects(json.loads(line.strip()))
        if (current_entry.id == id):
            break

totalTime = int(time.time() - float(current_entry.date))
p1LastMoveIdx, p2LastMoveIdx = findLatestDoneMoves(current_entry.moves)
p1LastTurnTimestamp = float(current_entry.moves[p1LastMoveIdx].player1.turn_time) if p1LastMoveIdx > -1 else current_entry.date
p2LastTurnTimestamp = float(current_entry.moves[p2LastMoveIdx].player2.turn_time) if p2LastMoveIdx > -1 else current_entry.date
p1Time = int(time.time() - p1LastTurnTimestamp)
p2Time = int(time.time() - p2LastTurnTimestamp)

totalScore = utils.getTotalScore(current_entry.moves)

print(json.dumps({"player1": current_entry.p1_name, "player2": current_entry.p2_name, "moves": getAsyncMoves(), "totalTime": totalTime, "player1Time": p1Time, "player2Time": p2Time, "p1Wins": totalScore[0], "p2Wins": totalScore[1], "draws": totalScore[2]}))
