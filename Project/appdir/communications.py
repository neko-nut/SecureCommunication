# the dictionary that store the two users and their communication class
communications = {}


def get_communication(user1, user2):
    """
    first find the user who have smaller id
    then find the user who have larger id
    find the communication class for these two user form the dictionary
    """
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
    """
    if the communication class for these two users are not exist
    create a new class for this two users
    store the class in the dictionary through the user id
    """
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
    """
    delete the current communication
    """
    if user1 < user2:
        communications[user1].pop(user2)
    else:
        communications[user2].pop(user1)


class Communication:
    """
    the communication class that contain the sentences that two user have speak
    identify by the user id
    """
    user1 = 0
    user2 = 0
    sentences = []
    files = []

    """
    create the class through two user ids
    """
    def __init__(self, user_1, user_2):
        self.user1 = user_1
        self.user2 = user_2
        self.sentences = []
        self.files = []

    """
    add new sentences
    """
    def add_sentence(self, sentence, user):
        self.sentences.append({user: sentence})

    """
    return all the sentences
    """
    def get_sentence(self):
        return self.sentences

    """
    add new file
    """
    def add_file(self, file, name):
        self.files.append({name: file})
        print(self.files)

    """
    return all the sentences
    """
    def get_file(self):
        print(self.files)
        return self.files

