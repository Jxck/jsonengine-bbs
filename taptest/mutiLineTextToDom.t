use JSTAPd::Suite;
sub tests { 6 }

sub include {
    (
        '/js/db.js',
        '/js/je.js',
        '/js/bbs.js',
    );
}

sub include_ex {
    (
#        'https://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js',
		'/js/jquery-1.4.2.min.js',
		'/js/jquery-ui-1.8.2.custom.min.js',
		\'jquery-jstapd.js',
    );
}
