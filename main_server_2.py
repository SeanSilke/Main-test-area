import tornado.ioloop
import tornado.web
import tornado.websocket
import json


class WebSocketHandler(tornado.websocket.WebSocketHandler):
	def __init__(self, *args, **kwargs):
		super(tornado.websocket.WebSocketHandler, self).__init__(*args, **kwargs)		
		self.test_text = "Hello world"

	def on_close(self):
		print "WebSocket is closed"

	def open(self):
		print "New WebSocket is open"

	def check_origin(self, origin):
		return True

	def on_message(self, message):
		msg = json.loads(message)
		print message, msg['type'], self.test_text
		self.write_message(message)

app = tornado.web.Application([(r'/websocket', WebSocketHandler)])
app.listen(8888)
tornado.ioloop.IOLoop.instance().start()