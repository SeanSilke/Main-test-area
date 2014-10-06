// HTML receiver with NetGear channel
jQuery( document ).ready(function( ) {
	var i = 1

	var setReciever = N.Njs.Compile(function(id){
		var host = $("#host").val()
		var port = $("#port").val()
		var password = $("#password").val()
		var receiver = new reciever_constructor(host,port,password,id)
		receiver.Connect.yld()
		receiver.Read()
	})

	$("#login_button").click(function(){
		setReciever(i++);
	})

	window.reciever_constructor = function (host,port,password,id){
		var that = this
		this.id = id
		this.connected = false
		this.parameters = {
			connection: {
				host: host,
				password: password,
				ssl: false,
				id: null,
				port: port,
			}
		}
		this.channel = new J.Gnss.Channel.Http(this.parameters)
		this.channel.on("close",function(e){
				that.disable()
				that.header.append(" " + e.errText)
				that.connected = false
				})

		this.dom_elem = $($(".template").html())

		this.header = this.dom_elem.find(".header")
		this.header.html("Receiver " + this.id)

		this.output_field = this.dom_elem.find(".output_field")
		this.enter_button = this.dom_elem.find(".enter_button")
		this.clear_button = this.dom_elem.find(".clear_button")
		this.close_button = this.dom_elem.find(".close_button")
		this.input_field = this.dom_elem.find(".input_field")

		this.enable = function(bool){
			var fieldset = this.dom_elem.find("fieldset")
			fieldset.prop('disabled',false)
		}

		this.disable = function(){
			var fieldset = this.dom_elem.find("fieldset")
			fieldset.prop('disabled',true)
		}

		this.Connect = N.Njs.Compile(function(){
			try{
				this.channel.Connect.yld()
				this.connected = true
				this.enable()
			}
			catch(e){
				this.header.append("<em> " + e.name + ". " + e.message + "</em>")
			}
		})

		this.Read = N.Njs.Compile(function (data){
			while(this.connected){
				var response = this.channel.Read.yld(1000)
				this.output_field.append(response);
			}
		})

		this.enter_button.click(function(){
			var text = that.input_field.val()
			that.channel.Send(text+'\n')
		})

		this.close_button.click(function(){
			that.dom_elem.remove()
			that.channel.Close()
		})

		this.clear_button.click(function(){
			that.output_field.html('')
		})

		$('.main_panel').prepend(this.dom_elem);

	}

	var default_loggin_data = function(){
		$("#host").val('172.30.0.42')
		$("#port").val('80'),
		$("#login").val(''),
		$("#password").val('b')
	}

	$("#default_login_button").click(default_loggin_data)
})