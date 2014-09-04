import socket 
import time

TCP_IP = '172.30.0.42'
TCP_PORT = 8002

LOGIN = 'a'
PASSWORD = 'b'
COMMAND = 'print,/par/net/ip:on'
message_list = ['',LOGIN,PASSWORD,COMMAND]



def receiver_login(socket,login = 'a', password = 'b'):
	state = 'login'
	my_buffer = ''
	while state != 'success':
		my_buffer+= socket.recv(100)
		print my_buffer
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


def send_messages(socket,message_list):
	for message in message_list:
		if message: socket.send(message + '\n')
		time.sleep(1)
		print socket.recv(1024)


socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
socket.connect((TCP_IP, TCP_PORT))

receiver_login(socket)

send_messages(socket,message_list = [COMMAND])
