import entry, json

def getEntriesFromFile(url="../../../data/prax3/results.txt"):
    with (open(url, "r")) as file:
        results = file.readlines()
    return results

def writeEntriesToFile(entries, url="../../../data/prax3/results.txt"):
    with (open(url, "w")) as file:
        for line in entries:
            file.write(json.dumps(line.getAsBasicObjects()) + "\n")

def makeJSONtoEntries(entriesList):
    all_results = []
    for i in range(len(entriesList)):
        result = json.loads(entriesList[i].strip())
        tmp_entry = entry.getAsObjects(result)
        all_results.append(tmp_entry)
    return all_results

def findEntryById(id, entries):
    for i in range(len(entries)):
        if (entries[i].id == id):
            return (i, entries[i])
    return (-1, None)

def getTotalScore(moves):
    p1Wins = 0
    p2Wins = 0
    draws = 0
    for move in moves:
        if move.result == "draw":
            draws += 1
        elif move.result == "p1":
            p1Wins += 1
        elif move.result == "p2":
            p2Wins += 1
    return [p1Wins, p2Wins, draws]
