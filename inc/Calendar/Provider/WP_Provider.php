<?php
namespace AweBooking\Calendar\Provider;

use Roomify\Bat\Unit\Unit;
use Roomify\Bat\Event\Event as BAT_Event;
use Roomify\Bat\Calendar\Calendar as BAT_Calendar;
use AweBooking\Calendar\Event\Event;
use AweBooking\Calendar\Event\Event_Interface;
use AweBooking\Calendar\Provider\Stores\BAT_Store;
use AweBooking\Calendar\Resource\Resource_Collection;
use AweBooking\Calendar\Resource\Resource_Interface;
use AweBooking\Support\Carbonate;
use AweBooking\Support\Collection;
use AweBooking\Support\Utils as U;

class WP_Provider implements Provider_Interface, Contracts\Storable {
	/**
	 * The collect of resource.
	 *
	 * @var \AweBooking\Calendar\Resource\Resource_Collection
	 */
	protected $resources;

	/**
	 * The BAT Store instance.
	 *
	 * @var \AweBooking\Calendar\Provider\Stores\BAT_Store
	 */
	protected $store;

	/**
	 * Constructor.
	 *
	 * @param Resource_Collection|array $resources   The resources to get events.
	 * @param string                    $table       The table name.
	 * @param string                    $foreign_key The foreign key.
	 */
	public function __construct( $resources, $table, $foreign_key ) {
		$this->store = new BAT_Store( $table, $foreign_key );
		$this->resources = new Resource_Collection( $resources instanceof Resource_Interface ? [ $resources ] : $resources );
	}

	/**
	 * Add one more resource to fetching.
	 *
	 * @param  Resource_Interface $resource The resource implementation.
	 * @return $this
	 */
	public function add( Resource_Interface $resource ) {
		$this->resources->push( $resource );

		return $this;
	}

	/**
	 * Get the BAT Store instance.
	 *
	 * @return \AweBooking\Calendar\Provider\Stores\BAT_Store
	 */
	public function get_store() {
		return $this->store;
	}

	/**
	 * Get the resources collection.
	 *
	 * @return \AweBooking\Calendar\Resource\Resource_Collection
	 */
	public function get_resources() {
		return $this->resources;
	}

	/**
	 * {@inheritdoc}
	 */
	public function store_event( Event_Interface $event ) {
		return false;
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_events( Carbonate $start_date, Carbonate $end_date, array $options = [] ) {
		$units = $this->transform_resources_to_units();

		// If empty units, leave and return an empty array.
		if ( empty( $units ) ) {
			return [];
		}

		// Fetch the raw events from dabatabse (via BAT Calendar).
		$raw_events = U::rescue( function() use ( $units, $start_date, $end_date ) {
			return $this->get_calendar( $units )->getEvents( $start_date, $end_date, true );
		}, [] );

		return Collection::make( $raw_events )
			->flatten( 1 )
			->map(function( $raw_event ) {
				// Get back the resource.
				$resource = $this->resources->first( function( $r ) use ( $raw_event ) {
					return $r->get_id() === $raw_event->getUnitId();
				});

				// Transform to AweBooking Event.
				return $this->transform_calendar_event( $raw_event, $resource );
			})
			->all();
	}

	/**
	 * Create the BAT calendar and return it.
	 *
	 * @param  array $units The array of BAT units.
	 * @return \Roomify\Bat\Calendar\Calendar
	 */
	protected function get_calendar( array $units ) {
		return new BAT_Calendar( $units, $this->store, 0 );
	}

	/**
	 * Transform the BAT_Event to the AweBooking Calendar Event.
	 *
	 * @param  BAT_Event          $raw_event The BAT event.
	 * @param  Resource_Interface $resource  The mapping resource.
	 * @return \AweBooking\Calendar\Event\Event_Interface
	 */
	protected function transform_calendar_event( BAT_Event $raw_event, Resource_Interface $resource ) {
		return new Event( $resource, $raw_event->getStartDate(), $raw_event->getEndDate(), $raw_event->getValue() );
	}

	/**
	 * Transform resources to BAT units.
	 *
	 * @return array
	 */
	protected function transform_resources_to_units() {
		return Collection::make( $this->resources )
		->map(function( $r ) {
			return new Unit( $r->get_id(), $r->get_value() );
		})->unique(function( $u ) {
			return $u->getUnitId();
		})->all();
	}
}
