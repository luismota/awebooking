<?php

use AweBooking\Support\Utils;
use AweBooking\Support\Formatting;
use AweBooking\Support\Debug\Dumper;

if ( ! function_exists( 'dd' ) ) {
	/**
	 * Dump the passed variables and end the script.
	 *
	 * @param  mixed ...$args The dump arguments.
	 * @return void
	 */
	function dd( ...$args ) {
		foreach ( $args as $x ) {
			(new Dumper)->dump( $x );
		}

		die( 1 );
	}
}

if ( ! function_exists( 'awebooking_random_string' ) ) {
	/**
	 * Generate a random string.
	 *
	 * @param  integer $length Random string length.
	 * @return string
	 */
	function awebooking_random_string( $length = 16 ) {
		return Utils::random_string( $length );
	}
}

/**
 * Make a list sort by priority.
 *
 * @param  array $values An array values.
 * @return Skeleton\Support\Priority_List
 */
function awebooking_priority_list( array $values ) {
	$stack = new Skeleton\Support\Priority_List;

	foreach ( $values as $key => $value ) {
		$priority = is_object( $value ) ? $value->priority : $value['priority'];
		$stack->insert( $key, $value, $priority );
	}

	return $stack;
}

if ( ! function_exists( 'wp_data_callback' ) ) :
	/**
	 * Get Wordpress specific data from the DB and return in a usable array.
	 *
	 * @param  string $type Data type.
	 * @param  mixed  $args Optional, data query args or something else.
	 * @return array
	 */
	function wp_data_callback( $type, $args = array() ) {
		return function() use ( $type, $args ) {
			return Skeleton\Support\WP_Data::get( $type, $args );
		};
	}
endif;


/**
 * Run a MySQL transaction query, if supported.
 *
 * @param  string $type Transaction type, start (default), commit, rollback.
 * @return void
 */
function awebooking_wpdb_transaction( $type = 'start' ) {
	global $wpdb;

	$wpdb->hide_errors();

	if ( ! defined( 'AWEBOOKING_USE_TRANSACTIONS' ) ) {
		define( 'AWEBOOKING_USE_TRANSACTIONS', true );
	}

	if ( AWEBOOKING_USE_TRANSACTIONS ) {
		switch ( $type ) {
			case 'commit':
				$wpdb->query( 'COMMIT' );
				break;
			case 'rollback':
				$wpdb->query( 'ROLLBACK' );
				break;
			default:
				$wpdb->query( 'START TRANSACTION' );
				break;
		}
	}
}

/**
 * Set a cookie - Wrapper for setcookie using WP constants.
 *
 * @param  string  $name   Name of the cookie being set.
 * @param  string  $value  Value of the cookie.
 * @param  integer $expire Expiry of the cookie.
 * @param  string  $secure Whether the cookie should be served only over https.
 */
function awebooking_setcookie( $name, $value, $expire = 0, $secure = null ) {
	$secure = is_null( $secure ) ? is_ssl() : $secure;

	if ( ! headers_sent() ) {
		setcookie( $name, $value, $expire, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, $secure );
	} elseif ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		headers_sent( $file, $line );
		trigger_error( "{$name} cookie cannot be set - headers already sent by {$file} on line {$line}", E_USER_NOTICE );
	}
}

/**
 * Sanitize price number.
 *
 * @param  Price|numeric $number Raw numeric.
 * @return float
 */
function awebooking_sanitize_price( $number ) {
	if ( $number instanceof Price ) {
		$number = $number->get_amount();
	}

	return Formatting::format_decimal( $number, true );
}

/**
 * Sanitize period.
 *
 * @param  array|mixed $value  Raw date period.
 * @param  bool        $strict Strict validation.
 * @return array
 */
function awebooking_sanitize_period( $value, $strict = false ) {
	$value = (array) $value;
	if ( empty( $value[0] ) || empty( $value[1] ) ) {
		return [];
	}

	try {
		$period = new Period( $value[0], $value[1], $strict );
	} catch ( Exception $e ) {
		return [];
	}

	if ( $period->nights() < 1 ) {
		return [];
	}

	return [
		$period->get_start_date()->toDateString(),
		$period->get_end_date()->toDateString(),
	];
}

/**
 * Create an array instance.
 *
 * @param  array           $ids   An array IDs.
 * @param  string|callable $class Class instance or a callable.
 * @return array
 */
function awebooking_map_instance( array $ids, $class ) {
	return array_filter(
		array_map( function( $id ) use ( $class ) {
			if ( is_string( $class ) && class_exists( $class ) ) {
				return new $class( $id );
			} elseif ( is_callable( $class ) ) {
				return call_user_func( $class, $id );
			}
		}, $ids )
	);
}
