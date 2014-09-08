import tornado.ioloop
import tornado.web
import tornado.websocket


class WebSocketHandler(tornado.websocket.WebSocketHandler):

	def on_close(self):
		print "WebSocket is closed"

	def open(self):
		print "New WebSocket is open"

	def check_origin(self, origin):
		return True

	def on_message(self, message):
		print message
		self.write_message(message)

app = tornado.web.Application([(r'/websocket', WebSocketHandler)])
app.listen(8888)
tornado.ioloop.IOLoop.instance().start()