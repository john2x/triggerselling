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

from worker import conn as _conn
import rethink_conn

q = Queue("low", connection=_conn)
dq = Queue("default", connection=_conn)
hq = Queue("high", connection=_conn)

# daily press email
# daily twitter email
# daily job email

print "starting clock"
from rq import Queue
from worker import conn as _conn
q = Queue("low", connection=_conn)
dq = Queue("default", connection=_conn)
hq = Queue("high", connection=_conn)

sched = BlockingScheduler()

p = pusher.Pusher(
  app_id='149760',
  key='f1141b13a2bc9aa3b519',
  secret='11723dad11b83473ab2f',
  ssl=True,
  port=443
)

@sched.scheduled_job('interval', seconds=10)
def timed_job():
    print('signals job')
    #Signals()._cron()
    #PressScrape()._start()

@sched.scheduled_job('interval', seconds=0.5)
def timed_job():
    print('profile_count')
    conn = rethink_conn.conn()
    t = pd.DataFrame(list(r.table("triggers").run(conn)))
    data = t.profile.value_counts().to_dict()
    for d in data.keys():
        p.trigger('profile_count', d, data[d])

@sched.scheduled_job('interval', seconds=0.5)
def timed_job():
    print "stats job"
    #high_q.enqueue(Stats()._cron)
    Stats()._cron()

@sched.scheduled_job('interval', seconds=20)
def timed_job():
    print "stats job"
    conn = rethink_conn.conn()
    triggers = r.table("triggers").coerce_to("array").run(conn)
    for val in triggers:
        if "domain" not in val.keys():
            print val
            dq.enqueue(CompanyNameToDomain()._update_company_record,
                       val["company_name"], val["company_key"])
            dq.enqueue(GoogleEmployeeSearch()._update_employee_record,
                       val["company_name"], val["company_key"], None, val["profile"])
            continue
        args = [val["domain"], val["company_key"]]
        print args
        cdrc = "company_domain_research_completed"
        ehsc = "emailhunter_search_completed"
        ehsc = "employee_search_completed"
        dq.enqueue(ClearbitSearch()._update_company_record, *args)
        hq.enqueue(EmailHunter()._update_record, *args)

@sched.scheduled_job('cron', day_of_week='mon-fri', hour=17)
def scheduled_job():
    print('This job is run every weekday at 5pm.')

sched.start()
