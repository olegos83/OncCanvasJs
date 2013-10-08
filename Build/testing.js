//WebbyJs class tests
WebbyJs.createClass('TestClass1', null, function(x, y) {
	this.prop1 = x;
	this.prop2 = y;
}, {
	method1: function(x) {
		this.prop1 = x;
	},
	
	method2: function(x) {
		this.prop2 = x;
	}
});

//test
var Test = {
	start: function() {
		console.log(WebbyJs);
		
		var dd2 = new WebbyJs.TestClass1(15, 'any');
		console.log(dd2);
		
		console.log(dd2 instanceof WebbyJs.TestClass1);
		
		dd2.dump();
		
		console.log(dd2.properties());
		console.log(dd2.getPrototype());
		console.log(dd2.methods());
		console.log(dd2.toObject());
	}
};
