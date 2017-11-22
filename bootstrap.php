<?php
/**
 * The AweBooking Bootstrap.
 *
 * @package AweBooking
 */

/**
 * We need autoload via Composer to make everything works.
 */
require trailingslashit( __DIR__ ) . 'vendor/autoload.php';

if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
	require trailingslashit( __DIR__ ) . '/development.php';
}

// Try locate the Skeleton.
if ( file_exists( __DIR__ . '/vendor/awethemes/skeleton/skeleton.php' ) ) {
	require_once trailingslashit( __DIR__ ) . '/vendor/awethemes/skeleton/skeleton.php';
} elseif ( ! defined( 'AWETHEMES_SKELETON_LOADED' ) ) {
	wp_die( 'AweBooking can\'t works without the Skeleton. Please double-check that everything is setup correctly!' );
}

require_once trailingslashit( __DIR__ ) . 'inc/functions.php';
require_once trailingslashit( __DIR__ ) . 'inc/template-functions.php';

// Make AweBooking\AweBooking as AweBooking alias.
class_alias( 'AweBooking\\AweBooking', 'AweBooking' );

// Deprecated classes, just make an alias for that.
class_alias( 'AweBooking\\Support\\Service_Provider', 'AweBooking\\Support\\Service_Hooks' );
