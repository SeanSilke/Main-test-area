"use strict";
jQuery( document ).ready(function( ) {

	var f1  = function(){
		console.log('Hello world')
	}

	//tried get string representation of function
	var s1 = f1.toString()

	// eval functon in strin representation
	var evalFstr = function(fucntionStr){
		eval("var f1 ="+fucntionStr+"; f1()" )
	};
	evalFstr(s1);

	//Call compiled njs function
	//function update(n) {
	//    for(var i = 0; i < n; i++) {
	//        console.log(i);
	//        sleep->(1000);
	//    }
	//}

	update(10)

	//how njs function in a compiled form look like.

	var update_inS_form = update.toString()
	console.log(update_inS_form)


	//begin directly working with Njscompiler

	var my_NjsCompiler = new NjsCompiler
	console.log(my_NjsCompiler)

	my_NjsCompiler.compile()


//	var compiler = new NjsCompiler(options);
//    try {
//		// options is a hash table of name/value pairs corresponding to
//		// the command-line options for the compiler.
//        var output_code = compiler.compile(input_code, filename)
//    } catch(e) {
//        // e is a JavaScript Error object
//        // do error notification here
//    }


});