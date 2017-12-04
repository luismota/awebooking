<?php
namespace AweBooking;

use Awethemes\Http\Request;

class Url_Generator {
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

	public function __construct( Request $request ) {
		$this->request = $request;
	}

	/**
	 * Get the plugin url.
	 *
	 * @return string
	 */
	public function plugin_url() {
		return untrailingslashit( plugins_url( '/', WC_PLUGIN_FILE ) );
	}

	public function get_booking_url() {
		return awebooking_get_page_permalink( 'booking' );
	}

	/**
	 * Retrieves the URL prefix for any API resource.
	 *
	 * @return string
	 */
	public function get_url_prefix() {
		$this->prefix;
	}

	/**
	 * Get the current URL for the request.
	 *
	 * @return string
	 */
	public function current() {
		return $this->to($this->request->getPathInfo());
	}

	/**
	 * Return the WC API URL for a given request.
	 *
	 * @param string    $request Requested endpoint.
	 * @param bool|null $ssl     If should use SSL, null if should auto detect. Default: null.
	 * @return string
	 */
	public function api_request_url( $request, $ssl = null ) {
		if ( is_null( $ssl ) ) {
			$scheme = parse_url( home_url(), PHP_URL_SCHEME );
		} elseif ( $ssl ) {
			$scheme = 'https';
		} else {
			$scheme = 'http';
		}

		if ( strstr( get_option( 'permalink_structure' ), '/index.php/' ) ) {
			$api_request_url = trailingslashit( home_url( '/index.php/wc-api/' . $request, $scheme ) );
		} elseif ( get_option( 'permalink_structure' ) ) {
			$api_request_url = trailingslashit( home_url( '/wc-api/' . $request, $scheme ) );
		} else {
			$api_request_url = add_query_arg( 'wc-api', $request, trailingslashit( home_url( '', $scheme ) ) );
		}

		return esc_url_raw( apply_filters( 'woocommerce_api_request_url', $api_request_url, $request, $ssl ) );
	}

	/**
	 * Retrieves the URL to a REST endpoint on a site.
	 *
	 * @param int    $blog_id Optional. Blog ID. Default of null returns URL for current blog.
	 * @param string $path    Optional. REST route. Default '/'.
	 * @param string $scheme  Optional. Sanitization scheme. Default 'rest'.
	 * @return string Full URL to the endpoint.
	 */
	public function get_route_url( $blog_id = null, $path = '/', $scheme = 'rest' ) {
		if ( empty( $path ) ) {
			$path = '/';
		}

		if ( is_multisite() && get_blog_option( $blog_id, 'permalink_structure' ) || get_option( 'permalink_structure' ) ) {
			global $wp_rewrite;

			if ( $wp_rewrite->using_index_permalinks() ) {
				$url = get_home_url( $blog_id, $wp_rewrite->index . '/' . $this->get_url_prefix(), $scheme );
			} else {
				$url = get_home_url( $blog_id, $this->get_url_prefix(), $scheme );
			}

			$url .= '/' . ltrim( $path, '/' );
		} else {
			$url = trailingslashit( get_home_url( $blog_id, '', $scheme ) );

			// Nginx only allows HTTP/1.0 methods when redirecting from / to /index.php
			// To work around this, we manually add index.php to the URL, avoiding the redirect.
			if ( 'index.php' !== substr( $url, 9 ) ) {
				$url .= 'index.php';
			}

			$path = '/' . ltrim( $path, '/' );

			$url = add_query_arg( 'rest_route', $path, $url );
		}

		if ( is_ssl() ) {
			// If the current host is the same as the REST URL host, force the REST URL scheme to HTTPS.
			if ( $_SERVER['SERVER_NAME'] === parse_url( get_home_url( $blog_id ), PHP_URL_HOST ) ) {
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
		 * @since 4.4.0
		 *
		 * @param string $url     REST URL.
		 * @param string $path    REST route.
		 * @param int    $blog_id Blog ID.
		 * @param string $scheme  Sanitization scheme.
		 */
		return apply_filters( 'rest_url', $url, $path, $blog_id, $scheme );
	}
}
