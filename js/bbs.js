//log = function(a){ 	if(console.log) console.log(a);};
//je = mock;
var bbs = {
	topictmp: null,
	docType: 'bbs',

	restmp: null,
	input_restmp: null,

	/**
	 * ’»Ø’Äê’¤·’¤¿ id ’¤ò’¸µ’¤Ë, html ’¤«’¤é’¥Æ’¥ó’¥×’¥ì’¡¼’¥È’¤ò’¥¤’¥Ù’¥ó’¥È’¤´’¤È’¥³’¥Ô’¡¼’¤¹’¤ë
	 * ’¥³’¥Ô’¡¼’¤·’¤¿’¥Æ’¥ó’¥×’¥ì’¡¼’¥È’¤«’¤é’¤Ï id ’¤ò’¾Ã’µî’¤·,
	 * ’¥³’¥Ô’¡¼’¸µ’¤Î html ’¤«’¤é’¤Ï’¥Æ’¥ó’¥×’¥ì’¡¼’¥È’¤ò’ºï’½ü’¤¹’¤ë.
	 * @param {string} id ’¥³’¥Ô’¡¼’¤·’¤¿’¤¤’¥Æ’¥ó’¥×’¥ì’¡¼’¥È’¤Î id. ex '#template'
	 * @param {boolean} del ’¥³’¥Ô’¡¼’¤·’¤¿’¥Æ’¥ó’¥×’¥ì’¡¼’¥È’¤ò’¾Ã’¤¹’¤«, false ’¤Ê’¤é’¾Ã’¤µ’¤º hide()
	 * @return {object} ’¥³’¥Ô’¡¼’ÍÑ’¤Î id ’¤ò’¾Ã’µî’¤·’¤¿ jQuery ’¥ª’¥Ö’¥¸’¥§’¥¯’¥È
	 */
	clone_template: function(id, del) {
		var _$tmp = $(id);
		var $template = _$tmp.clone(true).removeAttr('id');
		del ? _$tmp.remove() : _$tmp.hide();
		return $template;
	},

	baseView: function(id) {
		var $template = $(id);
		this.baseObj = $template.clone(true).removeAttr('id');
		$template.hide();
	},

	init: function() {

		// restmp ’¤Ë’¥Æ’¥ó’¥×’¥ì’¡¼’¥È’¤ò’¥¯’¥í’¡¼’¥ó’¤·’½é’´ü’²½’¤¹’¤ë’¡£
		bbs.restmp = bbs.clone_template('#restmp', true);

		// input_restmp ’¤Ë’¥Æ’¥ó’¥×’¥ì’¡¼’¥È’¤ò’¥¯’¥í’¡¼’¥ó’¤·’½é’´ü’²½’¤¹’¤ë’¡£
		bbs.input_restmp = 	bbs.clone_template('#input-restmp', true);

		$('.topic .clear,.topic .submit').hide();

		// response ’¥Ü’¥¿’¥ó’¤¬’¥¯’¥ê’¥Ã’¥¯’¤µ’¤ì’¤¿’»þ’¤Î’¥¤’¥Ù’¥ó’¥È’¤ò’Àß’Äê
		$('.topic .response').live('click', function() {
			var $topic = $(this).parents('div.topic');
			var resInput = bbs.buildResInput();
			resInput.insertAfter($topic.find('p.detail'));
			$topic.find('.input-res-button input').toggle();
		});

		$('.topic .delete').live('click', function() {
			var _docId = $(this).parents('div.topic').attr('id');
			if (confirm('really?')) {
				var callback = function(data) {
					var response = JSON.parse(data.response);
					response.push(data._docId);
					for (var i = 0; i < response.length; i++) {
						je.DELETE(bbs.docType, response[i], function() {});
					}
					$('#' + data._docId).remove();
				};
				je.GET(bbs.docType, _docId, callback);
			}
		});

		//clear’¥Ü’¥¿’¥ó’¤Ë’¥¤’¥Ù’¥ó’¥È’¤ò’¥Ð’¥¤’¥ó’¥É
		$('.topic input[value="clear"]').live('click',function() {
			var $topic = $(this).parents('div.topic');
			$topic.find('textarea').val('');
		});

		//submit’¥Ü’¥¿’¥ó’¤Ë’¥¤’¥Ù’¥ó’¥È’¤ò’¥Ð’¥¤’¥ó’¥É
		$('.topic input[value="submit"]').live('click',function() {

			//’¥ì’¥¹’Ê¸’¤ò’¼è’ÆÀ
			var $topic = $(this).parents('div.topic');
			var inputResText = $topic.find('textarea').val();
			
			//’¶õ’¤À’¤Ã’¤¿’¤é’²¿’¤â’¤·’¤Ê’¤¤’¡£
			if (inputResText == '') {
				return false;
			}

			//’¥ì’¥¹’¤¬’Æþ’ÎÏ’¤µ’¤ì’¤¿Topic’¤Îid’¤ò’¼è’ÆÀ
			var _docId = $topic.attr('id');

			//’¥ì’¥¹’¤È’¤·’¤Æ’ÅÐ’Ï¿’¤¹’¤ë’¥Ç’¡¼’¥¿
			var data = {
				resDetail: inputResText,
				to: _docId
			};

			je.POST('res', data, function(postResponse) {
				// doc ’¤Ë ’ÅÐ’Ï¿’¤·’¤¿ res ’¤Î docId ’¤ò’²Ã’¤¨’¤ë’¡£
				bbs.addResIdToDoc(_docId, postResponse._docId);
				bbs.showResponse(_docId, postResponse);
			});
		});


		$('.delete-res').live('click', function() {
			var resId = $(this).parents('.res').attr('id');
			var topicId = $(this).parents().parents('.topic').attr('id');

			var callback = function(data) {
				var tmparr = JSON.parse(data.response);
				tmparr = bbs.deleteArrayElement(tmparr, topicId);

				je.PUT(bbs.docType,
					   topicId,
					   {response: JSON.stringify(tmparr)},
					   function() {}
					  );

				je.DELETE(bbs.docType, resId, function() {});
				$('#' + resId).remove();
			};
			je.GET(bbs.docType, topicId, callback);
		});

		// topictmp ’¤Ë’¥Æ’¥ó’¥×’¥ì’¡¼’¥È’¤ò’¥¯’¥í’¡¼’¥ó’¤·’½é’´ü’²½’¤¹’¤ë’¡£
		bbs.topictmp = bbs.clone_template('#template', false);

		this.buindSubmit();
	},

	buindSubmit: function() {
		//submit’¥Ü’¥¿’¥ó’¤Î’¥¤’¥Ù’¥ó’¥È’½è’Íý
		$('#input-new-submit').click(function() {
			var title = $('#new-topic input[type=text]').val();
			var detail = $('#new-topic textarea').val();
			if (title === '' || detail === '') {
				return false;
			}
			bbs.postTopic(title, detail, '[]');
			$('#input-new-clear').click();
		});

		//clear’¥Ü’¥¿’¥ó’¤Î’¥¤’¥Ù’¥ó’¥È’½è’Íý
		$('#input-new-clear').click(function() {
			$('#new-topic input[type=text]').val('');
			$('#new-topic textarea').val('');
		});
	},

	postTopic: function(titleData, detailData, responseData) {
		//’¥¿’¥¤’¥È’¥ë’¡¢’ËÜ’Ê¸’¡¢’ÊÖ’¿®’¤ò’¼õ’¤±’¼è’¤ê’¡¢post’¤¹’¤ë’¡£
		var data = {
			title: titleData,
			detail: detailData,
			response: responseData
		};
		var callback = function(data) {
			bbs.getTopic(data._docId);
		};
		je.POST(bbs.docType, data, callback);
	},

	getTopic: function(_docId) {
		//_docId’¤ò’¼õ’¤±’¼è’¤Ã’¤¿’¤é’¡¢’¤½’¤ì’¤ò’¸µ’¤Ë’¥É’¥­’¥å’¥á’¥ó’¥È’¤ò’¼è’ÆÀ’¤¹’¤ë’¡£
		//’°ú’¿ô’¤¬’¤Ê’¤«’¤Ã’¤¿’¤é’¡¢docType’Á´’Éô’¤ò’¼õ’¤±’¼è’¤ë’¡£
		//’¼õ’¤±’¼è’¤Ã’¤¿’¥É’¥­’¥å’¥á’¥ó’¥È’¤Ï’¡¢buildTopic’¤Ë’ÅÏ’¤¹’¡£
		var callback = null;

		if (_docId) {
			callback = function(res) {
				bbs.buildTopic(res);
			};
			je.GET(bbs.docType, _docId, callback);
		}else {
			callback = function(res) {
				for (var i in res) {
					bbs.buildTopic(res[i]);
				}
			};
			je.GET(bbs.docType, callback);
		}
	},

	deleteArrayElement: function(arr, elem) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === elem) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},

	restmpObj: function(responseDoc) {
		var resObj = bbs.restmp.clone();
		resObj.attr('id', responseDoc._docId);
		bbs.displayMultiLineText($('.detail', resObj), responseDoc.resDetail);
		$('._createdAt', resObj).text(responseDoc._createdAt);
		$('._createdBy', resObj).text(responseDoc._createdBy);
		return resObj;
	},

	displayMultiLineText: function(area, multiLineText) {
		// insert mutiline text to DOM area
		// each texts are wrapped with <span></span>
		// and add <br> at end of each line
		var lineArray = multiLineText.split('\n');
		for (var i = 0; i < lineArray.length; i++) {
			area.append($('<span>').text(lineArray[i]));
		}
		$('span', area).after('<br>');
	},

	buildTopic: function(doc) {
		//’¼õ’¤±’¼è’¤Ã’¤¿doc’¤ò’¸µ’¤ËTopic’¤ò’ÁÈ’¤ß’Î©’¤Æ’É½’¼¨’¤¹’¤ë’¡£
		//Topic’¤Î’¥Æ’¥ó’¥×’¥ì’¡¼’¥È’¤ò’¥¤’¥Ù’¥ó’¥È’¤È’°ì’½ï’¤Ë’¥³’¥Ô’¡¼
 		var tmp = bbs.topictmp.clone(true);

		//doc’¤Î’¥Ç’¡¼’¥¿’¤ò’Î®’¤·’¹þ’¤à
		$(tmp).attr('id', doc._docId);
 		$('.title', tmp).text(doc.title);
 		$('._createdAt', tmp).text(doc._createdAt);
		$('._createdBy', tmp).text(doc._createdBy);

		//detail’¤Î’Ãæ’¤Ë’¡¢doc.detail’¤ò’Î®’¤·’¹þ’¤à’¡£
		bbs.displayMultiLineText($('p.detail', tmp), doc.detail);

		//doc.response’¤Ë’Æþ’¤Ã’¤Æ’¤ëdocId’¤Î’ÇÛ’Îó’¤ò’¼è’ÆÀ’¡£
		var resArray = JSON.parse(doc.response);

		if (resArray) {//resArray’¤¬’Ãæ’¿È’¤ò’»ý’¤Ã’¤Æ’¤¤’¤¿’¤é
			for (var j = 0; j < resArray.length; j++) {
 				je.GET('res', resArray[j], function(res) {
  					var resObj = bbs.restmpObj(res);
 					$('div.topicDetail > p.detail', tmp).append(resObj);
 				});
			}
		}
		tmp.insertAfter('.topic:last');
	},

	buildResInput: function(target) {
		//response’¤ò’É½’¼¨’¤¹’¤ë’ÎÎ’°è’¤ò’³Î’ÊÝ
		var tmp = bbs.input_restmp.clone(true);
		return tmp;
	},

	addResIdToDoc: function(docId, resId) {
		var callback = function(data) {
			var responseArray = JSON.parse(data.response);
			responseArray.push(resId);

			je.PUT(bbs.docType, docId, {response: JSON.stringify(responseArray)}, function(data) {

		    });
		};
		je.GET(bbs.docType, docId, callback);
	},

	showResponse: function(_docId, res) {
 		var $topic = $('#' + _docId);

		$topic.find('.input-res-field').remove();
		$topic.find('.input-res-button input').toggle();

 		var resObj = bbs.restmpObj(res);
		$topic.find('p.detail').append(resObj);
	}
};

$(function() {
	  //Accordion
	  $('#accordion').accordion({
		  header: 'h3',
// 		  active : 0,
 		  active: false,
		  collapsible: true,
		  autoHeight: false
	  });

 	  bbs.init();
 	  bbs.getTopic();
});


