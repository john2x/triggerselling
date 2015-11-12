# -*- coding: utf-8 -*-
"""
    TriggerIQ_Auth
    ~~~~~~~~~
    Trigger-JWT module
"""
import rethinkdb as r
import bcrypt

from flask import current_app, request, jsonify, Blueprint
from flask_jwt import JWT, jwt_required, current_identity
from flask import Flask, send_from_directory, render_template, make_response, request
from datetime import datetime, timedelta
import re
import rethink_conn
import json

from werkzeug.local import LocalProxy

#conn = r.connect(host="localhost", port=28015, db="triggeriq")
conn = rethink_conn.conn()

auth = Blueprint('auth', __name__)

_auth= LocalProxy(lambda: current_app.extensions['auth'])


#TODO
# - Authentication
'''
 Register:                  Login:
 POST to /signup            POST to /login
 Content-Type: application/json
 {
    "username": user,
    "password": pass
 }
'''

class User(object):
    # def __init__(self, **kwargs):
    #     for k, v in kwargs.items():
    #         setattr(self, k, v)
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

class Auth(object):

    def __init__(self, app=None):
        self.app = app
        if app:
            self.init_app(app)

    def init_app(self, app):
        app.config['SECRET_KEY'] = 'super-secret'
        app.config['JWT_AUTH_URL_RULE'] = '/login'
        app.config['JWT_EXPIRATION_DELTA'] = timedelta(days=30)

        # Register callbacks
        self.jwt = JWT(app, self.authenticate, self.identity)
        if not hasattr(app, 'extensions'):  # pragma: no cover
            app.extensions = {}

        app.extensions['auth'] = self
        global auth
        with app.app_context():
            app.register_blueprint(auth)

    def create_user(self, username, password):
        # Hash password
        conn = rethink_conn.conn()
        hashed_pass =  bcrypt.hashpw(password, bcrypt.gensalt(8))

        user = {}
        user['email'] = username
        user['password'] = hashed_pass

        created = r.table("users").insert(user).run(conn)

        assert created['inserted'] == 1
        # Generate token
        user_id = created['generated_keys'][0]
        user = User(user_id, username, hashed_pass)
        return self.jwt.jwt_encode_callback(user)

    def login(self, username, password):
        user = self.authenticate(username, password)
        return self.jwt.jwt_encode_callback(user)

    def authenticate(self, username, password):
        conn = rethink_conn.conn()
        username, password = username.encode('utf-8'), password.encode('utf-8')
        cursor = r.table("users").filter(r.row["email"] == username).run(conn)
        try:
            user = cursor.next()
            if not user:
                return None
            email = user['email']
            hashed_pass = user['password']

            if username == email and hashed_pass == bcrypt.hashpw(password.encode('utf-8'), hashed_pass.encode('utf-8')):
                # return User(id=user['id'], username=email)
                return User(user['id'], email, hashed_pass)
        except r.ReqlCursorEmpty:
            return None

    def identity(self, payload):
        conn = rethink_conn.conn()
        print payload
        cursor = r.table("users").filter(r.row["id"] == payload['identity']).run(conn)
        try:
            user = cursor.next()
            # return User(id=user['id'], username=user['email'])
            print user
            return User(user['id'], user['email'], user["password"])
        except r.ReqlCursorEmpty:
            return None

    #TODO - Customize Payload expiration ?
    # @jwt.payload_handler
    # def make_payload(user):
    #     return {
    #         'user_id': user.id,
    #         'exp': datetime.utcnow() + timedelta(days=30)
    #     }


@auth.route("/app_login", methods=['POST'])
def login():
    print "LOGIN"
    json = request.get_json(force=True)
    email = json.get('username','').encode('utf-8')
    password = b"%s" % json.get('password', '').encode('utf-8')
    try:
        token = _auth.login(email, password)
        return jsonify({'status': 'OK', 'token': token})
    except:
        return jsonify({'status': 'error'})
        

#TODO: - ValidationError handler
@auth.route("/signup", methods=['POST'])
def signup():
    conn = rethink_conn.conn()
    json = request.get_json(force=True)
    email = json.get('username','')

    # Email validation
    if not re.match("^[^@ ]+@[^@ ]+\.[^@ ]+$", email):
        return jsonify({'status': 'Not a valid email'})

    already_taken = len(list(r.table("users").filter(
                    r.row["email"] == email).run(conn))) > 0
    if already_taken:
        return jsonify({'status': 'Already Taken'})

    password = b"%s" % json.get('password', '')
    # Create user
    token = _auth.create_user(email, password.encode('utf-8'))
    # Create Redis Token And Current Plan
    # TODO
    # days left till end of trial
    # end of current plan
    # billing cycle

    # return token
    return jsonify({'status': 'OK', 'token': token})

# TODO - ADD

@auth.route('/trial')
def free_trial():
    data = {"days_left": 1}
    return make_response(json.dumps(data))

@auth.route('/stripe/add_card')
def stripe_add_card():
    data = {"days_left": 1}
    return make_response(json.dumps(data))

@auth.route('/stripe/change_plan')
def stripe_change_plan():
    data = {"days_left": 1}
    return make_response(json.dumps(data))

