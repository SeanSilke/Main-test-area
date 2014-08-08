import logging
import tornado.ioloop
import tornado.web
import tornado.websocket
import os

from tornado.options import define, options

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

    def open(self):
        logging.info("WebSocket opened")
        ChatWebSocket.waiters.add(self) 

    def on_close(self):
        logging.info("WebSocket closed")
        ChatWebSocket.waiters.remove(self)

    def check_origin(self, origin):        
        return True

    @classmethod  
    def send_updates(cls, message):
        logging.info("sending message to %d waiters", len(cls.waiters))
        for waiter in cls.waiters:            
            try:
                waiter.write_message(message)
            except:
                logging.error("Error sending message", exc_info=True)        

    def on_message(self, message):
        ChatWebSocket.send_updates(message)

if __name__ == '__main__':
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()