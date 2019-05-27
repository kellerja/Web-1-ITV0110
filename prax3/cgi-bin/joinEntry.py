#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, json, entry, utils

print("Content-type: text/html\n")

form = cgi.FieldStorage()

id = -1
if ("id" in form):
    id = int(form.getvalue("id"))
name = "Player2"
if ("name" in form):
    name = form.getvalue("name")
turnNumber = 1

entries = utils.makeJSONtoEntries(utils.getEntriesFromFile())

row, selected_entries = utils.findEntryById(id, entries)

if (row != -1):
    if (selected_entries.p2_name == None and selected_entries.p1_name != name):
        selected_entries.p2_name = name
    elif selected_entries.p2_name != name and selected_entries.p1_name != name:
        id = -1

    entries[row] = selected_entries
else:
    id = -1

if id != -1:
    if selected_entries.p1_name == name:
        i = -1
        for i in range(len(selected_entries.moves)):
            move = selected_entries.moves[i]
            if move.player1.choice == None:
                i -= 1
                break
        turnNumber = i + 2
    else:
        i = -1
        for i in range(len(selected_entries.moves)):
            move = selected_entries.moves[i]
            if move.player2.choice == None:
                i -= 1
                break
        turnNumber = i + 2

utils.writeEntriesToFile(entries)

print(id, turnNumber)
