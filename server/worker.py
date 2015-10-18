import os
import uuid
import redis
from rq import Worker, Queue, Connection
import urlparse
import getopt
import sys
from multiprocessing import Process
import bugsnag
from splinter import Browser

# Preload heavy libraries
from bs4 import BeautifulSoup
import pandas as pd
import requests

bugsnag.configure(
  api_key = "2556d33391f9accc8ea79325cd78ab62"
)

listen = ['high', 'default', 'low']

redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
conn = redis.from_url(redis_url)

def work():
  with Connection(conn):
    Worker(map(Queue, listen), name=str(uuid.uuid1()), exc_handler=my_handler).work()

def my_handler(job, exc_type, exc_value, traceback):
  bugsnag.notify(traceback, meta_data={"type":exc_type,
                                       "value":exc_value,
                                       "source": "prospecter-api"})

if __name__ == '__main__':
  work()
