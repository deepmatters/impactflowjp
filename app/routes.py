from flask import render_template, redirect, url_for, flash, request, json, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from flask_mail import Message

from app import app, db, mail
from app.models import User, Project, Stakeholder, Activity, Output, Outcome
from app.forms import SignupForm, LoginForm, ForgetForm, PasswordChangeForm, PasswordResetForm, ProjectForm, StakeholderForm, ActivityForm, OutputForm, OutcomeForm

import pymongo
import random
from datetime import datetime
from threading import Thread
import boto3
import pytz
import os
import ast
from sqlalchemy.orm.attributes import flag_modified

# Define a function to check file extension for file upload
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Time conversion from UTC, to be used as filter in Jinja2
# E.g. {{ user.lastlogin_dt|datetimefilter }}
def datetimefilter(value, format="%d-%m-%Y %H:%M:%S"):
    tz = pytz.timezone('Asia/Tokyo') # timezone you want to convert to from UTC
    utc = pytz.timezone('UTC')  
    value = utc.localize(value, is_dst=None).astimezone(pytz.utc)
    local_dt = value.astimezone(tz)
    return local_dt.strftime(format)

app.jinja_env.filters['datetimefilter'] = datetimefilter

# Defind img convert function to eval string saved in db as list
# In Jinja2, when testing if having img, USE {% if db_object.img_url|length > 2 %}
def img_convert(img_url):
    if len(img_url) > 2:  # 2 mean empty bracket []. This happens when img is deleted.
        img_list = ast.literal_eval(img_url)
        img = img_list[0]  # Select only the 1st img
    else:  # If img_url is an empty bracket (len = 2), or None
        img = None
    return img

app.jinja_env.filters['img_convert'] = img_convert

"""
Error handling

Don't forget to output header page variable for each content type
"""
@app.errorhandler(404)
def page_not_found(e):
    if request.path.split('/')[1] == 'project':
        return render_template('404.html', project=[]), 404
    else:
        return render_template('404.html'), 404
    
@app.errorhandler(500)
def internal_server_error(e):
    if request.path.split('/')[1] == 'project':
        print('This is 500 error from /project')
        return render_template('500.html', project=[]), 500
    else:
        print('This is 500 error')
        return render_template('500.html'), 500

@app.route('/')
def home():
    if current_user.is_authenticated:
        projects = Project.query.filter(Project.user_id == current_user.id).order_by(Project.create_dt.desc()).all()
        projects_published = Project.query.filter(Project.published == True).order_by(Project.create_dt.desc()).all()
        projects_unpublished = Project.query.filter(Project.published == False).order_by(Project.create_dt.desc()).all()

        return render_template('home.html', projects=projects, projects_published=projects_published, projects_unpublished=projects_unpublished)
    else:
        projects_published = Project.query.filter(Project.published == True).order_by(Project.create_dt.desc()).all()

        return render_template('home.html', projects_published=projects_published)

@app.route('/project-all')
def project_all():
    projects_published = Project.query.filter(Project.published == True).order_by(Project.create_dt.desc()).all()

    return render_template('project-all.html', projects_published=projects_published)

@app.route('/about')
def about():
    return render_template('about.html')

"""
Login and user sub-system
"""

@app.route('/signup', methods=('GET', 'POST'))
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
        
    form = SignupForm()

    if form.validate_on_submit():
        # Get data from form
        name = form.name.data
        email = form.email.data
        password = form.password.data
        password_check = form.password_check.data

        # Check if email already exist
        email_exist = User.query.filter_by(email=email).first()
        if email_exist:
            comment = f"{email} このメールアドレスはすでに登録されています。"   
            return render_template('signup-error.html', comment=comment)

        # Check if passwords match
        if password == password_check:
            password_final = password
        else:
            comment = "2つのパスワードが一致する必要があります。"
            return render_template('signup-error.html', comment=comment)

        # Create user with name, email, password
        new_user = User(name=name, email=email)
        new_user.set_password(password_final)
        db.session.add(new_user)
        db.session.commit()

        # Give confirmation, login, and redirect to profile page
        user = User.query.filter_by(email=form.email.data).first()
        login_user(user)
        flash("登録が完了し、すでにログインしています")
        return redirect('/profile')

    return render_template('signup.html', form=form)

# Function to send mail using thread
def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

