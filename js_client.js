//"use strict";
var njsCompile = function(f) {
	var compiler = new NjsCompiler({})
	var fString = f.toString()
	var fString = "var f =" + fString +"; f"
	var compileCodeText = compiler.compile(fString)
	return eval(compileCodeText)
}

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
			$('H3').html('Connected to the server')
		}

		newWs.onmessage = function(message){
			var message = (JSON.parse(message.data));
			if (message.type == 'send'){
				var reciever_id = message.id
				var reciever = recievers_dict[reciever_id]
				reciever.onmessage(message.data)
			}

			if (message.type == 'event' && message.data == "connected"){
				console.log(message.id, "connected")
			}
		};

		ws = newWs
	})()

	var login = function(){

		var data = {ip: $("#ip").val(),
					port: Number($("#port").val())}
		var msg = {id: reciever_id,
					type: 'init',
					data: data}

		var login = $("#login").val();
		var password = $("#password").val()
		var reciever =  new reciever_constructor(reciever_id, login, password)
		reciever.Login()
		ws.send(JSON.stringify(msg))
		reciever_id += 1
	}	

	var reciever_constructor = function (reciever_id, login, password){
		var that = this
		this.login = login
		this.password = password
		this.resultNotifier = new ResultNotifier
		this.dom_elem = $($(".template").html())

		this.header = this.dom_elem.find(".header")
		this.header.html("Receiver " + reciever_id)

		this.login_buf = ''
		this.state = 'login'

		this.output_field = this.dom_elem.find(".output_field")
		this.enter_button = this.dom_elem.find(".enter_button")
		this.clear_button = this.dom_elem.find(".clear_button")
		this.close_button = this.dom_elem.find(".close_button")
		this.input_field = this.dom_elem.find(".input_field")

		this.enable = function(){
			var fieldset = this.dom_elem.find("fieldset")
			fieldset.removeAttr( "disabled" )
		}

		this.onmessage = function (data){
			if (this.state == "login"){
						this.resultNotifier.fulfill(data)
					}
			this.output_field.append(data + "<br>");
		}

		this.ReadUntil = njsCompile(function (){
			var promise = this.resultNotifier
			var value = promise.value.yld()
			this.resultNotifier = new ResultNotifier
			return value
		})

		this.Login = njsCompile(function(){
			var login_buf = ""
			while (1){
				if (this.state == 'login'){
					var data = this.ReadUntil.yld()
					login_buf += data
					if(login_buf.indexOf('login:') >= 0){
						this.callback('send', this.login)
						login_buf = ' '
					}
					if (login_buf.indexOf('Password:') >= 0) {
						this.callback('send',this.password)
						login_buf = ''
					}
					if (login_buf.indexOf('Logged in on') >= 0) {
						this.enable()
						this.state = 'logged';
						login_buf = '';
						return;
					}
				}
			}
		})

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