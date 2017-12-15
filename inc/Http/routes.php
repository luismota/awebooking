<?php

use AweBooking\Http\Controllers\Cart_Ajax_Controller;

$route->post( '/cart/add_room', Cart_Ajax_Controller::class . '@add_room' );
$route->post( '/cart/add_service', Cart_Ajax_Controller::class . '@add_service' );
