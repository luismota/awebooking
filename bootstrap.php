<?php
/**
 * AweBooking bootstrap file.
 *
 * @package AweBooking
 */

if ( ! defined( 'WP_DEBUG' ) || WP_DEBUG ) {
	require trailingslashit( __DIR__ ) . '/development.php';
}

/**
 * We need autoload via Composer to make everything works.
 */
require trailingslashit( __DIR__ ) . 'vendor/autoload.php';

// Try locate the Skeleton.
if ( ! defined( 'AWETHEMES_SKELETON_LOADED' ) ) {
	if ( file_exists( __DIR__ . '/vendor/awethemes/skeleton/skeleton.php' ) ) {
		require_once trailingslashit( __DIR__ ) . '/vendor/awethemes/skeleton/skeleton.php';
	} else {
		wp_die( '<h1>Something went wrong!</h1> <p>AweBooking can\'t works without the Skeleton. Please double-check that everything is setup correctly!</p>' );
	}
}

require_once trailingslashit( __DIR__ ) . 'inc/functions.php';
require_once trailingslashit( __DIR__ ) . 'inc/template-functions.php';

// Make AweBooking\AweBooking as AweBooking alias.
class_alias( 'AweBooking\\AweBooking', 'AweBooking' );
