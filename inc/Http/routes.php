<?php

use AweBooking\Http\Controllers\Cart_Ajax_Controller;

$route->post( '/cart/add_room', Cart_Ajax_Controller::class . '@add_room' );
$route->post( '/cart/remove_room', Cart_Ajax_Controller::class . '@remove_room' );
$route->post( '/cart/edit_room', Cart_Ajax_Controller::class . '@edit_room' );
$route->post( '/cart/save_room', Cart_Ajax_Controller::class . '@save_room' );
$route->post( '/cart/add_service', Cart_Ajax_Controller::class . '@add_service' );
