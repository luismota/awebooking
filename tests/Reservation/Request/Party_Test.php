<?php

use AweBooking\Reservation\Request\Party;
use AweBooking\Reservation\Request\Request_Node;

class Reservation_Request_Party_Test extends WP_UnitTestCase {
	public function setUp() {
		parent::setUp();
	}

	public function testConstructor() {
		$party = new Party( 10 );
		$this->assertInstanceOf(Request_Node::class, $party);

		$this->assertEquals(10, $party->get_adults());
		$this->assertEquals(0, $party->get_children());
		$this->assertEquals(0, $party->get_infants());
	}

	public function testSet() {
		$party = new Party( 10, 1, 2 );

		$this->assertEquals(10, $party->get_adults());
		$this->assertEquals(1, $party->get_children());
		$this->assertEquals(2, $party->get_infants());

		$party->set_adults( 100 );
		$party->set_children( 200 );
		$party->set_infants( 300 );

		$this->assertEquals(100, $party->get_adults());
		$this->assertEquals(200, $party->get_children());
		$this->assertEquals(300, $party->get_infants());
	}

	public function testToString() {
		$party1 = new Party( 1 );
		$party2 = new Party( 10, 1 );
		$party3 = new Party( 10, 2, 3 );

		$this->assertEquals('<span class="awebooking_party__adults">1 adult</span>', $party1->as_string());
		$this->assertEquals('<span class="awebooking_party__adults">1 adult</span>', (string) $party1);

		$this->assertEquals('<span class="awebooking_party__adults">10 adults</span> , <span class="awebooking_party__children">1 child</span>', $party2->as_string());
		$this->assertEquals('<span class="awebooking_party__adults">10 adults</span> , <span class="awebooking_party__children">2 children</span> &amp; <span class="awebooking_party__infants">3 infants</span>', $party3->as_string());
	}

	/**
	 * @dataProvider getFailedData
	 */
	public function testException( $adults, $children, $infants ) {
		$this->expectException(LogicException::class);
		new Party( $adults, $children, $infants );
	}

	public function getFailedData() {
		return [
			[ 0, 1, 1 ],
			[ -1, 0, 0 ],
			[ 1, -1, -1 ],
			[ 1, 1, -1 ],
		];
	}
}
