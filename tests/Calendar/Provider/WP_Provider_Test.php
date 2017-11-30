<?php

use AweBooking\Support\Carbonate;
use AweBooking\Calendar\Resource\Resource;
use AweBooking\Calendar\Resource\Resource_Collection;
use AweBooking\Calendar\Provider\WP_Provider;
use AweBooking\Calendar\Provider\Provider_Interface;
use AweBooking\Calendar\Provider\Contracts\Storable;
use Roomify\Bat\Unit\Unit as BAT_Unit;
use Roomify\Bat\Event\Event as BAT_Event;

class Calendar_Store_WP_Store_Test extends WP_UnitTestCase {
	public function setUp() {
		parent::setUp();
	}

	public function testInstance() {
		$resource = new Resource( 100 );
		$provider = new WP_Provider( [ $resource ], 'awebooking_booking', 'room_id' );

		$this->assertInstanceOf( Provider_Interface::class, $provider);
		$this->assertInstanceOf( Storable::class, $provider);
		$this->assertInstanceOf( Resource_Collection::class, $provider->get_resources());
		$this->assertInstanceOf( \AweBooking\Calendar\Provider\Stores\BAT_Store::class, $provider->get_store());
	}

	public function  testAddMoreResources() {
		$resource = new Resource( 100 );
		$resource2 = new Resource( 1001 );

		$provider = new WP_Provider( [ $resource ], 'awebooking_booking', 'room_id' );
		$this->assertCount( 1, $provider->get_resources() );

		$provider->add( $resource2 );
		$this->assertCount(2, $provider->get_resources() );
		$this->assertSame( $resource2, $provider->get_resources()->get( 1) );
	}

	public function testGetEvents() {
		$resource  = new Resource( 100 );
		$provider  = new WP_Provider( [ $resource ], 'awebooking_booking', 'room_id' );

		$store = $provider->get_store();
		$event1 = new BAT_Event( new DateTime( '2017-11-10' ), new DateTime( '2017-11-29' ), new BAT_Unit( 100, 0 ), 150 );
		$event2 = new BAT_Event( new DateTime( '2017-12-10' ), new DateTime( '2017-12-15' ), new BAT_Unit( 101, 0 ), 250 );
		$this->assertTrue($store->storeEvent($event1, 'bat_day'));
		$this->assertTrue($store->storeEvent($event2, 'bat_day'));

		$events = $provider->get_events(new Carbonate( '2017-11-10' ), new Carbonate( '2017-12-30' ));
		$this->assertCount( 2, $events );
		$this->assertInstanceOf( 'AweBooking\Calendar\Event\Event', $events[0] );

		$provider->add( $resource2 = new Resource( 101 ) );
		$events = $provider->get_events(new Carbonate( '2017-11-10' ), new Carbonate( '2017-12-30' ));
		$this->assertCount( 5, $events );
	}

	public function testGetEmptyResource() {
		$provider = new WP_Provider( [], 'awebooking_booking', 'room_id' );
		$this->assertCount( 0, $provider->get_resources() );

		$events = $provider->get_events(new Carbonate( '2017-11-10' ), new Carbonate( '2017-12-30' ));
		$this->assertEmpty($events);
	}
}
