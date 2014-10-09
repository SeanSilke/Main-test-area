var isCountdown = false
var count = 10
var callbackList = []


var Countdown = N.Njs.Compile(function(){
	count = 10
	while(count){
		console.log(count);
		count--;
		for (var id in callbackList){
			callbackList[id].fire(count)
		}
		sleep.yld(500);
	}
	isCountdown = false
	return;
})

var ServiceSessionClass = N.Webio.ServiceSessionObject.extend({
	initialize: function(data){
	},

	Method1: function(data){
		console.log("Service's method1")
		if (isCountdown){
			return
			// return {hello:"world",data:data}
		}else{
			isCountdown = true
			Countdown() //Tread
		}
		console.log("isCountdown", isCountdown)
	},

	Method2: N.Njs.Compile(function(data){
			console.log("Method2")
			callbackList.push(data.WebioCallback)
	}),

})

var Create = N.Njs.Compile(function () {
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
})

Create()
