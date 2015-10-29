import os
from flask import Flask, send_from_directory, render_template, make_response, request
import pandas as pd
from redis import Redis
from rq_scheduler import Scheduler
from datetime import datetime
from crossdomain import crossdomain
import rethinkdb as r
import json
from scraping.company_api.company_name_to_domain import CompanyNameToDomain
from scraping.email_pattern.email_hunter import EmailHunter
from scraping.email_pattern.clearbit_search import ClearbitSearch
from scraping.employee_search.employee_search import GoogleEmployeeSearch
import logging
import sys
from auth import Auth, auth
from flask_jwt import JWT, jwt_required, current_identity

from raven.contrib.flask import Sentry

from rq import Queue
from worker import conn as _conn
import rethink_conn
q = Queue("low", connection=_conn)
dq = Queue("default", connection=_conn)
hq = Queue("high", connection=_conn)

app = Flask(__name__, static_url_path="", static_folder="client")
app.debug = True
sentry = Sentry(app, dsn='https://a8eac57225094af19dde9bd29aec2487:90689fd1b88c475ba0e5c13ddb27d1d4@app.getsentry.com/55649')
Auth(app)


# Authentication Routes
"""
@app.route("/login")
def login():
  return render_template('signup.html')

@app.route("/signup")
def signup():
  return render_template('signup.html')

@app.route("/logout")
def logout():
    return redirect(somewhere)
"""

# TODO
# - auth
# - real time web socket trigger for new results that come in the background
# - company research stats
# - create a table to address speed of researches
# - company name to domain still returns errors
#
# - make sure that the endpoints return same stuff every time
# - make create / delete / edit  signal modal work
# - newrelic figure out which python process is so CPU intensive
#
# - press signals
# - twitter signals
#
# - integrations
# - onboarding modal

@app.route("/test_1")
@jwt_required()
def test_1():
    return "test_8"

@app.route("/domain/<company_name>")
def company_name_to_domain(company_name):
    conn = rethink_conn.conn()
    data = CompanyNameToDomain().get(company_name)
    print data
    return make_response(json.dumps(data))

@app.route("/company_research")
def company_research():
    conn = rethink_conn.conn()
    triggers = r.table("triggers").coerce_to("array").run(conn)
    for val in triggers:
        if "domain" not in val.keys(): continue
        print val["domain"]
        dq.enqueue(ClearbitSearch()._update_company_record,
                  val["domain"], val["company_key"])
    return make_response(json.dumps({"started":True}))

@app.route("/trigger_research")
def trigger_research():
    conn = rethink_conn.conn()
    triggers = r.table("triggers").coerce_to("array").run(conn)

    for val in triggers:
        dq.enqueue(CompanyNameToDomain()._update_company_record,
                  val["company_name"], val["company_key"])
        dq.enqueue(GoogleEmployeeSearch()._update_employee_record,
                  val["company_name"], "", val["company_key"])
    return make_response(json.dumps({"started":True}))
    #return "Hello from python"

@app.route("/")

#TODO requires authentication
def hello():
  #return app.send_static_file('static/landing/landing_page.html')
  return send_from_directory("client", "index.html")

# application routes
@app.route("/profiles", methods=["GET","POST","PUT"])
@crossdomain(origin='*')
def profiles():
    conn = rethink_conn.conn()
    profiles = r.table("prospect_profiles").coerce_to("array").run(conn)
    return make_response(json.dumps(profiles))

@app.route("/stripe_upgrade", methods=["GET","POST","PUT"])
@crossdomain(origin='*')
def stripe_upgrade():
    conn = rethink_conn.conn()
    profiles = r.table("prospect_profiles").coerce_to("array").run(conn)
    return make_response(json.dumps(profiles))

# application routes
@app.route("/profile/<_id>/companies")
@crossdomain(origin='*')
def profile_companies():
    conn = rethink_conn.conn()
    profiles = r.table("prospect_profiles").coerce_to("array").run(conn)
    #return flask.jsonify(**{"lol":"lmao"})
    return make_response(json.dumps(profiles))

@app.route("/triggers")
@crossdomain(origin='*')
def triggers():
    # TODO paginate
    #data = r.table("triggers").limit(50).coerce_to("array").run(conn)
    conn = rethink_conn.conn()
    data = r.table("triggers").eq_join("profile",
           r.table("prospect_profiles")).coerce_to("array").zip().run(conn)
    #data = pd.DataFrame(data)
    data = pd.DataFrame(data).dropna()
    data = data[[i for i in data.columns
                 if "company_domain_research" not in i]]
    # TODO
    # load triggers with completed domain research
    data = data[data.domain.notnull()].to_dict("r")[:30]
    print data
    return make_response(json.dumps(data))

@app.route("/profiles/<_id>")
@crossdomain(origin='*')
def profile_id(_id):
    conn = rethink_conn.conn()
    data = r.table("prospect_profiles").get(_id).coerce_to("array").run(conn)
    return make_response(json.dumps(data))

@app.route("/company/<_id>")
def company_id(_id):
    conn = rethink_conn.conn()
    data = r.table("triggers").get(_id).coerce_to("array").run(conn)
    return make_response(json.dumps(data))

@app.route("/companies/<domain>")
@crossdomain(origin='*')
def company_info(domain):
    conn = rethink_conn.conn()
    data = r.table("companies").filter({"domain":domain}).run(conn)
    try:
      data = list(data)[0]
    except:
      data = {}
    return make_response(json.dumps(data))

@app.route("/company/<_id>/employees")
#@jwt_required()
# add simmetrica events
# timing requests
@crossdomain(origin='*')
def company_employees(_id):
    # TODO - create company employee keys
    print _id
    # current_identity
    conn = rethink_conn.conn()
    qry = {"company_id":_id}
    data = r.table("company_employees").filter(qry).coerce_to("array").run(conn)
    return make_response(json.dumps(data))

@app.route("/api_key_test")
#@require_appkey
@crossdomain(origin='*')
def api_key_test():
    data = {"authenticated":True}
    print request.__dict__
    #key = user_id or jwt_token
    simmetrica.push('{0}:requests:used'.format(key))
    return make_response(json.dumps(data))

@app.route('/lmao')
def lol_test():
    data = {"test":"lmao"}
    return make_response(json.dumps(data))

@app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=7000)

