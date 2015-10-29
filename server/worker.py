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

from raven import Client
from raven.transport.http import HTTPTransport
from rq.contrib.sentry import register_sentry

client = Client('https://a8eac57225094af19dde9bd29aec2487:90689fd1b88c475ba0e5c13ddb27d1d4@app.getsentry.com/55649', transport=HTTPTransport)

listen = ['high', 'default', 'low']

concurrency = 1

try:
  opts, args = getopt.getopt(sys.argv[1:],"c:",[])
except getopt.GetoptError:
  print 'worker.py -c <concurrency>'
  sys.exit(2)
for opt, arg in opts:
  if opt == '-c':
    concurrency = int(arg)

redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
conn = redis.from_url(redis_url)

def work():
  with Connection(conn):
    worker = Worker(map(Queue, listen), name=str(uuid.uuid1()))
    register_sentry(client, worker)
    worker.work()

if __name__ == '__main__':
  processes = [Process(target=work) for x in range(concurrency)]
  for process in processes:
    process.start()
  for process in processes:
    process.join()
