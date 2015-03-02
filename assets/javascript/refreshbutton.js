var request = require( 'request' ),
	_ = require( 'underscore' ),
	gui = require( 'nw.gui' ),
	q = require( 'q' );

var original_refresh_text;

var openLink = function( link ) {
	return function() {
		gui.Shell.openExternal( link );
	}
}

var refresh = function() {
	content_area = document.getElementById( 'content_area' );
	return function() {
		return q.Promise( function( resolve, reject ) {
			request.get( { url: 'http://jira-notifications.herokuapp.com/notifications' }, function( e, r, body ) {
				if( e ) reject( e );

				var body_json = JSON.parse( body );
				_.each( body_json, function( item ) {
					var div = document.createElement( 'div' );
					div.className = 'item link';

					var link = 'https://markone.atlassian.net/browse/' + item.body.issue.key;
					div.onclick = openLink( link );

					div.innerHTML = item.body.issue.fields.summary;

					var parent_div = document.createElement( 'div' );
					parent_div.className = 'item_parent';
					parent_div.appendChild( div );

					content_area.appendChild( parent_div );
				} );

				setupDrag();
				resolve();
			} );
		} );
	};
};

var startRefresh = function( button ) {
    return function() {
        button.innerHTML = 'Refreshing Now';

        refresh()()
        	.then( finishRefresh( button ) );
    }
}

var finishRefresh = function( button ) {
    return function() {
        button.innerHTML = original_refresh_text;
    }
}

var initRefreshButton = function() {
    var refresh_button = document.getElementById( 'refresh_button' );
    original_refresh_text = refresh_button.innerHTML;
    refresh_button.onclick = startRefresh( refresh_button );
}