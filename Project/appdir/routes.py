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
        user = User.query.filter_by(name=form.username).first()
        if not user:
            flash("Username or password is not correct so please ")
            return redirect('login')
        elif not check_password_hash(user.password, form.password.data):
            flash("Incorrect User")
            return redirect('login')
        else:
            session["USERID"] = user.id
            session["USERTYPE"] = form.type.data
            add_online_user(user.id)
            return redirect(url_for('main_page'))
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
            return jsonify({
                "name": form.username.data,
                "password": form.password.data,

            })
    return render_template('register.html', form=form)


@application.route('/adduser', methods=['GET', 'POST'])
def add_user(name, password, phone, email):
    db.session.add(
        User(name=name, password=password, phone=phone, email=email))
    db.session.commit()
    return redirect(url_for("login"))