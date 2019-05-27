#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, json, utils

print("Content-type: text/html\n")

form = cgi.FieldStorage()
url = "../../../data/prax3/ads.txt"

if "id" not in form:
    exit()

id = int(form.getvalue("id"))

ads = [json.loads(data.strip()) for data in utils.getEntriesFromFile(url)]

new_ads = ""
for i in range(len(ads)):
    ad = ads[i]
    if ad["id"] != id:
        new_ads += json.dumps(ad) + "\n"

with (open(url, "w", encoding="UTF-8")) as file:
    file.write(new_ads)
