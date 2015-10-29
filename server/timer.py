import time

def timefunc(f):
    def f_timer(*args, **kwargs):
        start = time.time()
        result = f(*args, **kwargs)
        end = time.time()
        print f.__name__, 'took', end - start, 'time'
        # TODO
        # persist to redis sorted set
        # use bitmaps?
        return result
    return f_timer
