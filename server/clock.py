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

@sched.scheduled_job('interval', seconds=50)
def signals_schedule():
    print('signals job')
    """
    try:
        Signals()._cron()
    except Exception as e:
        print e
    """
    Signals()._cron()

@sched.scheduled_job('interval', seconds=100)
def press():
    print('press job')
    #PressScrape()._start()
    # adding press_events to profile
    # add press_events with profile to async cron

@sched.scheduled_job('cron', day_of_week='mon-fri', hour=17)
def scheduled_job():
    print('This job is run every weekday at 5pm.')

sched.start()
