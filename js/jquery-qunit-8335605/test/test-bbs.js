test('test of test', function(){
	ok(bbs);
//	ok(bbs.init);
//	ok(bbs.buildTopic);
});

// test('clone base object',function(){
// 	equal(bbs.baseObj,null);
// 	bbs.init();
// 	notEqual(bbs.baseObj,null);
// });

// test('build topic from json',function(){

// 	bbs.buildTopic(json);
// });



test('multiLineText2Html', function(){
	ok(bbs.	multiLineText2Html, 'exist');

	var multiLineText = 'this\nis\nmulti\nline\ntext';
	var expected = $('<p>').append($('<span>this</span><br><span>is</span><br><span>multi</span><br><span>line</span><br><span>text</span><br>'));
	var converted = bbs.multiLineText2Html(multiLineText);

 	equal(converted, expected, 'converted to html');

	log(converted.contents());
	log(expected);
});
