jQuery( document ).ready(function( ) {

	$("ul li").click(function(){
			$('.active').removeClass("active");
			$(this).addClass("active");
			var index = $(this).index()
			var id = $(this).attr('id');
			$("#myContainer").html(index + " " + id);
		}
	)

	$(".active").click();
});