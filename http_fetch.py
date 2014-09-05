import tornado.ioloop
from tornado.httpclient import AsyncHTTPClient

def handle_request(response):
    if response.error:
        print "Error:", response.error
    else:
        print 'called'
#        print response.body
        print response.request_time
        tornado.ioloop.IOLoop.instance().stop()


http_client = AsyncHTTPClient() # we initialize our http client instance
http_client.fetch("http://www.google.com/", handle_request) # here we try
                    # to fetch an url and delegate its response to callback
                    
tornado.ioloop.IOLoop.instance().start() # start the tornado ioloop to
                    # listen for events

