ok($, 'ok $');
ok(bbs, 'ok bbs1');
var multiLineText = 'this\nis\nmulti\nline\ntext';
var $p = bbs.multiLineTextToDom(multiLineText);

var $expect = $('<p>' +
				'<span>this</span><br>' +
				'<span>is</span><br>' +
				'<span>multi</span><br>' +
				'<span>line</span><br>' +
				'<span>text</span><br>' +
				'</p>');

is($p.jquery, $().jquery, 'return jquery object');
is($p.html(), $expect.html(), 'build success');

var arr = ['abc','def'];
var expect = ['abc','def'];

for(var i=0; i<arr.length; i++){
	is(arr[i], expect[i], 'test');
}
//is(bbs.deleteArrayElement(arr, 'def'), expect, 'delete element');

//tap_dump();