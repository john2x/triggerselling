from google import Google
from fuzzywuzzy import fuzz
from search_engine import *
from worker import conn
import pandas as pd
import rethinkdb as r
import urlparse
import redis
import time
import bitmapist
import math
import os
import grequests
import rethink_conn

un, pw = "customero", "iUyET3ErxR"
CRAWLERA_URL = "http://{0}:{1}@paygo.crawlera.com/fetch?".format(un, pw)

#un, pw = "5846ea676dc7405eac44d83201127e7f", ""
#CRAWLERA_URL = "http://{0}:{1}@proxy.crawlera.com/fetch?".format(un, pw)

SPLASH_URL = "http://localhost:8950/render.html?"

class CompanyNameToDomain:
    def _search_engine_search(self,  company_name):
        qry = urllib.urlencode({"text":company_name})
        url ="https://www.yandex.com/search/?{0}".format(qry)
        url = CRAWLERA_URL + urllib.urlencode({'url':url})
        url = urllib.unquote_plus(url)
        yd_url = SPLASH_URL + urllib.urlencode({'url': url})

        # splash
        qry = urllib.urlencode({"q":company_name})
        url = "https://duckduckgo.com/?{0}".format(qry)
        url = CRAWLERA_URL + urllib.urlencode({'url':url})
        url = urllib.unquote_plus(url)
        dd_url = SPLASH_URL + urllib.urlencode({'url': url})

        qry = urllib.urlencode({"q":company_name})
        url = "http://www.bing.com/search?{0}".format(qry)
        bg_url = CRAWLERA_URL + urllib.urlencode({'url':url})

        args = urllib.urlencode({'q':company_name,'start':0,'num':100})
        url = 'https://www.google.com/search?'+ args
        g_url = CRAWLERA_URL + urllib.urlencode({'url':url})
        
        #urls = [yd_url, dd_url, bg_url, g_url]
        urls = [bg_url, g_url]
        reqs = grequests.map(grequests.get(u) for u in urls)
        g = pd.DataFrame()
        yd, dd, bg = g, g, g

        for i in reqs:
            try:
                i.text
            except:
                continue

            if "google" in i.url:
                g = Google()._results_html_to_df(i.text)
            elif "yandex" in i.url:
                yd = Yandex()._html_to_df(i.text)
            elif "duckduckgo" in i.url:
                dd = DuckDuckGo()._html_to_df(i.text)
            elif "bing" in i.url:
                bg = Bing()._html_to_df(i.text)

        return dd, g, yd, bg

    def get(self, company_name):
        dd, g, yd, bg = self._search_engine_search(company_name)
        """
        dd = DuckDuckGo().search(company_name)
        g  = Google().search(company_name)
        yd = Yandex().search(company_name)
        bg = Bing().search(company_name)
        """

        print "SEARCH ENGINE RESULTS", company_name
        print "===================="
        print g.shape, company_name
        print bg.shape, company_name
        print dd.shape, company_name
        print yd.shape, company_name

        if g.empty: g = pd.DataFrame(columns=["link","domain"])
        if yd.empty: yd = pd.DataFrame(columns=["link","domain"])
        if bg.empty: bg = pd.DataFrame(columns=["link","domain"])
        if dd.empty: dd = pd.DataFrame(columns=["link","domain"])

        #m = pd.concat([dd.ix[:10],g.ix[:10],yd.ix[:10],bg.ix[:10]])
        g["domain"] = [".".join(urlparse.urlparse(i).netloc.split(".")[-2:]) for i in g.link]
        yd["domain"] = [".".join(urlparse.urlparse(i).netloc.split(".")[-2:]) if i else "" for i in yd.link]
        bg["domain"] = [".".join(urlparse.urlparse(i).netloc.split(".")[-2:]) for i in bg.link]
        dd["domain"] = [".".join(urlparse.urlparse(i).netloc.split(".")[-2:]) if i else "" for i in dd.link]
        m = pd.concat([g.ix[:10].drop_duplicates("domain"),
                       yd.ix[:10].drop_duplicates("domain"),
                       dd.ix[:10].drop_duplicates("domain"),
                       bg.ix[:10].drop_duplicates("domain")])
        m = m.reset_index()
        m["domain"] = [".".join(urlparse.urlparse(i).netloc.split(".")[-2:]) for i in m.link]
        m = m[m.domain != ""]
        #print m[["link","domain"]]

        # Scoring based on frequency and rank of domain in all search engines
        a, b = m.domain.value_counts().ix[:10], m.groupby("domain").sum().sort("index").ix[:10]
        a, b = a.iloc[::-1], b.iloc[::-1]
        a,b = a.reset_index(), b.reset_index()
        a,b = a.reset_index(), b.reset_index()
        a.columns, b.columns = ["new_score","domain","old_score"], ["new_score","domain","old_score"]

        f = pd.concat([a,b]).groupby("domain").sum()
        f = f.sort("new_score", ascending=False)
        f["confidence"] = f.new_score / 8.0 *100
        full_domains = f.reset_index()
        domains = f[:3].reset_index()
        domains["fuzz_score"] = [fuzz.ratio(company_name, i) for i in domains.domain]
        domains = domains.sort("fuzz_score", ascending=False)
        domains = domains.to_dict("r")
        
        data = {"company_name": company_name, "short_list": domains, 
                "long_list":full_domains.to_dict("r"), 
                #TODO search engine results
                "google_results": g.shape,
                "bing_results": bg.shape,
                "yandex_results": yd.shape,
                "duckduckgo_results": dd.shape,
                "createdAt":arrow.now().timestamp,
                "selected": domains[0]["domain"]}
        conn = rethink_conn.conn()
        r.table("company_name_to_domain").insert(data).run(conn)

        try:
          print domains[0]["domain"]
          return domains
        except:
          return None

    def _update_company_record(self, company_name, _id):
        print "UPDATE RECORD FOR COMPANY NAME"
        start_time = time.time()
        domain = self.get(company_name)[0]["domain"]
        conn = rethink_conn.conn()
        #r.table('hiring_signals').get(_id).update({"domain":domain}).run(conn)
        print _id, domain
        print r.table('triggers').filter({"company_key":_id}).update({"domain":domain}, return_changes=True).run(conn)
        """
        bitmapist.mark_event("function:time:company_name_to_domain", 
                             int((time.time() - start_time)*10**6))
        """

        conn.zadd("function:time:company_name_to_domain",
                           str((time.time() - start_time)*10**6), 
                           arrow.now().timestamp)

#CompanyName().get("facebook inc")
