import tornado.ioloop
import tornado.web
import tornado.websocket

from tornado import tcpclient
from tornado import gen

@gen.coroutine
def login(wsocket, stream):		
	state = 'login'
	buff = ''
	while state != 'success':
		buff += yield stream.read_bytes(1024,  partial=True)
		print buff
		wsocket.write_message(buff)		
		if  state == 'login' and'login:' in buff:			
			yield stream.write('a' + '\n')
			buff = ''
			state = "password"
		if  state =='password' and 'Password:' in buff:
			yield stream.write('b' + '\n')
			buff = ''
			state = 'approval'
		if  state == 'approval' and "Logged in on" in buff:
			state = 'success'
			print 'Successfull Connect '
	raise gen.Return(stream)	


@gen.coroutine
def main(wsocket,TCP_IP,TCP_PORT):
	client = tcpclient.TCPClient()	
	stream = yield client.connect(TCP_IP, TCP_PORT)	
	stream = yield login(wsocket,stream)
	raise gen.Return(stream)	

class WebSocketHandler(tornado.websocket.WebSocketHandler):

	def open(self):		
		print 'opened'
		self.tcp_stream = None

	@gen.coroutine
	def on_message(self, message):								
		if self.tcp_stream:
			self.write_message(str(message))						
			yield self.tcp_stream.write(str(message) + '\n')
			data = yield self.tcp_stream.read_bytes(1024,  partial=True)
			self.write_message(data)	
		else:
			print "message", message
			param_list = message.split()
			TCP_IP = str(param_list[0])
			TCP_PORT = int(param_list[1])
			self.tcp_stream = yield main(self,TCP_IP, TCP_PORT)
			

	def on_close(self):
		print "close"

	def check_origin(self, origin):
		return True

app = tornado.web.Application([(r'/websocket', WebSocketHandler)])

app.listen(8888)
tornado.ioloop.IOLoop.instance().start()