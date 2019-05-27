#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, json, entry, cgitb

cgitb.enable()

def beautify(line):
    string = ""
    for key in line:
        string += "<li>" + str(key) + ": " + str(line[key]) + "</li>"
    return string

print("Content-type: text/html\n")

form = cgi.FieldStorage()
url = "../../../data/prax3/ads.txt"

read = 0
if ("read" in form):
    read = int(form.getvalue("read"))
clear = 0
if ("clear" in form):
    clear = int(form.getvalue("clear"))

print("<p>SETTINGS: Read: "+str(read)+" Clear: "+str(clear)+"</p>")
if read == 1:
    with(open(url, "r", encoding="UTF-8")) as file:
        lines = file.readlines()
    if len(lines) == 0:
        print("<p>File is empty</p>")
    else:
        for line in lines:
            print("<ul>")
            print(beautify(json.loads(line.strip())))
            print("</ul>")
if clear == 1:
    with(open(url, "w", encoding="UTF-8")) as file:
        file.write("")
