// console.log("Hello I'am client")
// console.log(N.Njs.Compile)
// console.log(N.Webio.Connection)
// console.log(N.Webio.TransportClient)

jQuery( document ).ready(function( ) {
	window.counterField = $(".counter")
})

Create = N.Njs.Compile(function(){
	var connection = new N.Webio.Connection();
	connection.Connect.yld('http://geoserver:8200/webio');
	var transport = new N.Webio.TransportClient(connection);

	var countDownService = transport.Session.yld({name: "myCountdown"})
	// console.log("countDownService", countDownService)

	// var res1 = countDownService.Method1.yld();
	// console.log("res1", res1);

	// var res2 = countDownService.Method1.yld({rabbit: 'hole'})
	// console.log('res2',res2);

	countDownService.Method2.yld(
		{
			WebioCallback: new N.Webio.Callback(
				function(data){
					counterField.html(data)
				}
			)
		}
	)
})

Create()