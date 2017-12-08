<?php
namespace AweBooking\Admin\Calendar;

use AweBooking\Factory;
use AweBooking\Constants;
use AweBooking\Model\Room_Type;
use AweBooking\Support\Utils as U;
use AweBooking\Support\Abstract_Calendar;
use AweBooking\Calendar\Provider\State_Provider;
use AweBooking\Calendar\Resource\Resource;
use AweBooking\Calendar\Period\Month;
use AweBooking\Calendar\Calendar;
use AweBooking\Calendar\Scheduler;

class Availability_Calendar extends Schedule_Calendar {
	protected $room_type;

	public function __construct( Room_Type $room_type, array $options = [] ) {
		$this->room_type = $room_type;
	}

	/**
	 * Display the Calendar.
	 *
	 * @return void
	 */
	public function display() {
		$calendars = U::collect( $this->room_type->get_rooms() )
			->map(function( $room ) {
				$resource = new Resource( $room->get_id(), Constants::STATE_AVAILABLE );

				$calendar = new Calendar( $resource, new State_Provider( $resource ) );
				$calendar->set_name( $room->get_name() );

				return $calendar;
			});

		$month = new Month( 2017, 12 );
		$scheduler = new Scheduler( $calendars, $month );

		echo $this->generate_scheduler_calendar( $scheduler, $month );
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
