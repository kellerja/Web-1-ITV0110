#!/usr/bin/python
# -*- coding: utf-8 -*-
import cgi, json, random

print "Content-type: text/html"
print

def main():
    formdata = getData()
    evaluateReceivedData(formdata)

def getData():
    return cgi.FieldStorage()

def evaluateReceivedData(data):
    if not data.has_key("id"):
        addNewEntry()
    else:
        findEntry(data["id"])
    if data.has_key("choice"):
        choiceManager(data["choice"].value)
    if data.has_key("getResults"):
        returnResults()
    if data.has_key("setName"):
        setName(data["setName"].value)
    if data.has_key("setDate"):
        setDate(data["setDate"].value)
    saveEntry()

def addNewEntry():
    newId = getNewId()
    entry = Entry()

def findEntry():
    pass

def choiceManager(choice):
    #TODO: make choice to entry
    pass

def writeResultToFile(entry, url="../../../data/prax3/results.txt"):
    file = open(url, "a")
    file.write(makeResultIntoJSON(entry) + "\n")
    file.close()

def makeResultIntoJSON(entry):
    return json.dumps(entry, encoding="utf-8")

def returnResults():
    print readResultsFromFile()

def readResultsFromFile(url="../../../data/prax3/results.txt"):
    file = open(url, "r")
    lines = "[" + ",".join(map(removeNewline, file.readlines())) + "]"
    file.close()
    return lines

def removeNewline(word):
    return word.strip()

def setName(name):
    pass

def setDate(date):
    entry.date = date

def saveEntry():
    pass

def parseResultLine(line):
    decodedLine = json.loads(line)
    return decodedLine

def makeDataIntoObjects(decodedLine):
    moves = [Move(Contender(decodedLine["p1Name"], move["p1"]["choice"], move["p1"]["turnTime"]), Contender(decodedLine["p2Name"], move["p2"]["choice"], move["p2"]["turnTime"]), move["result"]) for move in decodedLine["moves"]]
    p1 = moves[-1].player1
    p2 = moves[-1].player2
    entry = Entry(decodedLine["id"], decodedLine["date"], decodedLine["p1Name"], decodedLine["p2Name"], moves)

def getNewId():
    return 1
    results = readResultsFromFile()
    maxId = 0
    for line in results:
        id = int(line[1:].split(",")[0])
        maxId = max(maxId, id)
    return maxId + 1

entryRow = False
entry = None
p1 = None
p2 = None
moves = None

main()
c1 = '{"choice": "rock", "turnTime": 15}'
c2 = '{"choice": "paper", "turnTime": 77}'
moves = '"moves": [{"p1": ' + c1 + ', "p2": ' + c2 + ', "result": "p2"}]'
parseResultLine('{"id": 1,"date": "2016-14-16","p1Name": "hi","p2Name": "ni", ' + moves + '}')
