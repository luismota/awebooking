<?php

$packages = [
	// __DIR__ . '/awethemes/skeleton/skeleton.php',
	// __DIR__ . '/awethemes/skeleton/vendor/autoload.php',
	// __DIR__ . '/awethemes/container/vendor/autoload.php',
	// __DIR__ . '/awethemes/wp-http/vendor/autoload.php',
	// __DIR__ . '/awethemes/wp-object/vendor/autoload.php',
	// __DIR__ . '/awethemes/wp-session/vendor/autoload.php',
];

foreach ( $packages as $path ) {
	require $path;
}

use AweBooking\Support\Carbonate;
use AweBooking\Calendar\Resource\Resource;
use AweBooking\Calendar\Provider\Pricing_Provider;

add_action( 'awebooking/booted', function () {

	// include __DIR__ . '/inc/Reservation/Reservation.php';
	// exit;

});
