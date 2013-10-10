//WebbyJs class tests
WebbyJs.createClass('TestClass', null, function(x, y, z) {
	this.prop1 = x;
	this.prop2 = y;
	this.prop3 = z;
	this.objMember = {};
	this.arrMember = [0, 1];
}, {
	method1: function(x) {
		this.prop1 = x;
	},
	
	method2: function(x) {
		this.prop2 = x;
	}
});

WebbyJs.createClass('CloneTester', null, function() {
	this.test = 'original';
}, {
	change: function(x) {
		this.test = x;
	}
});

//test
var Test = {
	start: function() {
		var dd2 = new WebbyJs.TestClass(111, 'old', new WebbyJs.CloneTester());
		
		var dd2_clone = dd2.clone();
		
		dd2_clone.prop1 = 222;
		dd2_clone.prop2 = 'new';
		dd2_clone.prop3.change('cloned');
		dd2_clone.arrMember[0] = 777;
		dd2_clone.objMember.xxx = 'xxx';
		
		console.log(dd2, dd2_clone);
	}
};
