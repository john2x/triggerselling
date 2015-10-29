from functools import wraps
from flask import Flask, send_from_directory, render_template, make_response
from flask import request, abort
import redis
import arrow
import pandas
import simmetrica

# The actual decorator function
def require_appkey(view_function):
    @wraps(view_function)

    def decorated_function(*args, **kwargs):
        # get key out of http basic auth
        # if not there get key from Auth Bearer
        key = ""
        if r.get("{0}_plan".format(key)):
            requests_allowed = int(r.get("{0}_plan".format(key)))
          
            now = arrow.utcnow()
            start, end = now.replace(months=0).span('month')
            start, end = start.timestamp, end.timestamp

            qry_key = '{0}:requests:used'.format(key)
            results = list(simmetrica.query(qry_key, start, end, 'week'))
            val = pd.Series([int(val) for time, val in list(results)]).sum()

            if val < requests_allowed:
                # TODO do what the function is asking
            else:
                # 401 Unauthorized - Exceeded alotted number of requests for your 
                # plan for this month
                make_response(401)
    else:
        # 401 Unauthorized - key does not exist error
        make_response(401)

    return decorated_function
