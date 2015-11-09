import os
import tornado.ioloop
import logging
import tornado.web
from async_research import *
import rethinkdb as r
from tornado import ioloop, gen
from schedule import *
from routes import app
import pusher
from scraping.company_api.company_name_to_domain import CompanyNameToDomain
from scraping.company_api.async_company_name_research import AsyncCompanyNameResearch
from scraping.email_pattern.email_hunter import EmailHunter
from scraping.email_pattern.clearbit_search import ClearbitSearch
from scraping.employee_search.employee_search import GoogleEmployeeSearch
from scraping.press.press import *
from tornadotools.route import Route
from websocket import *
from apscheduler.schedulers.tornado import TornadoScheduler
from tornado import ioloop, gen
from tornado.concurrent import Future, chain_future
import functools

import rethinkdb as r
import json
import rethink_conn

r.set_loop_type("tornado")
conn_future = rethink_conn.conn()
http_client = tornado.httpclient.AsyncHTTPClient()

''' RethinkDB Changefeeds Callbacks '''
r.set_loop_type("tornado")

from rq import Queue
from worker import conn as _conn
q = Queue("low", connection=_conn)
dq = Queue("default", connection=_conn)
hq = Queue("high", connection=_conn)

p = pusher.Pusher(
  app_id='149760',
  key='f1141b13a2bc9aa3b519',
  secret='11723dad11b83473ab2f',
  ssl=True,
  port=443
)

@gen.coroutine
def company_name_to_domain_changes():
    conn = yield r.connect(**rethink_conn.args())
    #feed = yield r.table('hiring_signals').changes().run(rethink_conn)
    feed = yield r.table('company_domain_research').changes().run(conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        qry = change["new_val"]["qry"]
        # TODO Score
        q = r.table('company_domain_research').filter({"qry":qry})
        searches = yield q.coerce_to("array").run(conn)
        print pd.DataFrame(searches).search_engine, qry
        domains = CompanyNameToDomain().score(qry, 
                    [pd.DataFrame(i["res"]) for i in searches])
        if domains:
            triggers = r.table("triggers").filter({"company_name":qry})
            triggers = yield triggers.coerce_to("array").run(conn)
            print "triggers", len(triggers)
            for t in triggers:
                domain = domains[0]["domain"]
                t=r.table("triggers").get(t["company_key"]).update({"domain":domain})
                yield t.run(conn)
        print domains

@gen.coroutine
def trigger_changes():
    """
    conn = yield r.connect(**rethink_conn.args())
    #feed = yield r.table('hiring_signals').changes().run(rethink_conn)
    feed = yield r.table('triggers').changes().run(conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        #print change
        if change["old_val"] == None:
            print "STARTING"
            a = [change["new_val"]["company_name"], change["new_val"]["company_key"]]
            j = dq.enqueue(CompanyNameToDomain()._update_company_record, *a)
            j.meta["company_name_to_domain"] = True
            j.save()

            a.append(None)
            a.append(change["new_val"]["profile"])
            j = dq.enqueue(GoogleEmployeeSearch()._update_employee_record, *a)
            j.meta["company_employee_search"] = True
            j.save()

        if "domain" in change["new_val"]:
            #if change["old_val"] == None or "domain" not in change["old_val"]:
            print "SECOND TIME ROUND"
            val = change["new_val"]
            args = [change["new_val"]["domain"], change["new_val"]["company_key"]]
            j = dq.enqueue(ClearbitSearch()._update_company_record, *args)
            j.meta["clearbit_company_search"] = True
            j.save()

            hq.enqueue(EmailHunter()._update_record, *args)
            j.meta["emailhunter_search_for_pattern"] = True
            j.save()

        cdrc = "company_domain_research_completed"
        ehsc = "emailhunter_search_completed"

        if ehsc in change["new_val"].keys() and cdrc in change["new_val"].keys():
            # TODO do filtering
            # TODO update counts
            # TODO update UI with pusher
            qry = r.table("triggers").filter({"profile":change["new_val"]})
            count = yield qry.count().run(conn)
            data = {"count": count}
            p.trigger('profile_count', change["new_val"]["profile"], data)

        if "email_pattern" in change["new_val"]:
            print "EMAIL_PATTERN"
            val = change["new_val"]
            a = [val["company_key"], val["email_pattern"]["pattern"], val["domain"]]
            hq.enqueue(ClearbitSearch()._bulk_update_employee_record, *a)
    """

#change_feed: python -u change_feed.py
@gen.coroutine
def email_pattern():
    feed = yield r.table('press_events').changes().run(rethink_conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        if change["old_val"] == None:
            http_client.fetch(url, AsyncPressScrape()._parse_response)

@gen.coroutine
def email_pattern():
    conn = yield r.connect(**rethink_conn.args())
    feed = yield r.table('email_pattern_crawls').changes().run(rethink_conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        print "EMAIL PATTERN CHANGE FEED"
        print "lol"
        print change
        # score email_pattern_crawl

''' Application Routes '''
@Route(r"/triggers")
class SimpleHandler5(tornado.web.RequestHandler):
    def get(self):
        # get all routes which belong to user or profile
        # TODO - include employees
        self.write( {"lol":"lmao"} )

@Route(r"/signals")
class SimpleHandler6(tornado.web.RequestHandler):
    def get(self):
        # TODO - get all routes which belong to
        self.write( {"lol":"lmao"} )

app = tornado.web.Application(Route.routes() + [
 (r'/send_message', SendMessageHandler)
] + sockjs.tornado.SockJSRouter(MessageHandler, '/sockjs').urls)

if __name__ == "__main__":
    app.listen(8988)
    #app.listen(8000)
    #app.listen(5000)
    #tornado.ioloop.IOLoop.current().add_callback(print_changes)
    tornado.ioloop.IOLoop.current().add_callback(company_name_to_domain_changes)
    tornado.ioloop.IOLoop.current().add_callback(trigger_changes)

    scheduler = TornadoScheduler()
    #scheduler.add_job(AsyncCompanyNameResearch().start, 'interval', seconds=1)
    scheduler.add_job(AsyncCompanyResearch().start, 'interval', seconds=1)
    scheduler.start()

    tornado.ioloop.IOLoop.current().start()
