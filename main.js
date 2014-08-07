jQuery( document ).ready(function( ) {

	var message = 'JavaScript line to make connection' + "<br>" +
	'//var ws = new WebSocket("ws://localhost:8888/websocket");' + "<br>" +
	'var ws = new WebSocket("ws://sergey-vn:8888/websocket");' + "<br>" +
	'ws.onmessage = function(evn){console.log(evn.data)}' + "<br>" +
	"ws.send('Hi')"

	var last = $("#Home");
	$("#myContainer").html(message);
	
	var navigator = function(id, text){
		$(id).click(function() {
			$("#myContainer").html(text);			
			last.removeClass("active")
			$(this).addClass("active")
			last = $(this);			
		});	
	};
	
	

	navigator("#Home",message);
	navigator("#Profile","Profile");
	navigator("#Portfolio","Portfolio");
	
});



