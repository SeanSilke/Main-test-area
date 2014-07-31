import tornado.ioloop
import tornado.web
import tornado.websocket

from tornado.options import define, options, parse_command_line

define("port", default=8888, help="run on the given port", type=int)

# dictionary to store clients in 
clients = []

"""
 JavaScript line to make connection
 //var ws = new WebSocket("ws://localhost:8888/websocket");
 var ws = new WebSocket("ws://sergey-vn:8888/websocket");
 ws.onmessage = function(evn){console.log(evn.data)}
 ws.send('Hi')
"""

class ChatWebSocket(tornado.websocket.WebSocketHandler):    
    def open(self):
        print "WebSocket opened"   
#        self.id = self.get_argument("Id")
        clients.append(self)        

    def on_message(self, message):
        for client in clients:
        	if client == self:
        		client.write_message(u"You said: " + message)
        	else:
        		client.write_message(u"Other one said: " + message)
        print(message);

    def on_close(self):
        print "WebSocket closed"
        clients.remove(self)


    def check_origin(self, origin):        
        return True


app = tornado.web.Application([
    (r'/websocket', ChatWebSocket),
])

if __name__ == '__main__':
    parse_command_line()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()