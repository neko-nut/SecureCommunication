from flask import render_template, session, url_for, flash, redirect, jsonify
from flask import request
from werkzeug.security import check_password_hash

from appdir import application


@application.route('/')
def hello():
    return "hello"

@application.route('/mainpage')
def main_page():
    """

    :return:
    """
    if session.get("USERID") is None:
        return render_template("main_page.html", language=getLanguage())
    elif session.get("USERTYPE") is '0':
        return render_template("customer_main_page.html", language=getLanguage(),
                               username=getCustomerById(session['USERID']).name)
    elif session.get("USERTYPE") is '1':
        return render_template("employee_main_page.html", language=getLanguage())
    else:
        return render_template("main_page.html", language=getLanguage())


@application.route('/login', methods=['GET', 'POST'])
def login():
    """

    :return:
    """
    getLanguage()
    form = LoginForm()
    form.type.choices = [('0', getLanguage()["Customer"]), ('1', getLanguage()["Employee"])]
    form.submit.label.text = getLanguage()["Login"]
    if form.validate_on_submit():
        user = getUser(form.username.data, form.type.data)
        if not user:
            flash(getLanguage()["Incorrect User"])
            return redirect('login')
        elif not check_password_hash(user.password, form.password.data):
            flash(getLanguage()["Incorrect User"])
            return redirect('login')
        else:
            session["USERID"] = user.id
            session["USERTYPE"] = form.type.data
            return redirect(url_for('main_page'))
    flash(getLanguage()["Enter Sign In"])
    # print(getLanguage()["Enter"])
    return render_template("login_page.html", form=form, language=getLanguage(), page="login")


@application.route('/logout')
def logout():
    """

    :return:
    """
    session.pop("USERID", None)
    session.pop("USERTYPE", None)
    flash(['Logout'])
    return redirect(url_for('login'))


@application.route('/register', methods=['GET', 'POST'])
def register():
    """

    :return:
    """
    getLanguage()
    form = RegisterForm()
    form.submit.label.text = getLanguage()["Submit"]
    if form.validate_on_submit():
        if form.password.data != form.repeat_pwd.data:
            flash(getLanguage()['Inconsistent Password'])
            return redirect('register')
        elif getCustomerByName(form.username.data):
            flash(getLanguage()['Username is occupied'])
            return redirect('register')
        else:
            addCustomer(form)
            return redirect(url_for("login"))
    flash(getLanguage()['Enter Sign Up'])
    return render_template('register_page.html', form=form, language=getLanguage())

