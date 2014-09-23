"use strict";
jQuery( document ).ready(function( ) {
	var reciever_id = 1;
	var recievers_dict = {};
	var ws = undefined;

	(function (){
		var newWs = new WebSocket("ws://localhost:8888/websocket");

		newWs.onclose = function(){
			$('H3').html("No connection with a server")
			$("fieldset").prop('disabled', true)
			$('.main_panel').html('')
		}

		newWs.onopen = function(){
			$("fieldset").first().removeAttr("disabled")
			//$("fieldset").first().removeAttr("disabled")
			$('H3').html('Connected to the server')
		}

		newWs.onmessage = function(message){
			var message = (JSON.parse(message.data));
			if (message.type == 'send'){
				var reciever_id = message.id
				var reciever = recievers_dict[reciever_id]
				reciever.r_print(message.data)
			}

			if (message.type == 'event' && message.data == "logged"){				
				var reciever_id = message.id
				var reciever = recievers_dict[reciever_id]
				reciever.enable()
			}
		};

		ws = newWs
	})()

	var login = function(){

		var data = {ip: $("#ip").val(),
				port: Number($("#port").val()),
				login: $("#login").val(),
				password: $("#password").val()
				}
		var msg = {id: reciever_id,
					type: 'init',
					data: data}		
		new reciever_constructor(reciever_id)
		ws.send(JSON.stringify(msg))
		reciever_id += 1
	}	

	var reciever_constructor = function(reciever_id){

		var that = this
		this.dom_elem = $($(".template").html())

		this.header = this.dom_elem.find(".header")
		this.header.html("Receiver " + reciever_id)

		this.output_field = this.dom_elem.find(".output_field")
		this.enter_button = this.dom_elem.find(".enter_button")
		this.clear_button = this.dom_elem.find(".clear_button")
		this.close_button = this.dom_elem.find(".close_button")
		this.input_field = this.dom_elem.find(".input_field")

		this.enable = function(){
			var fieldset = this.dom_elem.find("fieldset")
			fieldset.removeAttr( "disabled" )
		}

		this.r_print = function (data){
			this.output_field.append(data + "<br>");
		}

		this.callback = function(type, data){
			var message = {id: reciever_id,
						type: type,
						data: data}
			ws.send(JSON.stringify(message))
		}

		this.enter_button.click(function(){
			var text = that.input_field.val()
			that.callback('send',text)
		})

		this.close_button.click(function(){
			that.dom_elem.remove()
			that.callback('close',' ')
		})
		this.clear_button.click(function(){
			that.output_field.html('')
		})

		recievers_dict[reciever_id] = this
		$('.main_panel').prepend(this.dom_elem);

	}

	var default_loggin_data = function(){
		$("#ip").val('172.30.0.42')
		$("#port").val('8002'),
		$("#login").val(''),
		$("#password").val('b')
	}
	
	$("#login_button").click(login)	
	$("#default_login_button").click(default_loggin_data)

});