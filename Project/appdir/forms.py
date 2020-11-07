from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.fields.html5 import EmailField, DateField
from wtforms.validators import DataRequired, Email, Length


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired('Please enter your username. ')])
    password = PasswordField('Password', validators=[DataRequired('Please enter your password')])
    submit = SubmitField("Login")


class RegisterForm(FlaskForm):
    email = EmailField('Email', validators=[DataRequired('Please Enter the email correctly'), Email()])
    username = StringField('Username', validators=[DataRequired('Please enter your username. ')])
    password = PasswordField('Password', validators=[DataRequired('Please enter your password'), Length(min=6)])
    repeat_pwd = PasswordField('Repeat Your Password', validators=[DataRequired('Please repeat your password'), Length(min=6)])
    address = StringField('Home Address')
    phone = StringField('Phone Number')
    submit = SubmitField('Sign Up')


class CommunicateForm(FlaskForm):
    sentence = StringField("Sentence", validators=[DataRequired()])
    submit = SubmitField('submit')