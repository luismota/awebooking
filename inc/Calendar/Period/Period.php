<?php
namespace AweBooking\Calendar\Period;

use DatePeriod;
use AweBooking\Support\Carbonate;
use League\Period\Period as League_Period;

class Period extends League_Period {
	/**
	 * Create date period.
	 *
	 * The date should be a string using
	 * ISO-8601 "Y-m-d" date format, eg: 2017-05-10.
	 *
	 * @param string|Carbonate $start_date Starting date point.
	 * @param string|Carbonate $end_date   Ending date point.
	 * @param bool             $strict     Optional, use strict mode.
	 */
	public function __construct( $start_date, $end_date, $strict = false ) {
		parent::__construct(
			Carbonate::create_datetime( $start_date ),
			Carbonate::create_datetime( $end_date )
		);

		$this->validate_period( $strict );
	}

	/**
	 * Returns the starting date point.
	 *
	 * @return Carbonate
	 */
	public function get_start_date() {
		return $this->getStartDate();
	}

	/**
	 * Returns the ending datepoint.
	 *
	 * @return Carbonate
	 */
	public function get_end_date() {
		return $this->getEndDate();
	}

	/**
	 * Returns a \DateInterval equivalent to the period.
	 *
	 * @return \DateInterval
	 */
	public function get_interval() {
		return $this->getDateInterval();
	}

	/**
	 * Tells whether the specified index is fully contained within
	 * the current Period object.
	 *
	 * @param  DateTimeInterface|string $index The datetime index.
	 * @return bool
	 */
	public function contains( $index ) {
		return parent::contains( $index );
	}

	/**
	 * Returns true if the period include the other period
	 * given as argument.
	 *
	 * @param  PeriodInterface $period The period instance.
	 * @return bool
	 */
	public function includes( PeriodInterface $period ) {
		return $this->containsPeriod( $period );
	}

	/**
	 * Returns if $event is during this period.
	 *
	 * @param  Event_Interface $event The event instance.
	 * @return bool
	 */
	public function contains_event( Event_Interface $event ) {
		// TODO: ...
		return false;
	}

	/**
	 * Get DatePeriod object instance.
	 *
	 * @param  DateInterval|int|string $interval The interval.
	 * @param  int                     $option   See DatePeriod::EXCLUDE_START_DATE.
	 * @return DatePeriod
	 */
	public function get_period( $interval = '1 DAY', $option = 0 ) {
		return new DatePeriod( $this->get_start_date(), static::filterDateInterval( $interval ), $this->get_end_date(), $option );
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
	 * Get number of nights.
	 *
	 * @return int
	 */
	public function nights() {
		return (int) $this->getDateInterval()->format( '%r%a' );
	}

	/**
	 * Split period segments by interval at end-of-week.
	 *
	 * @param  integer $week_begins Week begins, 0 (for Sunday) through 6 (for Saturday)
	 *                              Default is 1 (Monday).
	 * @return Generator
	 */
	public function segments( $week_begins = 1 ) {
		$enddate = $this->get_end_date();
		$startdate = $this->get_start_date();

		$new_segment = false;
		foreach ( $this->moveEndDate( '+1 DAY' )->get_period() as $day ) {
			// @codingStandardsIgnoreLine
			$dayofweek = calendar_week_mod( $day->dayOfWeek - $week_begins );

			// Create new segment point at end-of-week or end of event-period.
			if ( 0 == $dayofweek || $day->isSameDay( $this->get_end_date() ) ) {
				$enddate = $day;
				$new_segment = true;
			}

			if ( $new_segment ) {
				yield new Period( $startdate, $enddate );
				$startdate = $day;
			}

			$new_segment = false;
		}
	}

	/**
	 * {@inheritdoc}
	 */
	public function getStartDate() {
		// @codingStandardsIgnoreLine
		$dt = $this->startDate;

		return new Carbonate( $dt->format( 'Y-m-d H:i:s.u' ), $dt->getTimeZone() );
	}

	/**
	 * {@inheritdoc}
	 */
	public function getEndDate() {
		// @codingStandardsIgnoreLine
		$dt = $this->endDate;

		return new Carbonate( $dt->format( 'Y-m-d H:i:s.u' ), $dt->getTimeZone() );
	}

	/**
	 * Validate period for require minimum night(s).
	 *
	 * @param  integer $nights Minimum night(s) to required, default 1.
	 * @return void
	 *
	 * @throws \LogicException
	 */
	public function required_minimum_nights( $nights = 1 ) {
		if ( $this->nights() < $nights ) {
			/* translators: %d: Number of nights */
			throw new \LogicException( sprintf( esc_html__( 'The date period must be have minimum %d night(s).', 'awebooking' ), esc_html( $nights ) ) );
		}
	}

	/**
	 * Validate the period in strict.
	 *
	 * @param  bool $strict Strict mode validation past date.
	 * @return void
	 *
	 * @throws \RangeException
	 */
	protected function validate_period( $strict ) {
		if ( $strict && $this->isBefore( Carbonate::today() ) ) {
			throw new \RangeException( esc_html__( 'The date period must be greater or equal to the today.', 'awebooking' ) );
		}
	}
}
