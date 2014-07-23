jQuery( document ).ready(function( ) {

	var last = $("#Home");
	$("#myContainer").html("Home");
	
	var navigator = function(id, text){
		$(id).click(function() {
			$("#myContainer").html(text);			
			last.removeClass("active")
			$(this).addClass("active")
			last = $(this);			
		});	
	};
	
	navigator("#Home","Home");
	navigator("#Profile","Profile");
	navigator("#Portfolio","Portfolio");
	
});



