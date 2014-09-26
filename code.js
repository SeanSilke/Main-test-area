//"use strict";
jQuery( document ).ready(function( ) {

	var N = {}
	N.Njs = {}

	var njsCompile = function(f) {
		var compiler = new NjsCompiler({})
		var fString = f.toString()
		var fString = "var f =" + fString +"; f"
		var compileCodeText = compiler.compile(fString)
		return eval(compileCodeText)
	}

	N.Njs.Compile = function (func) {
		var compiler = new NjsCompiler({ });
		return eval(compiler.compile('var f=' + func.toString() + ';\n f;', 'njs_method'));
	};

	var waitClick = function() {
		var elem = document.getElementById("myButton");
		elem.onclick = new EventNotifier();
		elem.onclick.wait.yld();
		sleep.yld(1000)
		console.log("click")
	}

	function rnTest(){
		var promise = new ResultNotifier();
		var elem = document.getElementById("myButton");

		elem.onclick = function(){promise.fulfill.yld('Hello')}
		console.log(promise.value.yld())
		console.log("asdf")
	}

//	var waitClick = njsCompile(waitClick)
//	waitClick()

	var waitClick = N.Njs.Compile(waitClick)
	waitClick()

});