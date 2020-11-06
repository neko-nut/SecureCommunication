import random

onlineUser = []
communications = []


def get_online_user():
    return onlineUser


def add_online_user(user_id):
    onlineUser.append(user_id)


def remove_online_user(user_id):
    onlineUser.remove(user_id)


def getCommunicate()

class Communicate:
    key = 0
    user1 = 0
    user2 = 0
    sentences = []

    def __init__(self, user_1, user_2):
        self.key = random.randint(0, 2147483647)
        self.user1 = user_1
        self.user2 = user_2
        self.sentences = []

    def add_sentence(self, sentence, user):
        if user == self.user1:
            speaker = 1
        else:
            speaker = 2
        self.sentences.append({speaker: sentence})

    def get_sentence(self):
        return self.sentences
