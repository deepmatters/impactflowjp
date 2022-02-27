from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_mail import Mail, Message
from flask_pagedown import PageDown
from flaskext.markdown import Markdown
from flask_wtf.csrf import CSRFProtect
from functools import partial
import json

app = Flask(__name__)
app.config.from_object(Config)

# To save non-ascii characters in db, need SQLAlchemy engine_options
db = SQLAlchemy(app, engine_options={'json_serializer':partial(json.dumps, ensure_ascii=False)})

migrate = Migrate(app, db)
login = LoginManager(app)
mail = Mail(app)
csrf = CSRFProtect(app)
pagedown = PageDown(app)
Markdown(app)

from app import routes, models