//WebbyJs class tests
WebbyJs.Class({
	name:'TestClass',
	
	construct:function TestClass(x, y, z) {
		this.prop1 = x;
		this.prop2 = y;
		this.prop3 = z;
		this.objMember = {};
		this.arrMember = [0, 1];
	},
	
	proto: {
		method1: function(x) {
			this.prop1 = x;
		},
		
		method2: function(x) {
			this.prop2 = x;
		}
	}
});

WebbyJs.Class({
	name: 'TTT',
	
	construct: function TTT() {
		
	}
});

//test
var Test = {
	start: function() {
		_w_.export();
		_w_.log(TTT);
		_w_.log(webbyjs);
	}
};
