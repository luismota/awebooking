<?php
namespace AweBooking\Calendar;

use AweBooking\Calendar\Event\Event_Interface;
use AweBooking\Calendar\Event\Event_Collection;
use AweBooking\Calendar\Period\Period_Interface;
use AweBooking\Calendar\Resource\Resource_Interface;
use AweBooking\Calendar\Provider\Provider_Interface;

class Calendar {
	/**
	 * The Calendar resource.
	 *
	 * @var Resource_Interface
	 */
	protected $resource;

	/**
	 * The Calendar Store
	 *
	 * @var Store_Interface
	 */
	protected $provider;

	/**
	 * Name of the calendar.
	 *
	 * @var string
	 */
	protected $name;

	/**
	 * Description of the calendar.
	 *
	 * @var string
	 */
	protected $description;

	/**
	 * Hex color to use as background color for events in this calendar.
	 *
	 * @var string
	 */
	protected $background_color;

	/**
	 * Hex color to use as foreground color for events in this calendar.
	 *
	 * @var string
	 */
	protected $foreground_color;

	/**
	 * Create a Calendar.
	 *
	 * @param Resource_Interface $resource The resource implementation.
	 * @param Provider_Interface $provider The calendar provider implementation.
	 */
	public function __construct( Resource_Interface $resource, Provider_Interface $provider ) {
		$this->provider = $provider;
		$this->resource = $resource;
	}

	/**
	 * Get events available in a period.
	 *
	 * @param  Period_Interface $period  The period.
	 * @param  array            $options Optional, something pass to provider to get events.
	 * @return \AweBooking\Calendar\Event\Event_Collection
	 */
	public function get_events( Period_Interface $period, array $options = [] ) {
		// Get events from provider.
		$events = $this->provider->get_events( $period->get_start_date(), $period->get_end_date(), $options );

		return Event_Collection::make( $events )
			->reject(function( $e ) {
				return $this->resource->get_id() !== $e->get_resource()->get_id();
			});
	}

	/**
	 * Get unique ID for this calendar.
	 *
	 * TODO: Make this unique.
	 *
	 * @return string
	 */
	public function get_uid() {
		return $this->resource->get_id();
	}

	/**
	 * Get the Calendar name.
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * Set the Calendar name.
	 *
	 * @param  string $name The Calendar name.
	 * @return $this
	 */
	public function set_name( $name ) {
		$this->name = $name;

		return $this;
	}

	/**
	 * Get the Calendar description.
	 *
	 * @return string
	 */
	public function get_description() {
		return $this->description;
	}

	/**
	 * Set the Calendar description.
	 *
	 * @param  string $description The Calendar description.
	 * @return $this
	 */
	public function set_description( $description ) {
		$this->description = $description;

		return $this;
	}

	/**
	 * Get the background color of the Calendar.
	 *
	 * @return string
	 */
	public function get_background_color() {
		return $this->background_color;
	}

	/**
	 * Set the background color of the Calendar.
	 *
	 * @param  string $background_color Valid hex color.
	 * @return $this
	 */
	public function set_background_color( $background_color ) {
		$this->background_color = sanitize_hex_color( $background_color );

		return $this;
	}

	/**
	 * Get the foreground color of the Calendar.
	 *
	 * @return string
	 */
	public function get_foreground_color() {
		return $this->foreground_color;
	}

	/**
	 * Set the foreground color of the Calendar.
	 *
	 * @param  string $foreground_color Valid hex color.
	 * @return $this
	 */
	public function set_foreground_color( $foreground_color ) {
		$this->foreground_color = sanitize_hex_color( $foreground_color );

		return $this;
	}
}
