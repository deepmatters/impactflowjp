from datetime import datetime
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import login

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    password_hash = db.Column(db.String(200))
    role = db.Column(db.String(20), default="user")
    create_dt = db.Column(db.DateTime, default=datetime.utcnow)
    lastlogin_dt = db.Column(db.DateTime, default=datetime.utcnow)
    password_reset_id = db.Column(db.String(12))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User {}>'.format(self.name)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    create_dt = db.Column(db.DateTime, default=datetime.utcnow)
    mod_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Who edited last
    mod_dt = db.Column(db.DateTime)  # When it was last edited
    img_url = db.Column(db.String(10000))
    published = db.Column(db.Boolean)
    json = db.Column(db.JSON)

    def __repr__(self):
        return '<Project {}>'.format(self.id)

class Stakeholder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id', ondelete="CASCADE"))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    create_dt = db.Column(db.DateTime, default=datetime.utcnow)
    mod_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Who edited last
    mod_dt = db.Column(db.DateTime)  # When it was last edited
    published = db.Column(db.Boolean)
    json = db.Column(db.JSON)

    def __repr__(self):
        return '<Stakeholder {}>'.format(self.id)

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stakeholder_id = db.Column(db.Integer, db.ForeignKey('stakeholder.id', ondelete="CASCADE"))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    create_dt = db.Column(db.DateTime, default=datetime.utcnow)
    mod_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Who edited last
    mod_dt = db.Column(db.DateTime)  # When it was last edited
    published = db.Column(db.Boolean)
    json = db.Column(db.JSON)

    def __repr__(self):
        return '<Activity {}>'.format(self.id)

class Output(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(db.Integer, db.ForeignKey('activity.id', ondelete="CASCADE"))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    create_dt = db.Column(db.DateTime, default=datetime.utcnow)
    mod_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Who edited last
    mod_dt = db.Column(db.DateTime)  # When it was last edited
    published = db.Column(db.Boolean)
    json = db.Column(db.JSON)

    def __repr__(self):
        return '<Output {}>'.format(self.id)

class Outcome(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    output_id = db.Column(db.Integer, db.ForeignKey('output.id', ondelete="CASCADE"))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    create_dt = db.Column(db.DateTime, default=datetime.utcnow)
    mod_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Who edited last
    mod_dt = db.Column(db.DateTime)  # When it was last edited
    published = db.Column(db.Boolean)
    json = db.Column(db.JSON)

    def __repr__(self):
        return '<Outcome {}>'.format(self.id)
"""
# To create a database, run the following:
$ export FLASK_APP=appname.py (set env var so flask cmd know where the app is)
$ flask db init
$ flask db migrate -m "commit message"
$ flask db upgrade

# To add a user and password, use Python prompt:
>>> from app import db
>>> from app.models import User, Post
>>> u = User(email='name@domain.com')
>>> u.set_password('MyPassword')
>>> u.check_password('MyPassword')
True
>>> db.session.add(u)
>>> db.session.commit()

#To query database:
>>> users = User.query.all()
>>> users
>>> for u in users:
...     print(u.id, u.email, u.password_hash)

# To create a password hash for a user:
>>> from werkzeug.security import generate_password_hash
>>> hash = generate_password_hash('foobar')
>>> hash
Use this hash as a password_hash entry in db

# To verify hash:
>>> from werkzeug.security import check_password_hash
>>> check_password_hash(hash, 'foobar')
True
"""

@login.user_loader
def load_user(id):
    return User.query.get(int(id))
