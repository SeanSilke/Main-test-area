var njsCompile = function(f) {
	var compiler = new NjsCompiler({})
	var fString = f.toString()
	var fString = "var f =" + fString +"; f"
	var compileCodeText = compiler.compile(fString)
	return eval(compileCodeText)
}


jQuery( document ).ready(function( ) {


	var creatAndSend = njsCompile(function(){
		var parameters = {
			connection: {
				host: "172.30.0.42",
				password: "b",
				ssl: false,	
				id: null,
				port: "80"
			}
		}
				
		var channel = new J.Gnss.Channel.Http(parameters)		
		channel.Connect()
		channel.Send("print,/par/net/ip/addr\n")
		var response = channel.Read.yld(1000)
		console.log(response)
		channel.Close()

	})

	creatAndSend()

})