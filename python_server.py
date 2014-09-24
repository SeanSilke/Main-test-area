import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.tcpclient
import json
from tornado import gen

class Client():
	def __init__(self,callback, ip, port):
		print 'New client is created',ip,port
		self.tcp_stream = None

		self.callback = callback
		self.TCP_IP = ip
		self.TCP_PORT = port

	@gen.coroutine
	def Connect(self):
		client = tornado.tcpclient.TCPClient()
		self.tcp_stream = yield client.connect(self.TCP_IP, self.TCP_PORT)		
		def callback(data):
			print data
			self.callback('send',data)
		self.tcp_stream.read_until_close(callback = callback,streaming_callback=callback)
		self.callback('event','connected')

	@gen.coroutine
	def Close(self):
		print 'close tcp connection with client'
		self.tcp_stream.close()
		self.callback('event','closed')

	@gen.coroutine
	def Write(self,command = 'print,/par/net/ip/addr:on'):
		yield self.tcp_stream.write(command + '\n')

class WebSocketHandler(tornado.websocket.WebSocketHandler):
	def __init__(self, *args, **kwargs):
		super(tornado.websocket.WebSocketHandler, self).__init__(*args, **kwargs)		
		self.client_dict = {}

	def on_close(self):
		print "WebSocket is closed"
		print "this tcp clients was created in this session:"
		for client_id in self.client_dict:
			print  " client_id", client_id
			self.client_dict[client_id].Close()

	def open(self):
		print "New WebSocket is open"

	def check_origin(self, origin):
		return True

	def on_message(self, message):
		msg = json.loads(message)
		if msg['type'] == "init":
			def callback(msg_type, msg_data):
				msg_id = msg['id']
				message = {"id":msg_id,"type":msg_type, "data":msg_data}
				s_message = json.dumps(message)
				self.write_message(s_message)
			client = Client(callback,**msg["data"])
			self.client_dict[msg['id']] = client
			client.Connect()
		else:
			try:
				client = self.client_dict[msg['id']]
			except KeyError:
				print "There no such client", msg['id']

		if msg['type'] == "close":
			client.Close()
			del self.client_dict[msg['id']]
		elif msg['type'] == "send":
			print 'on_message', str(msg['data'])
			client.Write(str(msg['data']))


app = tornado.web.Application([(r'/websocket', WebSocketHandler)])
app.listen(8888)
tornado.ioloop.IOLoop.instance().start()