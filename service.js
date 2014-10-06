// console.log("Hello I'am service")
// console.log(N.Webio.ServiceSessionObject)
// console.log(N.Webio.Connection)

// console.log(N.Webio.SimpleBus)
// console.log(N.Webio.TransportClient)

// console.log(N.Util.guid)

var ServiceSessionClass = N.Webio.ServiceSessionObject.extend({
	initialize: function(data){
	},

	Method1: function(data){
		console.log("Service's method1")
		return {hello:"world",data:data};
	},

	Method2: N.Njs.Compile(function(data){
		this.runThread(data.WebioCallback);
	}),

	runThread: N.Njs.Compile(function(WebioCallback){
		sleep.yld(1000);
		WebioCallback.fire('1');
		sleep.yld(1000);
		WebioCallback.fire('2');
		sleep.yld(1000);
		WebioCallback.fire('3');
	})
})

var Create = N.Njs.Compile(function () {
	console.log("Now we will registrate session on the server")
	var sessionName = "myCountdown";
	var connection = new N.Webio.Connection();
	connection.Connect.yld('http://geoserver:8200/webio');
	var bus = new N.Webio.SimpleBus(sessionName, ServiceSessionClass);
	var transport = new N.Webio.TransportClient(connection, bus);
	transport.UpdateService.yld([{
		name: sessionName,
		uid: N.Util.guid(),
		info: "Test Service"
	}]);
	console.log("Done");
})

Create()
