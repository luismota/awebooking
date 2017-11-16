<?php
namespace AweBooking\Admin\Calendar;

use AweBooking\Support\Period;
use AweBooking\Support\Carbonate;
use AweBooking\Support\Collection;
use AweBooking\Support\Abstract_Calendar;

abstract class Schedule_Calendar extends Abstract_Calendar {
	/**
	 * The Calendar default options.
	 *
	 * @var array
	 */
	protected $defaults = [
		'date_title'       => 'l, M j, Y',
		'month_label'      => 'abbrev',  // 'abbrev', 'full'.
		'weekday_label'    => 'abbrev',  // 'initial', 'abbrev', 'full'.
		'base_class'       => 'awebooking-schedule',
	];

	/**
	 * Generate scheduler calendar.
	 *
	 * @param  Carbonate $month     The month to start calendar.
	 * @param  array     $units An array units.
	 * @return string
	 */
	protected function generate_scheduler_calendar( Carbonate $month, $units ) {
		$this->period = $period = Period::createFromDay( $month )
			->moveStartDate( '-2 DAY' )
			->moveEndDate( '+1 MONTH' );

		$this->data = $this->prepare_data( clone $period, 'scheduler' );

		$this->events = Collection::make([
			'2017-10-30' => new Period( '2017-10-30', '2017-11-04' ),
		]);

		$units = Collection::make( $units )->filter(function( $unit ) {
			return isset( $unit['id'] ) && $unit['id'] > 0 && isset( $unit['name'] );
		});

		wp_enqueue_script( 'awebooking-schedule-calendar' );

		$output  = '<div class="' . esc_attr( $this->get_html_class() ) . '">';

		$output .= '<aside class="' . esc_attr( $this->get_html_class( '&__aside' ) ) . '">';
		$output .= "\n\t<ul>";

		foreach ( $units as $unit ) {
			$output .= '<li data-unit="' . esc_attr( $unit['id'] ) . '">' . esc_html( $unit['name'] ) . '</li>';
		}

		$output .= "\n\t</ul>\n";
		$output .= "\n</aside>";

		$output .= '<div class="' . esc_attr( $this->get_html_class( '&__table' ) ) . '">';
		$output .= "\n<header>\n\t<ul>";

		// $scheduler_heading = "<span>{$this->get_month_name( $month->month )}, {$month->year}</span>";
		// if ( method_exists( $this, 'custom_scheduler_heading' ) ) {
		// 	$scheduler_heading = $this->custom_scheduler_heading( $month );
		// }

		// $output .= "\n\t\t" . '<th class="' . esc_attr( $this->get_html_class( '&__scheduler-heading' ) ) . '">' . $scheduler_heading . '</th>';
		foreach ( $period->get_period() as $day ) {
			$output .= "\n\t\t" . sprintf( '<li class="%1$s" data-day="%2$s"><span>%3$s %2$s</span></li>',
				esc_attr( $this->get_html_class( '&__day-heading' ) ),
				esc_html( $day->day ),
				esc_html( $this->get_weekday_name( $day->dayOfWeek, 'abbrev' ) )
			);
		}

		$output .= "\n\t</ul>\n</header>";
		$output .= "\n<div class=\"" . esc_attr( $this->get_html_class( '&__tbody' ) ) . '">';

		foreach ( $units as $unit ) {
			$output .= "\n\t<ul data-unit='" . esc_attr( $unit['id'] ) . "'>";
			// $output .= "\n\t\t" . '<th class="' . esc_attr( $this->get_html_class( '&__month-heading' ) ) . '" data-month="' . esc_attr( $month->month ) . '">' . $this->get_scheduler_row_heading( $month, $unit ) . '</th>';

			foreach ( $period->get_period() as $day ) {
				$this->setup_date( $day->copy(), $unit );
				$output .= "\n\t\t" . $this->generate_cell_date( $day, 'scheduler' );
			}

			$output .= "\n\t</ul>\n";
		} // End for().


		$output .= '<div class="awebooking-schedule__marker"></div>';
		$output .= "\n</div>";

		$output .= '<div class="awebooking-schedule__asd popper"><span class="popper__arrow" x-arrow></span><div>asdasdasd</div></div>';

		$output .= "\n</div></div>";

		return $output;
	}

	/**
	 * Generate HTML cell of a day.
	 *
	 * @param  Carbonate $date    Current day instance.
	 * @param  string    $context Context from Calendar.
	 * @return string
	 */
	protected function generate_cell_date( Carbonate $date, $context ) {

		$events = [];
		if ( $this->events->has( $date->toDateString() ) ) {
			$current_segment = $this->events->get( $date->toDateString() );

			$width = $current_segment->nights();
			$classes = [];

			$events[] = '<i class="sevent ' . esc_attr( implode( ' ', $classes ) ) . '" style="width:' . esc_attr( $width * 100 ) . '%%"></i>';
		}

		return sprintf( '<li class="%6$s" data-day="%1$d" data-month="%2$d" data-year="%3$d" data-date="%4$s" title="%5$s">' .  implode( ' ', $events ) . $this->get_date_contents( $date, $context ) . '</li>',
			esc_attr( $date->day ),
			esc_attr( $date->month ),
			esc_attr( $date->year ),
			esc_attr( $date->toDateString() ),
			esc_attr( $date->format( $this->get_option( 'date_title' ) ) ),
			esc_attr( implode( ' ', $this->get_date_classes( $date ) ) )
		);
	}
}
