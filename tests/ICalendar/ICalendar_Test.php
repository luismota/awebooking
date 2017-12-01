<?php

use AweBooking\ICalendar\ICalendar;

class ICalendar_Test extends WP_UnitTestCase {
	public function testRead() {
		// $result = ICalendar::read( __DIR__ . '/Reader/sample-ics/google-calendar.ics' );
		// $this->assertInstanceOf('AweBooking\ICalendar\Reader\Reader_Result', $result);

		// $result = ICalendar::read( fopen( __DIR__ . '/Reader/sample-ics/google-calendar.ics', 'r' ) );
		// $this->assertInstanceOf('AweBooking\ICalendar\Reader\Reader_Result', $result);

		// $result = ICalendar::read( file_get_contents( __DIR__ . '/Reader/sample-ics/google-calendar.ics' ) );
		// $this->assertInstanceOf('AweBooking\ICalendar\Reader\Reader_Result', $result);

		// TODO: Test with URL.
	}
}
