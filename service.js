// console.log("Hello I'am service")
// console.log(N.Webio.ServiceSessionObject)
// console.log(N.Webio.Connection)

// console.log(N.Webio.SimpleBus)
// console.log(N.Webio.TransportClient)

// console.log(N.Util.guid)

var text = "Hello i'am text"
var isCountdown = true
var count = 1
var callbackList = []


var Countdown = N.Njs.Compile(function(){
	// isCountdown = true;
	while(isCountdown){
		console.log(count);
		sleep.yld(500);
		count++;
		// console.log(callbackList)
		for (var id in callbackList){
			// console.log(callbackList[id]);
			callbackList[id].fire(count)
		}
	}
	// isCountdown = false
})

Countdown()

var ServiceSessionClass = N.Webio.ServiceSessionObject.extend({
	initialize: function(data){
	},

	Method1: function(data){
		console.log("Service's method1", text)
		return {hello:"world",data:data};
	},

	Method2: N.Njs.Compile(function(data){
		// while(isCountdown){
			console.log("Method2")
			callbackList.push(data.WebioCallback)
			// data.WebioCallback.fire(count)
		// }
	}),


	// Method2: N.Njs.Compile(function(data){
	// 	this.runThread(data.WebioCallback);
	// }),

	// runThread: N.Njs.Compile(function(WebioCallback){
	// 	WebioCallback.fire('1');
	// 	sleep.yld(1000);
	// 	WebioCallback.fire('2');
	// 	sleep.yld(1000);
	// 	WebioCallback.fire('3');
	// 	sleep.yld(1000);
	// })
})

var Create = N.Njs.Compile(function () {
	// console.log("Now we will registrate session on the server")
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
	// console.log("Done");
})

Create()
