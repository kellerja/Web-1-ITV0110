import contender, move

class Entry():
    def __init__(self, id, date=None, p1_name=None, p2_name=None, moves=[], game_type=0, advertise=False, turns_ahead=1):
        self.type = game_type
        self.id = id
        self.date = date
        self.p1_name = p1_name
        self.p2_name = p2_name
        self.moves = moves
        self.advertise = advertise
        self.turns_ahead = turns_ahead
    def addDate(self, date):
        self.date = date
    def addP1Name(self, name):
        self.p1_name = name
    def addP2Name(self, name):
        self.p2_name = name
    def addMoves(self, moves):
        self.moves = moves
    def addMove(self, move):
        self.moves.append(move)
    def getAsBasicObjects(self):
        return {
            "id": self.id,
            "type": self.type,
            "date": self.date,
            "p1Name": self.p1_name,
            "p2Name": self.p2_name,
            "moves": [m.getAsBasicObjects() for m in self.moves],
            "advertise": self.advertise,
            "turnsAhead": self.turns_ahead
        }
    def getAsBasicObjectsPublic(self):
        return {
            "id": self.id,
            "type": self.type,
            "date": self.date,
            "p1Name": self.p1_name,
            "p2Name": self.p2_name,
            "moves": [m.getAsBasicObjects() for m in self.moves if m.result is not None],
            "advertise": self.advertise,
            "turnsAhead": self.turns_ahead
        }
def getAsObjects(entryAsBasicObjects):
    return Entry(
        entryAsBasicObjects["id"],
        entryAsBasicObjects["date"],
        entryAsBasicObjects["p1Name"],
        entryAsBasicObjects["p2Name"],
        [move.getAsObjects(m, entryAsBasicObjects["p1Name"], entryAsBasicObjects["p2Name"]) for m in entryAsBasicObjects["moves"]],
        entryAsBasicObjects["type"],
        entryAsBasicObjects["advertise"],
        entryAsBasicObjects["turnsAhead"]
    )
