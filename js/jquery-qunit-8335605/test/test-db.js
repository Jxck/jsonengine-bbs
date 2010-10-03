module('localStorage',{
	setup: function() { 
		localStorage.clear();
	},
	teardown: function() { 
		localStorage.clear();
	}
});

test('localStorage exists and has methods',function(){

	ok(localStorage,'localStorage');
	same(localStorage.length,0,'initial localStorage.length is 0');

	ok(localStorage.key,'localStorage.key');
	same(typeof localStorage.key,'function','localStorage.key is function');

	ok(localStorage.getItem,'localStorage.getItem');
	same(typeof localStorage.getItem,'function','localStorage.getItem is function');

	ok(localStorage.setItem,'localStorage.setItem');
	same(typeof localStorage.setItem,'function','localStorage.setItem is function');

	ok(localStorage.removeItem,'localStorage.removeItem');
	same(typeof localStorage.removeItem,'function','localStorage.removeItem is function');

	ok(localStorage.clear,'localStorage.clear');
	same(typeof localStorage.clear,'function','localStorage.clear is function');

});

test('Manipulate by method access',function(){

	localStorage.setItem('key','value');
	same(localStorage.length,1,'created');
	same(localStorage.getItem('key'),'value','same');
	localStorage.removeItem('key');
	same(localStorage.length,0,'removed');

	//if access inexistent property is null
	same(localStorage.getItem('hoge'),null);
	same(localStorage.removeItem('hoge'),undefined);

});

test('Manipulate by property access',function(){

	localStorage.key='value';
	same(localStorage.length,1,'created');
	same(localStorage.key,'value','same');
	delete localStorage.key;
	same(localStorage.length,0,'deleted');

	//if access inexistent property is null
	same(localStorage.hoge,null);
	same(delete localStorage.hoge,true);

});

test('Manipulate by name(key) access',function(){

	localStorage['key']='value';
	same(localStorage.length,1,'created');
	same(localStorage['key'],'value','same');
	delete localStorage['key'];
	same(localStorage.length,0,'deleted');

	//if access inexistent property is null
	same(localStorage['hoge'],null);
	same(delete localStorage['hoge'],true);

});

test('clear all data in localStorage',function(){

	localStorage.setItem('key1','value1');
	localStorage.setItem('key2','value2');
	localStorage.setItem('key3','value3');

	same(localStorage.length,3,'many data exists');
	localStorage.clear();
	same(localStorage.length,0,'localStorage.clear() delete all data of localStorage');

});

test('Manipulate all data by key(index) roop',function(){

	localStorage.setItem('key1','value1');
	localStorage.setItem('key2','value2');
	localStorage.setItem('key3','value3');

	same(localStorage.length,3,'many data exists');

	for (var i=0; i<localStorage.length; i++){
		var tmp = localStorage.key(i);
		ok(tmp,tmp);
	}
	
});

test('Manipulate all data by hash[index] roop',function(){

	localStorage.setItem('key1','value1');
	localStorage.setItem('key2','value2');
	localStorage.setItem('key3','value3');

	same(localStorage.length,3,'many data exists');

	for (var i=0; i<localStorage.length; i++){
		var tmp = localStorage[i];
		ok(tmp,tmp);
	}
	
});

test('Manipulate all data by $.each()',function(){

	localStorage.setItem('key1','value1');
	localStorage.setItem('key2','value2');
	localStorage.setItem('key3','value3');

	same(localStorage.length,3,'many data exists');

	$.each(localStorage,function(i,val){
		ok(val,val);
	});

});

test('Manipulate all data by iteration roop',function(){

	localStorage.setItem('key1','value1');
	localStorage.setItem('key2','value2');
	localStorage.setItem('key3','value3');

	same(localStorage.length,3,'many data exists');

	for (var key in localStorage){
		ok(key,key);
		ok(localStorage[key],localStorage[key]);
	}

});


test('add JSON Object',function(){

	var obj = { 
		"key" : "value",
		"arr" : ["a",1,true],
		"nest" : { "nested" : {"nested" : "value" }}
	};

	localStorage.setItem('obj', obj);

	var value = localStorage.getItem('obj');
	ok(value,value);
	same(value,obj);

});

test('add JSON String',function(){

	var obj = { 
		"key" : "value",
		"arr" : ["a",1,true],
		"nest" : { "nested" : {"nested" : "value" }}
	};
	var str = JSON.stringify(obj);
	localStorage.setItem('str',str);
	var value = localStorage.getItem('str');

	ok(value,value);
	same(value,str);
	value = JSON.parse(value);
	same(value,obj);

});

////////////////////////////////////
//wrapper library of set-get-each
////////////////////////////////////
var db ={
	set : function(key, obj){
		localStorage.setItem(key, JSON.stringify(obj));
	},

	get : function(key){
		return JSON.parse(localStorage.getItem(key));
	},

	each : function(fun){
		try{
			for (var i=0; i<localStorage.length; i++){
				var k = localStorage.key(i);
				fun(k,db.get(k));
			}
		}catch(e){
			for (var key in localStorage){
				if(key === 'key') continue;
				fun(key,db.get(key));
			}
		}
	}
};

module('my db library',{
	setup: function() { 
		localStorage.clear();
	},
	teardown: function() { 
		localStorage.clear();
	}
});

test('set(key, obj) and get(key)',function(){
	var obj = { 
		"key" : "value",
		"arr" : ["a",1,true],
		"nest" : { "nested" : {"nested" : "value" }}
	};

	db.set('obj',obj);
	var value = db.get('obj');
	same(value, obj);
});

test('each(fun)',function(){
	
	db.set('key1','value1');
	db.set('key2','value2');
	db.set('key3','value3');
	same(localStorage.length,3,'many data exists');

	db.each(function(k,v){
		ok(k,k);
		ok(v,v);
	});

});
