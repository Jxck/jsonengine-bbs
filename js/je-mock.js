//log = function(data) {if (console.log) {console.log(data);}};
var mock = {

	ALNUMS: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
	UUID_DIGITS: 32,

	_getDocId: function() {
		var docId = '';
		var ALNUMS = mock.ALNUMS;
		var digits = mock.UUID_DIGITS;

		for (var i = 0; i < digits; i++) {
			docId += ALNUMS[Math.floor(Math.random() * (digits + 1))];
		}
		return docId;
	},

	_getCurrentTime: function() {
		return parseInt((new Date) / 1000);
	},

	_delay: function(callback, data) {
		setTimeout(function() {
			callback(data);
		},1000);
	},

	POST: function(docType,data,callback) {
		var docId = mock._getDocId();
		var now = mock._getCurrentTime();
		var doc = {
			'_docId' : docId,
			'_updatedAt' : now,
			'_createdAt' : now,
			'_updatedBy' : null,
			'_createdBy' : null
		};

		for (var i in data) {
			doc[i] = data[i];
		}

		var bucket = db.get(docType);
		if (!bucket) {
			bucket = {};
		}

		bucket[docId] = doc;
		db.set(docType, bucket);

		mock._delay(callback, doc);
	},

	GET: function(docType, docId, callback) {
		var text = db.get(docType);
		if (arguments.length === 3) {
			text = text[docId];
		}else if (arguments.length === 2) {
			callback = docId;
		}

		mock._delay(callback, text);
	},

	PUT: function(docType, docId, params, callback) {
		var tmp = db.get(docType);
		var doc = tmp[docId];
		for (var k in params) {
			doc[k] = params[k];
		}

		doc._updatedAt = mock._getCurrentTime();

 		tmp[docId] = doc;

 		db.set(docType, tmp);

		mock._delay(callback, doc);
	},

	DELETE: function(docType, docId, callback) {
		//もし引数が2つだったらdocTypeで消す。
		//3つだったらdocIdで消す。
		if (arguments.length === 3) {
			var tmp = db.get(docType);
			tmp[docId] = null;
			db.set(docType, tmp);
			mock._delay(callback, '');
		}else if (arguments.length === 2) {
			callback = docId;
			db.del(docType);
			if (db.get(docType) === null) {
				mock._delay(callback, '');
			}
		}
	}
};
