import threading
import socket 
import time

TCP_IP = '172.30.0.42'
TCP_PORT = 8002
my_buffer = ""

COMMAND = 'print,/par/net/ip:on'

def recv_async(socket,bytes, callback):
   def wrapper():
       data = socket.recv(bytes)
       callback(data)
   thread =threading.Thread(target = wrapper)
   thread.setDaemon(True)
   thread.start()

def send_messages(socket,message_list):
	for message in message_list:
		if message: socket.send(message + '\n')
		time.sleep(1)
		recv_async(socket,1000, my_print)


def add_to_buffer(data):
	global my_buffer
	my_buffer += data
	print my_buffer

def my_print(data):
	print data

def receiver_login(socket,login = 'a', password = 'b', callback):
	state = 'login'
	global my_buffer	
	while state != 'success':
		recv_async(socket,100,add_to_buffer)
		if  state == 'login' and "login:" in my_buffer:
			socket.send(login + '\n')			
			my_buffer = ''
			state = "password"
		if  state == "password" and "Password:" in my_buffer:
			socket.send(password + '\n')
			my_buffer = ''
			state  = 'approval'
		if  state == 'approval' and "Logged in on" in my_buffer:
			state = 'success'

socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
socket.connect((TCP_IP, TCP_PORT))

#receiver_login(socket)

#send_messages(socket,message_list = [COMMAND])

print 'ioloop started'
time.sleep(500)

