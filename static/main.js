"use strict";
jQuery( document ).ready(function( ) {

	var composeMessage = function(text){
	//
	// login "ip" "port"
	// send "" "message"
	// 
	//currently messages with multiple whitespace not processed correctly.
	//Message body will contain only text before second whitespace.
		var msg = {};

		var list = text.split(' ')		
		switch(list[0]){
			case 'login':
				msg.type = 'login'
				msg.ip = list[1];
				msg.port =  list [2];
				break;
			case 'send':
				msg.type = 'send';
				msg.receiver = list[1];
				msg.message = list[2];
				break;
			default:
				msg = {};
		}
		console.log(JSON.stringify(msg))
		return msg;

	};

	composeMessage("login 172.30.0.42 8002");
	composeMessage("send 172.30.0.42 8002");
	composeMessage("Alice's Adventures in Wonderland");


	
	var ws = new WebSocket("ws://localhost:8888/websocket");	
	ws.onopen = function (event) {  		
  		$("#myContainer").append("Socket is open" + "<br>");
	};

	ws.onclose = function (event) {  		
  		$("#myContainer").append("Socket is closed" + "<br>");
	};

	ws.onmessage = function(evn){
		$("#myContainer").append(evn.data + "<br>");			
	};


	$("#clear").click(function () {		
		$("#myContainer").html(" ");
	})

	$("#loginData").click(function () {	
		$("#input").val("login 172.30.0.42 8002");
	})

	$("#commandData").click(function () {
		$("#input").val("send 1 print,/par/net/ip:on");
	})

	$("#send").click(function () {
		var text = $("#input").val()
		var msg = composeMessage(text)
		ws.send(JSON.stringify(msg))		
	})


	
	
});



