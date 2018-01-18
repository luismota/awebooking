<?php
namespace AweBooking\Reservation;

use AweBooking\Factory;
use AweBooking\Constants;
use AweBooking\Model\Stay;
use AweBooking\Model\Room;
use AweBooking\Model\Rate;
use AweBooking\Model\Party;
use AweBooking\Model\Guest;
use AweBooking\Model\Room_Type;
use AweBooking\Concierge\Pricing\Pricing;
use AweBooking\Concierge\Availability\Checker;
use AweBooking\Reservation\Source\Source;
use AweBooking\Reservation\Searcher\Query;

class Reservation {
	/**
	 * The request source.
	 *
	 * @var \AweBooking\Reservation\Source\Source
	 */
	protected $source;

	/**
	 * The request Stay instance.
	 *
	 * @var \AweBooking\Model\Stay
	 */
	protected $stay;

	/**
	 * The reservation customer.
	 *
	 * @var \AweBooking\Model\Customer
	 */
	protected $customer;

	/**
	 * The selected rooms.
	 *
	 * @var \AweBooking\Reservation\Item_Collection
	 */
	protected $rooms;

	/**
	 * [$services description]
	 *
	 * @var [type]
	 */
	protected $services;

	protected $taxes;
	protected $fees;

	protected $deposit;

	protected $payment;
	protected $recently_created = false;

	/**
	 * Create new reservation.
	 *
	 * @param Source $source The source implementation.
	 * @param Stay             $stay   The stay for the reservation.
	 */
	public function __construct( Source $source, Stay $stay ) {
		$this->source = $source;

		$stay->require_minimum_nights( 1 );
		$this->stay = $stay;

		// Create empty rooms.
		$this->rooms = new Item_Collection;
	}

	/**
	 * Search pricing and availability.
	 *
	 * @param  Guest $guest       The Guest instance.
	 * @param  array $constraints The constraints.
	 * @return \AweBooking\Reservation\Searcher\Results
	 */
	public function search( Guest $guest = null, array $constraints = [] ) {
		return ( new Query( $this->stay, $guest, $constraints ) )->get();
	}

	public function create( array $options = [], callable $callback = null ) {
	}

	/**
	 * Get the totals.
	 *
	 * @return \AweBooking\Reservation\Totals
	 */
	public function get_totals() {
		return new Totals( $this );
	}

	/**
	 * Get the Stay.
	 *
	 * @return \AweBooking\Model\Stay
	 */
	public function get_stay() {
		return $this->stay;
	}

	/**
	 * Get the Source.
	 *
	 * @return \AweBooking\Reservation\Source\Source
	 */
	public function get_source() {
		return $this->source;
	}

	/**
	 * Get the customer.
	 *
	 * @return \AweBooking\Model\Customer
	 */
	public function get_customer() {
		return $this->customer;
	}

	/**
	 * Set the reservation customer.
	 *
	 * @param  \AweBooking\Model\Customer $customer The customer instance.
	 * @return $this
	 */
	public function set_customer( Customer $customer ) {
		$this->customer = $customer;

		return $this;
	}

	/**
	 * Get all reservation rooms.
	 *
	 * @return \AweBooking\Reservation\Item_Collection
	 */
	public function get_rooms() {
		return $this->rooms;
	}

	/**
	 * Determines a reservation-room exists in current reservation.
	 *
	 * @param  \AweBooking\Model\Room $room The room instance.
	 * @return boolean
	 */
	public function has_room( Room $room ) {
		return $this->rooms->has( $room->get_id() );
	}

	/**
	 * Get reservation-room by given a room-unit.
	 *
	 * @param  \AweBooking\Model\Room $room The room instance.
	 * @return \AweBooking\Reservation\Item
	 */
	public function get_room( Room $room ) {
		return $this->rooms->get( $room->get_id() );
	}

