ok($, 'ok $');
ok(bbs, 'ok bbs1');
is('test', 'test', 'is');
isnt('test', 'dev', 'isnt');
like('test', new RegExp('es'), 'like');
is(tap$('test').innerHTML, 'DATA', 'getElementById');
