import tornado.ioloop
from tornado.httpclient import AsyncHTTPClient
#from tornado.concurrent import Future
from tornado import gen

"""
def async_fetch_future(url):
    http_client = AsyncHTTPClient()
#    my_future = Future()
    fetch_future = http_client.fetch(url)
    def a(f):
    	print f.result().request_time
    fetch_future.add_done_callback( a )
#    return my_future

async_fetch_future("http://www.google.com/")
"""


@gen.coroutine
def fetch_coroutine(url):
	print "fetching url:", url	
	http_client = AsyncHTTPClient()	
	response =  yield http_client.fetch(url)	
	print response.request_time	


fetch_coroutine("http://www.google.com/")
fetch_coroutine("http://www.ya.ru")
fetch_coroutine("http://www.google.com/")
fetch_coroutine("http://www.ya.ru")
fetch_coroutine("http://www.google.com/")
fetch_coroutine("http://www.ya.ru")


tornado.ioloop.IOLoop.instance().start()