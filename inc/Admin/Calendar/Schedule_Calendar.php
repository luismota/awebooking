<?php
namespace AweBooking\Admin\Calendar;

use AweBooking\Support\Carbonate;
use AweBooking\Calendar\Scheduler;
use AweBooking\Calendar\Period\Period;
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

	protected function generate_scheduler_calendar( $scheduler, $period ) {
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

		// $scheduler_heading = "<span>{$this->get_month_name( $month->month )}, {$month->year}</span>";
		// if ( method_exists( $this, 'custom_scheduler_heading' ) ) {
		// 	$scheduler_heading = $this->custom_scheduler_heading( $month );
		// }

		// $output .= "\n\t\t" . '<th class="' . esc_attr( $this->get_html_class( '&__scheduler-heading' ) ) . '">' . $scheduler_heading . '</th>';
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
			$this->indexed_events[ $calendar->get_uid() ] = $calendar->get_events( $period )
				->reject(function( $e ) {
					return ! $e->get_value();
				})
				->indexes();

			$output .= "\n\t<div class=\"" . esc_attr( $this->get_html_class( '&__row' ) ) . "\" data-unit='" . esc_attr( $calendar->get_uid() ) . "'>";
			// $output .= "\n\t\t" . '<th class="' . esc_attr( $this->get_html_class( '&__month-heading' ) ) . '" data-month="' . esc_attr( $month->month ) . '">' . $this->get_scheduler_row_heading( $month, $unit ) . '</th>';

			$output .= "\n\t<div class=\"" . esc_attr( $this->get_html_class( '&__days' ) ) . "\">";
			foreach ( $period->get_date_period() as $day ) {
				$output .= "\n\t\t" . $this->generate_cell_date( $day, $calendar );
			}
			$output .= "\n\t</div>\n";


			$output .= "\n\t<div class=\"" . esc_attr( $this->get_html_class( '&__events' ) ) . "\">";
			foreach ( $period->get_date_period() as $day ) {
				$output .= "\n\t\t" . $this->generate_cell_events( $day, $calendar );
			}
			$output .= "\n\t</div>\n";


			$output .= "\n\t</div>\n";
		} // End for().

		$output .= '<div class="awebooking-schedule__marker"></div>';
		$output .= "\n</div>";

		// $output .= '<div class="awebooking-schedule__asd popper"><span class="popper__arrow" x-arrow></span><div>asdasdasd</div></div>';

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
	protected function generate_cell_events( Carbonate $date, $calendar ) {
		$calendar_events = $this->indexed_events[ $calendar->get_uid() ];

		$html_events = [];
		if ( $calendar_events->has( $date->toDateString() ) ) {
			$events = $calendar_events->get( $date->toDateString() );

			foreach ( $events as $event ) {
				$classes = [];
				$width   = $event->get_period()->getDateInterval()->format( '%r%a' ) + 1;

				$html_events[] = '<i class="awebooking-schedule__event ' . esc_attr( implode( ' ', $classes ) ) . '" style="left: 30px; width:' . esc_attr( $width * 60 ) . 'px">' . $event->get_summary() . '</i>';
			}
		}


		$output = '<div class="' . esc_attr( $this->get_html_class( '&__cell-event' ) ) . '">';

		$output .= implode( ' ', $html_events );

		$output .= '</div>';

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

		$output .= '</div>';

		return $output;
	}
}
