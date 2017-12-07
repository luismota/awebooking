<?php
namespace AweBooking;

use AweBooking\AweBooking;
use Awethemes\Http\Request;

class Url_Generator {

	/**
	 * The admin settings instance.
	 *
	 * @var \AweBooking\AweBooking
	 */
	protected $awebooking;

	/**
	 * The request instance.
	 *
	 * @var \Awethemes\Http\Request
	 */
	protected $request;

	/**
	 * A cached copy of the URL root for the current request.
	 *
	 * @var string|null
	 */
	protected $cached_root;

	/**
	 * Constructor.
	 *
	 * @param AweBooking $awebooking awebooking
	 * @param Request    $request    request
	 */
	public function __construct( AweBooking $awebooking, Request $request ) {
		$this->request = $request;
		$this->awebooking = $awebooking;
	}

	/**
	 * Get the plugin url.
	 *
	 * @return string
	 */
	public function plugin_url() {
		return untrailingslashit( plugins_url( '/', __DIR__ ) );
	}

	/**
	 * Get check availability url.
	 *
	 * @return string
	 */
	public function get_check_availability_url() {
		return awebooking_get_page_permalink( 'check_availability' );
	}

	/**
	 * Get booking url.
	 *
	 * @return string
	 */
	public function get_booking_url() {
		return awebooking_get_page_permalink( 'booking' );
	}

	/**
	 * Get checkout url.
	 *
	 * @return string
	 */
	public function get_checkout_url() {
		return awebooking_get_page_permalink( 'checkout' );
	}

	/**
	 * Get the current URL for the request.
	 *
	 * @return string
	 */
	public function current() {
		return $this->to( $this->request->getPathInfo() );
	}

	/**
	 * Retrieves the URL to a REST endpoint on a site.
	 *
	 * @param string $path    Optional. REST route. Default '/'.
	 * @param string $scheme  Optional. Sanitization scheme. Default 'rest'.
	 * @return string Full URL to the endpoint.
	 */
	public function get_route_url( $path = '/', $scheme = 'rest' ) {
		if ( empty( $path ) ) {
			$path = '/';
		}

		if ( is_multisite() || get_option( 'permalink_structure' ) ) {
			global $wp_rewrite;

			if ( $wp_rewrite->using_index_permalinks() ) {
				$url = get_home_url( null, $wp_rewrite->index . '/' . $this->awebooking->endpoint_name(), $scheme );
			} else {
				$url = get_home_url( null, $this->awebooking->endpoint_name(), $scheme );
			}

			$url .= '/' . ltrim( $path, '/' );
		} else {
			$url = trailingslashit( get_home_url( null, '', $scheme ) );

			// Nginx only allows HTTP/1.0 methods when redirecting from / to /index.php
			// To work around this, we manually add index.php to the URL, avoiding the redirect.
			if ( 'index.php' !== substr( $url, 9 ) ) {
				$url .= 'index.php';
			}

			$path = '/' . ltrim( $path, '/' );

			$url = add_query_arg( 'awebooking_route', $path, $url );
		}

		if ( is_ssl() ) {
			// If the current host is the same as the REST URL host, force the REST URL scheme to HTTPS.
			if ( $_SERVER['SERVER_NAME'] === parse_url( get_home_url(), PHP_URL_HOST ) ) {
				$url = set_url_scheme( $url, 'https' );
			}
		}

		if ( is_admin() && force_ssl_admin() ) {
			// In this situation the home URL may be http:, and `is_ssl()` may be
			// false, but the admin is served over https: (one way or another), so
			// REST API usage will be blocked by browsers unless it is also served
			// over HTTPS.
			$url = set_url_scheme( $url, 'https' );
		}

		/**
		 * Filters the REST URL.
		 *
		 * Use this filter to adjust the url returned by the get_rest_url() function.
		 *
		 * @param string $url     REST URL.
		 * @param string $path    REST route.
		 */
		return apply_filters( 'awebooking/route_url', $url, $path, $scheme );
	}

	/**
	 * Retrieves the Admin URL to a REST endpoint on a site.
	 *
	 * @param string $path    Optional. REST route. Default '/'.
	 * @return string Full URL to the endpoint.
	 */
	public function get_admin_route_url( $path = '/' ) {
		if ( empty( $path ) ) {
			$path = '/';
		}

		$url = admin_url( 'admin.php' );

		if ( is_admin() && force_ssl_admin() ) {
			// In this situation the home URL may be http:, and `is_ssl()` may be
			// false, but the admin is served over https: (one way or another), so
			// REST API usage will be blocked by browsers unless it is also served
			// over HTTPS.
			$url = set_url_scheme( $url, 'https' );
		}

		$url = add_query_arg( 'awebooking', $path, $url );

		/**
		 * Filters the REST URL.
		 *
		 * Use this filter to adjust the url returned by the get_rest_url() function.
		 *
		 * @param string $url     REST URL.
		 * @param string $path    REST route.
		 */
		return apply_filters( 'awebooking/admin_route_url', $url, $path );
	}
}
