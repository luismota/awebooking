<?php
namespace AweBooking\Model;

use AweBooking\Model\Room;
use AweBooking\Model\Room_Type;
use AweBooking\Model\Booking\Booking;
use AweBooking\Model\Booking\Items\Line_Item;
use AweBooking\Model\Booking\Items\Service_Item;
use AweBooking\Model\Booking\Items\Booking_Item;
use AweBooking\Model\WP_Object;

class Factory {
	/**
	 * Get room unit by ID.
	 *
	 * @param  int $room_unit Room unit ID.
	 * @return AweBooking\Model\Room
	 */
	public static function get_room_unit( $room_unit ) {
		return static::get_object_from_cache( $room_unit, Room::class, Constants::CACHE_ROOM_UNIT );
	}

	/**
	 * Get room type by ID.
	 *
	 * @param  int $room_type Room type ID or instance.
	 * @return AweBooking\Model\Room_Type
	 */
	public static function get_room_type( $room_type ) {
		return static::get_object_from_cache( $room_type, Room_Type::class, Constants::CACHE_ROOM_TYPE );
	}

	/**
	 * Get booking by ID.
	 *
	 * @param  int $booking_id Booking ID.
	 * @return AweBooking\Booking\Booking
	 */
	public static function get_booking( $booking_id ) {
		return static::get_object_from_cache( $booking_id, Booking::class, Constants::CACHE_BOOKING );
	}

	/**
	 * Get booking item instance by ID.
	 *
	 * @param  int $item_id Booking item ID.
	 * @return mixed|false|null
	 */
	public static function get_booking_item( $item_id ) {
		if ( is_numeric( $item_id ) ) {
			global $wpdb;
			$item_data = $wpdb->get_row( $wpdb->prepare( "SELECT `booking_item_type` FROM `{$wpdb->prefix}awebooking_booking_items` WHERE `booking_item_id` = %d LIMIT 1", $item_id ), ARRAY_A );

			$id        = $item_id;
			$item_type = isset( $item_data['booking_item_type'] ) ? $item_data['booking_item_type'] : false;
		} elseif ( $item_id instanceof Booking_Item ) {
			$id        = $item_id->get_id();
			$item_type = $item_id->get_type();
		} elseif ( is_array( $item_id ) && ! empty( $item_id['booking_item_type'] ) ) {
			$id        = $item_id['booking_item_id'];
			$item_type = $item_id['booking_item_type'];
		} else {
			$id        = false;
			$item_type = false;
		}

		// Found invalid ID or type, just return.
		if ( ! $id || ! $item_type ) {
			return;
		}

		// Resolve booking item class by type.
		$classname = static::resolve_booking_item_class( $item_type );
		if ( ! $classname || ! class_exists( $classname ) ) {
			return false;
		}

		try {
			return new $classname( $id );
		} catch ( \Exception $e ) {
			return false;
		}
	}

	/**
	 * Resolve booking item class by type.
	 *
	 * @param  string $type Booking item type.
	 * @return string|null
	 */
	protected static function resolve_booking_item_class( $type ) {
		$maps = apply_filters( 'awebooking/booking_item_class_maps', [
			'line_item'    => Line_Item::class,
			'service_item' => Service_Item::class,
		]);

		if ( array_key_exists( $type, $maps ) ) {
			return $maps[ $type ];
		}
	}

	/**
	 * Create an object, cache it if exists.
	 *
	 * @param  int    $object_id    The object ID.
	 * @param  string $object_class The object class.
	 * @param  string $cache_group  The cache group for the object.
	 * @return mixed
	 */
	protected static function get_object_from_cache( $object_id, $object_class, $cache_group ) {
		if ( is_numeric( $object_id ) && $object_id > 0 ) {
			$object_id = (int) $object_id;
		} elseif ( ! empty( $object_id->ID ) ) {
			$object_id = (int) $object_id->ID;
		} elseif ( ! empty( $object_id->term_id ) ) {
			$object_id = (int) $object_id->term_id;
		} elseif ( $object_id instanceof WP_Object ) {
			$object_id = $object_id->get_id();
		}

		$the_object = wp_cache_get( $object_id, $cache_group );

		if ( false === $the_object ) {
			$the_object = new $object_class( $object_id );

			// If the object not exists, do not cache it.
			// Just return the new instance.
			if ( ! $the_object->exists() ) {
				return $the_object;
			}

			wp_cache_add( $object_id, $the_object, $cache_group );
		}

		return $the_object;
	}
}
