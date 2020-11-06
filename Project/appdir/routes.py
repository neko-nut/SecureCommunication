from flask import render_template, session, url_for, flash, redirect, jsonify
from flask import request
from werkzeug.security import check_password_hash
from appdir import db

from appdir import application
from appdir.forms import LoginForm, RegisterForm
from appdir.models import User
from appdir.communications import get_online_user, add_online_user


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
    onlines = []
    for i in get_online_user():
        if i != session["USERID"]:
            onlines.append(User.query.filter_by(id=i).first())
    return render_template('list.html', onlines=onlines)

