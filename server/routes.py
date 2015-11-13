import os
from flask import Flask, send_from_directory, render_template, make_response, request
import pandas as pd
from redis import Redis
from worker import conn
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
import arrow
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

# TODO
# - create a table to address speed of researches
# - make create / delete / edit  signal modal work
# - newrelic figure out which python process is so CPU intensive
# - figure out how to make press signals work with counts
# - integrations
# - onboarding modal
#conn = rethink_conn.conn()

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
        if "domain" not in val.keys(): continue
        print val["domain"]
        dq.enqueue(CompanyNameToDomain()._update_company_record,
                  val["company_name"], val["company_key"])
        dq.enqueue(GoogleEmployeeSearch()._update_employee_record,
                  val["company_name"], "", val["company_key"])
    return make_response(json.dumps({"started":True}))

@app.route("/")
def hello():
  #return app.send_static_file('static/landing/landing_page.html')
  return send_from_directory("client", "index.html")

# application routes
@app.route("/profiles", methods=["GET","POST","PUT"])
@crossdomain(origin='*')
def profiles():
    conn = rethink_conn.conn()
    profiles = r.table("prospect_profiles").coerce_to("array").run(conn)
    #profiles = profiles.order_by("createdAt")
    return make_response(json.dumps(profiles))

@app.route("/stripe_upgrade", methods=["GET","POST","PUT"])
@crossdomain(origin='*')
def stripe_upgrade():
    conn = rethink_conn.conn()
    profiles = r.table("prospect_profiles").coerce_to("array").run(conn)
    return make_response(json.dumps(profiles))

# application routes
@app.route("/profile/<profile_id>/companies")
@crossdomain(origin='*')
def profile_companies(profile_id):
    conn = rethink_conn.conn()
    data = r.table("triggers").filter(lambda trigger: trigger.has_fields("domain"))
    data = data.filter({"profile":profile_id})
    data = data.order_by("timestamp")
    data = data.without(["company_domain_research_completed","employee_search_completed","emailhunter_search_completed"])
    data = data.eq_join("profile", r.table("prospect_profiles")).zip()
    data = data.run(conn)
    return make_response(json.dumps(data))

@app.route("/profile/<profile_id>/employees")
@crossdomain(origin='*')
def profile_employees(profile_id):
    conn = rethink_conn.conn()
    data = r.table("triggers").filter(lambda trigger: trigger.has_fields("domain"))
    data = data.filter({"profile":profile_id})
    data = data.order_by("createdAt")
    #data = data.order_by("timestamp")
    data = data.without(["company_domain_research_completed","employee_search_completed","emailhunter_search_completed"])
    data = data.eq_join("profile", r.table("prospect_profiles")).zip()
    d = list(data.run(conn))

    e = pd.DataFrame(list(r.table("company_employees").run(conn)))
    ee = e[e.company_id.isin(pd.DataFrame(d).company_key.tolist())]
    emp = ee.columns.tolist()
    emp[0] = "company_key"
    ee.columns = emp
    em = pd.merge(ee, pd.DataFrame(d),on="company_key")

    return make_response(json.dumps(em.to_dict("r")))

@app.route("/triggers/<page>")
@crossdomain(origin='*')
def triggers(page=0):
    # TODO paginate
    #data = r.table("triggers").limit(50).coerce_to("array").run(conn)
    print page
    page = int(page)
    conn = rethink_conn.conn()
    #.distinct(index="domain")
    data = r.table("triggers").filter(lambda trigger: trigger.has_fields("domain"))
    #data = data.order_by("created_at")
    data = data.order_by(r.desc("timestamp"))
    data = data.without(["company_domain_research_completed","employee_search_completed","emailhunter_search_completed"])
    data = data.eq_join("profile", r.table("prospect_profiles"))
    data = data.slice(page*50, (page+1)*50).limit(50).zip()
    #data = data.without([])
    data = list(data.run(conn))
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

@app.route("/timeline/<profile_id>")
#@require_appkey
def profile_timeline(profile_id):
    conn = rethink_conn.conn()
    t = r.table("triggers").filter({"profile":profile_id})
    t = t.without(["company_domain_research_completed","employee_search_completed","emailhunter_search_completed"])
    t = t.run(conn)
    t = pd.DataFrame(list(t))
    t.index = [arrow.get(i).datetime for i in t.timestamp.fillna(0)]

    e = pd.DataFrame(list(r.table("company_employees").run(conn)))
    tstamps = map(str, t.index.to_period("D").unique())
    dtimes = [arrow.get(i).timestamp for i in t.index.to_period("D").to_timestamp().unique()]
    keys = [t[i].company_key.unique().tolist() for i in tstamps]
    cos = [t[t.company_key.isin(key)].fillna("").to_dict("r") for key in keys]
    emps = [e[e.company_id.isin(key)].fillna("").to_dict("r") for key in keys]
    final = [{"timestamp":dtimes[i], "cos":cos[i],"emps":emps[i]} for i in range(len(keys))]
    return make_response(json.dumps(final))

@app.route("/<profile_id>/triggers/<page>")
#@require_appkey
def profile_triggers(profile_id, page=0):
    #TODO - add filter profile_id filter
    page = int(page)
    conn = rethink_conn.conn()

    data = r.table("triggers").filter(lambda trigger: trigger.has_fields("domain"))
    data = data.filter({"profile":profile_id})
    data = data.order_by(r.desc("timestamp"))
    data = data.without(["company_domain_research_completed","employee_search_completed","emailhunter_search_completed"])
    data = data.eq_join("profile", r.table("prospect_profiles")).zip()
    data = data.slice(page*50, (page+1)*50).limit(50)
    data = list(data.run(conn))
    return make_response(json.dumps(data))

@app.route("/<profile_id>/count")
#@require_appkey
def profile_counts(profile_id):
    #TODO - add filter profile_id filter
    conn = rethink_conn.conn()
    t = pd.DataFrame(list(r.table("triggers").filter({"profile":profile_id}).run(conn)))
    e = pd.DataFrame(list(r.table("company_employees").run(conn)))
    ee = len(e[e.company_id.isin(t.company_key.unique())])
    data = {"count":t.shape[0], "employee_count":ee}
    return make_response(json.dumps(data))

@app.route("/<profile_id>/trigger/employees")
#@require_appkey
def profile_trigger_employees(profile_id):
    #TODO - add filter profile_id filter
    conn = rethink_conn.conn()
    t = pd.DataFrame(list(r.table("triggers").run(conn)))
    # get employees
    return make_response(json.dumps(t.to_dict()))

@app.route("/redis/stats/<stat>")
@crossdomain(origin='*')
def redis_stats(stat):
    #rd = redis.Redis()
    print conn
    zr = conn.zrange(stat, 0, -1, withscores=True)
    return make_response(json.dumps(zr))

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

