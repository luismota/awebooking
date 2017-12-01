<?php

use AweBooking\ICalendar\Reader\Reader;
use AweBooking\ICalendar\Reader\Reader_Interface;
use AweBooking\ICalendar\Reader\Adapter\Stream_Adapter;
use AweBooking\ICalendar\Reader\Adapter\Adapter_Interface;

class ICalendar_Reader_Test extends WP_UnitTestCase {
	function testInstance() {
		$reader = new Reader( '', new Stream_Adapter);
		$this->assertInstanceOf(Reader_Interface::class, $reader);
		$this->assertInstanceOf(Adapter_Interface::class, $reader->get_adapter());
	}

	/**
	 * @expectedException AweBooking\ICalendar\Reader\Reading_Exception
	 */
	function testReadingError() {
		$reader = new Reader( __DIR__.'/sample-ics/demo.ics', new Stream_Adapter);
		$result = $reader->read();
	}

	/**
	 * @dataProvider get_properties()
	 */
	function testValidProperty( $path, $actual, $short_actual, $event_count ) {
		$reader = new Reader($path, new Stream_Adapter);
		$result = $reader->read();

		$this->assertInstanceOf( 'AweBooking\ICalendar\Reader\Reader_Result', $result );
		$this->assertEquals($actual, $result->get_property());
		$this->assertEquals($short_actual, $result->get_property_name());
		$this->assertCount($event_count, $result->get_events());
	}

	function get_properties() {
		return [
			[ __DIR__.'/sample-ics/google-calendar.ics', '-//Google Inc//Google Calendar 70.9054//EN', 'Google Inc', 9 ],
			[ __DIR__.'/sample-ics/listing-12027235.ics', '-//Airbnb Inc//Hosting Calendar 0.8.8//EN', 'Airbnb Inc', 29 ],
			[ __DIR__.'/sample-ics/listing-13195122.ics', '-//Airbnb Inc//Hosting Calendar 0.8.8//EN', 'Airbnb Inc', 5 ],
			[ __DIR__.'/sample-ics/listing-17595749.ics', '-//Airbnb Inc//Hosting Calendar 0.8.8//EN', 'Airbnb Inc', 84 ],
			[ __DIR__.'/sample-ics/wix-reservations.ics', '-//WiX Hotels//Reservations Calendar//EN', 'WiX Hotels', 1 ],
		];
	}

	function testReadEvent() {
		$reader = new Reader(__DIR__.'/sample-ics/wix-reservations.ics', new Stream_Adapter);
		$result = $reader->read();

		$this->assertInstanceOf( 'AweBooking\ICalendar\Reader\Reader_Result', $result );
		$this->assertEquals('-//WiX Hotels//Reservations Calendar//EN', $result->get_property());
		$this->assertCount(1, $result->get_events());

		$event = $result->get_events()->first();
		$this->assertInstanceOf('AweBooking\ICalendar\Event', $event );
		$this->assertInstanceOf('AweBooking\Calendar\Event\Event', $event );

		$this->assertEquals(32, strlen($event->get_uid()));
		$this->assertContains('Reservation: #140106, room: Deluxe, unit #1, occupancy: adults/children (1/0', $event->get_summary());
		$this->assertTrue($event->is_untrusted_resource());
		$this->assertTrue($event->should_be_booking());
		$this->assertFalse($event->should_be_unavailable());
		$this->assertEquals( '2017-10-31', $event->get_start_date()->toDateString());
		$this->assertEquals( '2017-11-01', $event->get_end_date()->toDateString());
	}
}
