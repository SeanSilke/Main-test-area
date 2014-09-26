//"use strict";
jQuery( document ).ready(function( ) {

	var njsCompile = function(f) {
		var compiler = new NjsCompiler({})
		var fString = f.toString()
		var compileCodeText = compiler.compile(fString)
		return eval("var f ="+compileCodeText+"; f")
	}

	function waitClick(){
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

	var rnTest = njsCompile(rnTest)
	rnTest()

});