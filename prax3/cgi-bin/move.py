import contender

class Move(object):
    def __init__(self, player1, player2, result=None):
        self.player1 = player1
        self.player2 = player2
        self.result = result
    def getAsBasicObjects(self):
        return {
            "player1": self.player1.getAsBasicObjects(),
            "player2": self.player2.getAsBasicObjects(),
            "result": self.result
        }
def getAsObjects(move, p1Name, p2Name):
    return Move(
        contender.getAsObjects(move["player1"], p1Name),
        contender.getAsObjects(move["player2"], p2Name),
        move["result"]
    )
