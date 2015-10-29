import requests
import schedule
from scraping.signals import Signals
from scraping.press.press_scrapy import *
from apscheduler.schedulers.blocking import BlockingScheduler
import logging
from stats import Stats
logging.basicConfig()

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

@sched.scheduled_job('interval', seconds=100)
def timed_job():
    print('This job is run every three minutes.')
    Signals()._cron()
    #PressScrape()._start()

@sched.scheduled_job('interval', seconds=5)
def timed_job():
    print "stats job"
    #high_q.enqueue(Stats()._cron)
    Stats()._cron()

@sched.scheduled_job('cron', day_of_week='mon-fri', hour=17)
def scheduled_job():
    print('This job is run every weekday at 5pm.')

sched.start()
