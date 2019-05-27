#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, json, utils

print("Content-type: text/html\n")

form = cgi.FieldStorage()
url = "../../../data/prax3/ads.txt"

print(json.dumps([json.loads(x.strip()) for x in utils.getEntriesFromFile(url)]))
