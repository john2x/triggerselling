import tornado.httpclient
import rethinkdb as r
import rethink_conn
from apscheduler.schedulers.tornado import TornadoScheduler
from tornado import ioloop, gen
from tornado.concurrent import Future, chain_future
import functools
from company_name_to_domain import CompanyNameToDomain
import pandas as pd

r.set_loop_type("tornado")
conn_future = rethink_conn.conn()
http_client = tornado.httpclient.AsyncHTTPClient()

class AsyncCompanyNameResearch:
    @tornado.gen.coroutine
    def handle_response(self, response):
        conn = yield conn_future
        if response.code != 200:
            return
            http_client.fetch(response.effective_url, 
            AsyncCompanyNameResearch().handle_response)

        df = CompanyNameToDomain()._persist(response)
        #print response.effective_url, df
        #print df["search_engine"], df["qry"] 
        yield r.table('company_domain_research').insert(df).run(conn)
        # persist to rethinkdb
        
    @tornado.gen.coroutine
    def start(self):
        conn = yield conn_future
        triggers = yield r.table("triggers").coerce_to("array").run(conn)
        triggers = pd.DataFrame(triggers).drop_duplicates("company_name")
        if "domain" in triggers.columns:
            triggers = triggers[triggers.domain.isnull()]
        triggers = triggers.sort("createdAt",ascending=False)
        for i, trigger in triggers.head(50).iterrows():
            if trigger["company_name"] == 100: continue
            for url in CompanyNameToDomain()._make_urls(trigger["company_name"]):
                http_client.fetch(url, AsyncCompanyNameResearch().handle_response)
