import tornado.httpclient
import rethinkdb as r
import rethink_conn
from apscheduler.schedulers.tornado import TornadoScheduler
from tornado import ioloop, gen
from tornado.concurrent import Future, chain_future
import functools
from scraping.company_api.company_name_to_domain import CompanyNameToDomain
from scraping.employee_search.employee_search import GoogleEmployeeSearch
from scraping.email_pattern.email_hunter import EmailHunter
import json
import pandas as pd
import urlparse
import urllib

r.set_loop_type("tornado")
conn_future = rethink_conn.conn()
http_client = tornado.httpclient.AsyncHTTPClient()

class AsyncCompanyResearch:
    @tornado.gen.coroutine
    def handle_response(self, response):
        conn = yield conn_future
        if response.code != 200:
            """ """

    @tornado.gen.coroutine
    def clearbit_response(self, response):
        conn = yield conn_future
        if response.code != 200:
            """ """
        print "clearbit", response.code
        company = json.loads(response.body)
        yield r.table('companies').insert(company).run(conn)
        data = {"company_domain_research_completed": r.now()} 
        try:
            t = r.table('triggers').filter({"domain": company["domain"]})
        except:
            print response.code
            print company
            return
        t = yield t.coerce_to("array").run(conn)
        for i in t: 
            yield r.table("triggers").get(i["company_key"]).update(data).run(conn)

    @tornado.gen.coroutine
    def parse_employees(self, response):
        conn = yield conn_future
        d = dict(urlparse.parse_qsl(urlparse.urlparse(response.effective_url).query))
        print d, "employees", response.code
        if response.code != 200: return
        res = GoogleEmployeeSearch()._parse_response(response.body, d["company_name"])
        print "employees found", d["company_name"], res.shape
        yield r.table('company_employees').insert(res.to_dict("r")).run(conn)
        epsc = "employee_search_completed"
        yield r.table("triggers").get(d["company_key"]).update({epsc: r.now()}).run(conn)

    @tornado.gen.coroutine
    def emailhunter_response(self, response):
        conn = yield conn_future
        data = EmailHunter()._parse_response(response.body)
        print "emailhunter", response.code
        yield r.table('triggers').get(_id).update(data).run(conn)
        ehsc = "emailhunter_search_completed"
        t = r.table('triggers').filter({"domain": company["domain"]})
        t = yield t.coerce_to("array").run(conn)
        for i in t: 
            yield r.table("triggers").get(i["company_key"]).update(data).run(conn)

    @tornado.gen.coroutine
    def start(self):
        #print "started"
        conn = yield conn_future
        triggers = r.table("triggers").eq_join("profile",r.table("prospect_profiles"))
        triggers = yield triggers.zip().coerce_to("array").run(conn)
        triggers = pd.DataFrame(triggers)
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


        print t1[t1.domain.notnull()].shape
        print t2[t2.domain.notnull()].shape
        print t3[t3.domain.notnull()].shape

        for val in t1[t1.domain.notnull()].to_dict("r")[:100]:
            #print "CLEARBIT EMP CRON"
            api_key = "dc80f4192b73cca928f4e7c284b46573"
            url='https://{0}:@company-stream.clearbit.com/v1/companies/domain/{1}?{2}'
            args = urllib.urlencode({"company_key":val["company_key"]})
            url = url.format(api_key, val["domain"], args)
            http_client.fetch(url, AsyncCompanyResearch().clearbit_response)

        for val in t2.to_dict("r")[:100]:
            #print "GOOGLE EMP CRON"
            if "titles" in val.keys(): val["titles"] = [None]
            if val["titles"] == []: val["titles"] = [None]

            for title in val["titles"]:
                args = [val["company_name"], title]
                url  = GoogleEmployeeSearch()._url(*args)

            args = [val["company_name"], val["company_key"], None, val["profile"]]
            cols = ["company_name", "company_key","title","profile"]
            url = url + "&" + urllib.urlencode(dict(zip(cols, args)))
            http_client.fetch(url, AsyncCompanyResearch().parse_employees)

        for val in t3[t3.domain.notnull()].to_dict("r")[:100]:
            #print "EMAILHUNTER EMP CRON"
            api_key = "493b454750ba86fd4bd6c2114238ef43696fce14"
            url = "http://api.emailhunter.co/v1/search?domain={0}&api_key={1}"
            url = url.format(val["domain"], api_key)
            http_client.fetch(url, AsyncCompanyResearch().emailhunter_response)

