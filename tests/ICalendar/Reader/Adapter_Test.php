<?php

use AweBooking\ICalendar\Reader\Adapter\File_Adapter;
use AweBooking\ICalendar\Reader\Adapter\Remote_Adapter;
use AweBooking\ICalendar\Reader\Adapter\Stream_Adapter;
use AweBooking\ICalendar\Reader\Adapter\Contents_Adapter;
use AweBooking\ICalendar\Reader\Adapter\Adapter_Interface;

class Icalendar_Reader_Adapter_Test extends WP_UnitTestCase {
	public function setUp() {
		WP_Mock::setUp();
	}

	public function tearDown() {
		WP_Mock::tearDown();
	}

	public function testInstanceOf() {
		$this->assertInstanceOf( Adapter_Interface::class, new File_Adapter );
		$this->assertInstanceOf( Adapter_Interface::class, new Remote_Adapter );
		$this->assertInstanceOf( Adapter_Interface::class, new Stream_Adapter );
		$this->assertInstanceOf( Adapter_Interface::class, new Contents_Adapter );
	}

	public function testContentsAdapter() {
		$adapter = new Contents_Adapter;
		$this->assertEquals( 'Dummy contents', $adapter->get( 'Dummy contents' ) );
	}

	public function testFileAdapterShouldWork() {
		$adapter = new File_Adapter;
		$this->assertContains( 'Dummy contents', $adapter->get( __DIR__ . '/sample-ics/demo.ics' ) );
	}

	/**
	 * @expectedException InvalidArgumentException
	 */
	public function testFileAdapterShouldNotWork() {
		$adapter = new File_Adapter;
		$adapter->get( 'dummy-file.ics' );
	}

	public function testStreamAdapterShouldWork() {
		$adapter = new Stream_Adapter;
		$this->assertInternalType( 'resource', $adapter->get( __DIR__ . '/sample-ics/demo.ics' ) );
	}

	public function testRemoteAdapterShouldWork() {
		$adapter = new Remote_Adapter;
		$this->assertContains( 'Example Domain', $adapter->get( 'http://example.com' ) );
	}

	/**
	 * @expectedException RuntimeException
	 */
	public function testRemoteAdapterShouldNotWork() {
		$adapter = new Remote_Adapter;
		$adapter->get( 'http://notfound.aaaa/abc.ics' );
	}
}
