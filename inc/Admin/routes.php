<?php

use Awethemes\Http\Request;
use AweBooking\Model\Room;
use AweBooking\Http\Router\Binding_Resolver;

$route->get( '/save-setting', 'AweBooking\Admin\Controllers\Setting_Controller@save' );
$route->get( '/check-availability', 'AweBooking\Admin\Controllers\Check_Availability_Controller@check' );

$route->get( '/room/{room}', function( Request $request, Room $room ) {
	$room['name'] = 'ANN';
	$room->save();

	return $room;
});
