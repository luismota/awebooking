<?php

use AweBooking\Http\Router\Binding_Resolver;

$route->get( '/', function () {
	$binding = new Binding_Resolver( awebooking() );

	$binding->bind( 'room_type', function() {

	} );

	dd($binding->resolve_bindings([ 'room_type' => 1 ]));

	return '~.~';
});
