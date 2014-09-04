import threading
import socket 
import time


TCP_IP = '172.30.0.42'
TCP_PORT = 8002

COMMAND = 'print,/par/net/ip:on'


def recv_async(socket,bytes, callback):
   def wrapper():
       data = socket.recv(bytes)
       callback(data)
   thread =threading.Thread(target = wrapper)
   thread.setDaemon(True)
   thread.start()

def process_data(socket, finish_callback,data,buff,state):		
	buff += data
	print buff
	if  state == 'login' and "login:" in buff:
		socket.send('a' + '\n')			
		buff = ''
		state = "password"
	if  state == "password" and "Password:" in buff:
		socket.send('b' + '\n')
		buff = ''
		state  = 'approval'
	if  state == 'approval' and "Logged in on" in buff:
		state = 'success'

	if state != 'success':
		def callback(data):
			process_data(socket,finish_callback,data,buff,state)
		recv_async(socket,1024,callback)
	else:
		finish_callback()

def asyn_receiver_login(socket,callback):	
	buff = ''
	state = 'login'
	def first_callback(data):		
		process_data(socket, callback,data,buff,state)
	recv_async(socket,1024,first_callback)


socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
socket.connect((TCP_IP, TCP_PORT))

def login_callback():	
	print 'connected'
	socket.send('print,/par/net/ip:on' + '\n')
	def callback(data):
		print data
	recv_async(socket,1024,callback)

asyn_receiver_login(socket,login_callback)
time.sleep(100)