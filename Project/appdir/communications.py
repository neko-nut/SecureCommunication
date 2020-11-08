communications = {}


def get_communication(user1, user2):
    if user1 < user2:
        if user1 in communications:
            if user2 in communications[user1]:
                return communications[user1][user2]
    else:
        if user2 in communications:
            if user1 in communications[user2]:
                return communications[user2][user1]
    return False


def add_communication(user1, user2):
    com = Communication(user1, user2)
    if user1 < user2:
        if user1 in communications:
            communications[user1][user2] = com
        else:
            communications[user1] = {}
            communications[user1][user2] = com
    else:
        if user2 in communications:
            communications[user2][user1] = com
        else:
            communications[user2] = {}
            communications[user2][user1] = com
    return com


def remove_communication(user1, user2):
    if user1 < user2:
        communications[user1].pop(user2)
    else:
        communications[user2].pop(user1)


class Communication:
    user1 = 0
    user2 = 0
    sentences = []

    def __init__(self, user_1, user_2):
        self.user1 = user_1
        self.user2 = user_2
        self.sentences = []

    def add_sentence(self, sentence, user):
        self.sentences.append({user: sentence})

    def get_sentence(self):
        return self.sentences
