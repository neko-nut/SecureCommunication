onlineUser = []
communications = {}


def get_online_user():
    return onlineUser


def add_online_user(user_id):
    onlineUser.append(user_id)


def remove_online_user(user_id):
    onlineUser.remove(user_id)


def get_communication(user1, user2):
    i = user1 + "," + user2
    return communications[i]


def add_communication(user1, user2):
    com = Communication(user1, user2)
    i = user1 + ',' + user2
    communications[i] = com
    return com


def remove_communication(user1, user2):
    i = user1 + ',' + user2
    communications.pop(i)


class Communication:
    user1 = 0
    user2 = 0
    sentences = []

    def __init__(self, user_1, user_2):
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
