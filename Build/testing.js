//WebbyJs class tests
WebbyJs.createClass('TestClass', null, function(x, y) {
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
		console.log('dd2 = new WebbyJs.TestClass()');
		var dd2 = new WebbyJs.TestClass(15, 'any');
		console.log(dd2);
		console.log('');
		
		console.log('dd2.getPrototype()');
		console.log(dd2.getPrototype());
		
		console.log('dd2.toObject()');
		console.log(dd2.toObject());
	}
};
