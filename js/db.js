var db = {
	set: function(key, obj) {
		localStorage.setItem(key, JSON.stringify(obj));
	},

	get: function(key) {
		var tmp = localStorage.getItem(key);
		return (tmp === undefined) ? null : JSON.parse(tmp);
	},

	each: function(fun) {
		try {
			for (var i = 0; i < localStorage.length; i++) {
				var k = localStorage.key(i);
				fun(k, db.get(k));
			}
		}catch (e) {
			for (var key in localStorage) {
				if (key === 'key') continue;
				fun(k, db.get(k));
			}
		}
	},

	del: function(key) {
		delete localStorage[key];
	}
};
