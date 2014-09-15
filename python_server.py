import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.tcpclient
import json
from tornado import gen



class Receiver():
	def __init__(self,callback, ip, port,login, password):
		print 'New receiver is created'
		print ip,port,login,password, "end"
		self.state = 'init'
		self.tcp_stream = None
		self.buff = ''

		self.callback = callback
		self.TCP_IP = ip
		self.TCP_PORT = port
		self.login = str(login)
		self.password = str(password)

	@gen.coroutine
	def streaming_callback(self, data):
		print data
		self.buff+=data

	@gen.coroutine
	def Login(self):
		client = tornado.tcpclient.TCPClient()
		stream = yield client.connect(self.TCP_IP, self.TCP_PORT)
		callback = self.callback
		self.state = 'connecting'
		callback('event','connecting')			
		while self.state != 'logged':
			print "hello1"
			yield stream.read_bytes(1024, streaming_callback = self.streaming_callback)
			print "hello2"
			#self.buff += yield stream.read_bytes(1024,  partial=True) #Should we remove "partiona = True?"
			callback('send',self.buff)
			if  self.state == 'connecting' and'login:' in self.buff:
				yield stream.write(self.login + '\n')
				self.buff = ''
				self.state = "password"
				callback('event','login_in')
			if  self.state =='password' and 'Password:' in self.buff:
				yield stream.write(self.password + '\n')
				self.buff = ''
				self.state = 'approval'
			if  self.state == 'approval' and "Logged in on" in self.buff:
				self.state = 'logged'
				print 'Successfull Connect '
				callback('event','logged')
		self.tcp_stream = stream

	@gen.coroutine
	def Close(self):
		print 'close tcp connection with receiver'
		self.tcp_stream.close()
		self.callback('event','closed')

	@gen.coroutine
	def Write(self,command = 'print,/par/net/ip/addr:on'):
		yield self.tcp_stream.write(command + '\n')
		data = yield self.tcp_stream.read_bytes(1024,  partial=True)
		print 'response: ',str(data)
		self.callback('send',data)


class WebSocketHandler(tornado.websocket.WebSocketHandler):
	def __init__(self, *args, **kwargs):
		super(tornado.websocket.WebSocketHandler, self).__init__(*args, **kwargs)		
		self.receiver_dict = {}

	def on_close(self):
		print "WebSocket is closed"
		print "this receiver was created in this session:"
		for receiver_id in self.receiver_dict:
			print  " receiver_id", receiver_id
			self.receiver_dict[receiver_id].Close()

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
			receiver = Receiver(callback,**msg["data"])
			self.receiver_dict[msg['id']] = receiver
			receiver.Login()
		else:
			try:
				receiver = self.receiver_dict[msg['id']]
			except KeyError:
				print "There no such receiver", msg['id']

		if msg['type'] == "close":
			receiver.Close()
			del self.receiver_dict[msg['id']]
		elif msg['type'] == "send":
			print 'on_message', str(msg['data'])
			receiver.Write(str(msg['data']))



"""
@gen.engine
def main():
	print 'HI'
	def test_callback(msg_type, msg_data):
		print  msg_type, msg_data

	receiver = Receiver(test_callback,1,3,4,5)
	yield receiver.Login()
	yield receiver.Write()
	yield receiver.Close()

main()
"""


app = tornado.web.Application([(r'/websocket', WebSocketHandler)])
app.listen(8888)
tornado.ioloop.IOLoop.instance().start()