@app.route('/forget', methods=('GET', 'POST'))
def forget():
    form = ForgetForm()
    if form.validate_on_submit():
        # Get data from form
        email = form.email.data

        # Check if entered email is an existing user or not
        user = User.query.filter_by(email=email).first()
        if user is None:
            # Return comment and error type
            comment = "電子メールが見つかりません。"
            error_type = "wrong_email"
            return render_template('forget-result.html', comment=comment, error_type=error_type)
        # If email exists, proceed to password recovery process
        else:
            # Generate password_reset_id
            rand_universe = [1,2,3,4,5,6,7,8,9,"a","b","c","d","e","f","g","A","B","C","D","E","F","G"]
            rand_str = ""
            rand_list = random.sample(rand_universe, k=12)
            password_reset_id = rand_str.join([str(i) for i in rand_list])

            # Insert password_reset_id in db for this user
            user.password_reset_id = password_reset_id
            db.session.commit()

            # Send an email to user

            """
            !!! MUST CUSTOMISE MESSAGE BODY IN IMPLEMENTATION !!!
            """
            msg = Message(subject='[jp.ImpactFlow.org] パスワードの再設定',
                  sender = 'support@cfapp.org',
                  recipients = [email])  # <<< CONFIGURE WEBSITE URL
            msg.body = ("https://jp.impactflow.org/password-reset/" + password_reset_id + " 上記リンクより、パスワードの再設定をお願いします。")  # <<< CONFIGURE EMAIL MESSAGE AND URL

            Thread(target=send_async_email, args=(app, msg)).start()  # Send mail asynchronously

            # Return comment
            comment = "パスワード再設定のご案内をメールにてお送りしました。"
            return render_template('forget-result.html', comment=comment)

    return render_template('forget.html', form=form)

# Password recovery API endpoint
@app.route('/password-reset/<string:password_reset_id>')
def password_reset(password_reset_id):
    # Check if password_reset_id is valid or not
    user = User.query.filter_by(password_reset_id=password_reset_id).first()
    if user is None:
        flash("パスワード再設定用リンクが無効、または使用されています。")
        return redirect('/')
    # If password_reset_id is valid, proceed to reset password
    else:
        form = PasswordResetForm()
        return render_template('password-reset.html', password_reset_id=password_reset_id, form=form)

@app.route('/password-reset-result', methods=('GET', 'POST'))
def password_reset_result():
    form = PasswordResetForm()

    if form.validate_on_submit():
        # Get data from form
        password_reset_id = form.password_reset_id.data
        password_new = form.password_new.data
        password_new_check = form.password_new_check.data

        # Get the user who belong to this password_reset_id
        user = User.query.filter_by(password_reset_id=password_reset_id).first()

        # Check if new passwords match each other
        if password_new != password_new_check:
            # Return comment and error type
            comment = "2つのパスワードが一致する必要があります。"
            error_type = "unmatched_password_check_reset"
            return render_template('password-change-result.html', comment=comment, error_type=error_type, password_reset_id=password_reset_id)
        # Proceed if passwords check passed
        else:
            # Generate new password hash
            user.set_password(password_new)

            # Update password_reset_id with blank string so the id can be used only this time only
            # and can't be used in API
            user.password_reset_id = ""
            db.session.commit()

            # Login user instantly
            login_user(user)
            flash("正常にログインしました")

            # Return comment
            comment = "次回から新しいパスワードでログインしてください。"
            return render_template('password-change-result.html', comment=comment)

    return render_template('password-change-result.html')

@app.route('/login', methods=('GET', 'POST'))
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    
    form = LoginForm()
    
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        
        if user is None or not user.check_password(form.password.data):
            return render_template('fail.html')
        
        login_user(user)

        # Update lastlogin_dt to the current time
        user.lastlogin_dt = datetime.now()
        db.session.commit()

        flash("正常にログインしました")
        return redirect('/')

    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("正常にログアウトしました")
    return redirect(url_for('home'))

@app.route('/password-change', methods=('GET', 'POST'))
@login_required
def password_change():
    form = PasswordChangeForm()

    if form.validate_on_submit():
        # Get data from form
        pass_current = form.password_current.data
        pass_new = form.password_new.data
        pass_new_check = form.password_new_check.data

        # Connect to db
        user = User.query.filter_by(id=current_user.id).first()

        # Check if current pass matches pass in db
        if not user.check_password(pass_current):
            # Return comment and error type
            comment = "パスワードが正しくありません。"
            error_type = "wrong_pass_current"
            return render_template('password-change-result.html', comment=comment, error_type=error_type)
        # Check if new passwords match each other
        elif pass_new != pass_new_check:
            # Return comment and error type
            comment = "2つのパスワードが一致する必要があります。"
            error_type = "unmatched_password_check"
            return render_template('password-change-result.html', comment=comment, error_type=error_type)
        # Proceed if 2 above checks passed
        else:
            # Generate new password hash
            user.set_password(pass_new)
            db.session.commit()

            # Return comment
            comment = "次回から新しいパスワードでログインしてください。"
            return render_template('password-change-result.html', comment=comment)

    return render_template('password-change.html', form=form)

