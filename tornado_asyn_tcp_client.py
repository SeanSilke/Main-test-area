from tornado import tcpclient
from tornado.ioloop import IOLoop
from tornado import gen


@gen.coroutine
def login(stream):		
	state = 'login'
	buff = ''
	while state != 'success':
		buff += yield stream.read_bytes(1024,  partial=True)
		print buff		
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
def send_command(stream,command):	
	yield stream.write(command + '\n')
	data = yield stream.read_bytes(1024,  partial=True)
	print data


@gen.coroutine
def main():
	client = tcpclient.TCPClient()
	TCP_IP = '172.30.0.42'
	TCP_PORT = 8002
	stream = yield client.connect(TCP_IP, TCP_PORT)	
	stream = yield login(stream)	
	yield send_command(stream, command = 'print,/par/net/ip:on')

main()
IOLoop.instance().start()