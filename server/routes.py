import os
from flask import Flask, send_from_directory, render_template, make_response
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

from rq import Queue
from worker import conn as _conn
q = Queue("low", connection=_conn)
default_q = Queue("default", connection=_conn)
high_q = Queue("high", connection=_conn)

conn = r.connect(
  host='rethinkdb_tunnel',
  port=os.environ['RETHINKDB_TUNNEL_PORT_28015_TCP_PORT'],
  db=os.environ['RETHINKDB_DB'],
  auth_key=os.environ['RETHINKDB_AUTH_KEY']
)
app = Flask(__name__, static_url_path="", static_folder="client")
if 'DEBUG' in os.environ:
  app.debug = True

# TODO
# - real time web socket trigger for new results that come in the background
# - company research stats
# - create a table to address speed of researches
# - company name to domain still returns errors
#
# - make sure that the endpoints return same stuff every time
# - make create / delete / edit  signal modal work
# - auth
# - newrelic figure out which python process is so CPU intensive
#
# - press signals
# - twitter signals
#
# - integrations
# - onboarding modal

@app.route("/test_1")
def test_1():
    return "test_8"

@app.route("/domain/<company_name>")
def company_name_to_domain(company_name):
    data = CompanyNameToDomain().get(company_name)
    print data
    return make_response(json.dumps(data))


@app.route("/company_research")
def company_research():
  triggers = r.table("triggers").coerce_to("array").run(conn)

  for val in triggers:
      if "domain" not in val.keys(): continue
      print val["domain"]
      q.enqueue(ClearbitSearch()._update_company_record,
                val["domain"], val["company_key"])
  return make_response(json.dumps({"started":True}))

@app.route("/trigger_research")
def trigger_research():
  triggers = r.table("triggers").coerce_to("array").run(conn)

  for val in triggers:
      q.enqueue(CompanyNameToDomain()._update_company_record,
                val["company_name"], val["company_key"])
      q.enqueue(GoogleEmployeeSearch()._update_employee_record,
                val["company_name"], "", val["company_key"])
  return make_response(json.dumps({"started":True}))
  #return "Hello from python"

@app.route("/login")
def login():
  return render_template('signup.html')

@app.route("/signup")
def signup():
  return render_template('signup.html')

@app.route("/logout")
def logout():
    logout_user()
    return redirect(somewhere)

@app.route("/app")
#TODO requires authentication
def app_hello():
  return send_from_directory("client", "index.html")

@app.route("/test")
#TODO requires authentication
def test():
  #return app.send_static_file('static/landing/landing_page.html')
  return render_template('landing_page.html')

@app.route("/")
#TODO requires authentication
def hello():
  #return app.send_static_file('static/landing/landing_page.html')
  return render_template('landing_page.html')

# application routes
@app.route("/profiles")
@crossdomain(origin='*')
def profiles():
  profiles = r.table("prospect_profiles").coerce_to("array").run(conn)
  #return flask.jsonify(**{"lol":"lmao"})
  return make_response(json.dumps(profiles))

# application routes
@app.route("/profile/<_id>/companies")
@crossdomain(origin='*')
def profile_companies():
    profiles = r.table("prospect_profiles").coerce_to("array").run(conn)
    #return flask.jsonify(**{"lol":"lmao"})
    return make_response(json.dumps(profiles))

@app.route("/triggers")
@crossdomain(origin='*')
def triggers():
    #data = r.table("triggers").limit(50).coerce_to("array").run(conn)
    data = r.table("triggers").eq_join("profile",
           r.table("prospect_profiles")).coerce_to("array").zip().run(conn)
    #data = pd.DataFrame(data)
    data = pd.DataFrame(data).dropna()
    data = data[[i for i in data.columns
                 if "company_domain_research" not in i]]
    # TODO
    # load triggers with completed domain research
    data = data[data.domain.notnull()].to_dict("r")[:2]
    print data
    return make_response(json.dumps(data))

@app.route("/profiles/<_id>")
@crossdomain(origin='*')
def profile_id(_id):
    data = r.table("prospect_profiles").get(_id).coerce_to("array").run(conn)
    return make_response(json.dumps(data))

@app.route("/company/<_id>")
def company_id(_id):
    data = r.table("triggers").get(_id).coerce_to("array").run(conn)
    #return render_template('landing_page.html')
    return make_response(json.dumps(data))

@app.route("/companies/<domain>")
@crossdomain(origin='*')
def company_info(domain):
    data = r.table("companies").filter({"domain":domain}).run(conn)
    try:
      data = list(data)[0]
    except:
      data = {}
    return make_response(json.dumps(data))

@app.route("/company/<_id>/employees")
@crossdomain(origin='*')
def company_employees(_id):
    print _id
    data = r.table("company_employees").filter({"company_id":_id}).coerce_to("array").run(conn)
    #return render_template('landing_page.html')
    #data = [1,2,3]
    return make_response(json.dumps(data))

# Redis Datastructures
# URL Set to Crawl for each source
# User Profiles Stored in hash
# => Twitter Profiles
# => Job Profiles
# => Press Profiles
# => Industry Profiles
# User Company Domains stored in hash

# Features / Reqs
# Real-time String filtering
# Real-time Property Filtering
# Real-time feed/ml scoring
# Add Activity Feeds
# Fan Out Adding To Feeds

# Clearspark
# => Subscribing to a list of domains
# => User specific feeds

# TriggerIQ
# [press, industry]
# => Subscribing to an event

# [twitter, jobs]
# => Subscribing to an event
# => do a string match
# => and then add to feed

# TODO
# Generate Fake Test Data For Schema