"""
Profile
"""

@app.route('/profile')
@login_required
def profile():
    user = User.query.filter_by(id=current_user.id).first()
    projects = Project.query.filter(Project.user_id == user.id).order_by(Project.create_dt.desc()).all()

    return render_template('profile.html', user=user, projects=projects)

"""
Project
"""

@app.route('/project-create', methods=('GET', 'POST'))
@login_required
def project_create():
    form = ProjectForm()

    if request.method == 'POST':
        json_data = request.get_json()  # Convert JSON to Python dict
        now = datetime.now()

        project = Project(
            user_id=current_user.id,
            create_dt=now,
            published=json_data['published'],
            json=json_data
        )

        db.session.add(project)
        db.session.commit()
        flash("新規プロジェクトの作成が正常に行われました。")

        print(json.dumps(json_data, sort_keys=False, indent=4, ensure_ascii=False))

        return redirect('/')
    else:
        return render_template('project-create.html', form=form)

@app.route('/project/<int:project_id>')
def project(project_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholders = Stakeholder.query.filter(Stakeholder.project_id == project_id).order_by(Stakeholder.id.asc()).all()

    # Get activities for each stakeholder
    activities = []

    for stakeholder in stakeholders:
        activities_raw = Activity.query.filter(Activity.stakeholder_id == stakeholder.id).order_by(Activity.id.asc()).all()

        for activity in activities_raw:
            activities.append([activity.stakeholder_id, activity])

    # Get outputs for each activity
    outputs = []

    for activity in activities:
        outputs_raw = Output.query.filter(Output.activity_id == activity[1].id).order_by(Output.id.asc()).all()

        for output in outputs_raw:
            outputs.append([output.activity_id, output])

    # Get outcomes for each output
    outcomes = []

    for output in outputs:
        outcomes_raw = Outcome.query.filter(Outcome.output_id == output[1].id).order_by(Outcome.id.asc()).all()

        for outcome in outcomes_raw:
            outcomes.append([outcome.output_id, outcome])

    # Find a list of project's impact that haven't been checked in outcome stage

    # 1. Create a unique list of outcomes' impactCheck fields to check against project data's impact
    outcomes_forcheck = []

    for output in outputs:
        outcomes_raw = Outcome.query.filter(Outcome.output_id == output[1].id).order_by(Outcome.id.asc()).all()

        for outcome in outcomes_raw:
            outcomes_forcheck.append(outcome)

    outcome_impact_check = []

    for outcome in outcomes_forcheck:
        for impact in outcome.json['impactCheck']:
            outcome_impact_check.append(impact)

    outcome_impact_set = set(outcome_impact_check)

    # 2. Create a list of impact from project data
    project_impact = []

    for impact in project.json['impact']:
        project_impact.append(impact['objective'])

    project_impact_set = set(project_impact)

    # 3. Find symetric difference between outcome_impact_set and project_impact_set
    impact_diff = project_impact_set.symmetric_difference(outcome_impact_set)

    # 4. Reorder impact diff by creating a new list against project_impact
    impact_diff_ordered = []

    for impact in project_impact:
        if impact in impact_diff:
            impact_diff_ordered.append(impact)

    # Editability check
    editable = False

    if current_user.is_authenticated:
        if project.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    # Limit the view of unpublished project to owner or admin only
    if project.published == False and editable == False:
        return render_template('owner-error.html', project=project)
    else:
        # Converting record.img_url from db to list
        if project.img_url:
            img_url_raw = project.img_url
            imgs = ast.literal_eval(img_url_raw)
        else:
            imgs = None

        return render_template('project.html', project=project, imgs=imgs, stakeholders=stakeholders, activities=activities, outputs=outputs, outcomes=outcomes, impact_diff_ordered=impact_diff_ordered, editable=editable)

@app.route('/project/<int:project_id>/edit', methods=('GET', 'POST'))
@login_required
def project_edit(project_id):
    project = Project.query.filter(Project.id == project_id).first()

    editable = False

    if current_user.is_authenticated:
        if project.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    form = ProjectForm()

    if request.method == 'POST':
        if editable:
            json_data = request.get_json()  # Convert JSON to Python dict
            now = datetime.now()

            project.mod_user_id = current_user.id
            project.mod_dt = now
            project.published = json_data['published']
            project.json = json_data

            db.session.commit()
            flash("プロジェクトの編集が正常に行われました。")

            print(json.dumps(json_data, sort_keys=False, indent=4, ensure_ascii=False))

            return "แก้ไขโครงการสำเร็จแล้ว"

        else:
            return render_template('owner-error.html', project=project)
    else:
        if editable:
            data = json.dumps(project.json, sort_keys=False, indent=4, ensure_ascii=False)

            return render_template('project-edit.html', project=project, form=form, data=data)
        else:
            return render_template('owner-error.html', project=project)

@app.route('/project/<int:project_id>/delete')
@login_required
def project_delete(project_id):
    project = Project.query.filter(Project.id == project_id).first()

    editable = False

    if current_user.is_authenticated:
        if project.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        return render_template('project-delete.html', project=project, project_id=project_id)
    else:
        return render_template('owner-error.html', project=project)


@app.route('/project/<int:project_id>/delete/confirm')
@login_required
def project_delete_confirm(project_id):
    project = Project.query.filter(Project.id == project_id).first()

    editable = False

    if current_user.is_authenticated:
        if project.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        db.session.delete(project)
        db.session.commit()

        flash("プロジェクトを正常に削除しました。")
        return redirect('/')
    else:
        return render_template('owner-error.html', project=project)

@app.route('/project/<int:project_id>/publish/<string:mode>')
@login_required
def project_share_toggle(project_id, mode):
    project = Project.query.filter(Project.id == project_id).first()

    editable = False

    if current_user.is_authenticated:
        if project.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        if mode == 'on':
            project.json['published'] = True
            project.published = True

            flag_modified(project, "json")
            db.session.add(project)
            db.session.commit()

            return redirect('/project/' + str(project_id))
        elif mode == 'off':
            project.json['published'] = False
            project.published = False
            
            flag_modified(project, "json")
            db.session.add(project)
            db.session.commit()

            return redirect('/project/' + str(project_id))

"""
Stakeholder
"""

@app.route('/project/<int:project_id>/stakeholder-create', methods=('GET', 'POST'))
@login_required
def stakeholder_create(project_id):
    project = Project.query.filter(Project.id == project_id).first()

    form = StakeholderForm()
    
    editable = False

    if current_user.is_authenticated:
        if project.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        if request.method == 'POST':
            json_data = request.get_json()  # Convert JSON to Python dict
            now = datetime.now()

            stakeholder = Stakeholder(
                project_id=project_id, 
                user_id=current_user.id,
                create_dt=now,
                published=json_data['published'],
                json=json_data
            )

            db.session.add(stakeholder)
            db.session.commit()
            flash("ステークホルダーの新規作成が正常に行われました。")

            print(json.dumps(json_data, sort_keys=False, indent=4, ensure_ascii=False))

            return redirect('/')
        else:
            return render_template('stakeholder-create.html', form=form, project=project)
    else:
        return render_template('owner-error.html', project=project)

@app.route('/project/<int:project_id>/<int:stakeholder_id>')
def stakeholder(project_id, stakeholder_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activities = Activity.query.filter(Activity.stakeholder_id == stakeholder_id).order_by(Activity.create_dt.desc()).all()

    editable = False

    if current_user.is_authenticated:
        if stakeholder.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    # Limit the view of unpublished project to owner or admin only
    if project.published == False and editable == False:
        return render_template('owner-error.html', project=project)
    else:
        return render_template('stakeholder.html', project=project, stakeholder=stakeholder, activities=activities, editable=editable)

@app.route('/project/<int:project_id>/<int:stakeholder_id>/edit', methods=('GET', 'POST'))
@login_required
def stakeholder_edit(project_id, stakeholder_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()

    editable = False

    if current_user.is_authenticated:
        if stakeholder.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    form = StakeholderForm()

    if request.method == 'POST':
        if editable:
            json_data = request.get_json()  # Convert JSON to Python dict
            now = datetime.now()

            stakeholder.mod_user_id = current_user.id
            stakeholder.mod_dt = now
            stakeholder.published = json_data['published']
            stakeholder.json = json_data

            db.session.commit()
            flash("ステークホルダーの編集が正常に行われました。")

            print(json.dumps(json_data, sort_keys=False, indent=4, ensure_ascii=False))

            return "แก้ไขผู้มีส่วนได้เสียสำเร็จแล้ว"

        else:
            return render_template('owner-error.html', project=project)
    else:
        if editable:
            data = json.dumps(stakeholder.json, sort_keys=False, indent=4, ensure_ascii=False)

            return render_template('stakeholder-edit.html', project=project, stakeholder=stakeholder, form=form, data=data)
        else:
            return render_template('owner-error.html', project=project)

@app.route('/project/<int:project_id>/<int:stakeholder_id>/delete')
@login_required
def stakeholder_delete(project_id, stakeholder_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()

    editable = False

    if current_user.is_authenticated:
        if stakeholder.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        return render_template('stakeholder-delete.html', project=project, project_id=project_id, stakeholder=stakeholder, stakeholder_id=stakeholder_id)
    else:
        return render_template('owner-error.html', project=project)


@app.route('/project/<int:project_id>/<int:stakeholder_id>/delete/confirm')
@login_required
def stakeholder_delete_confirm(project_id, stakeholder_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()

    editable = False

    if current_user.is_authenticated:
        if stakeholder.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        db.session.delete(stakeholder)
        db.session.commit()

        flash("ステークホルダーを正常に削除しました。")
        return redirect('/project/' + str(project_id))
    else:
        return render_template('owner-error.html', project=project)

"""
Activity
"""

@app.route('/project/<int:project_id>/<int:stakeholder_id>/activity-create', methods=('GET', 'POST'))
@login_required
def activity_create(project_id, stakeholder_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()

    form = ActivityForm()

    editable = False

    if current_user.is_authenticated:
        if project.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        if request.method == 'POST':
            json_data = request.get_json()  # Convert JSON to Python dict
            now = datetime.now()

            activity = Activity(
                stakeholder_id=stakeholder_id, 
                user_id=current_user.id,
                create_dt=now,
                published=json_data['published'],
                json=json_data
            )

            db.session.add(activity)
            db.session.commit()
            flash("新しい活動が正常に作成されました。")

            print(json.dumps(json_data, sort_keys=False, indent=4, ensure_ascii=False))

            return redirect('/')
        else:
            return render_template('activity-create.html', form=form, project=project, stakeholder=stakeholder)
    else:
        return render_template('owner-error.html', project=project)

@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>')
def activity(project_id, stakeholder_id, activity_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()

    editable = False

    if current_user.is_authenticated:
        if activity.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    # Limit the view of unpublished project to owner or admin only
    if project.published == False and editable == False:
        return render_template('owner-error.html', project=project)
    else:
        return render_template('activity.html', project=project, stakeholder=stakeholder, activity=activity, editable=editable)

@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/edit', methods=('GET', 'POST'))
@login_required
def activity_edit(project_id, stakeholder_id, activity_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()

    editable = False

    if current_user.is_authenticated:
        if activity.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    form = ActivityForm()

    if request.method == 'POST':
        if editable:
            json_data = request.get_json()  # Convert JSON to Python dict
            now = datetime.now()

            activity.mod_user_id = current_user.id
            activity.mod_dt = now
            activity.published = json_data['published']
            activity.json = json_data

            db.session.commit()
            flash("活動の編集が正常に行われました。")

            print(json.dumps(json_data, sort_keys=False, indent=4, ensure_ascii=False))

            return "แก้ไขกิจกรรมสำเร็จแล้ว"

        else:
            return render_template('owner-error.html', project=project)
    else:
        if editable:
            data = json.dumps(activity.json, sort_keys=False, indent=4, ensure_ascii=False)

            return render_template('activity-edit.html', project=project, stakeholder=stakeholder, activity=activity, form=form, data=data)
        else:
            return render_template('owner-error.html', project=project)

@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/delete')
@login_required
def activity_delete(project_id, stakeholder_id, activity_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()

    editable = False

    if current_user.is_authenticated:
        if activity.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        return render_template('activity-delete.html', project=project, project_id=project_id, stakeholder=stakeholder, stakeholder_id=stakeholder_id, activity=activity, activity_id=activity_id)
    else:
        return render_template('owner-error.html', project=project)


@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/delete/confirm')
@login_required
def activity_delete_confirm(project_id, stakeholder_id, activity_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()

    editable = False

    if current_user.is_authenticated:
        if activity.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        db.session.delete(activity)
        db.session.commit()

        flash("活動を正常に削除しました。")
        return redirect('/project/' + str(project_id))
    else:
        return render_template('owner-error.html', project=project)

"""
Output
"""

@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/output-create', methods=('GET', 'POST'))
@login_required
def output_create(project_id, stakeholder_id, activity_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()

    form = OutputForm()

    editable = False

    if current_user.is_authenticated:
        if project.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        if request.method == 'POST':
            json_data = request.get_json()  # Convert JSON to Python dict
            now = datetime.now()

            output = Output(
                activity_id=activity_id, 
                user_id=current_user.id,
                create_dt=now,
                published=json_data['published'],
                json=json_data
            )

            db.session.add(output)
            db.session.commit()
            flash("新規アウトプットが正常に作成されました。")

            print(json.dumps(json_data, sort_keys=False, indent=4, ensure_ascii=False))

            return redirect('/')
        else:
            return render_template('output-create.html', form=form, project=project, stakeholder=stakeholder, activity=activity)
    else:
        return render_template('owner-error.html', project=project)

@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/<int:output_id>')
def output(project_id, stakeholder_id, activity_id, output_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()
    output = Output.query.filter(Output.id == output_id).first()

    editable = False

    if current_user.is_authenticated:
        if output.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    # Limit the view of unpublished project to owner or admin only
    if project.published == False and editable == False:
        return render_template('owner-error.html', project=project)
    else:
        return render_template('output.html', project=project, stakeholder=stakeholder, activity=activity, output=output, editable=editable)

@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/<int:output_id>/edit', methods=('GET', 'POST'))
@login_required
def output_edit(project_id, stakeholder_id, activity_id, output_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()
    output = Output.query.filter(Output.id == output_id).first()

    editable = False

    if current_user.is_authenticated:
        if output.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    form = OutputForm()

    if request.method == 'POST':
        if editable:
            json_data = request.get_json()  # Convert JSON to Python dict
            now = datetime.now()

            output.mod_user_id = current_user.id
            output.mod_dt = now
            output.published = json_data['published']
            output.json = json_data

            db.session.commit()
            flash("アウトプットの編集が正常に行われました。")

            print(json.dumps(json_data, sort_keys=False, indent=4, ensure_ascii=False))

            return "แก้ไขผลผลิตสำเร็จแล้ว"

        else:
            return render_template('owner-error.html', project=project)
    else:
        if editable:
            data = json.dumps(output.json, sort_keys=False, indent=4, ensure_ascii=False)

            return render_template('output-edit.html', project=project, stakeholder=stakeholder, activity=activity, output=output, form=form, data=data)
        else:
            return render_template('owner-error.html', project=project)

@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/<int:output_id>/delete')
@login_required
def output_delete(project_id, stakeholder_id, activity_id, output_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()
    output = Output.query.filter(Output.id == output_id).first()

    editable = False

    if current_user.is_authenticated:
        if output.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        return render_template('output-delete.html', project=project, project_id=project_id, stakeholder=stakeholder, stakeholder_id=stakeholder_id, activity=activity, activity_id=activity_id, output=output, output_id=output_id)
    else:
        return render_template('owner-error.html', project=project)


@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/<int:output_id>/delete/confirm')
@login_required
def output_delete_confirm(project_id, stakeholder_id, activity_id, output_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()
    output = Output.query.filter(Output.id == output_id).first()

    editable = False

    if current_user.is_authenticated:
        if output.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        db.session.delete(output)
        db.session.commit()

        flash("アウトプットが正常に削除されました。")
        return redirect('/project/' + str(project_id))
    else:
        return render_template('owner-error.html', project=project)

"""
Outcome
"""

@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/<int:output_id>/outcome-create', methods=('GET', 'POST'))
@login_required
def outcome_create(project_id, stakeholder_id, activity_id, output_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()
    output = Output.query.filter(Output.id == output_id).first()

    form = OutcomeForm()

    editable = False

    if current_user.is_authenticated:
        if project.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        if request.method == 'POST':
            json_data = request.get_json()  # Convert JSON to Python dict
            now = datetime.now()

            outcome = Outcome(
                output_id=output_id, 
                user_id=current_user.id,
                create_dt=now,
                published=json_data['published'],
                json=json_data
            )

            db.session.add(outcome)
            db.session.commit()
            flash("新しいアウトカムの作成が正常に行われました。")

            print(json.dumps(json_data, sort_keys=False, indent=4, ensure_ascii=False))

            return redirect('/')
        else:
            # Dump project's json to be used for objectives check
            data_project = json.dumps(project.json, sort_keys=False, indent=4, ensure_ascii=False)

            return render_template('outcome-create.html', form=form, project=project, stakeholder=stakeholder, activity=activity, output=output, data_project=data_project)
    else:
        return render_template('owner-error.html', project=project)

@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/<int:output_id>/<int:outcome_id>')
def outcome(project_id, stakeholder_id, activity_id, output_id, outcome_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()
    output = Output.query.filter(Output.id == output_id).first()
    outcome = Outcome.query.filter(Outcome.id == outcome_id).first()

    editable = False

    if current_user.is_authenticated:
        if outcome.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    # Limit the view of unpublished project to owner or admin only
    if project.published == False and editable == False:
        return render_template('owner-error.html', project=project)
    else:
        return render_template('outcome.html', project=project, stakeholder=stakeholder, activity=activity, output=output, outcome=outcome, editable=editable)

@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/<int:output_id>/<int:outcome_id>/edit', methods=('GET', 'POST'))
@login_required
def outcome_edit(project_id, stakeholder_id, activity_id, output_id, outcome_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()
    output = Output.query.filter(Output.id == output_id).first()
    outcome = Outcome.query.filter(Outcome.id == outcome_id).first()

    editable = False

    if current_user.is_authenticated:
        if outcome.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    form = OutcomeForm()

    if request.method == 'POST':
        if editable:
            json_data = request.get_json()  # Convert JSON to Python dict
            now = datetime.now()

            outcome.mod_user_id = current_user.id
            outcome.mod_dt = now
            outcome.published = json_data['published']
            outcome.json = json_data

            db.session.commit()
            flash("アウトカムの編集が正常に行われました。")

            print(json.dumps(json_data, sort_keys=False, indent=4, ensure_ascii=False))

            return "แก้ไขผลลัพธ์สำเร็จแล้ว"

        else:
            return render_template('owner-error.html', project=project)
    else:
        if editable:
            data = json.dumps(outcome.json, sort_keys=False, indent=4, ensure_ascii=False)

            # Dump project's json to be used for objectives check
            data_project = json.dumps(project.json, sort_keys=False, indent=4, ensure_ascii=False)

            return render_template('outcome-edit.html', project=project, stakeholder=stakeholder, activity=activity, output=output, outcome=outcome, form=form, data=data, data_project=data_project)
        else:
            return render_template('owner-error.html', project=project)

@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/<int:output_id>/<int:outcome_id>/delete')
@login_required
def outcome_delete(project_id, stakeholder_id, activity_id, output_id, outcome_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()
    output = Output.query.filter(Output.id == output_id).first()
    outcome = Outcome.query.filter(Outcome.id == outcome_id).first()

    editable = False

    if current_user.is_authenticated:
        if outcome.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        return render_template('outcome-delete.html', project=project, project_id=project_id, stakeholder=stakeholder, stakeholder_id=stakeholder_id, activity=activity, activity_id=activity_id, output=output, output_id=output_id, outcome=outcome, outcome_id=outcome_id)
    else:
        return render_template('owner-error.html', project=project)


@app.route('/project/<int:project_id>/<int:stakeholder_id>/<int:activity_id>/<int:output_id>/<int:outcome_id>/delete/confirm')
@login_required
def outcome_delete_confirm(project_id, stakeholder_id, activity_id, output_id, outcome_id):
    project = Project.query.filter(Project.id == project_id).first()
    stakeholder = Stakeholder.query.filter(Stakeholder.id == stakeholder_id).first()
    activity = Activity.query.filter(Activity.id == activity_id).first()
    output = Output.query.filter(Output.id == output_id).first()
    outcome = Outcome.query.filter(Outcome.id == outcome_id).first()

    editable = False

    if current_user.is_authenticated:
        if outcome.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        db.session.delete(outcome)
        db.session.commit()

        flash("結果を正常に削除しました。")
        return redirect('/project/' + str(project_id))
    else:
        return render_template('owner-error.html', project=project)

"""
File uploader
"""

@app.route('/project/<int:project_id>/upload')
def project_upload(project_id):
    form = ProjectForm()

    project = Project.query.filter(Project.id == project_id).first()

    editable = False

    if current_user.is_authenticated:
        if project.user_id == current_user.id or current_user.role == 'admin':
            editable = True

    if editable:
        return render_template('upload.html', form=form, project=project)
    else:
        return render_template('owner-error.html', project=project)

@app.route('/project/<int:project_id>/file-post', methods=('GET', 'POST'))
def file_post(project_id):
    if request.method == 'POST':
        files = request.files.getlist("file")

        if files:
            file_num = 0
            file_uploaded_num = 0
            file_list = []
            status = []
            
            for file in files:
                file_num += 1

                file_uploaded_name = file.filename
                print(f"To upload: {file_uploaded_name}")

                # Upload file filename
                if allowed_file(file_uploaded_name):
                    file_uploaded_num += 1

                    # Local and S3 folder, S3 bucket name
                    """CUSTOMISE LOCAL/S3 FOLDERS AND S3 BUCKET HERE"""
                    local_folder = "project-img"
                    s3_bucket_folder = "project-img"
                    s3_bucket = "impactflowjp"

                    # Standardise file filename
                    """CUSTOMISE FILE NAME TEMPLATE HERE"""
                    file_name = "project-" + str(project_id) + "-" + str(file_uploaded_num) + os.path.splitext(file_uploaded_name)[1]

                    # Upload to server. NEED app.route_path FOR os.path.join TO WORK
                    file.save(os.path.join(app.root_path, 'static/' + local_folder, file_name))

                    # Upload to S3
                    s3_destination = (s3_bucket_folder + '/' + file_name)
                    s3_testmultiupload = boto3.resource('s3').Bucket(s3_bucket)
                    s3_testmultiupload.upload_file(
                        Filename=os.path.join(app.root_path, 'static/' + local_folder, file_name), 
                        Key=s3_destination, ExtraArgs={'ContentType': 'image/jpeg', 'ACL': 'public-read'}
                    )

                    print(f"Uploaded: {file_uploaded_name}")

                    # Generate file URL
                    file_url = 'https://' + s3_bucket + '.s3.ap-northeast-1.amazonaws.com/' + s3_bucket_folder + '/' + file_name

                    # Append each file URL to file_list
                    file_list.append(file_url)

                    # Append info of each file to status, to be returned as JSON
                    status.append({
                        "uploadStatus": True,
                        "uploadedFileId": file_uploaded_num, 
                        "uploadedOriginalName": file_uploaded_name, 
                        "uploadedUpdatedName": file_name, 
                        "fileUrl": file_url
                    })
                else:
                    status.append({
                        "uploadStatus": False, 
                        "uploadedFileId": 0, 
                        "uploadedOriginalName": file_uploaded_name, 
                        "uploadedUpdatedName": 0
                    })
            print(f"DB file list: {file_list}")

            return jsonify(status)
        else:
            return jsonify({"status": "no file uploaded"})

@app.route('/project/<int:project_id>/file-save', methods=('GET', 'POST'))
def file_save(project_id):
    if request.method == 'POST':
        # Get request JSON and parse as dict
        file_url_list = request.get_json()

        print(file_url_list)

        """
        SAVE TO DB HERE.
        Before saving, don't forget to convert file_url_list to string, 
        then recover using ast function
        """
        project = Project.query.filter(Project.id == project_id).first()

        project.img_url = str(file_url_list)

        db.session.commit()

        return jsonify(file_url_list)

"""
Indicator bank management
"""

@app.route('/indicator/view')
@login_required
def indicator_view():
    editable = False

    if current_user.is_authenticated:
        if current_user.role == 'admin':  # Admin only
            editable = True

    if editable:
        # Connect and define the database
        client = pymongo.MongoClient(app.config['DB_URI'])
        mongodb = client.impactflowjp

        indicators =  mongodb.indicator.find({})

        return render_template('indicator-view.html', indicators=indicators)
    else:
        return render_template('owner-error.html', project=project)

"""
Search
"""

@app.route('/indicator/api', methods=('GET', 'POST'))
def indicator_api():
    if request.method == 'GET':
        # Connect and define the database
        client = pymongo.MongoClient(app.config['DB_URI'])
        mongodb = client.impactflowjp

        indicators = []

        for result in mongodb.indicator.find({}):
            indicators.append({
                "category": result['category'], 
                "subcategory": result['Sub-category'], 
                "indicator": result['indicator'], 
                "source": result['source'], 
                "content": result['Sub-category'] + " : " + result['indicator'] + " (" + result['source'] + ")"
            })

        return jsonify(indicators)