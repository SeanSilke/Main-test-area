import logging
import tornado.ioloop
import tornado.web
import tornado.websocket
import os
import re




from tornado.httpclient import HTTPClient
from tornado.httpclient import AsyncHTTPClient
from tornado.options import define, options
from tornado import gen
from tornado.web import asynchronous

define("port", default=8888, help="run on the given port", type=int)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [    
            (r"/", MainHandler),
            (r"/static/(.*)", tornado.web.StaticFileHandler, {'path': "/home/sergey/Main-test-area/static"}),
            (r'/websocket', ChatWebSocket),    
        ]
        tornado.web.Application.__init__(self, handlers)



class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("chat.html")


class ChatWebSocket(tornado.websocket.WebSocketHandler):
    waiters = set()
#    command_dict = {"send":send}

    def open(self):
        logging.info("WebSocket opened")
        ChatWebSocket.waiters.add(self) 

    def on_close(self):
        logging.info("WebSocket closed")
        ChatWebSocket.waiters.remove(self)

    def check_origin(self, origin):        
        return True

    @classmethod  
    def send(cls, message):
#        cls.command_dict["send"]= cls.send
        logging.info("sending message to %d waiters", len(cls.waiters))
        for waiter in cls.waiters:            
            try:
                waiter.write_message(message)
            except:
                logging.error("Error sending message", exc_info=True)

    @classmethod
    def synchronous_fetch(cls, url):
        logging.info("fetching url: %s", url)
        http_client = HTTPClient()
        response = http_client.fetch(url)
        cls.send("request_time: " + str(response.request_time))

    @classmethod
    def asynchronous_fetch(cls, url):
        logging.info("asynchronous fetching url: %s", url)
        http_client = AsyncHTTPClient()
        def handle_response(response):            
            cls.send("request_time: " + str(response.request_time))
        response = http_client.fetch(url, callback=handle_response)
    
    @classmethod    
    @gen.coroutine 
    def fetch_coroutine(cls,url):
        logging.info("fetching url: %s", url)
        http_client = AsyncHTTPClient()
        response = yield http_client.fetch(url)
        logging.info("request_time: %s", response.request_time)      
        cls.send("request_time: " + str(response.request_time))



    def on_message(self, message):        
        match = re.search(r"(^\w+):\s(.+$)", message)        
        if match and match.group(1) == 'send':
            ChatWebSocket.send(match.group(2))
        elif match and match.group(1) == 'fetch':
            ChatWebSocket.synchronous_fetch(match.group(2))
        elif match and match.group(1) == 'afetch':
            ChatWebSocket.asynchronous_fetch(match.group(2))
        elif match and match.group(1) == 'gafetch':
            ChatWebSocket.fetch_coroutine(match.group(2))
        else:
            self.write_message(message + "<em> is not valid command</em>")
       

if __name__ == '__main__':
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()