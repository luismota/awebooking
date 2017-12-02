<?php
namespace AweBooking\Calendar\Html;

use AweBooking\Support\Carbonate;
use AweBooking\Calendar\Calendar;
use AweBooking\Calendar\Period\Month;

use AweBooking\Calendar\Event\State_Event;
use AweBooking\Calendar\Event\Booking_Event;
use AweBooking\Calendar\Event\Pricing_Event;

class Month_Calendar {
	/**
	 * The month to generate HTML.
	 *
	 * @var \AweBooking\Calendar\Period\Month
	 */
	protected $month;

	/**
	 * The Calendar instance.
	 *
	 * @var \AweBooking\Calendar\Calendar|null
	 */
	protected $calendar;

	/**
	 * Calendar events.
	 *
	 * @var mixed
	 */
	protected $events;

	/**
	 * Week begins, 0 stands for Sunday.
	 *
	 * @var int
	 */
	protected $week_begins;

	/**
	 * The Calendar options.
	 *
	 * @var array
	 */
	protected $options = [];

	/**
	 * The Calendar default options.
	 *
	 * @var array
	 */
	protected $default_options = [
		'date_title'       => 'l, M j, Y',
		'month_label'      => 'abbrev',  // 'abbrev', 'full'.
		'weekday_label'    => 'abbrev',  // 'initial', 'abbrev', 'full'.
		'base_class'       => 'awebooking-month-calendar',
	];

	/**
	 * Constructor.
	 *
	 * @param Month    $month    [description]
	 * @param Calendar $calendar [description]
	 * @param array    $options  [description]
	 */
	public function __construct( Month $month, Calendar $calendar = null, array $options = [] ) {
		$this->month    = $month;
		$this->calendar = $calendar;

		$this->week_begins = (int) get_option( 'start_of_week' );
		$this->options     = wp_parse_args( $options, $this->default_options );
	}

	/**
	 * Display the Calendar.
	 *
	 * @return void
	 */
	public function display() {
		$month = $this->month;

		$output = '';

		for ( $i = 0; $i <= 6; $i++ ) {
			$wd = (int) ( $i + $this->week_begins ) % 7;
			$wd_class = ( Carbonate::SUNDAY == $wd || Carbonate::SATURDAY == $wd ) ? '&__day-heading--weekend' : '&__day-heading--weekday';

			/*$output .= "\n\t\t" . sprintf( '<th class="%1$s"><span title="%3$s">%2$s</span></th>',
				esc_attr( $this->get_html_class( '&__day-heading ' . $wd_class ) ),
				esc_html( $this->get_weekday_name( $wd ) ),
				esc_attr( $this->get_weekday_name( $wd, 'full' ) )
			);*/
		}

		// Get all events and reject events have empty value.
		$events = $this->retrieve_events()->indexes();

		foreach ( $month as $week ) {
			$output .= '<ul class="' . $this->get_html_class( '&__week' ) . '">';

			foreach ( $week as $day ) {
				$index = $day->format( 'Y-m-d' );

				if ( ! $month->contains( $day ) ) {
					$output .= "\n\t\t" . $this->generate_cell_pad();
				} else {
					$day_events = [];

					if ( $events->has( $index ) ) {
						$day_events = $events->get( $index );
					}

					$output .= "\n\t\t" . $this->generate_cell_date( $day, $day_events );
				}
			}

			$output .= '</ul>';
		}

		return $output;
	}

	/**
	 * Get the Calendar option.
	 *
	 * @param  string $option  Option key name.
	 * @param  mixed  $default Default value.
	 * @return mixed
	 */
	public function get_option( $option, $default = null ) {
		return isset( $this->options[ $option ] ) ? $this->options[ $option ] : $default;
	}

	/**
	 * [retrieve_events description]
	 *
	 * @return [type]
	 */
	protected function retrieve_events() {
		if ( ! $this->calendar ) {
			return;
		}

		return $this->calendar->get_events( $this->month )
			->reject(function( $e ) {
				return $this->should_reject_event( $e );
			});
	}

