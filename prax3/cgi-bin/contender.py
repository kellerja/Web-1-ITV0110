class Contender(object):
    def __init__(self, name, choice=None, turn_time=None):
        self.name = name
        self.choice = choice
        self.turn_time = turn_time
    def getAsBasicObjects(self):
        return {
            "choice": self.choice,
            "turnTime": self.turn_time
            }
def getAsObjects(contender, name):
    return Contender(
        name,
        contender["choice"],
        contender["turnTime"]
    )