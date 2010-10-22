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

