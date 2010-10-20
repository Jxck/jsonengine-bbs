//log = function(a){ 	if(console.log) console.log(a);};
//je = mock;
var bbs = {
	topictmp: null,
	docType: 'bbs',

	restmp: null,
	input_restmp: null,

	/**
	 * ��ؒ�꒤���� id ��򒸵���, html �����钥ƒ��ג�쒡���Ȓ�򒥤��ْ��Ȓ����Ȓ����Ԓ��������
	 * �����Ԓ����������ƒ��ג�쒡���Ȓ����钤� id ���Ò��,
	 * �����Ԓ�������� html �����钤ϒ�ƒ��ג�쒡���Ȓ���������.
	 * @param {string} id �����Ԓ�������������ƒ��ג�쒡���Ȓ�� id. ex '#template'
	 * @param {boolean} del �����Ԓ����������ƒ��ג�쒡���Ȓ��Ò�����, false ��ʒ�钾Ò����� hide()
	 * @return {object} �����Ԓ����ђ�� id ���Ò����� jQuery �����֒�����������
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

		// restmp ��˒�ƒ��ג�쒡���Ȓ�򒥯��풡���󒤷��钴���������뒡�
		bbs.restmp = bbs.clone_template('#restmp', true);

		// input_restmp ��˒�ƒ��ג�쒡���Ȓ�򒥯��풡���󒤷��钴���������뒡�
		bbs.input_restmp = 	bbs.clone_template('#input-restmp', true);

		$('.topic .clear,.topic .submit').hide();

		// response ��ܒ����󒤬�����꒥Ò�������쒤������Β����ْ��Ȓ���ߒ��
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

		//clear��ܒ�����˒����ْ��Ȓ��В������
		$('.topic input[value="clear"]').live('click',function() {
			var $topic = $(this).parents('div.topic');
			$topic.find('textarea').val('');
		});

		//submit��ܒ�����˒����ْ��Ȓ��В������
		$('.topic input[value="submit"]').live('click',function() {

			//��쒥��ʸ������
			var $topic = $(this).parents('div.topic');
			var inputResText = $topic.find('textarea').val();
			
			//��������Ò����钲���⒤���ʒ�����
			if (inputResText == '') {
				return false;
			}

			//��쒥���������ϒ����쒤�Topic���id������
			var _docId = $topic.attr('id');

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

		// topictmp ��˒�ƒ��ג�쒡���Ȓ�򒥯��풡���󒤷��钴���������뒡�
		bbs.topictmp = bbs.clone_template('#template', false);

		this.buindSubmit();
	},

	buindSubmit: function() {
		//submit��ܒ�����Β����ْ��Ȓ����
		$('#input-new-submit').click(function() {
			var title = $('#new-topic input[type=text]').val();
			var detail = $('#new-topic textarea').val();
			if (title === '' || detail === '') {
				return false;
			}
			bbs.postTopic(title, detail, '[]');
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
		//��������蒤Ò��doc��򒸵���Topic����Ȓ�ߒΩ��ƒɽ��������뒡�
		//Topic��Β�ƒ��ג�쒡���Ȓ�򒥤��ْ��Ȓ�Ȓ�쒽˒����Ԓ��
 		var tmp = bbs.topictmp.clone(true);

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


