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
"""
"""

#change_feed: python -u change_feed.py
@gen.coroutine
def print_changes():
    rethink_conn = yield r.connect(host="localhost", port=28015, db="triggeriq")
    feed = yield r.table('mytable').changes().run(rethink_conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        print "lol"
        print change

@gen.coroutine
def email_pattern():
    rethink_conn = yield r.connect(host="localhost", port=28015, db="triggeriq")
    feed = yield r.table('email_pattern_crawls').changes().run(rethink_conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        print "EMAIL PATTERN CHANGE FEED"
        print "lol"
        print change
        # score email_pattern_crawl

@gen.coroutine
def trigger_changes():
    rethink_conn = yield r.connect(host="localhost", port=28015, db="triggeriq")
    #feed = yield r.table('hiring_signals').changes().run(rethink_conn)
    feed = yield r.table('triggers').changes().run(rethink_conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        print change
        if change["old_val"] == None:
            print "STARTING"
            a = [change["new_val"]["company_name"], change["new_val"]["company_key"]]
            q.enqueue(CompanyNameToDomain()._update_company_record, change["new_val"]["company_name"],change["new_val"]["company_key"])
            q.enqueue(GoogleEmployeeSearch()._update_employee_record, *a)
        if "domain" in change["new_val"]:
            #if change["old_val"] == None or "domain" not in change["old_val"]:
            print "SECOND TIME ROUND"
            val = change["new_val"]
            args = [change["new_val"]["domain"], change["new_val"]["company_key"]]
            dq.enqueue(ClearbitSearch()._update_company_record, *args)
            hq.enqueue(EmailHunter()._update_record, *args)

            # TODO socket.io integration
        if "email_pattern" in change["new_val"]: 
            print "EMAIL_PATTERN"
            """
            val = change["new_val"]
            a = [val["company_key"], val["email_pattern"]["pattern"], val["domain"]]
            hq.enqueue(ClearbitSearch()._bulk_update_employee_record, *a)
            """
        
''' Application Routes '''
@Route(r"/trigger_research")
class SimpleHandler(tornado.web.RequestHandler):
    def get(self):
        #self.write("Hello, world")
        conn = yield r.connect(host="localhost", port=28015, db="triggeriq")
        feed = yield r.table('triggers').changes().run(conn)
        while (yield feed.fetch_next()):
            val = yield feed.next()
            q.enqueue(CompanyNameToDomain()._update_record, 
                      val["company_name"], val["company_key"])
            q.enqueue(GoogleEmployeeSearch()._update_record, 
                      val["company_name"], "", val["company_key"])

        self.write( {"print":"research"} )

@Route(r"/test_with_name", name="test")
class SimpleHandler2(tornado.web.RequestHandler):
    def get(self):
        #self.write("Hello, world")
        self.write( {"lol":"lmao"} )

@Route(r"/test_with_init", initialize={'init': 'dictionary'})
class SimpleHandler3(tornado.web.RequestHandler):
    pass

@Route(r"/profiles")
class SimpleHandler4(tornado.web.RequestHandler):
    def get(self):
        # TODO - get all routes which belong to certain user
        self.write( {"lol":"lmao"} )

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
    tornado.ioloop.IOLoop.current().add_callback(print_changes)
    tornado.ioloop.IOLoop.current().add_callback(trigger_changes)
    tornado.ioloop.IOLoop.current().start()
