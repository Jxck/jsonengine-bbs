log = function(a,b){
	if(console.log){(!b)? console.log(a) :	console.log(a);console.log(b);}
};
module('je', {
	baseURI: null,
	testdata: null,
	docType: null,
	docId: null,

	/**
	 * mock of docId generator
	 * 
	 * @return {string} docId
	 */
	_getDocId: function() {
		var docId = '';
		var ALNUMS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var digits = 32;

		for (var i = 0; i < digits; i++) {
			docId += ALNUMS[Math.floor(Math.random() * (digits + 1))];
		}
		return docId;
	},

	setup: function() {
		this.baseURI = '../../../../../_je/',
		this.testdata = {
			'key' : 'value',
			'arr' : ['a', 1, true],
			'nest' : { 'nested' : {'nested' : 'value' }}
		};
		this.testdata2 = {
			'key' : 'value2',
			'arr' : ['b', 2, false],
			'nest' : { 'nested2' : {'nested2' : 'value2' }}
		};

		this.docType = 'test';
	},

	teardown: function() {
		this.basesURI = null;
		this.testdata = null;
		this.docType = null;
		this.docId = null;
	}
});

test('test of test', function() {
	// all five method are exist
	expect(5);
	ok(je, 'je');
	ok(je.POST, 'je.POST');
	ok(je.GET, 'je.GET');
	ok(je.PUT, 'je.PUT');
	ok(je.DELETE, 'je.DELETE');
});

asyncTest('POST only doc parameter', function() {
	expect(7);
	var docType = this.docType;
	var testdata = this.testdata;

	var callback = function(data) {
 		setTimeout(function() {
 			start();
 			ok(data, 'callback catches response data');
  			same(typeof data.key, 'string');
  			same(data.key, testdata.key);

  			same(typeof data.arr, 'object');
  			same(data.arr, testdata.arr);

  			same(typeof data.nest, 'object');
  			same(data.nest, testdata.nest);
 		},10);
	};
	je.POST(docType, testdata, callback);
});

asyncTest('POST with specify the docId in doc parameter', function() {
	expect(9);
	var docType = this.docType;
	var testdata = this.testdata;
	testdata._docId = "testId"; //this._getDocId();

	var callback = function(data) {
 		setTimeout(function() {
 			start();
 			ok(data, 'callback catches response data');
  			same(typeof data.key, 'string');
  			same(data.key, testdata.key);

  			same(typeof data.arr, 'object');
  			same(data.arr, testdata.arr);

  			same(typeof data.nest, 'object');
  			same(data.nest, testdata.nest);

  			same(typeof data._docId, 'string');
  			//same(data._docId, testdata._docId);
			same(data._docId, "testId");

 		},10);
	};
	je.POST(docType, testdata, callback);
});

test('POST with specify the conflicted docId in doc parameter', function() {
//	expect(9);
	var baseURI = this.baseURI;
	var docType = this.docType;
	var testdata = this.testdata;
	var testdata2 = this.testdata2;
	testdata._docId = 'testId2';
	testdata2._docId = 'testId2';

	var jsonparam = { _doc: JSON.stringify(testdata) };
	$.ajax({
		async: true,
		type: 'post',
		url: baseURI + docType,
		data: jsonparam,
		dataType: 'json',
		success: function(res,dataType) {
//			log(res);
		},
		error: function(xhr, status, error) {
//			log(xhr);
		}
	});
	
	stop();
	
	var callback = function(data) {
 		setTimeout(function() {
 			start();
 			ok(data, 'callback catches response data');

  			same(typeof data._docId, 'string', 'docId is string');
			same(data._docId, 'testId2', 'docId is testId2');

  			same(typeof data.key, 'string');
  			same(data.key, testdata2.key);

  			same(typeof data.arr, 'object');
  			same(data.arr, testdata2.arr);

  			same(typeof data.nest, 'object');
  			same(data.nest, testdata2.nest);


 		},10);
	};
	je.POST(docType, testdata2, callback);

});


asyncTest('GET by docId', function() {
	expect(9);
	var docType = this.docType;
	var testdata = this.testdata;
	var docId = null;

	var callback = function(data) {
		setTimeout(function() {
			start();
			ok(data, 'callback catches response data');
 			same(typeof data.key, 'string');
 			same(data.key, testdata.key);
 			same(typeof data.arr, 'object');
 			same(data.arr, testdata.arr);
 			same(typeof data.nest, 'object');
 			same(data.nest, testdata.nest);
  			same(typeof data._docId, 'string');
  			same(data._docId, docId);
		},10);
	};

 	je.POST(docType, testdata, function(data) {
		docId = data._docId;
		je.GET(docType, docId, callback);
	});
});

asyncTest('GET by docType', function() {
	expect(2);
	var docType = this.docType;
	var testdata = this.testdata;

	var callback = function(data) {
		setTimeout(function() {
			start();
			ok(data, 'callback catches response data');
  			same(typeof data, 'object');
		},10);
	};
 	je.POST(docType, testdata, function(data) {
		je.GET(docType, callback);
	});
});


asyncTest('DELETE by docType', function() {
	expect(1);
	var docType = this.docType;
	var testdata = this.testdata;
	var callback = function(data) {
 		setTimeout(function() {
 			start();
 			same(data, '', 'callback catches empty data');
 		},50);
	};
	je.DELETE(docType, callback);
});

asyncTest('DELETE by docId exist', function() {
	expect(1);
	var docType = this.docType;
	var testdata = this.testdata;
	var callback = function(resdata) {
		setTimeout(function() {
			je.DELETE(docType, resdata._docId, function(data) {
				setTimeout(function() {
					start();
					same(data, '', 'callback catches empty data');
				},30);
			});
 		},30);
	};
	je.POST(docType, testdata, callback);
});

asyncTest('PUT partial update', function() {
	expect(4);
	var docType = this.docType;
	var testdata = this.testdata;
	var callback = function(resdata) {
		setTimeout(function() {
			var updateTo = {
				'parcial' : 'update',  // add new param
				'key' : 'values',  // update param
				'nest' : null // update param
			};
			je.PUT(docType, resdata._docId, updateTo, function(data) {
				setTimeout(function() {
					start();
					same(data.arr, ['a', 1, true], 'added data');
					same(data.parcial, 'update', 'added data');
					same(data.key, 'values', 'updated data');
					same(data.nest, 'null', 'update to null became "null"');
				},30);
			});
 		},30);
	};
	je.POST(docType, testdata, callback);
});
