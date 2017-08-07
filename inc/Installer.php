<?php
namespace AweBooking;

class Installer {
	/**
	 * Install the AweBooking.
	 *
	 * @return void
	 */
	public static function install() {
		static::create_tables();

		$current_version = get_option( 'awebooking_version', null );
		$current_db_version = get_option( 'awebooking_db_version', null );

		// No versions? This is a new install :).
		if ( is_null( $current_version ) && is_null( $current_db_version ) && apply_filters( 'awebooking/enable_setup_wizard', true ) ) {
			set_transient( '_awebooking_activation_redirect', 1, 30 );
		}

		delete_option( 'awebooking_version' );
		add_option( 'awebooking_version', AweBooking::VERSION );

		@flush_rewrite_rules();
	}

	/**
	 * Set up the database tables which the plugin needs to function.
	 *
	 * @see https://codex.wordpress.org/Creating_Tables_with_Plugins
	 */
	public static function create_tables() {
		global $wpdb;
		$wpdb->hide_errors();

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( static::get_schema() );
	}

	/**
	 * Get Table schema.
	 *
	 * @return string
	 */
	private static function get_schema() {
		global $wpdb;

		$collate = '';
		if ( $wpdb->has_cap( 'collation' ) ) {
			$collate = $wpdb->get_charset_collate();
		}

		$tables = "
CREATE TABLE `{$wpdb->prefix}awebooking_rooms` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `room_type` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `room_type` (`room_type`)
) $collate;

CREATE TABLE `{$wpdb->prefix}awebooking_booking` (
  `room_id` bigint UNSIGNED NOT NULL DEFAULT 0,
  `year` integer NOT NULL DEFAULT 0,
  `month` integer NOT NULL DEFAULT 0,
  " . static::generate_days_schema() . "
  PRIMARY KEY (`room_id`, `year`, `month`)
) $collate;

CREATE TABLE `{$wpdb->prefix}awebooking_availability` (
  `room_id` bigint UNSIGNED NOT NULL DEFAULT 0,
  `year` integer NOT NULL DEFAULT 0,
  `month` integer NOT NULL DEFAULT 0,
  " . static::generate_days_schema() . "
  PRIMARY KEY (`room_id`, `year`, `month`)
) $collate;

CREATE TABLE `{$wpdb->prefix}awebooking_pricing` (
  `rate_id` bigint UNSIGNED NOT NULL DEFAULT 0,
  `year` integer NOT NULL DEFAULT 0,
  `month` integer NOT NULL DEFAULT 0,
  " . static::generate_days_schema() . "
  PRIMARY KEY (`rate_id`, `year`, `month`)
) $collate;
		";

		return $tables;
	}

	/**
	 * Generate days schema.
	 *
	 * @return string
	 */
	private static function generate_days_schema() {
		$command = '';

		for ( $i = 1; $i <= 31; $i++ ) {
			$command .= '`d' . $i . '` integer NOT NULL DEFAULT 0, ';
		}

		return $command;
	}
}
