import requests
import rethink_conn
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
import redis

r.set_loop_type("tornado")
conn_future = rethink_conn.conn()
http_client = tornado.httpclient.AsyncHTTPClient()

class AsyncPressScrape:
    def _parse_response(self, response)
        conn = yield conn_future
        if response.code != 200:
            http_client.fetch(effective_url, AsyncPressScrape()._parse_response)
        if "newswire.ca" in response.effective_url:
            data = NewsWire()._parse_article_html(response.body)
        elif "prnewswire" in response.effective_url:
            data = PRNewsWire()._parse_article_html(response.body)
        elif "businesswire" in response.effective_url:
            data = BusinessWire()._parse_article_html(response.body)
        elif "marketwire" in response.effective_url:
            data = MarketWired()._parse_article_html(response.body)

        press = yield r.table("press_events").get(response.request.url).run(conn)
        yield press.update(data).run(conn)

    def _async_profile_add(self):
        """ """
        # query and add to profiles
        # add to profiles
        
    def _async_event_research(self):
        """ """
        # Cron Job To research only if there in a profile
        # email hunter + clearbit research domain
        # employee search
        # TODO filter

    def _remove_non_ascii(self, text):
        try:
            return ''.join(i for i in text if ord(i)<128)
        except:
            return text
