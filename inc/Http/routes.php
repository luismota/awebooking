<?php

use AweBooking\Http\Controllers\Cart_Ajax_Controller;

$route->post( '/cart/add', Cart_Ajax_Controller::class . '@add' );
