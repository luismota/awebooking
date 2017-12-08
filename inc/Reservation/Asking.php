<?php
namespace AweBooking\Reservation;

use AweBooking\Model\Room_Type;

class Asking {
	/* Constants asking for */
	const BOTH = 0;
	const PRICING = 1;
	const AVAILABILITY = 2;

	/**
	 * Asking for room-type.
	 *
	 * @var \AweBooking\Model\Room_Type
	 */
	protected $room_type;

	/**
	 * What's kind of asking for?
	 *
	 * @var int
	 */
	protected $asking_for;

	protected $request_services;

	/**
	 * Constructor.
	 *
	 * @param Room_Type $room_type  The room-type instance.
	 * @param int       $asking_for Asking for what, Asking::BOTH, Asking::PRICING, Asking::AVAILABILITY.
	 */
	public function __construct( Room_Type $room_type, $asking_for = self::BOTH ) {
		$this->room_type  = $room_type;
		$this->asking_for = $asking_for;
	}

	/**
	 * Get the room-type asking for.
	 *
	 * @return \AweBooking\Model\Room_Type
	 */
	public function get_room_type() {
		return $this->room_type;
	}

	public function is_asking_for( $kind ) {
		return $this->asking_for === $kind;
	}
}
