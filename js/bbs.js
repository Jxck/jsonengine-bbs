/**
 * @fileoverview
 * this is the sample bbs application of jsonengine.
 * require jsonengine[http://code.google.com/p/jsonengine/]
 * require jQuery1.4.2, je.js

 * @author block.rxckin.beats@gmail.com (id:Jxck)
 */

log = function(a, b) {
  // if(console.log){(a)? console.log(a) :    console.log(a);console.log(b);}
};
//je = mock;
var bbs = {

  docType: 'bbs',

  $topictmp: null,
  $restmp: null,
  $input_restmp: null,

  init: function() {

    // $restmp ¤Ë¥Æ¥ó¥×¥ì¡¼¥È¤ò¥¯¥í¡¼¥ó¤¹¤ë¡£
    bbs.$restmp = bbs.clone_template('#restmp', true);

    // $input_restmp ¤Ë¥Æ¥ó¥×¥ì¡¼¥È¤ò¥¯¥í¡¼¥ó¤¹¤ë¡£
    bbs.$input_restmp = bbs.clone_template('#input-restmp', true);

    // topic Æâ¤Î clear ¤È submit ¥Ü¥¿¥ó¤ò±£¤¹
    $('.topic .clear,.topic .submit').hide();

    // topic ¤ÎÅê¹ÆÍó¤Î submit ¥Ü¥¿¥ó¤¬¥¯¥ê¥Ã¥¯¤µ¤ì¤¿»þ¤Î¥¤¥Ù¥ó¥È¤òÀßÄê
    bbs.bindTopicSubmit();

    // topic ¤ÎÅê¹ÆÍó¤Î clear ¥Ü¥¿¥ó¤¬¥¯¥ê¥Ã¥¯¤µ¤ì¤¿»þ¤Î¥¤¥Ù¥ó¥È¤òÀßÄê
    bbs.bindTopicClear();

    // topic ¤Î response ¥Ü¥¿¥ó¤¬¥¯¥ê¥Ã¥¯¤µ¤ì¤¿»þ¤Î¥¤¥Ù¥ó¥È¤òÀßÄê
    bbs.bindTopicResponse();

    // topic ¤Î delete ¥Ü¥¿¥ó¤¬¥¯¥ê¥Ã¥¯¤µ¤ì¤¿»þ¤Î¥¤¥Ù¥ó¥È¤òÀßÄê
    bbs.bindTopicDelete();

    // res ¤Î clear ¥Ü¥¿¥ó¤¬¥¯¥ê¥Ã¥¯¤µ¤ì¤¿»þ¤Î¥¤¥Ù¥ó¥È¤òÀßÄê
    bbs.bindResponseClear();

    // res ¤Î submit ¥Ü¥¿¥ó¤¬¥¯¥ê¥Ã¥¯¤µ¤ì¤¿»þ¤Î¥¤¥Ù¥ó¥È¤òÀßÄê
    bbs.bindResponseSubmit();

    // res ¤Î delete ¥Ü¥¿¥ó¤¬¥¯¥ê¥Ã¥¯¤µ¤ì¤¿»þ¤Î¥¤¥Ù¥ó¥È¤òÀßÄê
    bbs.bindResponseDelete();

    // $topictmp ¤Ë¥Æ¥ó¥×¥ì¡¼¥È¤ò¥¯¥í¡¼¥ó¤¹¤ë¡£
    bbs.$topictmp = bbs.clone_template('#template', false);

  },

  /**
  * µ­»öÅê¹ÆÍó¤Î submit ¥Ü¥¿¥ó¤Ø¤Î¥¤¥Ù¥ó¥ÈÅÐÏ¿
  * ¿·µ¬µ­»ö¤Î¥Ç¡¼¥¿¤Ï¡¢postTopic ¤ËÅÏ¤¹¡£
  */
  bindTopicSubmit: function() {
    $('#input-new-submit').click(function() {
      var title = $('#new-topic input[type=text]').val();
      var detail = $('#new-topic textarea').val();
      if (title === '' || detail === '') {
        // Ì¤ÆþÎÏ»þ¤Ï¤Ê¤Ë¤â¤·¤Ê¤¤¡£
        return false;
      }
      // µ­»ö¥Ç¡¼¥¿¤È¡¢res ¤òÆþ¤ì¤ë¤¿¤á¤Î¶õÇÛÎó¤òÁ÷¤ë¡£
      bbs.postTopic(title, detail, '[]');
      // ÆþÎÏÍó¤ò¶õ¤Ë¤¹¤ë¡£
      $('#input-new-clear').click();
    });
  },

  /**
  * µ­»ö¤Î response ¥Ü¥¿¥ó¤Ø¤Î¥¤¥Ù¥ó¥ÈÅÐÏ¿
  */
  bindTopicResponse: function() {
    $('.topic .response').live('click', function() {
      var $topic = $(this).parents('div.topic');
      var resInput = bbs.$input_restmp.clone(true);
      resInput.insertAfter($topic.find('p.detail'));
      $topic.find('.input-res-button input').toggle();
    });
  },

  /**
  * µ­»öÅê¹ÆÍó¤Î clear ¥Ü¥¿¥ó¤Ø¤Î¥¤¥Ù¥ó¥ÈÅÐÏ¿
  */
  bindTopicClear: function() {
    $('#input-new-clear').click(function() {
      $('#new-topic input[type=text]').val('');
      $('#new-topic textarea').val('');
    });
  },

  /**
   * µ­»ö¤Î delete ¥Ü¥¿¥ó¤Ø¤Î¥¤¥Ù¥ó¥ÈÅÐÏ¿
   */
  bindTopicDelete: function() {
    $('.topic .delete').live('click', function() {
      // delete ¥Ü¥¿¥ó¤¬²¡¤µ¤ì¤¿ topic ¤Î docId ¤ò¼èÆÀ
      var _docId = $(this).parents('div.topic').attr('id');
      // ³ÎÇ§
      if (confirm('really?')) {
        // °ìÃ¼¤½¤Î topic ¤Î doc ¤ò¼èÆÀ¤·Ä¾¤¹
        var callback = function(data) {
                    var responseArr = JSON.parse(data.response);
                    // responseArr ÇÛÎó¤Ë topic ¤Î docId ¤òÄÉ²Ã
                    responseArr.push(data._docId);
                    // topic ¤È responseArr ´Þ¤á¤ÆÁ´Éôºï½ü
                    for (var i = 0; i < responseArr.length; i++) {
            je.DELETE(bbs.docType, responseArr[i], function() {});
                    }
                    // dom ¤òºï½ü
                    $('#' + data._docId).remove();
        };
        je.GET(bbs.docType, _docId, callback);
      }
    });
  },


  /**
   * ¥ì¥¹ÆþÎÏÍó¤Î clear ¥Ü¥¿¥ó¤Ø¤Î¥¤¥Ù¥ó¥ÈÅÐÏ¿
   */
  bindResponseClear: function() {
    $('.topic .clear').live('click', function() {
      var $topic = $(this).parents('div.topic');
      $topic.find('textarea').val('');
    });
  },

  /**
   * ¥ì¥¹ÆþÎÏÍó¤Î submit ¥Ü¥¿¥ó¤Ø¤Î¥¤¥Ù¥ó¥ÈÅÐÏ¿
   */
  bindResponseSubmit: function() {
    $('.topic .submit').live('click', function() {

      //¥ì¥¹Ê¸¤ò¼èÆÀ
      var $topic = $(this).parents('div.topic');
      var inputResText = $topic.find('textarea').val();

      //¶õ¤À¤Ã¤¿¤é²¿¤â¤·¤Ê¤¤¡£
      if (inputResText == '') {
        return false;
      }

      //¥ì¥¹¤¬ÆþÎÏ¤µ¤ì¤¿Topic¤Îid¤ò¼èÆÀ
      var _docId = $topic.attr('id');

      //¥ì¥¹¤È¤·¤ÆÅÐÏ¿¤¹¤ë¥Ç¡¼¥¿
      var data = {
        resDetail: inputResText,
        to: _docId
      };

      je.POST('res', data, function(postResponse) {
        // doc ¤Ë ÅÐÏ¿¤·¤¿ res ¤Î docId ¤ò²Ã¤¨¤ë¡£
        bbs.addResIdToDoc(_docId, postResponse._docId);
        // ¥ì¥¹¥Ý¥ó¥¹¤Î res ¤òÉ½¼¨¤¹¤ë¡£
        bbs.showResponse(_docId, postResponse);
      });
    });
  },

  /**
   * ¥ì¥¹¤Î delete  ¥Ü¥¿¥ó¤Ø¤Î¥¤¥Ù¥ó¥ÈÅÐÏ¿
   */
  bindResponseDelete: function() {
    $('.delete-res').live('click', function() {
      // ¥ì¥¹¤Î docId ¤ò¼èÆÀ
      var resId = $(this).parents('.res').attr('id');
      // ¥È¥Ô¥Ã¥¯¤Î docId ¤ò¼èÆÀ
      var topicId = $(this).parents().parents('.topic').attr('id');

      var callback = function(data) {
        // res ¤ÎÇÛÎó¤ò¼èÆÀ
        var responseArr = JSON.parse(data.response);

        // ¤½¤³¤«¤é resId ¤òºï½ü
        responseArr = bbs.deleteArrayElement(responseArr, resId);

        // topic ¤Î response ÇÛÎó¤ò¹¹¿·(resId ¤È¤Î´ØÏ¢¤ò²ò½ü)
        je.PUT(bbs.docType,
                       topicId,
                       {response: JSON.stringify(responseArr)},
                       function() {}
        );

        // resId ¤Î doc ¤òºï½ü
        je.DELETE(bbs.docType, resId, function() {});

        // dom ¤òºï½ü
        $('#' + resId).remove();
      };
      // °ìÃ¼¤½¤Î topic ¤Î doc ¤ò¼èÆÀ¤·Ä¾¤¹
      je.GET(bbs.docType, topicId, callback);
    });
  },

  /**
   * »ØÄê¤·¤¿ id ¤ò¸µ¤Ë, html ¤«¤é¥Æ¥ó¥×¥ì¡¼¥È¤ò¥¤¥Ù¥ó¥È¤´¤È¥³¥Ô¡¼¤¹¤ë
   * ¥³¥Ô¡¼¤·¤¿¥Æ¥ó¥×¥ì¡¼¥È¤«¤é¤Ï id ¤ò¾Ãµî¤·,
   * ¥³¥Ô¡¼¸µ¤Î html ¤«¤é¤Ï¥Æ¥ó¥×¥ì¡¼¥È¤òºï½ü¤¹¤ë.
   * @param {string} id ¥³¥Ô¡¼¤·¤¿¤¤¥Æ¥ó¥×¥ì¡¼¥È¤Î id. ex '#template'.
   * @param {boolean} del ¥³¥Ô¡¼¤·¤¿¥Æ¥ó¥×¥ì¡¼¥È¤ò¾Ã¤¹¤«, false ¤Ê¤é¾Ã¤µ¤º hide().
   * @return {object} ¥³¥Ô¡¼ÍÑ¤Î id ¤ò¾Ãµî¤·¤¿ jQuery ¥ª¥Ö¥¸¥§¥¯¥È.
   */
  clone_template: function(id, del) {
    var _$tmp = $(id);
    var $template = _$tmp.clone(true).removeAttr('id');
    del ? _$tmp.remove() : _$tmp.hide();
    return $template;
  },

  /**
   * topic ¤Î¥¿¥¤¥È¥ë¡¢ËÜÊ¸¡¢ÊÖ¿®¤ÎÇÛÎó¤ò¼õ¤±¼è¤ê¡¢¥Ý¥¹¥È¤¹¤ë¡£
   * ¥ì¥¹¥Ý¥ó¥¹¤«¤é topic ¤Ë³ä¤êÅö¤Æ¤é¤ì¤¿ docId ¤ò¼èÆÀ¤·¡¢
   * getTopic ¤ËÅê¤²¤ë¡£
   * @param {string} titleData topic ¤Î¥¿¥¤¥È¥ë.
   * @param {string} detailData topic ¤ÎËÜÊ¸.
   * @param {string} responseData topic ¤ËÂÐ¤¹¤ë response ¤ÎÇÛÎó.
   */
  postTopic: function(titleData, detailData, responseData) {
    var data = {
      title: titleData,
      detail: detailData,
      response: responseData
    };
    // POST ¤Ç¿¶¤é¤ì¤¿ docId ¤ò getTopic ¤ËÅÏ¤¹¡£
    var callback = function(data) {
      bbs.getTopic(data._docId);
    };
    je.POST(bbs.docType, data, callback);
  },

  /**
   * _docId ¤ò¼õ¤±¼è¤Ã¤¿¤é¡¢¤½¤ì¤ò¸µ¤Ë¥É¥­¥å¥á¥ó¥È¤ò¼èÆÀ¤¹¤ë¡£
   * °ú¿ô¤¬¤Ê¤«¤Ã¤¿¤é¡¢ docType Á´Éô¤ò¼õ¤±¼è¤ë¡£
   * ¼õ¤±¼è¤Ã¤¿¥É¥­¥å¥á¥ó¥È¤Ï¡¢ buildTopic ¤Ç jquery ¥ª¥Ö¥¸¥§¥¯¥È¤Ë¤·
   * Ìá¤Ã¤¿¥É¥­¥å¥á¥ó¥È¤ò displayTopic ¤ËÅÏ¤¹¡£
   * @param {string} _docId docId(Ìµ¤¤¾ì¹ç¤â¤¢¤ë).
   */
  getTopic: function(_docId) {
    var callback = null;
    var $doc = null;
    if (_docId) {
      // docId ¤¬Í­¤ë¾ì¹ç
      callback = function(res) {
        $doc = bbs.buildTopic(res);
        bbs.displayTopic($doc);
      };
      je.GET(bbs.docType, _docId, callback);
    } else {
      // docId ¤¬Ìµ¤¤¾ì¹ç
      callback = function(res) {
        for (var i in res) {
          $doc = bbs.buildTopic(res[i]);
          bbs.displayTopic($doc);
        }
      };
      je.GET(bbs.docType, callback);
    }
  },

  /**
   * doc ¤ò¼õ¤±¼è¤ê Topic ¤òÁÈ¤ßÎ©¤Æ¤ë¡£
   * ÁÈ¤ßÎ©¤Æ¤¿ jquery ¥ª¥Ö¥¸¥§¥¯¥È¤òÊÖ¤¹¡£
   * @param {object} doc dom ¤òÀ¸À®¤·¤¿¤¤ÂÐ¾Ý¤Î doc.
   * @return {object} ÁÈ¤ßÎ©¤Æ¤¿ jquery ¥ª¥Ö¥¸¥§¥¯¥È.
   */
  buildTopic: function(doc) {
    //¼õ¤±¼è¤Ã¤¿doc¤ò¸µ¤ËTopic¤òÁÈ¤ßÎ©¤ÆÉ½¼¨¤¹¤ë¡£
    //Topic¤Î¥Æ¥ó¥×¥ì¡¼¥È¤ò¥¤¥Ù¥ó¥È¤È°ì½ï¤Ë¥³¥Ô¡¼
    var $tmp = bbs.$topictmp.clone(true);

    //doc¤Î¥Ç¡¼¥¿¤òÎ®¤·¹þ¤à
    $tmp.attr('id', doc._docId);
    $('.title', $tmp).text(doc.title);
    $('._createdAt', $tmp).text(doc._createdAt);
    $('._createdBy', $tmp).text(doc._createdBy);

    //detail¤ÎÃæ¤Ë¡¢doc.detail¤òÎ®¤·¹þ¤à¡£
    var $p = bbs.multiLineTextToDom(doc.detail);
    $('p.detail', $tmp).append($p);

    //doc.response¤ËÆþ¤Ã¤Æ¤ëdocId¤ÎÇÛÎó¤ò¼èÆÀ¡£
    var resArray = JSON.parse(doc.response);

    if (resArray) {//resArray¤¬Ãæ¿È¤ò»ý¤Ã¤Æ¤¤¤¿¤é
      for (var j = 0; j < resArray.length; j++) {
        je.GET('res', resArray[j], function(res) {
          var resObj = bbs.restmpObj(res);
          $('div.topicDetail > p.detail', $tmp).append(resObj);
        });
      }
    }
    return $tmp;
  },


  /**
   * Topic ¤Î jquery ¥ª¥Ö¥¸¥§¥¯¥È¤ò¼õ¤±¼è¤ê¡¢
   * µ­»ö¤ÎºÇ¸å¤ËÉ½¼¨¤¹¤ë¡£
   * @param {object} É½¼¨¤·¤¿¤¤ Topic ¤Î jquery ¥ª¥Ö¥¸¥§¥¯¥È.
   */
  displayTopic: function($doc) {
    $doc.insertAfter('.topic:last');
  },


  /**
   * resId ¤ò¼õ¤±¼è¤ê¡¢¤½¤ÎÃÍ¤òºï½ü¤·¤¿ array ¤òÊÖ¤¹¡£
   * @param {object} arr resId ¤ÎÇÛÎó.
   * @param {string} elem ¾Ã¤·¤¿¤¤ resId.
   * @return {object} ºï½ü½èÍý¤·¤¿ÇÛÎó.
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
   * response ¤Î doc ¤ò¼õ¤±¼è¤ê¡¢¹½ÃÛ¤·¤¿¥Æ¥ó¥×¥ì¡¼¥È¤òÊÖ¤¹¡£
   * @param {string} responseDoc ¼õ¤±¼è¤Ã¤¿ doc.
   * @return {object} ¹½ÃÛ¤·¤¿ jquery ¥ª¥Ö¥¸¥§¥¯¥È.
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
   * ¼õ¤±¼è¤Ã¤¿¥Þ¥ë¥Á¥é¥¤¥ó¥Æ¥­¥¹¥È¤ò
   * <p><span>text</span><br><span>text</span></p>
   * ¤Î·Á¤Ë¥Þ¡¼¥¯¥¢¥Ã¥×¤·¤¿ jquery ¥ª¥Ö¥¸¥§¥¯¥È¤òÊÖ¤¹¡£
   * @param {string} multiLineText É½¼¨¤¹¤ëÊ£¿ô¹Ô¥Æ¥­¥¹¥È.
   * @return {object} ¥Þ¡¼¥¯¥¢¥Ã¥×¤·¤¿ jquery ¥ª¥Ö¥¸¥§¥¯¥È.
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

  /**
   * ¿·¤·¤¤ response ¤ò topic ¤ËÉ³¤Å¤±¤ë¡£
   * docId ¤Ë³ºÅö¤¹¤ë doc ¤ò¼èÆÀ¤·¡¢
   * response ÇÛÎó¤ÎÃæ¤Ë resId ¤ÎÃÍ¤ò²Ã¤¨¤ë¡£
   * ¹¹¿·¤·¤¿ response ¤ò PUT ¤Ç¥Ñ¡¼¥·¥ã¥ë¥¢¥Ã¥×¥Ç¡¼¥È¤¹¤ë¡£
   * @param {string} docId ¹¹¿·ÂÐ¾Ý¤Î doc ¤Î id.
   * @param {string} resId É³¤Å¤±¤ë response ¤Î id.
   */
  addResIdToDoc: function(docId, resId) {
    var callback = function(data) {
      // response ÇÛÎó¤Ë resId ¤ò²Ã¤¨¤ë¡£
      var responseArray = JSON.parse(data.response);
      responseArray.push(resId);
      // ¹¹¿·¤·¤¿ response ¤ò doc ¤ËÈ¿±Ç¡£
      je.PUT(bbs.docType, docId, {response: JSON.stringify(responseArray)}, function(data) { });
    };
    // ³ºÅö¤¹¤ë doc ¤ò¼èÆÀ¡£
    je.GET(bbs.docType, docId, callback);
  },

  /**
   * ¥ì¥¹Åê¹Æ½ªÎ»¸å¤Ë¡¢ÆþÎÏÍó¤ò¾Ã¤·
   * ¥Ü¥¿¥ó¤ò¸µ¤ËÌá¤¹¡£
   * ¥ì¥¹¤Î¥Ç¡¼¥¿¤ò response ¤ÎºÇ¸åÈø¤Ë
   * ²Ã¤¨¤ÆÉ½¼¨¤¹¤ë
   * @param {string} docId ÂÐ¾Ý¤Î docId.
   * @param {string} resId ÄÉ²Ã¤µ¤ì¤¿¥ì¥¹¤Î id.
   */
  showResponse: function(docId, res) {
    var $topic = $('#' + docId);

    $topic.find('.input-res-field').remove();
    $topic.find('.input-res-button input').toggle();

    var resObj = bbs.restmpObj(res);
    $topic.find('p.detail').append(resObj);
  }
};

$(function() {
  // jQuery UI ¤Î Accordion
  $('#accordion').accordion({
    header: 'h3',
    //active : 0,
    active: false,
    collapsible: true,
    autoHeight: false
  });

  // GUI ¤Î½é´ü²½
  bbs.init();

  // ºÇ½é¤Î¥É¥­¥å¥á¥ó¥È¼èÆÀ
  bbs.getTopic();
});


