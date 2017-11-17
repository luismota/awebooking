<?php
namespace AweBooking\Calendar\Period;

use DateInterval;
use AweBooking\Support\Period;

abstract class Period_Abstract extends Period {
	/**
	 * The date interval specification for the period.
	 *
	 * @var string
	 */
	protected $interval = 'P1D';

	/**
	 * Create a period.
	 *
	 * @param string|DateTime $start_date The start date point.
	 */
	public function __construct( $start_date ) {
		$start_date = static::filterDatePoint( $start_date );

		$interval = static::filterDateInterval( $this->get_interval() );

		parent::__construct( $start_date, $start_date->add( $interval ) );
	}

	/**
	 * Format the period at start date point.
	 *
	 * @param  string $format The format string.
	 * @return string
	 */
	public function format( $format ) {
		return $this->get_start_date()->format( $format );
	}

	/**
	 * The the DateInterval instance.
	 *
	 * @return \DateInterval
	 */
	public function get_interval() {
		return new DateInterval( $this->interval );
	}

	/**
	 * Generate the iterator.
	 *
	 * @param  Period   $initial  The initial value.
	 * @param  callable $callback The callback, must be returned "false" sometimes for stop the while loop.
	 * @return \Generator
	 */
	protected function generate_iterator( Period $initial, callable $callback ) {
		$current = $initial;

		while ( $callback( $current, $initial ) ) {
			yield (string) $current => $current;

			$current = $current->next( $current->get_interval() );
		}
	}
}
