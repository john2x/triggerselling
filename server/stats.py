from pusher import Pusher
import os
import rethinkdb as r
import pandas as pd
import arrow
import pusher

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
        """ """

    def _cron(self):
        self._profile_value_counts()
        self._rq_job_counts()
