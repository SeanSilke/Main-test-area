var njsCompile = function(f) {
	var compiler = new NjsCompiler({})
	var fString = f.toString()
	var fString = "var f =" + fString +"; f"
	var compileCodeText = compiler.compile(fString)
	return eval(compileCodeText)
}


jQuery( document ).ready(function( ) {
	var id = 1

	var setReciever = function(){
		var host = $("#host").val()
		var port = $("#port").val()
		var password = $("#password").val()
		var receiver = new reciever_constructor(host,port,password)
		receiver.enable()
		receiver.channel.Connect()
		receiver.connected = true
		receiver.Read()
	}

	$("#login_button").click(setReciever)


	var reciever_constructor = function (host,port,password){
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
				console.log(e)
				that.dom_elem.remove()
				that.connected = false
				})

		this.dom_elem = $($(".template").html())

		this.header = this.dom_elem.find(".header")
		this.header.html("Receiver " + id)
		id+=1

		this.output_field = this.dom_elem.find(".output_field")
		this.enter_button = this.dom_elem.find(".enter_button")
		this.clear_button = this.dom_elem.find(".clear_button")
		this.close_button = this.dom_elem.find(".close_button")
		this.input_field = this.dom_elem.find(".input_field")

		this.enable = function(){
			var fieldset = this.dom_elem.find("fieldset")
			fieldset.removeAttr( "disabled" )
		}

		this.Read = njsCompile(function (data){
			while(this.connected){
				var response = this.channel.Read.yld(1000)
				this.output_field.append(response);
				console.log(this.id, "- id; Reading test")
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