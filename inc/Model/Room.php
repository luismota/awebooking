<?php
namespace AweBooking\Model;

use AweBooking\Factory;
use AweBooking\Constants;

class Room extends WP_Object {
	/**
	 * Name of object type.
	 *
	 * @var string
	 */
	protected $object_type = 'awebooking_rooms';

	/**
	 * WordPress type for object.
	 *
	 * @var string
	 */
	protected $wp_type = 'awebooking_rooms';

	/**
	 * This object does not support metadata.
	 *
	 * @var false
	 */
	protected $meta_type = false;

	/**
	 * The attributes for this object.
	 *
	 * Name value pairs (name + default value).
	 *
	 * @var array
	 */
	protected $attributes = [
		'name' => '',
		'room_type_id' => 0,
	];

	/**
	 * Setup the object attributes.
	 *
	 * @return void
	 */
	protected function setup() {
		$this['name'] = $this->instance['name'];
		$this['room_type_id'] = absint( $this->instance['room_type'] );
	}

	/**
	 * Get list room by room-type ID(s).
	 *
	 * @param  int|array $ids The room-type ID(s).
	 * @return array|null
	 */
	public static function get_by_room_type( $ids ) {
		global $wpdb;

		$ids = is_int( $ids ) ? [ $ids ] : $ids;
		$ids = apply_filters( 'awebooking/rooms/get_by_room_type', $ids );

		if ( is_array( $ids ) ) {
			$ids = implode( "', '", array_map( 'esc_sql', $ids ) );
			$query = "SELECT * FROM `{$wpdb->prefix}awebooking_rooms` WHERE `room_type` IN ('{$ids}')";
		}

		// @codingStandardsIgnoreLine
		return $wpdb->get_results( $query, ARRAY_A );
	}

	/**
	 * Get room name.
	 *
	 * @return string
	 */
	public function get_name() {
		return apply_filters( $this->prefix( 'get_name' ), $this['name'], $this );
	}

	/**
	 * Get room type instance.
	 *
	 * @return Room_Type
	 */
	public function get_room_type() {
		return apply_filters( $this->prefix( 'get_room_type' ), new Room_Type( $this['room_type_id'] ), $this );
	}

	/**
	 * Clean object cache after saved.
	 *
	 * @return void
	 */
	protected function clean_cache() {
		wp_cache_delete( $this->get_id(), 'awebooking_cache_room' );
	}

	/**
	 * Run perform insert object into database.
	 *
	 * @return int|void
	 */
	protected function perform_insert() {
		global $wpdb;

		// We need a room-type present.
		if ( ! $this['room_type_id'] ) {
			return;
		}

		$wpdb->insert( $wpdb->prefix . 'awebooking_rooms',
			[ 'name' => $this['name'], 'room_type' => $this['room_type_id'] ],
			[ '%s', '%d' ]
		);

		return absint( $wpdb->insert_id );
	}

	/**
	 * Run perform update object.
	 *
	 * @param  array $dirty The attributes has been modified.
	 * @return bool|void
	 */
	protected function perform_update( array $dirty ) {
		global $wpdb;

		// We need a room-type present for the update.
		if ( ! $this['room_type_id'] ) {
			return;
		}

		$updated = $wpdb->update( $wpdb->prefix . 'awebooking_rooms',
			[ 'name' => $this['name'], 'room_type' => $this['room_type_id'] ],
			[ 'id' => $this->get_id() ]
		);

		return false !== $updated;
	}

	/**
	 * Perform delete object.
	 *
	 * @param  bool $force Force delete or not.
	 * @return bool
	 */
	protected function perform_delete( $force ) {
		global $wpdb;

		$deleted = $wpdb->delete( $wpdb->prefix . 'awebooking_rooms', [ 'id' => $this->get_id() ], '%d' );

		return false !== $deleted;
	}

	/**
	 * Setup WP Core Object based on ID and object-type.
	 *
	 * @return void
	 */
	protected function setup_instance() {
		global $wpdb;

		// Get the room in database.
		$the_room = $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM `{$wpdb->prefix}awebooking_rooms` WHERE `id` = '%d' LIMIT 1", $this->get_id() ),
			ARRAY_A
		);

		// Do nothing if not found the room.
		if ( is_null( $the_room ) ) {
			return;
		}

		// Santize before cache this room.
		$the_room['id'] = (int) $the_room['id'];
		$the_room['room_type'] = (int) $the_room['room_type'];

		$this->set_instance( $the_room );
	}
}
