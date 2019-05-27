import random, time

choices = ["rock", "paper", "scissors"]

def getAiMove():
    return choices[random.randint(0, 2)]

def getAiTime():
    return time.time()
