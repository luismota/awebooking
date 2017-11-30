<?php
namespace AweBooking\Calendar\Period;

interface Period_Interface {
	/**
	 * Returns the starting date point.
	 *
	 * @return DateTimeImmutable
	 */
	public function get_start_date();

	/**
	 * Returns the ending datepoint.
	 *
	 * @return DateTimeImmutable
	 */
	public function get_end_date();

	/**
	 * Get DatePeriod object instance.
	 *
	 * @param  DateInterval|int|string $interval The interval.
	 * @param  int                     $option   See DatePeriod::EXCLUDE_START_DATE.
	 * @return DatePeriod
	 */
	public function get_period( $interval = '1 DAY', $option = 0 );

	/**
	 * Format the period at start date point.
	 *
	 * @param  string $format The format string.
	 * @return string
	 */
	public function format( $format );
}
