#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, json, entry, utils

def filterNames(entries, name1, name2):
    new_entries = []
    for record in entries:
        if name1 == "" and name2 == "":
            new_entries.append(record)
        elif name1 == "" and (name2 == record.p1_name or name2 == record.p2_name):
            new_entries.append(record)
        elif name2 == "" and (name1 == record.p1_name or name2 == record.p2_name):
            new_entries.append(record)
        elif name1 == record.p1_name and name2 == record.p2_name or name1 == record.p2_name and name2 == record.p1_name:
            new_entries.append(record)
    return new_entries

def filterTime(entries, start, end):
    new_entries = []
    save_end = end
    for record in entries:
        end = save_end
        last_move = (int(record.moves[-1].player1.turn_time) if record.moves[-1].player1.turn_time != None else int(record.moves[-1].player2.turn_time)) if len(record.moves) > 0 else 0
        if end < 0:
            end = last_move + 1 
        if record.date >= start and last_move < end:
            new_entries.append(record)
    return new_entries

def filterType(entries, game_type):
    new_entries = []
    for record in entries:
        if game_type < 0:
            new_entries.append(record)
        elif game_type == record.type:
            new_entries.append(record)
    return new_entries

print("Content-type: text/html\n")

form = cgi.FieldStorage()

filter_name_1 = ""
if "name1" in form:
    filter_name_1 = form.getvalue("name1")
filter_name_2 = ""
if "name2" in form:
    filter_name_2 = form.getvalue("name2")
filter_time_start = 0
if "timeStart" in form:
    filter_time_start = form.getvalue("timeStart")
filter_time_end = -1
if "timeEnd" in form:
    filter_time_end = form.getvalue("timeEnd")
filter_type = -1
if "type" in form:
    filter_type = form.getvalue("type")

try:
    filter_time_start = int(filter_time_start)
except ValueError:
    filter_time_start = 0
try:
    filter_time_end = int(filter_time_end)
except ValueError:
    filter_time_end = -1
try:
    filter_type = int(filter_type)
except ValueError:
    filter_type = -1

entries_list = utils.getEntriesFromFile()
entries = utils.makeJSONtoEntries(entries_list)

entries = filterNames(entries, filter_name_1, filter_name_2)
entries = filterTime(entries, filter_time_start, filter_time_end)
entries = filterType(entries, filter_type)

print(json.dumps([e.getAsBasicObjectsPublic() for e in entries]))
