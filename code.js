//"use strict";
jQuery( document ).ready(function( ) {

	function update(n) {
		for(var i = 0; i < n; i++) {
			console.log(i);
			sleep.yld(1000);
		}
	}

	var njsCompile = function(f) {
		var compiler = new NjsCompiler({})
		var fString = f.toString()
		var compileCodeText = compiler.compile(fString)
		return eval("var f ="+compileCodeText+"; f")
	}

	var update = njsCompile(update)

	update(4)

});