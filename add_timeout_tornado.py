import time
import tornado.ioloop
from tornado.ioloop import IOLoop

t0 = time.time()

''''
def foo():
	print(time.time() - t0)
	def f():
		print "f", str(time.time() - t0)	
	IOLoop.instance().add_timeout(time.time() + 5, f)    
'''

# tornado.ioloop.PeriodicCallback(foo, 2000).start()

'''
def f():
	print "f", str(time.time() - t0)	
IOLoop.instance().add_timeout(time.time() + 5, f) 

IOLoop.instance().start()

'''
from tornado import gen

@gen.engine
def foo():
	print IOLoop.instance().time()
	a = gen.Task(IOLoop.instance().call_later, 5)	
	yield a
	b = gen.Task(IOLoop.instance().call_later, 5)
	print IOLoop.instance().time()
	yield b
	print IOLoop.instance().time()

foo()

IOLoop.instance().start()