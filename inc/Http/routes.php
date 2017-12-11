<?php

use AweBooking\Http\Controllers\Test_Controller;

$route->get( '/step1', Test_Controller::class . '@step1' );
$route->get( '/step2', Test_Controller::class . '@step2' );
