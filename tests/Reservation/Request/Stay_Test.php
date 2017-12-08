<?php

use AweBooking\Reservation\Request\Stay;
use AweBooking\Reservation\Request\Request_Node;

class Reservation_Request_Stay_Test extends WP_UnitTestCase {
	public function setUp() {
		parent::setUp();
	}

	public function testConstructor() {
		$party = new Stay( '2017-10-10', new DateTime( '2017-10-11' ) );
		$this->assertInstanceOf(Request_Node::class, $party);
	}

	public function test_nights() {
		$party = new Stay( '2017-10-10', new DateTime( '2017-10-20' ) );
		$this->assertEquals($party->nights(), 10);
	}
}
