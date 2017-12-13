<?php

use AweBooking\Http\Controllers\Cart_Controller;

$route->get( '/cart', Cart_Controller::class . '@add' );
