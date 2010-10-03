//log = function(a){ 	if(console.log) console.log(a);};
//je = mock;
var bbs = {
	baseObj: null,
	docType: 'bbs',

	restmp: '<div class="res ui-corner-all">' +
		       '<span class="detail"></span>' +
		       '<span class="_createdAt"></span>' +
		       '<span class="_createdBy"></span>' +
		       '<input class="delete-button ui-button ui-state-hover ui-corner-all ui-button-text-only" type="button" value="delete" />' +
		     '</div>',

	input_restmp: null,

	clone_input_restmp: function() {
		// input_restmp ��˒�쒥������ϒ��Β�ƒ��ג�쒡���Ȓ�򒥯��풡���󒤹��뒽钴���������
		var _tmp = $('#input-restmp');
		var _return = _tmp.clone().removeAttr('id');
		_tmp.remove();
		return _return;
	},

	init: function() {
		var self = this;

		// input_restmp ��˒�ƒ��ג�쒡���Ȓ�򒥯��풡���󒤷��钴���������뒡�
		bbs.input_restmp = 	bbs.clone_input_restmp();

		$('.topic .input-res-button[value=response]').live('click', function() {
			var tmp = self.buildResInput();
			tmp.insertAfter($(this).parent());
			$(this).parent().remove();
		});

		$('.topic .input-res-button[value=delete]').live('click', function() {
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

		$('.delete-button').live('click', function() {
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
			}
			je.GET(bbs.docType, topicId, callback);
		});

		this.baseView('#template');
		this.buindSubmit();
	},

	baseView: function(id) {
		var $template = $(id);
		this.baseObj = $template.clone(true).removeAttr('id');
		$template.hide();
	},

	buindSubmit: function() {
		var self = this;
		//submit��ܒ�����Β����ْ��Ȓ����
		$('#input-new-submit').click(function() {
			var title = $('#new-topic input[type=text]').val();
			var detail = $('#new-topic textarea').val();
			if (title === '' || detail === '') {
				return false;
			}
			self.postTopic(title, detail, '[]');
			$('#input-new-clear').click();
		});

		//clear��ܒ�����Β����ْ��Ȓ����
		$('#input-new-clear').click(function() {
			$('#new-topic input[type=text]').val('');
			$('#new-topic textarea').val('');
		});
	},

	postTopic: function(titleData, detailData, responseData) {
		//��������Ȓ�뒡���ܒʸ�����֒�����������蒤꒡�post�����뒡�
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
		//_docId���������蒤Ò����钡������쒤򒸵��˒�ɒ����咥ᒥ�Ȓ����������뒡�
		//�����������ʒ����Ò����钡�docType���������������蒤뒡�
		//��������蒤Ò����ɒ����咥ᒥ�Ȓ�ϒ��buildTopic��˒�ϒ�����
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
		var resObj = $(bbs.restmp);
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
		//��������蒤Ò��doc��򒸵���Topic����Ȓ�ߒΩ��ƒɽ��������뒡�
		//Topic��Β�ƒ��ג�쒡���Ȓ�򒥤��ْ��Ȓ�Ȓ�쒽˒����Ԓ��
 		var tmp = this.baseObj.clone(true);

		//doc��Β�ǒ��������ή���������
		$(tmp).attr('id', doc._docId);
 		$('.title', tmp).text(doc.title);
 		$('._createdAt', tmp).text(doc._createdAt);
		$('._createdBy', tmp).text(doc._createdBy);

		//detail��Β�撤˒��doc.detail���ή������������
		bbs.displayMultiLineText($('p.detail', tmp), doc.detail);

		//doc.response��˒����Ò�ƒ��docId��Β�ے���������
		var resArray = JSON.parse(doc.response);

		if (resArray) {//resArray�����撿Ȓ�����Ò�ƒ��������
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
		//response���ɽ����������Β�蒤�Β��
		var tmp = bbs.input_restmp;

		//clear��ܒ�����˒����ْ��Ȓ��В������
		$('input[value="clear"]', tmp).click(function() {
			$('textarea', tmp).val('');
		});

		//submit��ܒ�����˒����ْ��Ȓ��В������
		$('input[value="submit"]', tmp).click(function() {
			//��쒥��ʸ������
			var inputResText = $('textarea', tmp).val();

			//��������Ò����钲���⒤���ʒ�����
			if (inputResText == '') {
				return false;
			}

			//��쒥���������ϒ����쒤�Topic���id������
			var _docId = $(this).parents('div.topic').attr('id');

			//��쒥���Ȓ����ƒ�ВϿ�����뒥ǒ�����
			var data = {
				resDetail: inputResText,
				to: _docId
			};

			je.POST('res', data, function(postResponse) {
				// doc ��� ��ВϿ������ res ��� docId ���Ò����뒡�
				bbs.addResIdToDoc(_docId, postResponse._docId);
				bbs.showResponse(_docId, postResponse);
			});
		});
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
		$('#' + _docId + ' .input-res').remove();
		$('#' + _docId + ' .input-res-button')
			.html(
				'<input class="input-res-button ui-button ui-state-hover ui-corner-all ui-button-text-only" type="button" value="response" />' +
				'<input class="input-res-button ui-button ui-state-hover ui-corner-all ui-button-text-only" type="button" value="delete" />'
		);
		var resObj = bbs.restmpObj(res);
		$('div.topicDetail > p.detail', '#' + _docId).append(resObj);
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


