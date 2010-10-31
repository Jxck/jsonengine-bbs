load('dist/env.rhino.js');
load('../js/jquery-1.4.2.min.js');

window.location = '../index.html';

load('../js/je.js');
load('../js/jquery-qunit-8335605/qunit/qunit.js');
load('../js/jquery-qunit-8335605/test/test-je.js');
load('./test/my.js');

jQuery.ready();

