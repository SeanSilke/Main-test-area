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
			$("fieldset").removeAttr("disabled")
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
		reciever_factory(reciever_id)
		ws.send(JSON.stringify(msg))
		reciever_id += 1
	}	

	var reciever_factory = function(reciever_id){		
		var callback = function(type, data){						
			var message = {id: reciever_id,
						type: type,
						data: data}
			ws.send(JSON.stringify(message))			
		}

		var reciever_dom_elem = $( '<div>\
					<div class = "row">	\
						<div class="col-xs-10">\
							<h4 class="header"> Receiver 1 </h4>\
						</div>\
						<div class="col-xs-2">\
							<button type="button" class="btn btn-default btn-block close_button">Close</button>\
						</div>\
					</div>\
					<fieldset disabled>\
						<div class="form-group">\
							<div class = "row">\
								<div class="col-xs-8">\
									<input class="form-control input_field" placeholder = "Enter command">\
								</div>\
								<div class="col-xs-2">\
									<button type="button" class="btn btn-default btn-block enter_button">Enter</button>\
								</div>\
								<div class="col-xs-2">\
									<button type="button" class="btn btn-default btn-block clear_button">Clear</button>\
								</div>\
							</div>\
						</div>\
						<div class="form-group">\
							<div class="row">\
								<div class="col-md-12">\
									<div class="well output_field"> </div>\
								</div>\
							</div>\
						</div>\
					</fieldset>\
				</div>')

		var header = reciever_dom_elem.find(".header")
		header.html("Receiver " + reciever_id)

		var fieldset = reciever_dom_elem.find("fieldset")
		var enable = function(){
			fieldset.removeAttr( "disabled" )
		}


		var output_field = reciever_dom_elem.find('.output_field')
		var r_print = function(data){
			output_field.append(data + "<br>");
		}

		var clear_button = reciever_dom_elem.find(".clear_button")
		clear_button.click(function(){
			output_field.html('')
		})

		var enter_button = reciever_dom_elem.find(".enter_button")
		var input_field = reciever_dom_elem.find(".input_field")

		enter_button.click(function () {
			var text = input_field.val()
			callback('send',text)
		})

		var close = function () {
			reciever_dom_elem.remove()
			callback('close',' ')
		}
		var close_button = reciever_dom_elem.find(".close_button")
		close_button.click(close)

		var reciever = {
			reciever_dom_elem:reciever_dom_elem,
			r_print: r_print,
			enable: enable,
			close: close
		}

		recievers_dict[reciever_id] = reciever
		$('.main_panel').prepend(reciever.reciever_dom_elem);
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