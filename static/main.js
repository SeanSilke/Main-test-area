jQuery( document ).ready(function( ) {

	var last = $("#Home");
	$("#myContainer").html(" ");
	
	var navigator = function(id, text){
		$(id).click(function() {
			$("#myContainer").html(text);			
			last.removeClass("active")
			$(this).addClass("active")
			last = $(this);			
		});	
	};

	navigator("#Home","message");
	navigator("#Profile","Profile");
	navigator("#Portfolio","Portfolio");

	
	var ws = new WebSocket("ws://localhost:8888/websocket");	
	ws.onopen = function (event) {
  		console.log("Socket os open")
	};

	$("#send").click(function () {
		ws.send($("#input").val())
	})
  

	$("#send2").click(function () {
		console.log( $("#input").val());
	})

	ws.onmessage = function(evn){
		$("#myContainer").append(evn.data + "<br>");			
	}
	
	
});



