import requests
import schedule
from scraping.signals import Signals
from scraping.press.press_scrapy import *
from apscheduler.schedulers.blocking import BlockingScheduler
from scraping.company_api.company_name_to_domain import CompanyNameToDomain
from scraping.email_pattern.email_hunter import EmailHunter
from scraping.email_pattern.clearbit_search import ClearbitSearch
from scraping.employee_search.employee_search import GoogleEmployeeSearch
import pusher
import logging
from stats import Stats
logging.basicConfig()
from rq import Queue
from worker import conn as _conn

q = Queue("low", connection=_conn)
dq = Queue("default", connection=_conn)
hq = Queue("high", connection=_conn)
import rethink_conn
sched = BlockingScheduler()
p = pusher.Pusher( app_id='149760', key='f1141b13a2bc9aa3b519', secret='11723dad11b83473ab2f', ssl=True, port=443)

@sched.scheduled_job('interval', seconds=5)
def signals_schedule():
    print('signals job')
    """
    try:
        Signals()._cron()
    except Exception as e:
        print e
    """
    PressScrape()._start()

"""
@sched.scheduled_job('interval', seconds=0.5)
def timed_job():
    print('profile_count')
    conn = rethink_conn.conn()
    t = pd.DataFrame(list(r.table("triggers").run(conn)))
    if t.empty: return
    data = t.profile.value_counts().to_dict()
    for d in data.keys():
        p.trigger('profile_count', d, data[d])

@sched.scheduled_job('interval', seconds=0.5)
def timed_job():
    print "stats job"
    #high_q.enqueue(Stats()._cron)
    #Stats()._cron()
    #Stats()._cron()

@sched.scheduled_job('interval', seconds=2)
def timed_job():
    print "stats job"
    conn = rethink_conn.conn()
    triggers = pd.DataFrame(r.table("triggers").coerce_to("array").run(conn))
    triggers = triggers.sort("createdAt",ascending=False)#.to_dict("r")
    cdrc = "company_domain_research_completed"
    epsc = "employee_search_completed"
    ehsc = "emailhunter_search_completed"

    t1, t2, t3 = triggers, triggers, triggers
    if cdrc in triggers.columns:
        t1 = triggers[triggers[cdrc].isnull()]

    if epsc in triggers.columns:
        t2 = triggers[triggers[epsc].isnull()]

    if ehsc in triggers.columns:
        t3 = triggers[triggers[ehsc].isnull()]

    for val in t1[t1.domain.notnull()].to_dict("r")[:100]:
        args = [val["domain"], val["company_key"]]
        print "CLEARBIT EMP CRON"
        dq.enqueue(ClearbitSearch()._update_company_record, *args)

    for val in t2.to_dict("r")[:100]:
        args = [val["domain"], val["company_key"]]
        print "GOOGLE EMP CRON"
        dq.enqueue(GoogleEmployeeSearch()._update_employee_record,
                   val["company_name"], val["company_key"], None, val["profile"])

    for val in t3[t3.domain.notnull()].to_dict("r")[:100]:
        args = [val["domain"], val["company_key"]]
        print "EMAILHUNTER EMP CRON"
        hq.enqueue(EmailHunter()._update_record, *args)

@sched.scheduled_job('cron', day_of_week='mon-fri', hour=17)
def scheduled_job():
    print('This job is run every weekday at 5pm.')
"""

sched.start()
