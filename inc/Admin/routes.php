<?php

use AweBooking\Http\Router\Binding_Resolver;

$route->get( '/save-setting', 'AweBooking\Admin\Controllers\Setting_Controller@save' );
$route->get( '/check-availability', 'AweBooking\Admin\Controllers\Check_Availability_Controller@check' );

// $route->get( '/room/{room}', function( $room ) {
// 	dd($room);
// });
