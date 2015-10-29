import os
import tornado.ioloop
import logging
import tornado.web
import rethinkdb as r
from tornado import ioloop, gen
from schedule import *
from routes import app
from scraping.company_api.company_name_to_domain import CompanyNameToDomain
from scraping.email_pattern.email_hunter import EmailHunter
from scraping.email_pattern.clearbit_search import ClearbitSearch
from scraping.employee_search.employee_search import GoogleEmployeeSearch
from scraping.press.press import *
from tornadotools.route import Route
from websocket import *

import rethinkdb as r
import json

''' RethinkDB Changefeeds Callbacks '''
r.set_loop_type("tornado")

from rq import Queue
from worker import conn as _conn
#q = Queue(connection=_conn)
q = Queue("low", connection=_conn)
dq = Queue("default", connection=_conn)
hq = Queue("high", connection=_conn)


@gen.coroutine
def trigger_changes():
    if 'DEBUG' in os.environ:
        app.debug = True
        rethink_conn = yield r.connect(db="triggeriq")
    else:
        rethink_conn = yield r.connect(
          #host='rethinkdb_tunnel',
          host=os.environ['RETHINKDB_HOST'],
          port=os.environ['RETHINKDB_TUNNEL_PORT_28015_TCP_PORT'],
          db=os.environ['RETHINKDB_DB'],
          auth_key=os.environ['RETHINKDB_AUTH_KEY']
        )
    #feed = yield r.table('hiring_signals').changes().run(rethink_conn)
    feed = yield r.table('triggers').changes().run(rethink_conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        print change
        if change["old_val"] == None:
            print "STARTING"
            a = [change["new_val"]["company_name"], change["new_val"]["company_key"]]
            j = dq.enqueue(CompanyNameToDomain()._update_company_record, *a)
            j.meta["company_name_to_domain"] = True
            j.save()
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

            # TODO update UI with pusher
        if "email_pattern" in change["new_val"]:
            print "EMAIL_PATTERN"
            """
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
        if "newswire.ca" in df.link:
            q.enqueue(NewsWire()._parse_article_html, objectId, row.url)
        elif "prnewswire" in df.link:
            q.enqueue(PRNewsWire()._parse_article_html, objectId, row.url)
        elif "businesswire" in df.link:
            q.enqueue(BusinessWire()._parse_article_html, objectId, row.url)
        elif "marketwire" in df.link:
            q.enqueue(MarketWired()._parse_article_html, objectId, row.url)

@gen.coroutine
def email_pattern():
    if 'DEBUG' in os.environ:
        app.debug = True
        rethink_conn = yield r.connect(db="triggeriq")
    else:
        rethink_conn = yield r.connect(
          #host='rethinkdb_tunnel',
          host=os.environ['RETHINKDB_HOST'],
          port=os.environ['RETHINKDB_TUNNEL_PORT_28015_TCP_PORT'],
          db=os.environ['RETHINKDB_DB'],
          auth_key=os.environ['RETHINKDB_AUTH_KEY']
        )
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
    tornado.ioloop.IOLoop.current().add_callback(trigger_changes)
    tornado.ioloop.IOLoop.current().start()
