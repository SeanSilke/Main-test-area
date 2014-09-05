

import time
import tornado.web
from tornado.options import define, options
from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, asynchronous, Application
from tornado import gen


define("port", default=8888, help="run on the given port", type=int)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [    
            (r"/", MainHandler), 
        ]
        tornado.web.Application.__init__(self, handlers)



class MainHandler(RequestHandler):
    @asynchronous
#    @gen.engine
    @gen.coroutine 
    def get(self):
        self.write("sleeping .... ")
        self.flush()
        # Do nothing for 5 sec
        yield gen.Task(IOLoop.instance().add_timeout, IOLoop.instance().time() + 5)
        self.write("I'm awake!")
        self.flush()

        yield gen.Task(IOLoop.instance().add_timeout, IOLoop.instance().time() + 5)
        self.write("I'm awake2!")
        self.flush()
        self.finish()
"""        
        yield gen.Task(IOLoop.instance().add_timeout, IOLoop.instance().time() + 5)
        self.write("I'm awake!")
        yield gen.Task(IOLoop.instance().add_timeout, IOLoop.instance().time() + 5)
        self.write("I'm awake!")
        yield gen.Task(IOLoop.instance().add_timeout, IOLoop.instance().time() + 5)
        self.write("I'm awake!")
        yield gen.Task(IOLoop.instance().add_timeout, time.time() + 5)
        self.write("I'm awake!")
        yield gen.Task(IOLoop.instance().add_timeout, time.time() + 5)
        self.write("I'm awake!")
        yield gen.Task(IOLoop.instance().add_timeout, time.time() + 5)
"""

if __name__ == '__main__':
    options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()