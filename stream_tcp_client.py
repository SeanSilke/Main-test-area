from tornado import tcpclient
from tornado.ioloop import IOLoop
from tornado import gen
	

@gen.coroutine
def main():
	client = tcpclient.TCPClient()
	TCP_IP = '172.30.0.42'
	TCP_PORT = 8002
	stream = yield client.connect(TCP_IP, TCP_PORT)	
	def f2(data):
		print 'callback',data
	def f3(data):
		print  'streaming_callback',data
	stream.read_until_close(callback= f2,streaming_callback=f3)

main()
IOLoop.instance().start()