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

		echo $this->generate_scheduler_calendar( $this->today, $rooms );
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
