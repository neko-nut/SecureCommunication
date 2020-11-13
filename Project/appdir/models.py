from typing import Any, Callable, Text

from sqlalchemy import Integer, String, Column, ForeignKey, Text

from appdir import db
from datetime import datetime


class User(db.Model):
    """
    user table
    """
    id = db.Column(Integer, index=True, primary_key=True, autoincrement=True)
    name = db.Column(String, index=True)
    password = db.Column(String, index=True)
    email = db.Column(String)
    phone = db.Column(String)



