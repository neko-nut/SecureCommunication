from flask import render_template, session, url_for, flash, redirect, jsonify
from flask import request
from werkzeug.security import check_password_hash
from appdir import db

from appdir import application
from appdir.forms import LoginForm, RegisterForm, CommunicateForm
from appdir.models import User
from appdir.communications import add_online_user, get_communication, add_communication

@application.route('/')
def hello():
    return 'hello'

@application.route('/login', methods=['GET', 'POST'])
def login():
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
            add_online_user(user.id)
            return redirect(url_for('user_list'))
    return render_template("login.html", form=form)


@application.route('/logout')
def logout():
    session.pop("USERID", None)
    session.pop("USERTYPE", None)
    flash("You have logout")
    return redirect(url_for('login'))


@application.route('/register', methods=['GET', 'POST'])
def register():
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
                User(name=form.username.data, password=form.password.data, phone=form.phone.data, email=form.email.data))
            db.session.commit()
            return redirect(url_for("login"))
    return render_template('register.html', form=form)


@application.route('/list')
def user_list():
    return render_template('list.html', onlines=User.query.all())


@application.route('/communicate/<user1>', methods=['GET', 'POST'])
def communicate(user1):
    user2 = int(session['USERID'])
    user1 = int(user1)
    if get_communication(user1, user2) is False:
        com = add_communication(user1, user2)
    else:
        com = get_communication(user1, user2)
    form = CommunicateForm()
    if form.validate_on_submit():
        com.add_sentence(form.sentence.data, session["USERID"])
        return redirect(url_for("communicate"))
    return render_template("communicate.html", form=form)


@application.route("/getsentence/<user1>/<user2>")
def get_sentence(user1, user2):
    user1 = User.query.filter_by(name=user1).first().id
    user2 = User.query.filter_by(name=user2).first().id
    com = get_communication(user1, user2)
    return jsonify(com.get_sentence())


@application.route("/getuser")
def get_user():
    return jsonify({"id": session["USERID"]})







