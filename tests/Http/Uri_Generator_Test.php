<?php

use AweBooking\AweBooking;
use Awethemes\Http\Request;
use AweBooking\Url_Generator;

class Uri_Generator_Test extends WP_UnitTestCase {

	/**
	 * Test room type
	 */
	public function test_uri() {
		$request = Request::create(
			'/', 'GET', [
				'name' => 'WP',
			]
		);

		$uri = new Url_Generator( awebooking(), $request );
		// var_dump($uri->plugin_url());
		// var_dump($uri->get_check_availability_url());
		// var_dump($uri->get_booking_url());
		// var_dump($uri->get_checkout_url());

		$this->assertEquals( 'http://example.org/index.php?awebooking_route=/save-settings', $uri->get_route_url( '/save-settings' ) );
		$this->assertEquals( 'http://example.org/wp-admin/admin.php?awebooking=/save-settings', $uri->get_admin_route_url( '/save-settings' ) );
	}
}
