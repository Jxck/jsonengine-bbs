// Copyright

/**
 * @fileoverview
 * require jsonengine.
 * @author block.rxckin.beats@gmail.com (id:Jxck)
 */


//log = function(a){ 	if(console.log) console.log(a);};
//je = mock;
var bbs = {

	docType: 'bbs',

	$topictmp: null,
	$restmp: null,
	$input_restmp: null,

	init: function() {

		// $restmp ��˒�ƒ��ג�쒡���Ȓ�򒥯��풡���󒤹��뒡�
		bbs.$restmp = bbs.clone_template('#restmp', true);

		// $input_restmp ��˒�ƒ��ג�쒡���Ȓ�򒥯��풡���󒤹��뒡�
		bbs.$input_restmp = bbs.clone_template('#input-restmp', true);

		// topic ��⒤� clear ��� submit ��ܒ�����򒱣���
		$('.topic .clear,.topic .submit').hide();

		// topic ��Β�꒹ƒ��� submit ��ܒ����󒤬�����꒥Ò�������쒤������Β����ْ��Ȓ���ߒ��
		bbs.bindTopicSubmit();

		// topic ��Β�꒹ƒ��� clear ��ܒ����󒤬�����꒥Ò�������쒤������Β����ْ��Ȓ���ߒ��
		bbs.bindTopicClear();

		// topic ��� response ��ܒ����󒤬�����꒥Ò�������쒤������Β����ْ��Ȓ���ߒ��
		bbs.bindTopicResponse();

		// topic ��� delete ��ܒ����󒤬�����꒥Ò�������쒤������Β����ْ��Ȓ���ߒ��
		bbs.bindTopicDelete();

		// res ��� clear ��ܒ����󒤬�����꒥Ò�������쒤������Β����ْ��Ȓ���ߒ��
		bbs.bindResponseClear();

		// res ��� submit ��ܒ����󒤬�����꒥Ò�������쒤������Β����ْ��Ȓ���ߒ��
		bbs.bindResponseSubmit();

		// res ��� delete ��ܒ����󒤬�����꒥Ò�������쒤������Β����ْ��Ȓ���ߒ��
		bbs.bindResponseDelete();

		// $topictmp ��˒�ƒ��ג�쒡���Ȓ�򒥯��풡���󒤹��뒡�
		bbs.$topictmp = bbs.clone_template('#template', false);

	},

	/**
	 * ��������꒹ƒ��� submit ��ܒ�����ؒ�Β����ْ��Ȓ�ВϿ
	 * ��������������Β�ǒ�������ϒ��postTopic ��˒�ϒ�����
	 */
	bindTopicSubmit: function() {
		$('#input-new-submit').click(function() {
			var title = $('#new-topic input[type=text]').val();
			var detail = $('#new-topic textarea').val();
			if (title === '' || detail === '') {
				// �̤�����ϒ����ϒ�ʒ�˒�⒤���ʒ�����
				return false;
			}
			// ��������ǒ�������Ȓ��res �������쒤뒤���ᒤΒ����ے�������뒡�
			bbs.postTopic(title, detail, '[]');
			// �����ϒ������˒����뒡�							 
			$('#input-new-clear').click();
		});
	},

	/**
	 * ��������� response ��ܒ�����ؒ�Β����ْ��Ȓ�ВϿ
	 */
	bindTopicResponse: function() {
		$('.topic .response').live('click', function() {
			var $topic = $(this).parents('div.topic');
			var resInput = bbs.buildResInput();
			resInput.insertAfter($topic.find('p.detail'));
			$topic.find('.input-res-button input').toggle();
		});
	},

	/**
	 * ��������꒹ƒ��� clear ��ܒ�����ؒ�Β����ْ��Ȓ�ВϿ
	 */
	bindTopicClear: function() {
		$('#input-new-clear').click(function() {
			$('#new-topic input[type=text]').val('');
			$('#new-topic textarea').val('');
		});
	},

	/**
	 * ��������� delete ��ܒ�����ؒ�Β����ْ��Ȓ�ВϿ
	 */
	bindTopicDelete: function() {
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
	},


	/**
	 * ��쒥������ϒ��� clear ��ܒ�����ؒ�Β����ْ��Ȓ�ВϿ
	 */
	bindResponseClear: function() {
		$('.topic .clear').live('click', function() {
			var $topic = $(this).parents('div.topic');
			$topic.find('textarea').val('');
		});
	},

	/**
	 * ��쒥������ϒ��� submit ��ܒ�����ؒ�Β����ْ��Ȓ�ВϿ
	 */
	bindResponseSubmit: function() {
		$('.topic .submit').live('click', function() {

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
				// ��쒥���ݒ�󒥹��� res ���ɽ��������뒡�
				bbs.showResponse(_docId, postResponse);
			});
		});
	},

	/**
	 * ��쒥���� delete  ��ܒ�����ؒ�Β����ْ��Ȓ�ВϿ
	 */
	bindResponseDelete: function(){
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
	},

	/**
	 * ��ؒ�꒤���� id ��򒸵���, html �����钥ƒ��ג�쒡���Ȓ�򒥤��ْ��Ȓ����Ȓ����Ԓ��������
	 * �����Ԓ����������ƒ��ג�쒡���Ȓ����钤� id ���Ò��,
	 * �����Ԓ�������� html �����钤ϒ�ƒ��ג�쒡���Ȓ���������.
	 * @param {string} id �����Ԓ�������������ƒ��ג�쒡���Ȓ�� id. ex '#template'.
	 * @param {boolean} del �����Ԓ����������ƒ��ג�쒡���Ȓ��Ò�����, false ��ʒ�钾Ò����� hide().
	 * @return {object} �����Ԓ����ђ�� id ���Ò����� jQuery �����֒�����������.
	 */
	clone_template: function(id, del) {
		var _$tmp = $(id);
		var $template = _$tmp.clone(true).removeAttr('id');
		del ? _$tmp.remove() : _$tmp.hide();
		return $template;
	},

	/**
	 * ��������Β�������Ȓ�뒡���ܒʸ�����֒����Β�ے���������蒤꒡���ݒ����Ȓ����뒡�
	 * ��쒥���ݒ�󒥹�����钵������˒�䒤�����ƒ�钤쒤� docId ������������
	 * getTopic ��˒�꒤���뒡�
	 * @param {string} titleData
	 * @param {string} detailData
	 * @param {string} responseData
	 */
	postTopic: function(titleData, detailData, responseData) {
		var data = {
			title: titleData,
			detail: detailData,
			response: responseData
		};
		// POST ��ǒ����钤쒤� docId ��� getTopic ��˒�ϒ�����
		var callback = function(data) {
			bbs.getTopic(data._docId);
		};
		je.POST(bbs.docType, data, callback);
	},

	/**
	 * _docId ���������蒤Ò����钡������쒤򒸵��˒�ɒ����咥ᒥ�Ȓ����������뒡�
	 * �����������ʒ����Ò����钡� docType ���������������蒤뒡�
	 * ��������蒤Ò����ɒ����咥ᒥ�Ȓ�ϒ�� buildTopic ��� jquery �����֒����������Ȓ�˒��
	 * ��ᒤÒ����ɒ����咥ᒥ�Ȓ�� displayTopic ��˒�ϒ�����
	 * @param {string} _docId docId(�̵�����쒹璤⒤����).
	 * @return {object} ����������������ے��.
	 */
	getTopic: function(_docId) {
		var callback = null;

		if (_docId) {
			// docId ����ͭ��뒾쒹�
			callback = function(res) {
				bbs.buildTopic(res);
			};
			je.GET(bbs.docType, _docId, callback);
		} else {
			// docId ����̵�����쒹�
			callback = function(res) {
				for (var i in res) {
					bbs.buildTopic(res[i]);
				}
			};
			je.GET(bbs.docType, callback);
		}
	},


	/**
	 * doc ���������蒤� Topic ����Ȓ�ߒΩ��ƒ�뒡�
	 * ��Ȓ�ߒΩ��ƒ�� jquery �����֒����������Ȓ���֒�����
	 * @param {object} doc 
	 * @return {object} ��Ȓ�ߒΩ��ƒ�� jquery �����֒�����������
	 */
	buildTopic: function(doc) {
		//��������蒤Ò��doc��򒸵���Topic����Ȓ�ߒΩ��ƒɽ��������뒡�
		//Topic��Β�ƒ��ג�쒡���Ȓ�򒥤��ْ��Ȓ�Ȓ�쒽˒����Ԓ��
 		var $tmp = bbs.$topictmp.clone(true);

		//doc��Β�ǒ��������ή���������
		$tmp.attr('id', doc._docId);
 		$('.title', $tmp).text(doc.title);
 		$('._createdAt', $tmp).text(doc._createdAt);
		$('._createdBy', $tmp).text(doc._createdBy);

		//detail��Β�撤˒��doc.detail���ή������������
		var $p = bbs.multiLineTextToDom(doc.detail);
		$('p.detail', $tmp).append($p);

		//doc.response��˒����Ò�ƒ��docId��Β�ے���������
		var resArray = JSON.parse(doc.response);

		if (resArray) {//resArray�����撿Ȓ�����Ò�ƒ��������
			for (var j = 0; j < resArray.length; j++) {
 				je.GET('res', resArray[j], function(res) {
  					var resObj = bbs.restmpObj(res);
 					$('div.topicDetail > p.detail', $tmp).append(resObj);
 				});
			}
		}
		$tmp.insertAfter('.topic:last');
	},

	/**
	 * resId ���������蒤꒡������Β�͒��������� array ����֒�����
	 * @param {object} arr resId ��Β�ے��.
	 * @param {string} elem ��Ò�������� resId.
	 * @return {object} ����������������ے��.
	 */
	deleteArrayElement: function(arr, elem) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === elem) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},

	/**
	 * response ��� doc ���������蒤꒡������ے�������ƒ��ג�쒡���Ȓ���֒�����
	 * @param {string} responseDoc ��������蒤Ò�� doc.
	 * @return {object} �����ے����� jquery �����֒�����������.
	 */
	restmpObj: function(responseDoc) {
		var $resObj = bbs.$restmp.clone(true);
		$resObj.attr('id', responseDoc._docId);
		var $p = bbs.multiLineTextToDom(responseDoc.resDetail);
		$('.detail', $resObj).append($p);
		$('._createdAt', $resObj).text(responseDoc._createdAt);
		$('._createdBy', $resObj).text(responseDoc._createdBy);
		return $resObj;
	},

	/**
	 * ��������蒤Ò����ޒ�뒥���钥����ƒ�������Ȓ��
	 * <p><span>text</span><br><span>text</span></p>
	 * ��Β����˒�ޒ����������Ò�ג����� jquery �����֒����������Ȓ���֒�����
	 * @param {string} multiLineText �ɽ���������ʣ�����Ԓ�ƒ��������.
	 * @return {object} ��ޒ����������Ò�ג����� jquery �����֒�����������.
	 */
	multiLineTextToDom: function(multiLineText) {
		var lineArray = multiLineText.split('\n');
		var $p = $('<p>');
		for (var i = 0; i < lineArray.length; i++) {
			var $span = $('<span>').text(lineArray[i]);
			$p.append($span);
		}
		$('span', $p).after('<br>');
		return $p;
	},


	buildResInput: function(target) {
		//response���ɽ����������Β�蒤�Β��
		var tmp = bbs.$input_restmp.clone(true);
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


