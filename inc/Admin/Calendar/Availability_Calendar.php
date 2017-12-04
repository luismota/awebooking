<?php
namespace AweBooking\Admin\Calendar;

use AweBooking\Factory;
use AweBooking\Hotel\Room_Type;
use AweBooking\Support\Utils as U;
use AweBooking\Support\Abstract_Calendar;

class Availability_Calendar extends Schedule_Calendar {
	protected $room_type;

	public function __construct( Room_Type $room_type, array $options = [] ) {
		parent::__construct( $options );

		$this->room_type = $room_type;
	}

	/**
	 * Display the Calendar.
	 *
	 * @return void
	 */
	public function display() {
		$rooms = U::collect($this->room_type->get_rooms())->map->only( 'id', 'name' );

		// echo $this->generate_scheduler_calendar( $this->today, $rooms );

		// $calendar = new \AweBooking\Calendar\Period\Year( 2017 );
		$month = new \AweBooking\Calendar\Period\Month( 2017, 11 );

		$cal = Factory::create_availability_calendar( [ Factory::get_room_unit( 1 ), Factory::get_room_unit( 2 ) ] );

		dd($cal->getEvents( new \DateTime( '2017-09-01' ), new \DateTime('2017-12-01')));
	}

	/**
	 * Prepare setup the data.
	 *
	 * @param  mixed  $input   Mixed input data.
	 * @param  string $context Context from Calendar.
	 * @return mixed
	 */
	protected function prepare_data( $input, $context ) {

	}
}
