<?php
namespace AweBooking\Admin\Calendar;

use AweBooking\Support\Carbonate;
use AweBooking\Calendar\Calendar;
use AweBooking\Calendar\Scheduler;
use AweBooking\Calendar\Period\Period;
use AweBooking\Calendar\Event\State_Event;
use AweBooking\Calendar\Event\Pricing_Event;
use AweBooking\Calendar\Event\Booking_Event;
use AweBooking\Calendar\Html\Skeleton_Calendar_Trait;

abstract class Schedule_Calendar {
	use Skeleton_Calendar_Trait;

	/**
	 * The Calendar default options.
	 *
	 * @var array
	 */
	protected $options = [
		'date_title'       => 'l, M j, Y',
		'month_label'      => 'abbrev',  // 'abbrev', 'full'.
		'weekday_label'    => 'abbrev',  // 'initial', 'abbrev', 'full'.
		'base_class'       => 'awebooking-schedule',
	];

	/**
	 * Generate the schedule calendar.
	 *
	 * @param  Scheduler $scheduler The Scheduler instance.
	 * @param  Period    $period    The Period.
	 * @return string
	 */
	protected function generate( Scheduler $scheduler, Period $period ) {
		wp_enqueue_script( 'awebooking-schedule-calendar' );

		$output  = '<div class="' . esc_attr( $this->get_html_class() ) . '">';

		$output .= '<aside class="' . esc_attr( $this->get_html_class( '&__aside' ) ) . '">';
		$output .= "\n\t<ul>";

		foreach ( $scheduler as $calendar ) {
			$output .= '<li data-unit="' . esc_attr( $calendar->get_uid() ) . '">' . esc_html( $calendar->get_name() ) . '</li>';
		}

		$output .= "\n\t</ul>\n";
		$output .= "\n</aside>";

		$output .= '<div class="' . esc_attr( $this->get_html_class( '&__table' ) ) . '">';

		// $output .= "\n<header>\n\t<ul>";
		/*foreach ( $period->get_date_period() as $day ) {
			$output .= "\n\t\t" . sprintf( '<li class="%1$s" data-day="%2$s"><span>%3$s %2$s</span></li>',
				esc_attr( $this->get_html_class( '&__day-heading' ) ),
				esc_html( $day->day ),
				esc_html( $this->get_weekday_name( $day->dayOfWeek, 'abbrev' ) )
			);
		}*/
		// $output .= "\n\t</ul>\n</header>";

		$output .= "\n<div class=\"" . esc_attr( $this->get_html_class( '&__tbody' ) ) . '">';
		foreach ( $scheduler as $calendar ) {
			$events = $this->get_calendar_events( $calendar, $period );
			$this->indexed_events[ $calendar->get_uid() ] = $events;

			$output .= "\n\t<div class=\"" . esc_attr( $this->get_html_class( '&__row' ) ) . "\" data-unit='" . esc_attr( $calendar->get_uid() ) . "'>";

			// The date columns.
			$output .= "\n\t<div class=\"" . esc_attr( $this->get_html_class( '&__days' ) ) . '">';
			foreach ( $period->get_date_period() as $day ) {
				$output .= "\n\t\t" . $this->generate_cell_date( $day, $calendar );
			}
			$output .= "\n\t</div>\n";

			// The events columns.
			$output .= "\n\t<div class=\"" . esc_attr( $this->get_html_class( '&__events' ) ) . '">';
			foreach ( $period->get_date_period() as $day ) {
				$output .= "\n\t\t" . $this->generate_cell_events( $events, $day, $calendar );
			}
			$output .= "\n\t</div>\n";

			// End row.
			$output .= "\n\t</div>\n";
		} // End for().

		$output .= '<div class="awebooking-schedule__marker"></div>';
		$output .= "\n</div>";

		$output .= "\n</div></div>";
		return $output;
	}

	/**
	 * Generate HTML cell of a day.
	 *
	 * @param  Carbonate $date    Current day instance.
	 * @param  string    $calendar
	 * @return string
	 */
	protected function generate_cell_date( Carbonate $date, $calendar ) {
		$output = sprintf( '<div class="%2$s" data-date="%1$s" title="%3$s">',
			esc_attr( $date->toDateString() ),
			esc_attr( implode( ' ', $this->get_date_classes( $date ) ) ),
			esc_attr( $date->format( $this->get_option( 'date_title' ) ) )
		);

		$output .= $this->get_cell_date_contents( $date, $calendar );
		$output .= '</div>';

		return $output;
	}

	protected function get_cell_date_contents( $date, $calendar ) {
		return '';
	}

	/**
	 * Get events from the Calendar in a Period.
	 *
	 * @param  Calendar $calendar [description]
	 * @param  Period   $period   [description]
	 * @return [type]
	 */
	protected function get_calendar_events( Calendar $calendar, Period $period ) {
		return $calendar->get_events( $period )
			->reject(function( $e ) {
				return ( $e instanceof State_Event
					|| $e instanceof Booking_Event
					|| $e instanceof Pricing_Event ) && ! $e->get_value();
			});
	}

	/**
	 * Generate HTML cell of a day.
	 *
	 * @param  Carbonate $date    Current day instance.
	 * @param  string    $calendar
	 * @return string
	 */
	protected function generate_cell_events( $events, Carbonate $date, Calendar $calendar ) {
		$output  = sprintf( '<div class="%1$s" data-date="%2$s">', esc_attr( $this->get_html_class( '&__cell-event' ) ), esc_attr( $date->toDateString() ) );
		$output .= $this->get_cell_event_contents( $events, $date, $calendar );
		$output .= '</div>';

		return $output;
	}

	protected function get_cell_event_contents( $events, $date, $calendar ) {
		return '';
	}
}
