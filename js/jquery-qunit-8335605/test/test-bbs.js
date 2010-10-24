test('test of test', function() {
	ok(bbs);
 	ok(bbs.multiLineTextToDom);
// 	ok(bbs.clone_input_restmp);
});


test('multiLineTextToDom', function(){
 	var multiLineText = 'this\nis\nmulti\nline\ntext';
	var $p = bbs.multiLineTextToDom(multiLineText);

	var $expect = $('<p>' +
				   '<span>this</span><br>' +
				   '<span>is</span><br>' +
				   '<span>multi</span><br>' +
				   '<span>line</span><br>' +
				   '<span>text</span><br>' +
				   '</p>');

	same($p.jquery, $().jquery, 'return jquery object');
 	same($p.html(), $expect.html(), 'build success');
});


test('deleteArrayElement', function(){
	var arr = ['abc','def','ghi'];
	var expect = ['abc','ghi'];
	same(bbs.deleteArrayElement(arr, 'def'), expect, 'delete element');

	arr = ['def'];
	expect = [];
	same(bbs.deleteArrayElement(arr, 'def'), expect, 'became empty');

	arr = [];
	expect = [];
	same(bbs.deleteArrayElement(arr, 'def'), expect, 'empty is empty');

});


test('restmpObj', function(){
// 	var res = {
// 		"resDetail":"’¾Ü’ºÙ’¾Ü’ºÙ",
// 		"to":"OTeTBos6jg7oH9jlD7ZElyoTrr5URfvO",
// 		"_docId":"Zex8V1fenIasFsCWivttvXH5Ppq4WjK6",
// 		"_updatedAt":1287807709880,
// 		"_createdAt":1287807709880,
// 		"_updatedBy":null,
// 		"_createdBy":null
// 	};

// 	var expect = 


// 	same(bbs.deleteArrayElement(arr, 'def'), expect, 'delete element');

// 	arr = ['def'];
// 	expect = [];
// 	same(bbs.deleteArrayElement(arr, 'def'), expect, 'became empty');

// 	arr = [];
// 	expect = [];
// 	same(bbs.deleteArrayElement(arr, 'def'), expect, 'empty is empty');

});


