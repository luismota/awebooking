<?php

use AweBooking\Factory;
use AweBooking\Reservation\Asking;
use AweBooking\Reservation\Request;
use AweBooking\Reservation\Request\Stay;
use AweBooking\Reservation\Request\Party;

$party = new Party( 3, 1 );
$stay = new Stay( '2017-12-10', '2017-12-15' );

$ask = new Asking( Factory::get_room_type( 83 ) );

$request = new Request( $party, $stay );

dd( $request->ask( $ask )->get_pricing() );
