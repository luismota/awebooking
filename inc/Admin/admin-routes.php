<?php

use AweBooking\Admin\Controllers\Ajax_Controller;
use AweBooking\Admin\Controllers\Booking_Controller;
use AweBooking\Admin\Controllers\Settings_Controller;

$route->post( '/settings', Settings_Controller::class . '@store' );

// Booking routes.
$route->post( '/booking/{booking:\d+}/add_note', Booking_Controller::class . '@add_note' );
$route->post( '/booking/{booking:\d+}/delete_note', Booking_Controller::class . '@delete_note' );

// Misc ajax routes.
$route->get( '/ajax/search_customers', Ajax_Controller::class . '@search_customers' );
