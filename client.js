jQuery( document ).ready(function( ) {
	window.counterField = $(".counter")
	window.startButton = $("#startButton")
})

Create = N.Njs.Compile(function(){
	var connection = new N.Webio.Connection();
	connection.Connect.yld('http://geoserver:8200/webio');
	var transport = new N.Webio.TransportClient(connection);

	var countDownService = transport.Session.yld({name: "myCountdown"})

	countDownService.Method2.yld(
		{
			WebioCallback: new N.Webio.Callback(
				function(data){
					counterField.html(data)
				}
			)
		}
	)

	var starMethod1 = function(Service){
		var resForMethos1 = Service.Method1.yld() //not tread
	}


	startButton.click(function(){
		starMethod1(countDownService);
	})

})

Create()