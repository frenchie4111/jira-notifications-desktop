var fs = require( 'fs' ),
    gui = require( 'nw.gui' );

var win = require('nw.gui').Window.get();
win.setResizable( true );

window.onload = function() {
    initMenuBar();
    initRefreshButton();
}