	/**
	 * Determines if event should reject.
	 *
	 * @param  [type] $e [description]
	 * @return [type]
	 */
	protected function should_reject_event( $e ) {
		return $e->get_value() && (
			$e instanceof State_Event ||
			$e instanceof Booking_Event ||
			$e instanceof Pricing_Event );
	}

	/**
	 * Generate HTML cell of a day.
	 *
	 * @param  Carbonate $date    Current day instance.
	 * @return string
	 */
	protected function generate_cell_date( $day, $events ) {
		$day = $day->get_start_date();

		$html_events = '';
		foreach ( $events as $event ) {
			$html_events .= '<span>' . $event->get_start_date()->toDateString() . $event->get_summary() . '</span>';
		}

		$output = sprintf( '<li class="%6$s" data-day="%1$d" data-month="%2$d" data-year="%3$d" data-date="%4$s" title="%5$s">',
			esc_attr( $day->day ),
			esc_attr( $day->month ),
			esc_attr( $day->year ),
			esc_attr( $day->toDateString() ),
			esc_attr( $day->format( $this->get_option( 'date_title' ) ) ),
			esc_attr( implode( ' ', $this->get_date_classes( $day ) ) )
		);

		$output .= $day->format( 'd' );
		$output .= '<div>' . $html_events . '</div>';

		$output .= '</li>';

		return $output;
	}

	/**
	 * Generate cell padding.
	 *
	 * @param  integer $pad How how much we should pad.
	 * @return string
	 */
	protected function generate_cell_pad( $pad = 1 ) {
		$padding = '<li class="' . $this->get_html_class( '&__pad' ) . '">&nbsp;</li>';

		return str_repeat( $padding, $pad );
	}

	/**
	 * Get classess for date.
	 *
	 * @param  Carbonate $date Date instance.
	 * @return array
	 */
	protected function get_date_classes( Carbonate $date ) {
		$classes[] = $this->get_html_class( '&__day' );

		// Is current day is today, future or past.
		if ( $date->isToday() ) {
			$classes[] = $this->get_html_class( '&__day--today' );
		} elseif ( $date->isPast() ) {
			$classes[] = $this->get_html_class( '&__day--past' );
		} elseif ( $date->isFuture() ) {
			$classes[] = $this->get_html_class( '&__day--future' );
		}

		if ( $date->isWeekend() ) {
			$classes[] = $this->get_html_class( '&__day--weekend' );
		}

		return $classes;
	}

	/**
	 * Get html base class or build new class.
	 *
	 * Uses "&" to represent to "base_class" like SCSS, eg: &__heading.
	 *
	 * @param  string $class Optional, extra classes.
	 * @return string
	 */
	protected function get_html_class( $class = null ) {
		$base_class = $this->get_option( 'base_class' );

		if ( is_null( $class ) ) {
			return $base_class;
		}

		return str_replace( '&', $base_class, $class );
	}

	/**
	 * Retrieve month label by month number depend "month_label" option.
	 *
	 * @param  string|int $month Month number from '01' through '12'.
	 * @param  string     $type  Optional, if null given using value from "month_label" option.
	 * @return string
	 */
	protected function get_month_name( $month, $type = null ) {
		global $wp_locale;

		$type = is_null( $type ) ? $this->get_option( 'month_label' ) : $type;
		$month_name = $wp_locale->get_month( $month );

		if ( 'abbrev' === $type ) {
			return $wp_locale->get_month_abbrev( $month_name );
		}

		return $month_name;
	}

	/**
	 * Retrieve weekday label depend "month_label" option.
	 *
	 * @param  int    $weekday Weekday number, 0 for Sunday through 6 Saturday.
	 * @param  string $type    Optional, if null given using value from "weekday_label" option.
	 * @return string
	 */
	protected function get_weekday_name( $weekday, $type = null ) {
		global $wp_locale;

		$type = is_null( $type ) ? $this->get_option( 'weekday_label' ) : $type;
		$weekday_name = $wp_locale->get_weekday( $weekday );

		switch ( $type ) {
			case 'initial':
				return $wp_locale->get_weekday_initial( $weekday_name );
			case 'abbrev':
				return $wp_locale->get_weekday_abbrev( $weekday_name );
			default:
				return $weekday_name;
		}
	}
}
