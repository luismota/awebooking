<?php
namespace AweBooking\Calendar;

use AweBooking\Support\Collection;
use AweBooking\Calendar\Period\Period;
use AweBooking\Calendar\Event\Event_Collection;

class Scheduler extends Collection {
	/**
	 * Get events available in a period.
	 *
	 * @param  Period $period  The period.
	 * @param  array  $options Optional, something pass to provider to get events.
	 * @return \AweBooking\Calendar\Event\Event_Collection
	 */
	public function get_events( Period $period, array $options = [] ) {
		$events = array_reduce( $this->items, function( $collection, $calendar ) use ( $period, $options ) {
			return $collection->merge( $calendar->get_events( $period, $options ) );
		}, new Event_Collection );
	}
}
