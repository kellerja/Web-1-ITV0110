#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, json, entry, time

print("Content-type: text/html\n")

form = cgi.FieldStorage()
url = "../../../data/prax3/results.txt"

with (open(url, "r")) as file:
    id = len(file.readlines())

if (not "name" in form):
    exit()
name = form.getvalue("name")
game_type = 0
if ("type" in form):
    game_type = int(form.getvalue("type"))
turns_ahead = 1
if ("turnsAhead" in form):
    turns_ahead = int(form.getvalue("turnsAhead"))

if game_type == 0:
    new_entry = entry.Entry(id, time.time(), name, "Computer", game_type=game_type, turns_ahead=turns_ahead)
else:
    new_entry = entry.Entry(id, time.time(), name, game_type=game_type, turns_ahead=turns_ahead)    

with (open(url, "a")) as file:
    file.write(json.dumps(new_entry.getAsBasicObjects()) + "\n")

print(id)
