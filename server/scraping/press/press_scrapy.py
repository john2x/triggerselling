import requests
#from press import *
from bs4 import BeautifulSoup
from splinter import Browser
from press_classification import PressClassification
import feedparser
import pandas as pd
from fuzzywuzzy import fuzz, process
from fuzzywuzzy import process
import arrow
from time import mktime
#import newspaper
import tldextract
import urllib
#from parse import Parse
import calendar
import rethinkdb as r
import arrow
from time import mktime
from datetime import datetime



from rq import Queue
from worker import conn as _conn
q = Queue("low", connection=_conn)
default_q = Queue("default", connection=_conn)
high_q = Queue("high", connection=_conn)


class PressScrape:
    def _start(self):
        r = requests.get("http://www.prweb.com/rss.htm")
        prweb_vals, prweb_sub = {}, {}
        for i in BeautifulSoup(r.text).find("table").find_all("tr"):
            if "Business: " in i.find("td").text:
                prweb_sub[i.find("td").text.split("Business: ")[-1]] = "http://www.prweb.com"+i.find_all("td")[1].find("a")["href"]

            if "Industry: " in i.find("td").text:
                prweb_vals[i.find("td").text.split("Industry: ")[-1]] = "http://www.prweb.com"+i.find_all("td")[1].find("a")["href"]

        #marketwired
        mw_vals, mw_sub = {}, {}
        r = requests.get("http://www.marketwired.com/News_Room/rss_newsfeeds")
        for row in BeautifulSoup(r.text).find_all("tr",{"class":"ByIndustry"}):
            mw_vals[row.find("a").text] = row.find_all("a")[1]["href"]

        for row in BeautifulSoup(r.text).find_all("tr",{"class":"BySubject"}):
            name = row.find("td").text.strip()
            url = row.find_all("a")[1]["href"].split("rss?url=")[-1]
            url = urllib.unquote_plus(url)
            mw_sub[name.split("\t")[-1]] = url

        # prnewswire
        r = requests.get("http://www.prnewswire.com/rss/")
        pnw_vals, pnw_sub = {}, {}
        found = False
        for row in BeautifulSoup(r.text).find_all("tr"):
            if row.find("th"):
                found = "Industry" in row.find("th").text

            if found:
                if row.find("a"):
                    link = row.find_all("button")
                    for i in link:
                        if i.find("i")["class"] == ["icon-rss"]:
                            link = "http://prnewswire.com"+i["onclick"].split("'")[1]
                    pnw_vals[row.find("a").text] = link.strip()

        # BusinessWire
        r = requests.get("http://www.businesswire.com/portal/site/home/news/industries/")
        bw_vals, bw_sub = {}, {}
        for tr in BeautifulSoup(r.text).find("table",{"id":"newsbyIndustry"}).find_all("tr"):
            link = tr.find("td",{"class":"rss"}).find("a")["href"]
            name = tr.find("a").text
            bw_vals[name] = link

        r = requests.get("http://www.businesswire.com/portal/site/home/news/subjects/")

        for tr in BeautifulSoup(r.text).find("table",{"id":"newsbySubject"}).find_all("tr"):
            link = tr.find("td",{"class":"rss"}).find("a")["href"]
            name = tr.find("a").text
            bw_sub[name] = link

        # cnw dict
        # Industry
        cnw_vals, cnw_sub = {}, {}
        """
        r = requests.get("http://www.newswire.ca/en/rss")
        for row in BeautifulSoup(r.text).find("table").find_all("table")[-1].find_all("tr"):
            for a in row.find_all("a"):
                if "RSS" in a.text:
                    cnw_vals[row.find_all("td")[1].text] = a["href"]

        r = requests.get("http://www.newswire.ca/en/rss")
        for row in BeautifulSoup(r.text).find("table").find_all("table")[-3].find_all("tr"):
            for a in row.find_all("a"):
                if "RSS" in a.text:
                    cnw_sub[row.find_all("td")[1].text] = a["href"]
        """

        # Merge
        ind = dict(bw_vals.items() + mw_vals.items() + pnw_vals.items() + prweb_vals.items()+ cnw_vals.items())
        sub = dict(bw_sub.items() + mw_sub.items() + pnw_sub.items() + prweb_sub.items()+ cnw_sub.items())
        print len(ind.keys()), len(sub.keys())

        for i in ind.keys():
            pind = PressClassification()._industries()
            if i not in pind.keys(): continue
            print pind[i], ind[i] 
            q.enqueue(PressScrape()._request, ind[i], "industry", pind[i])

        for i in sub.keys():
            psub = PressClassification()._subjects()
            if i not in psub.keys(): continue
            print psub[i], sub[i]  
            q.enqueue(PressScrape()._request, sub[i], "subject", psub[i])

    def _request(self, url, key, value):
        domain = "{}.{}".format(tldextract.extract(url).domain,
                                tldextract.extract(url).tld)
        feed = pd.DataFrame(feedparser.parse(url)["entries"])
        #feed["subject"] = name
        feed[key] = value
        feed["source"] = domain.split(".")[0].lower()
        data = feed.applymap(lambda x: self._remove_non_ascii(x))
        data["url"] = url
        if "published_parsed" in data.columns:
            ar = [arrow.get(datetime.fromtimestamp(mktime(i))).timestamp 
                                 for i in data.published_parsed]
            data["timestamp"] = ar

            del data["published_parsed"]
        print data.ix[0]
        data = [row.dropna().to_dict() for i, row in data.iterrows()]
        conn = r.connect(db="triggeriq")
        r.table("press_events").insert(data).run(conn)

    def _remove_non_ascii(self, text):
        try:
            return ''.join(i for i in text if ord(i)<128)
        except:
            return text
