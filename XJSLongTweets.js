function XJSLongTweets( format ) {
	"use strict";
	
	var buttonIdentifier = ".tweet-button",
	defaultFormat = " [$i/$m]",
	formatStatus = function ( format, status, index, maxIndex ) {
		return status + format.replace( /\$i/g, index ).replace( /\$m/g, maxIndex );
	},
	isSet = function ( o ) {
		return typeof o !== "undefined";
	},
	textareaIdentifier = "textarea",
	toString = function ( o ) {
		return o + "";
	},
	waitForReady = function ( isReady, onReady ) {
		if ( isReady( ) ) {
			onReady( );
		} else {
			window.setTimeout( function( ) {
				waitForReady( isReady, onReady );
			}, 1 );
		}
	},
	window = this;
	
	XJSLongTweets = function ( format ) {
		
		format = isSet( format ) ? toString( format ) : defaultFormat;
		
		var button,
		prepareStatus = function ( status ) {
			return $.trim( status.replace( /\s+/gi, " " ) );
		},
		textarea,
		window = this,
		$ = window.$;
		
		waitForReady(
			// isReady
			function ( ) {
				return ( button = $( buttonIdentifier ) ).length && ( textarea = $( textareaIdentifier ) ).length;// si length vaut 2..+++++
			},
			// onReady
			function ( ) {
				
				var fakeButton = button.clone( ),
				postStatus = function ( status ) {
					textarea.val( status );
					button.trigger( "click" );
				},
				postStatusArray = function ( statusArray ) {
					var index = 0,
					maxIndex = statusArray.length;
					textarea.val( "" );
					function f ( ) {
						var nextStatus = statusArray.shift( );
						if ( isSet( nextStatus ) ) {
							waitForReady(
								// isReady
								function ( ) {
									return textarea.val( ) === "";
								},
								// onReady
								function ( ) {
									postStatus( formatStatus( format, nextStatus, ++index, maxIndex ) );
									f( );
								}
							);
						}
					}
					f( );
				},
				splitStatus = function ( status ) {
					var index,
					nextIndex,
					statusArray = [ ],
					actualMaxLength = twitterMaxLength - format.length;
					while ( status.length > twitterMaxLength ) {
						nextIndex = -1;
						do {
							index = nextIndex;
							nextIndex = status.indexOf( " ", index + 1 );
						} while ( nextIndex <= actualMaxLength && nextIndex !== -1 );
						if ( index === -1 ) {
							index = actualMaxLength;
						}
						statusArray.push( $.trim( status.substring( 0, index ) ) );
						status = $.trim( status.substring( index ) );
					}
					statusArray.push( status );
					return statusArray;
				},
				twitterMaxLength = $( ".tweet-counter" ).val( );
				
				button.hide( );
				button.before( fakeButton );
				fakeButton.click( function ( ) {
					fakeButton.addClass( "disabled" );
					var status = prepareStatus( textarea.val( ) );
					if ( status.length <= twitterMaxLength ) {
						postStatus( status );
					} else {
						postStatusArray( splitStatus( status ) );
						
					}
				} );
				textarea.bind( "keydown keyup", function ( ) {
					if ( textarea.val( ) === "" ) {
						fakeButton.addClass( "disabled" );
					} else {
						fakeButton.removeClass( "disabled" );
					}
				} );
				
			}
		);
	};
	
	return XJSLongTweets( format );
	
}

XJSLongTweets( );