	/**
	 * Add a reservation-room to the reservation.
	 *
	 * @param \AweBooking\Model\Room  $room  The room instance.
	 * @param \AweBooking\Model\Rate  $rate  The rate instance.
	 * @param \AweBooking\Model\Guest $guest The guest instance.
	 */
	public function add_room( Room $room, Rate $rate, Guest $guest ) {
		// First, we will check the valid number of guest.
		$this->validate_guest_number( $room, $guest );

		// Next, check the current room can be bookable.
		$this->validate_bookable( $room, $this->stay );

		// Everything OK.
		$item = new Item( $room, $rate, $this->stay, $guest );

		$this->rooms->put( $room->get_id(), $item );

		return $item;
	}

	/**
	 * Resolve room type by given room-unit.
	 *
	 * @param  Room $room The room-unit instance.
	 * @return \AweBooking\Model\Room_Type
	 */
	protected function resolve_room_type( Room $room ) {
		return Factory::get_room_type( $room->get_room_type_id() );
	}

	/**
	 * Validate the guest number depends by restriction of room type.
	 *
	 * @param  Room  $room  The room instance.
	 * @param  Guest $guest The guest instance.
	 * @return void
	 *
	 * @throws Exceptions\Overflow_Guest_Exception
	 */
	protected function validate_guest_number( Room $room, Guest $guest ) {
		$room_type = $this->resolve_room_type( $room );

		// if current room-type include "calculation_infants" we will
		// get total number guest (included infants) to compare.
		$total_guest = $room_type->is_calculation_infants() ? $guest->total() : $guest->total_without_infants();

		if ( $total_guest > $room_type->get_maximum_occupancy() ) {
			throw new Exceptions\Overflow_Guest_Exception( sprintf(
				/* translators: %1$s: Room type title, %2$d: Maximum occupancy, %3$d: Given occupancy */
				esc_html__( 'The %1$s room can only stay maximum %2$d guest but given %3$d', 'awebooking' ),
				esc_html( $room_type->get_title() ),
				esc_html( $room_type->get_maximum_occupancy() ),
				esc_html( $total_guest )
			) );
		}
	}

	/**
	 * Check if this room can be for booking.
	 *
	 * @param  Room $room The room instance.
	 * @param  Stay $stay The stay instance.
	 *
	 * @throws Exceptions\No_Room_Left_Exception
	 * @throws Exceptions\Duplicate_Room_Exception
	 */
	protected function validate_bookable( Room $room, Stay $stay ) {
		if ( $this->has_room( $room ) ) {
			throw new Exceptions\Duplicate_Room_Exception( esc_html__( 'A room already exists in current reservation', 'awebooking' ) );
		}

		// Check the availability state.
		$room_type = $this->resolve_room_type( $room );
		$availability = ( new Checker )->check( $room_type, $stay );

		if ( ! $availability->remain( $room ) ) {
			throw new Exceptions\No_Room_Left_Exception( esc_html__( 'No room left for the reservation', 'awebooking' ) );
		}
	}

	public function create_booking( array $options = [], callable $callback = null ) {
		// Parse the options args.
		$options = wp_parse_args( $options, [
			'notify'       => true,
			'admin_notify' => true,
		] );

		if ( is_null( $this->customer ) ) {
			throw new Exception("Error Processing Request", 1);
		}

		if ( $this->items->isEmpty() ) {
			throw new Exceptions\Empty_Room_Exception("Error Processing Request", 1);
		}

		// Create new booking.
		$booking = (new Booking)->fill( apply_filters( 'awebooking/store_booking_args', [
			'status'              => Booking::PENDING,
		] ) );

		// Fire the callback before booking will be created.
		call_user_func_array( $callback, [ $booking, $this ] );

		// Save the booking in dababase.
		$booking->save();

		// Send emails notifications.
		if ( $options['notify'] ) {
			$this->send_booking_notifications();
		}

		if ( $options['admin_notify'] ) {
			$this->send_admin_notifications();
		}

		return $booking;
	}

	protected function send_admin_notifications( Booking $booking ) {
	}
}
