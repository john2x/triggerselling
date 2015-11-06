from splinter import Browser
import requests
from bs4 import BeautifulSoup
import pandas as pd
import urllib
import time
import os
from google import Google
from worker import conn
import rq
#from queue import RQueue
from rq import Queue
from worker import conn
#from crawl import *
from fuzzywuzzy import fuzz
import rethink_conn
import rethinkdb as r
import redis
import arrow
import time
import bitmapist
import math
#from jigsaw import *

rd = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379'))
q = Queue(connection=conn)

class LinkedinTitleDir:
  def test(self, company_name):
      job = rq.get_current_job()
      print job.meta.keys()
      if "queue_name" in job.meta.keys():
        print RQueue()._has_completed(job.meta["queue_name"])
        print RQueue()._has_completed("queue_name")
        if RQueue()._has_completed(job.meta["queue_name"]):
          q.enqueue(Jigsaw()._upload_csv, job.meta["company_name"])

  def _search(self, company_name, api_key=""):
    qry = 'site:linkedin.com inurl:"at-{0}" inurl:title -inurl:job'
    #TODO - remove, all [".","'",","]
    name = company_name.strip().lower().replace(" ","-")
    dirs = Google().search(qry.format(name), 1)
    for url in dirs.url:
      q.enqueue(LinkedinTitleDir().parse, url, company_name)

  def parse(self, url, company_name):
    cache = Google().cache(url)
    soup = BeautifulSoup(cache)
    p = []

    for i in soup.find_all("div",{"class":"entityblock"}):
        try:
          img = i.find("img")["data-delayed-url"]
        except:
          img = i.find("img")["src"]
        profile = i.find("a")["href"]
        name = i.find("h3",{"class":"name"})
        name = name.text if name else ""
        title = i.find("p",{"class":"headline"})
        title = title.text if title else ""
        company = title.split("at ")[-1]
        title = title.split(" at ")[0]
        city = i.find("dd")
        city = city.text if city else ""
        cols = ["img","profile","name","title","city", "company"]
        vals = [img, profile, name, title, city, company]
        print vals
        p.append(dict(zip(cols, vals)))
    print p
    results = pd.DataFrame(p)
    if " " in company_name:
        results['company_score'] = [fuzz.partial_ratio(company_name, company)
                                    for company in results.company]
    else:
        results['company_score'] = [fuzz.ratio(company_name, company)
                                    for company in results.company]
    results = results[(results.company_score > 64)]
    data = {'data': results.to_dict("r"), 'company_name':company_name}
    CompanyExtraInfoCrawl()._persist(data, "employees", "")

    job = rq.get_current_job()
    print job.meta.keys()
    if "queue_name" in job.meta.keys():
      if RQueue()._has_completed(job.meta["queue_name"]):
        q.enqueue(Jigsaw()._upload_csv, job.meta["company_name"])

    return p

class GoogleEmployeeSearch:
    def _url(self, company_name, keyword=""):
        args = '-inurl:"/dir/" -inurl:"/find/" -inurl:"/updates" -inurl:"/title/" -inurl:"/pulse/"'
        args = args+' -inurl:"job" -inurl:"jobs2" -inurl:"company"'
        qry = '"at {0}" {1} {2} site:linkedin.com'
        qry = qry.format(company_name, args, keyword)

        page = 0
        args = urllib.urlencode({'q':qry,'start':page*100,'num':100})
        url = 'https://www.google.com/search?'+ args

        un, pw = "customero", "iUyET3ErxR"
        cloak = "http://{0}:{1}@paygo.crawlera.com/fetch?".format(un, pw)
        # TODO - urllib
        cloak = cloak + urllib.urlencode({"url": cloak})
        return cloak

    def _employees(self, company_name="", keyword=None):
        ''' Linkedin Scrape '''
        # TODO - add linkedin directory search
        ''' Linkedin Scrape'''
        args = '-inurl:"/dir/" -inurl:"/find/" -inurl:"/updates" -inurl:"/title/" -inurl:"/pulse/"'
        args = args+' -inurl:"job" -inurl:"jobs2" -inurl:"company"'
        qry = '"at {0}" {1} {2} site:linkedin.com'
        qry = qry.format(company_name, args, keyword)
        #results = Google().search(qry, 10)
        results = Google().search(qry, 1)
        results = results.dropna()
        results = Google()._google_df_to_linkedin_df(results)
        _name = '(?i){0}'.format(company_name)
        print results.columns
        if results.empty: 
            print "No employees found for", company_name, keyword
            return results

        if " " in company_name:
            results['company_score'] = [fuzz.partial_ratio(_name, company) 
                                        for company in results.company_name]
        else:
            results['company_score'] = [fuzz.ratio(_name, company) 
                                        for company in results.company_name]
        if keyword:
            results['score'] = [fuzz.partial_ratio(keyword, title) 
                                for title in results.title]
            results = results[results.score > 75]
        results = results[results.company_score > 49]
        results = results.drop_duplicates()
        return results

    def _parse_response(self, html, company_name, keyword=None):
        results = Google()._results_html_to_df(html)
        results = results.dropna()
        results = Google()._google_df_to_linkedin_df(results)
        _name = '(?i){0}'.format(company_name)
        print results.columns
        if results.empty: 
            print "No employees found for", company_name, keyword
            return results

        if " " in company_name:
            results['company_score'] = [fuzz.partial_ratio(_name, company) 
                                        for company in results.company_name]
        else:
            results['company_score'] = [fuzz.ratio(_name, company) 
                                        for company in results.company_name]
        if keyword:
            results['score'] = [fuzz.partial_ratio(keyword, title) 
                                for title in results.title]
            results = results[results.score > 75]
        results = results[results.company_score > 49]
        results = results.drop_duplicates()
        return results

    def _update_employee_record(self, company_name,  _id, keyword=None, profile_id=None):
        #conn = r.connect(host="localhost", port=28015, db="triggeriq")
        conn = rethink_conn.conn()
        _profile = r.table("prospect_profiles").get(profile_id).run(conn)
        if "titles" not in _profile.keys(): _profile["titles"] = [None]
        if len(_profile["titles"]) == 0: profile["titles"] = [None]
        for title in _profile["titles"]:
            args = [company_name, _id, title, profile_id]
            q.enqueue(GoogleEmployeeSearch()._get_employee_record, *args)
        
    def _get_employee_record(self, company_name,  _id, keyword=None, profile_id=None):
        start_time = time.time()
        #conn = r.connect(host="localhost", port=28015, db="triggeriq")
        conn = rethink_conn.conn()
        res = self._employees(company_name, keyword)
        res["company_id"] = _id
        res["profile_id"] = profile_id
        print "EMPLOYEES FOUND", company_name, res.shape

        r.table('company_employees').insert(res.to_dict("r")).run(conn)
        epsc = "employee_search_completed"
        r.table("triggers").get(_id).update({epsc: r.now()}).run(conn)

        bitmapist.mark_event("function:time:company_employee_search", 
                             int((time.time() - start_time)*10**6))
        rd.zadd("function:time:company_employee_search", 
                           str((time.time() - start_time)*10**6), 
                           arrow.now().timestamp)

