<?php
namespace AweBooking\Providers;

use Awethemes\Http\Request;
use Awethemes\WP_Session\WP_Session;
use AweBooking\Support\Service_Provider;
use AweBooking\Http\Kernel;
use Psr\Log\LoggerInterface;

class Route_Service_Provider extends Service_Provider {
	/**
	 * Registers services on the AweBooking.
	 */
	public function register() {
		$this->register_request_binding();

		$this->awebooking->singleton( Kernel::class );
	}

	/**
	 * Init service provider.
	 *
	 * @param AweBooking $awebooking AweBooking instance.
	 */
	public function init( $awebooking ) {
		add_action( 'parse_request', [ $this, 'dispatch' ], 0 );
		add_action( 'awebooking/register_routes', [ $this, 'register_routes' ] );

		add_action( 'admin_init', [ $this, 'admin_dispatch' ], 0 );
		add_action( 'awebooking/register_admin_routes', [ $this, 'register_admin_routes' ] );
	}

	/**
	 * Register the request binding.
	 *
	 * @return void
	 */
	protected function register_request_binding() {
		$this->awebooking->singleton( Request::class, function( $awebooking ) {
			$request = Request::capture();

			$request->set_wp_session( $awebooking->make( 'session' )->get_store() );

			return $request;
		});

		$this->awebooking->alias( Request::class, 'request' );
	}

	/**
	 * Register the routes.
	 *
	 * @param \FastRoute\RouteCollector $route The route collector.
	 * @return void
	 */
	public function register_routes( $route ) {
		require trailingslashit( __DIR__ ) . '/../Http/routes.php';
	}

	/**
	 * Register the admin routes.
	 *
	 * @param \FastRoute\RouteCollector $route The route collector.
	 * @return void
	 */
	public function register_admin_routes( $route ) {
		require trailingslashit( __DIR__ ) . '/../Admin/routes.php';
	}

	/**
	 * Dispatch the incoming request (on front-end).
	 *
	 * @access private
	 */
	public function dispatch() {
		global $wp;

		if ( empty( $wp->query_vars['awebooking_route'] ) ) {
			return;
		}

		// Handle the awebooking_route endpoint requests.
		awebooking()->make( Kernel::class )
			->use_request_uri( $wp->query_vars['awebooking_route'] )
			->handle( $this->awebooking->make( Request::class ) );
	}

	/**
	 * Dispatch the incoming request (on admin).
	 *
	 * @access private
	 */
	public function admin_dispatch() {
		if ( empty( $_REQUEST['awebooking'] ) ) {
			return;
		}

		awebooking()->make( Kernel::class )
			->use_request_uri( $_REQUEST['awebooking'] )
			->handle( $this->awebooking->make( Request::class ) );
	}
}
