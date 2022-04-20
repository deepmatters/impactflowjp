from flask_wtf import FlaskForm
from wtforms.fields import EmailField, URLField, PasswordField, SubmitField, StringField, RadioField, TextAreaField, BooleanField, IntegerField, DecimalField
from wtforms.validators import DataRequired
from flask_pagedown.fields import PageDownField

class SignupForm(FlaskForm):
    name = StringField('名前', validators=[DataRequired()])
    email = EmailField('メールアドレス', validators=[DataRequired()])
    password = PasswordField('パスワード', validators=[DataRequired()])
    password_check = PasswordField('パスワード（確認）', validators=[DataRequired()])
    submit = SubmitField('アカウントを作成する')

class LoginForm(FlaskForm):
    email = EmailField('メールアドレス', validators=[DataRequired()])
    password = PasswordField('パスワード', validators=[DataRequired()])
    submit = SubmitField('ログイン')

class ForgetForm(FlaskForm):
    email = EmailField('メールアドレス', validators=[DataRequired()])
    submit = SubmitField('パスワードの再発行')

class PasswordChangeForm(FlaskForm):
    password_current = PasswordField('古いパスワード', validators=[DataRequired()])
    password_new = PasswordField('新しいパスワード', validators=[DataRequired()])
    password_new_check = PasswordField('新しいパスワード確認', validators=[DataRequired()])
    submit = SubmitField('パスワード変更')

class PasswordResetForm(FlaskForm):
    password_reset_id = StringField('パスワードのリセットID', validators=[DataRequired()])
    password_new = PasswordField('新しいパスワード', validators=[DataRequired()])
    password_new_check = PasswordField('新しいパスワード確認', validators=[DataRequired()])
    submit = SubmitField('パスワード変更')

class ProjectForm(FlaskForm):
    submit = SubmitField('提出')

class StakeholderForm(FlaskForm):
    submit = SubmitField('提出')

class ActivityForm(FlaskForm):
    submit = SubmitField('提出')

class OutputForm(FlaskForm):
    submit = SubmitField('提出')

class OutcomeForm(FlaskForm):
    submit = SubmitField('提出')