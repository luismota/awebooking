<?php
namespace AweBooking\Calendar;

class Factory {
	/**
	 * Create a Year period.
	 *
	 * @param int|DateTimeInterface $year The year for the period.
	 */
	public static function create_year( $year ) {
		return new Year( $year );
	}

	/**
	 * Create a Month period.
	 *
	 * @param int|\DateTimeInterface $year  The year for the period.
	 * @param int                    $month The month of year, optional.
	 */
	public static function create_month( $year, $month = null ) {
		return new Month( $year, $month );
	}

	/**
	 * Create a Week period.
	 *
	 * @param string|DateTime $start_date The start date point.
	 */
	public static function create_week( $start_date ) {
		return new Week( $start_date );
	}

	/**
	 * Create a Date period.
	 *
	 * @param string|DateTime $start_date The start date point.
	 */
	public static function create_day( $start_date ) {
		return new Day( $start_date );
	}
}
