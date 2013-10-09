/**
 * @file Base WebbyJs class. All created classes are inherited from it.
 * @author Olegos <olegos83@yandex.ru>
 */

	//default prototype for created classes
	_defaultProto: {
		//default toString
		toString: function() {
			return '[WebbyJs.' + this.constructor._w_className + ']';
		},
		
		//default valueOf
		valueOf: function() {
			return this.constructor._w_className;
		},
		
		//get class name
		className: function() {
			return this.constructor._w_className;
		},
		
		//export as object
		toObject: function() {
			return {
				name: this.className(),
				properties: this.properties(),
				methods: this.methods()
			};
		},
		
		//dump object info to console
		dump: function() {
			console.log(this.toString());
			
			for (var p in this) {
				console.log(p + ":" + WebbyJs.getClassName(this[p]) + " = " + this[p]);
			}
			
			return this;
		},
		
		//get prototype
		getPrototype: function() {
			return this.constructor.prototype;
		},
		
		//get properties as object
		properties: function() {
			var props = {};
			
			for (var p in this) {
				if (this.hasOwnProperty(p)) props[p] = this[p];
			}
			
			return props;
		},
		
		//get methods as object
		methods: function() {
			var methods = {}, proto = this.constructor.prototype;
			
			for (var m in proto) {
				if (proto.hasOwnProperty(m)) methods[m] = proto[m];
			}
			
			return methods;
		},
		
		//mixin object properties
		mixin: function(obj, safe) {
			for (var p in obj) if (obj.hasOwnProperty(p)) {
				if (safe) {
					if (!this[p]) this[p] = obj[p];
				} else {
					this[p] = obj[p];
				}
			}
			
			return this;
		},
		
		//invoke method in native scope
		invoke: function(method, args) {
			method.apply(this, args);
			return this;
		}
	}