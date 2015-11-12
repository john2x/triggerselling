from splinter import Browser
import urllib2
import requests
from bs4 import BeautifulSoup
import json
import pandas as pd
from clearbit_search import ClearbitSearch
import rethinkdb as r
import redis
import os
import rethink_conn
#from queue import RQueue

from rq import Queue
from worker import conn
q = Queue(connection=conn)

class EmailHunter:
    def old_get(self, domain, api_key=""):
        #url = "http://api.emailhunter.co/v1/search?domain={0}&api_key=0191b3bdcf20b25b778da18bca995911cec0f630"
        url = "http://api.emailhunter.co/v1/search?domain={0}&api_key=493b454750ba86fd4bd6c2114238ef43696fce14"
        url = url.format(domain)
        # if emails found return
        html = requests.get(url).text
        print "EMAIL HUNTER"
        print html
        e = json.loads(html)
        e = pd.DataFrame(e["emails"])
        if e.empty: return 0
        e = e[e.type == "personal"]
        e = e[~e.value.str.contains("\+")]
        for i, row in e.iterrows():
            job = q.enqueue(ClearbitSearch()._email_search, row.value, api_key, timeout=6000)
            print "EMAILHUNTER", domain, api_key
            #RQueue()._meta(job, "{0}_{1}".format(domain, api_key))
            if i > 10: break
        return e.shape[0]

    def _parse_response(self, html):
        #html = response.body
        ep = json.loads(html)
        #print ep.keys()
        if "pattern" in ep.keys():
            del ep["emails"]
            if ep["pattern"] == "none":
                ep["stache"] = None
                ep["pattern"] = None
            else:
                data = {"first":"{{first}}","last":"{{last}}"}
                data["f"] = "{{first_initial}}"
                data["l"] = "{{last_initial}}"
                ep["stache"] = ep["pattern"].format(**data)
                ep["stache"] = ep["stache"]+"@{{domain}}"
        else:
            ep = None
        data = {"email_pattern":ep, "emailhunter_search_completed": r.now()}
        print data
        return data

    def _update_record(self, domain, _id):
        print "EMAIL HUNTER UPDATE RECORD"
        url = "http://api.emailhunter.co/v1/search?domain={0}&api_key=0191b3bdcf20b25b778da18bca995911cec0f630"
        conn = rethink_conn.conn()
        url = url.format(domain)
        # if emails found return
        html = requests.get(url).text
        ep = json.loads(html)
        print ep.keys()
        if "pattern" in ep.keys():
            del ep["emails"]
            if ep["pattern"] == "none":
                ep["stache"] = None
                ep["pattern"] = None
            else:
                data = {"first":"{{first}}","last":"{{last}}"}
                data["f"] = "{{first_initial}}"
                data["l"] = "{{last_initial}}"
                ep["stache"] = ep["pattern"].format(**data)
                ep["stache"] = ep["stache"]+"@{{domain}}"
        else:
            ep = None

        data = {"email_pattern":ep, "emailhunter_search_completed": r.now()}
        r.table('triggers').get(_id).update(data).run(conn)
