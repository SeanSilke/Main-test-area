import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.tcpclient
import json
from tornado import gen



class Receiver():
	def __init__(self,callback):
		print 'New receiver is created'
		self.state = 'init'
		self.tcp_stream = None

		self.callback = callback
		self.TCP_IP = '172.30.0.42'
		self.TCP_PORT = 8002
		self.login = 'a'
		self.password = 'b'

	@gen.coroutine
	def Login(self):
		client = tornado.tcpclient.TCPClient()
		stream = yield client.connect(self.TCP_IP, self.TCP_PORT)
		callback = self.callback
		self.state = 'connecting'
		callback('event','connecting')
		buff = ''
		while self.state != 'logged':
			buff += yield stream.read_bytes(1024,  partial=True) #Should we remove partiona = True?
			print buff
			callback('send',buff)
			if  self.state == 'connecting' and'login:' in buff:
				yield stream.write(self.login + '\n')
				buff = ''
				self.state = "password"
				callback('event','login_in')
			if  self.state =='password' and 'Password:' in buff:
				yield stream.write(self.password + '\n')
				buff = ''
				self.state = 'approval'
			if  self.state == 'approval' and "Logged in on" in buff:
				self.state = 'logged'
				print 'Successfull Connect '
				callback('event','logged')
		self.tcp_stream = stream

	@gen.coroutine
	def Close(self):
		print 'close tcp connection with receiver'
		self.tcp_stream.close()
		self.callback('event','close')

	@gen.coroutine
	def Write(self,command = 'print,/par/net/ip/addr:on'):
		print "HELLO FROM Write"
		print command
		yield self.tcp_stream.write(command + '\n')
		data = yield self.tcp_stream.read_bytes(1024,  partial=True)
		self.callback('send',data)



'''

class WebSocketHandler(tornado.websocket.WebSocketHandler):
	def __init__(self, *args, **kwargs):
		super(tornado.websocket.WebSocketHandler, self).__init__(*args, **kwargs)		
		self.test_text = "Hello world"
		self.receiver_dict = {}

	def on_close(self):
		print "WebSocket is closed"
		for receiver in self.receiver_dict:
			receiver.close()

	def open(self):
		print "New WebSocket is open"

	def check_origin(self, origin):
		return True

	def on_message(self, message):
		msg = json.loads(message)
#		print message, msg['type'], self.test_text
#		self.write_message(message)
		if msg['type'] == "init":
			def callback(msg_type, msg_data):
				msg_id = msg['id']
				message = {"id":msg_id,"type":msg_type, "data":msg_data}
				s_message = json.dumps(message)
				self.write_message(s_message)
			receiver = new Receiver(callback,**msg["data"])
			self.receiver_dict[msg['id']] = receiver
			receiver.login()
		else:
			try:
				receiver = self.receiver_dict[msg['id']]
			except KeyError:
				print "There no such receiver", msg['id']

		if msg['type'] == "close":
			receiver.close()
			del self.receiver_dict[msg['id']]
		elif msg['type'] == "send":
			receiver.send(msg['data'])
'''

@gen.engine
def main():
	def test_callback(msg_type, msg_data):
		print  msg_type, msg_data

	receiver = Receiver(test_callback)
	yield receiver.Login()
	yield receiver.Write()
	yield receiver.Close()



main()

#app = tornado.web.Application([(r'/websocket', WebSocketHandler)])
#app.listen(8888)
tornado.ioloop.IOLoop.instance().start()