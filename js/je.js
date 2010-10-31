log = function(a,b){
//	if(console.log){(a)? console.log(a) :	console.log(a);console.log(b);}
};
var je = {
	baseURI: '/_je/',

	POST: function(docType, data ,callback) {
		var jsonparam = { _doc: JSON.stringify(data) };
		$.ajax({
			type: 'post',
			url: je.baseURI + docType,
			data: jsonparam,
			dataType: 'json',
			success: function(res,dataType) {
				callback(res);
			},
			error: function(xhr, status, error) {
				log(error);
			}
		});
	},

	/**
	 * (docType, docId, callback) 
	 * (docType, callback)
	 * (param)
	 * 
	 * param = {
	 *   docType : 'docType',
	 *   docId : 'docId',
	 *   callback : function(){},
	 *   beforeSend : function(){},
	 *   sucess : function(){},
	 *   error : function(){},
	 *   complete : function(){}
	 * }
	 * @param {string} id コピーしたいテンプレートの id. ex '#template'
	 * @param {boolean} del コピーしたテンプレートを消すか, false なら消さず hide()
	 * @return {object} コピー用の id を消去した jQuery オブジェクト
	 */
	GET: function(docType, docId, callback) {
		var url = je.baseURI + docType;
		if (arguments.length === 3) {
			url += '/' + docId;
		}else if (arguments.length === 2) {
			callback = docId;
		}

		$.ajax({
			type: 'GET',
			url: url,
			data: {'sort': '_createdAt.asc'},
			beforeSend: function(xhr) {
				log(xhr);
			},
			success: function(res) {
				log(res);
				callback(res);
			},
			error: function(xhr, status, error) {
				log(error);
			},
			complete: function(xhr, status) {
				log(xhr);
			}
		});
	},

	PUT: function(docType, docId, data, callback) {
		$.ajax({
			type: 'PUT',
			url: je.baseURI + docType + '/' + docId,
			data: data,
			success: function(res) {
				log(res);
				callback(res);
			},
			error: function(xhr) {
				if (xhr.status === 409) {
					je.PUT(params);
				}
			}
		});
	},

	DELETE: function(docType, docId, callback) {
		//もし引数が2つだったらdocTypeで消す。
		//3つだったらdocIdで消す。
		var url = je.baseURI + docType;
		if (arguments.length === 3) {
			url += '/' + docId;
		}else if (arguments.length === 2) {
			callback = docId;
		}
		$.ajax({
			type: 'DELETE',
			url: url,
			success: function(res,dataType) {
				callback(res);
			}
		});
	}
};
