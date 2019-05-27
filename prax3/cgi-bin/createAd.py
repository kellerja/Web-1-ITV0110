#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, json, utils

print("Content-type: text/html\n")

form = cgi.FieldStorage()
url = "../../../data/prax3/ads.txt"

if "id" not in form:
    exit()

id = int(form.getvalue("id"))

entries = utils.makeJSONtoEntries(utils.getEntriesFromFile())

row, entry = utils.findEntryById(id, entries)

if (entry.type != 1 or entry.p2_name is not None):
    exit()
for a in utils.getEntriesFromFile(url):
    a = json.loads(a)
    if a["id"] == id:
        exit()

with (open(url, "a", encoding="UTF-8")) as file:
    file.write(json.dumps({"id": id, "name": entry.p1_name, "date": entry.date, "turnsAhead": entry.turns_ahead}) + "\n")
