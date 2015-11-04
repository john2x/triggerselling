from pusher import Pusher
import os
import rethinkdb as r
import pandas as pd
import arrow
import pusher
import redis

p = pusher.Pusher(
  app_id='149760',
  key='f1141b13a2bc9aa3b519',
  secret='11723dad11b83473ab2f',
  ssl=True,
  port=443
)

from rq import Queue
from worker import conn as _conn
import rethink_conn

q = Queue("low", connection=_conn)
dq = Queue("default", connection=_conn)
hq = Queue("high", connection=_conn)

rd = redis.Redis()
class Stats:
    def _profile_value_counts(self):
        conn = rethink_conn.conn()
        t = pd.DataFrame(list(r.table("triggers").run(conn)))
        data = t.profile.value_counts().to_dict()
        p.trigger('admin_dashboard', 'profile_value_counts', data)

    def _rq_job_counts(self):
        data = [len(q.jobs), len(dq.jobs), len(hq.jobs)]
        p.trigger('admin_dashboard', 'rq_job_counts', data)

    def _average_value_counts(self):
      rd = redis.Redis()
      metrics = ["function:time:company_name_to_domain",
              "function:time:clearbit_search_company_record",
              "function:time:bulk_update_employee_record",
              "function:time:company_employee_search",
              "function:time:simplyhired_job_scrape",
              "function:time:indeed_job_scrape",
              "function:time:ziprecruiter_job_scrape"]

      for m in metrics:
          zr = pd.DataFrame(rd.zrange(m, 0, -1, withscores=True))
          zr = zr.astype("float")
          if zr.empty: continue
          zr.columns = ["a","b"]
          data = {"mean": zr.a.mean()/ 10**6,
                 "median":  zr.a.median()/ 10**6,
                 "min":   zr.a.min()/ 10**6,
                 "max":   zr.a.max()/ 10**6,
                 "amount":   len(zr.a)/ 10**6,
                 "raw":     zr.to_dict("r")[-15:],
                 "per_second":   len(zr.a) / (zr.b.max() - zr.b.min() / 10**6)}
          p.trigger('admin_dashboard', m, data) 

    def _percentage_counts(self):
        conn = rethink_conn.conn()
        t = pd.DataFrame(list(r.table("triggers").run(conn)))
        e = pd.DataFrame(list(r.table("company_employees").run(conn)))

        have_employees = len(e.company_id.drop_duplicates())
        have_domain = len(t.domain.dropna())
        cdrc = "company_domain_research_completed"
        have_cb = len(t[cdrc].dropna())
        have_ep = len(t.email_pattern.dropna())

        t = pd.DataFrame(list(r.table("triggers").run(conn)))
        data = {
          "_all": t.shape[0],
          "have_employees": have_employees,
          "have_domain": have_domain,
          "have_cb": have_cb,
          "have_ep": have_ep,
        }
        data = data.values()
        
        _data = {
          "_all": t.shape[0],
          "have_employees": (float(have_employees) / t.shape[0])*100,
          "have_domain": (float(have_domain) / t.shape[0] )*100,
          "have_cb": (float(have_cb) / t.shape[0])*100,
          "have_ep": (float(have_ep) / t.shape[0])*100,
        }
        
        _data = _data.values()

        p.trigger('admin_dashboard', "total_counts", data) 
        p.trigger('admin_dashboard', "percentage_counts", _data) 
        

    def _cron(self):
        conn = rethink_conn.conn()
        t = pd.DataFrame(list(r.table("triggers").run(conn)))
        if t.empty: return
        self._profile_value_counts()
        #self._rq_job_counts()
        self._average_value_counts()
        self._percentage_counts()
