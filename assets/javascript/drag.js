var request = require( 'request' ),
	_ = require( 'underscore' ),
	gui = require( 'nw.gui' ),
	q = require( 'q' );

var color_threshhold = 20,
	item_offset;

var calculateOffset = function( item, ui ) {
	return item_offset - $( item ).position().left;
}

var isLeft = function( item, ui ) {
	return calculateOffset( item, ui ) < -color_threshhold
}

var isRight = function( item, ui ) {
	return calculateOffset( item, ui ) > color_threshhold
}

var onItemDrag = function( item ) {
	return function( event, ui ) {
		if( isLeft( item, ui ) ) {
			$( item ).parent().css( 'background-color', 'green' );
		} else if( isRight( item, ui ) ) {
			$( item ).parent().css( 'background-color', 'red' );
		} else {
			$( item ).parent().removeAttr( 'background-color' );
		}
	};
};

var onItemStop = function( item ) {
	return function( event, ui ) {
		$( item ).animate( { 'left': item_offset + 'px' }, {
			duration: 400,
			done: function() {
				$( item ).css( 'left', item_offset + 'px' );
			}
		} );
	};
};

var onItemStart = function( item ) {
	return function( event, ui ) {
		$( item ).stop();
		$( item ).css( 'left', item_offset );
	}
}

var setupDrag = function() {
	_.each( $( '.item' ), function( item ) {
		item_offset = $( item ).position().left;

		$( item ).draggable( {
			axis: 'x',
			start: onItemStart( item ),
			drag: onItemDrag( item ),
			stop: onItemStop( item )
		} );
	} );
};

$( document ).ready( function() {
	console.log( 'ready' );
	setupDrag();
} );