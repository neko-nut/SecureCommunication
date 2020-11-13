from flask import render_template, session, url_for, flash, redirect, jsonify
from flask import request
from werkzeug.security import check_password_hash
from appdir import db

from appdir import application
from appdir.forms import LoginForm, RegisterForm, CommunicateForm
from appdir.models import User
from appdir.communications import get_communication, add_communication


@application.route('/')
@application.route('/login', methods=['GET', 'POST'])
def login():
    """
    The login functions
    We initially choose the user himself as the people he talk to
    Check the user name and the password
    store the user id in the session
    """
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(name=form.username.data).first()
        if not user:
            flash("Username or password is incorrect, please try again")
            return redirect('login')
        elif not form.password.data == user.password:
            flash("Username or password is incorrect, please try again")
            return redirect('login')
        else:
            session["USERID"] = user.id
            session["SPEAKER"] = user.id
            return redirect(url_for('user_list'))
    return render_template("login.html", form=form)


@application.route('/logout')
def logout():
    """
    logout
    """
    session.pop("USERID", None)
    session.pop("SPEAKER", None)
    flash("You have logout")
    return redirect(url_for('login'))


@application.route('/register', methods=['GET', 'POST'])
def register():
    """
    Register as a new user
    Encrpted the password
    """
    form = RegisterForm()
    if form.validate_on_submit():
        if form.password.data != form.repeat_pwd.data:
            flash('Inconsistent Password')
            return redirect('register')
        elif User.query.filter_by(name=form.username.data).first():
            flash('Username is occupied, please choose another one.')
            return redirect('register')
        else:
            db.session.add(
                User(name=form.username.data, password=form.password.data, phone=form.phone.data,
                     email=form.email.data))
            db.session.commit()
            return redirect(url_for("login"))
    return render_template('register.html', form=form)


@application.route('/list', methods=['GET', 'POST'])
def user_list():
    """
    Show the list of users and the text inout
    the core communication page
    """
    user1 = int(session['USERID'])
    user2 = int(session['SPEAKER'])
    if get_communication(user1, user2) is False:
        add_communication(user1, user2)
    return render_template('list.html', onlines=User.query.all())


@application.route('/addsentence',  methods=['GET', 'POST'])
def add_sentence():
    """
    get the user and speaker form session
    find the communication class
    add the sentence into the class by the method in the class
    """
    id1 = int(session["USERID"])
    id2 = int(session["SPEAKER"])
    com = get_communication(id1, id2)
    com.add_sentence(request.form['sentence'], session["USERID"])
    return jsonify({"success": 1})


@application.route('/addfile',  methods=['GET', 'POST'])
def add_file():
    """
    get the user and speaker form session
    find the communication class
    add the file into the class by the method in the class
    """
    id1 = int(session["USERID"])
    id2 = int(session["SPEAKER"])
    com = get_communication(id1, id2)
    com.add_file(request.form['file'], request.form["name"])
    return jsonify({"success": 1})


@application.route("/getfile")
def get_file():
    """
    get the files between these two users from the communication class
    """
    id1 = int(session["USERID"])
    id2 = int(session["SPEAKER"])
    com = get_communication(id1, id2)
    print(com.get_file())
    return jsonify(com.get_file())


@application.route("/changespeaker", methods=['GET', 'POST'])
def change_speaker():
    """
    if we choose another speaker
    change the data in the session
    if no communication class for these two users, creat one
    """
    speaker = request.args.get("speaker")
    session["SPEAKER"] = speaker
    id1 = int(session["USERID"])
    id2 = int(session["SPEAKER"])
    if get_communication(id1, id2) is False:
        add_communication(id1, id2)
    return jsonify({"success": 1})


@application.route("/getsentence")
def get_sentence():
    """
    get the sentences between these two users from the communication class
    """
    id1 = int(session["USERID"])
    id2 = int(session["SPEAKER"])
    com = get_communication(id1, id2)
    print(com.get_sentence())
    return jsonify(com.get_sentence())


@application.route("/getuser")
def get_user():
    """
    return the id of the current user
    """
    return jsonify({"id": session["USERID"]})


@application.route("/getspeakers")
def get_speakers():
    """
    return the user name of the two speakers
    """
    id1 = int(session["USERID"])
    id2 = int(session["SPEAKER"])
    if id1 > id2:
        user1 = User.query.filter_by(id=id1).first()
        user2 = User.query.filter_by(id=id2).first()
    else:
        user1 = User.query.filter_by(id=id2).first()
        user2 = User.query.filter_by(id=id1).first()
    return jsonify({"user1": user1.name, "user2": user2.name})


@application.route("/getspeaker")
def get_speaker():
    """
    return the id of the user who you talk to
    """
    return jsonify({"speaker": session["SPEAKER"]})


@application.route("/getspeakername")
def get_speaker_name():
    """
    return the name of the user who you talk to
    """
    return jsonify({"speaker":  User.query.filter_by(id=session["SPEAKER"]).first().name})