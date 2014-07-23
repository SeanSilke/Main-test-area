jQuery( document ).ready(function( ) {

	var last = $("#Home");
	$("#myDiv").html("Home");


	$("#Home").click(function() {
			$("#myDiv").html("Home");
			console.log($(this));
			last.removeClass("active")
			$(this).addClass("active")
			last = $(this);			
		});
		
	$("#Profile").click(function() {
			$("#myDiv").html("Profile");
			$(this).addClass("active")
			last.removeClass("active")
			last = $(this);
			
		});

	$("#Portfolio").click(function() {
			$("#myDiv").html("Portfolio");
			$(this).addClass("active")
			last.removeClass("active")
			last = $(this);			
		});	
	
});



