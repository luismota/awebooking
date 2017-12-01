<?php

use AweBooking\ICalendar\Event;
use AweBooking\ICalendar\Reader\Reader_Result;

class Icalendar_Reader_Result_Test extends WP_UnitTestCase {

	public function testBasic() {
		$result = new Reader_Result( '-//Calendar//AweBooking 2.0//EN' );
		$this->assertEquals('-//Calendar//AweBooking 2.0//EN', $result->get_property());
		$this->assertEquals('Calendar', $result->get_property_name());
		$this->assertInstanceOf('AweBooking\Support\Collection', $result->get_events());
		$this->assertTrue($result->is_empty());
	}

	public function testAddEvents() {
		$result = new Reader_Result( '-//Calendar//AweBooking 2.0//EN', 'ical' );
		$this->assertCount(0, $result->get_events());
		$this->assertTrue($result->is_empty());

		$result->add_event(new Event('2017-10-10', '2017-10-11'));
		$result->add_event(new Event('2017-10-11', '2017-10-15'));

		$this->assertFalse($result->is_empty());
		$this->assertCount(2, $result->get_events());
	}
}
