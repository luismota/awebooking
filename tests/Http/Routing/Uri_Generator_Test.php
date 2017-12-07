<?php

use AweBooking\AweBooking;
use Awethemes\Http\Request;
use AweBooking\Http\Routing\Url_Generator;

class Http_Routing_Uri_Generator_Test extends WP_UnitTestCase {
	public function setUp() {
		parent::setUp();
	}

	public function tearDown() {
		parent::tearDown();
		$this->set_permalink_structure( '' );
	}

	public function testCurrentUrl() {
		$url = $this->create_url_generator( Request::create('http://awebooking.com/wp-admin', 'GET' ) );
		$this->assertEquals( 'http://awebooking.com/wp-admin', $url->current() );
		$this->assertEquals( 'http://awebooking.com/wp-admin', $url->full() );

		$url = $this->create_url_generator( Request::create('http://example.com/sub/?a=a12', 'GET' ) );
		$this->assertEquals( 'http://example.com/sub', $url->current() );
		$this->assertEquals( 'http://example.com/sub?a=a12', $url->full() );
	}

	public function testBasicRouteUrl() {
		$url = $this->create_url_generator( Request::create(WP_TESTS_DOMAIN, 'GET' ) );

		$this->set_permalink_structure( '/%year%/%monthnum%/%day%/%postname%/' );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/awebooking-route/', $url->site_route() );

		$this->set_permalink_structure( '/index.php/%year%/%monthnum%/%day%/%postname%/' );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/index.php/awebooking-route/', $url->site_route() );

		$this->set_permalink_structure( '' );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/index.php?awebooking_route=/', $url->site_route() );
	}

	public function testRouteUrlWithSlash() {
		$url = $this->create_url_generator( Request::create(WP_TESTS_DOMAIN, 'GET' ) );

		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/index.php?awebooking_route=/', $url->site_route( '' ) );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/index.php?awebooking_route=/admin/123', $url->site_route( 'admin/123' ) );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/index.php?awebooking_route=/admin/123', $url->site_route( '/admin/123' ) );
	}

	public function testRouterUrlWithScheme() {
		$url = $this->create_url_generator( Request::create(WP_TESTS_DOMAIN, 'GET' ) );
		$this->assertSame( 'http', parse_url( $url->site_route('/', 'http' ), PHP_URL_SCHEME ) );
		$this->assertSame( 'https', parse_url( $url->site_route('/', 'https' ), PHP_URL_SCHEME ) );
	}

	public function testAdminUrl() {
		// Just for test.
		$this->set_permalink_structure( '/%year%/%monthnum%/%day%/%postname%/' );

		$url = $this->create_url_generator( Request::create(WP_TESTS_DOMAIN, 'GET' ) );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/wp-admin/admin.php?awebooking=/', $url->admin_route() );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/wp-admin/admin.php?awebooking=/', $url->admin_route( '' ) );

		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/wp-admin/admin.php?awebooking=/abc/123', $url->admin_route( '/abc/123' ) );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/wp-admin/admin.php?awebooking=/abc/123', $url->admin_route( 'abc/123' ) );
	}

	public function testGetPagesUrlWithPermalink() {
		$this->set_permalink_structure( '/%year%/%monthnum%/%day%/%postname%/' );
		$url = $this->create_url_generator( Request::create(WP_TESTS_DOMAIN, 'GET' ) );

		$page_booking = $this->create_awebooking_page( 'booking', 'booking-page' );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/booking-page/', $url->booking_page() );

		$page_avai = $this->create_awebooking_page( 'check_availability', 'avai-page' );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/avai-page/', $url->availability_page() );

		$page_checkout = $this->create_awebooking_page( 'checkout', 'cehckout-page' );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/cehckout-page/', $url->checkout_page() );
	}

	public function testGetPagesUrlWithNonPermalink() {
		$this->set_permalink_structure( '' );
		$url = $this->create_url_generator( Request::create(WP_TESTS_DOMAIN, 'GET' ) );

		$page_booking = $this->create_awebooking_page( 'booking', 'booking-page' );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/?page_id=' .  $page_booking, $url->booking_page() );

		$page_avai = $this->create_awebooking_page( 'check_availability', 'avai-page' );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/?page_id=' .  $page_avai, $url->availability_page() );

		$page_checkout = $this->create_awebooking_page( 'checkout', 'cehckout-page' );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/?page_id=' .  $page_checkout, $url->checkout_page() );
	}

	protected function create_url_generator( $request ) {
		$awebooking = AweBooking::get_instance();

		$awebooking->instance('request', $request );

		return new Url_Generator( $awebooking );
	}

	protected function create_awebooking_page( $page, $slug ) {
		$awebooking = AweBooking::get_instance();

		$page_id = $this->factory->post->create([
			'post_type'  => 'page',
			'post_title' => $page,
			'post_name'  => $slug,
		]);

		$awebooking['setting']->set( 'page_' . $page, $page_id );

		return $page_id;
	}
}
