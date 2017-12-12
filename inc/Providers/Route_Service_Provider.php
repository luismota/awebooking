<?php
namespace AweBooking\Providers;

use Awethemes\Http\Request;
use AweBooking\Http\Kernel;
use AweBooking\Http\Routing\Redirector;
use AweBooking\Http\Routing\Url_Generator;
use AweBooking\Http\Routing\Binding_Resolver;
use AweBooking\Http\Exceptions\Nonce_Mismatch_Exception;
use AweBooking\Http\Exceptions\Validation_Failed_Exception;
use AweBooking\Support\Service_Provider;
use Skeleton\Support\Validator;

class Route_Service_Provider extends Service_Provider {
	/**
	 * Registers services on the AweBooking.
	 */
	public function register() {
		$this->register_request();

		$this->register_redirector();

		$this->register_url_generator();

		$this->register_kernel();
	}

	/**
	 * Register the request binding.
	 *
	 * @return void
	 */
	protected function register_request() {
		Request::macro( 'verify_nonce', function( $nonce_field, $action ) {
			if ( ! wp_verify_nonce( $this->get( $nonce_field ), $action ) ) {
				throw new Nonce_Mismatch_Exception( esc_html__( 'Sorry, your nonce did not verify.', 'awebooking' ) );
			}

			return $this;
		});

		Request::macro( 'validate', function( array $rules, array $labels = [] ) {
			$validator = new Validator( $this->all(), $rules );
			$validator->labels( $labels );

			if ( $validator->fails() ) {
				throw new Validation_Failed_Exception( 'The given data failed to pass validation.' );
			}

			return $this->only( array_keys( $rules ) );
		});

		$this->awebooking->bind( 'request', function( $a ) {
			$request = Request::capture();

			$request->set_wp_session( $a['session']->get_store() );

			return $request;
		});

		$this->awebooking->alias( 'request', Request::class );
	}

	/**
	 * Register the Redirector binding.
	 *
	 * @return void
	 */
	protected function register_redirector() {
		$this->awebooking->singleton( 'redirector', function ( $a ) {
			$redirector = new Redirector( $a['url'] );

			$redirector->set_wp_session( $a['session']->get_store() );

			return $redirector;
		});

		$this->awebooking->alias( 'redirector', Redirector::class );
	}

	/**
	 * Register the Url_Generator binding.
	 *
	 * @return void
	 */
	protected function register_url_generator() {
		$this->awebooking->singleton( 'url', function( $a ) {
			return new Url_Generator( $a );
		});

		$this->awebooking->alias( 'url', Url_Generator::class );
	}

	/**
	 * Register the Kernel binding.
	 *
	 * @return void
	 */
	protected function register_kernel() {
		$this->awebooking->bind( 'kernel', function( $a ) {
			return new Kernel( $a );
		});

		$this->awebooking->singleton( 'route_binder', function( $a ) {
			return new Binding_Resolver( $a );
		});
	}

	/**
	 * Init service provider.
	 *
	 * @param AweBooking $awebooking AweBooking instance.
	 */
	public function init( $awebooking ) {
		$this->setup_router_binding();

		add_action( 'parse_request', [ $this, 'dispatch' ], 0 );
		add_action( 'awebooking/register_routes', [ $this, 'register_routes' ] );

		add_action( 'admin_init', [ $this, 'admin_dispatch' ], 0 );
		add_action( 'awebooking/register_admin_routes', [ $this, 'register_admin_routes' ] );
	}

	/**
	 * Setup router binding.
	 *
	 * @return void
	 */
	protected function setup_router_binding() {
		$router_binding = $this->awebooking->make( 'route_binder' );

		$models = apply_filters( 'awebooking/route_models_binding', [
			'rate'      => \AweBooking\Model\Rate::class,
			'room'      => \AweBooking\Model\Room::class,
			'room_type' => \AweBooking\Model\Room_Type::class,
			'amenity'   => \AweBooking\Model\Amenity::class,
			'service'   => \AweBooking\Model\Service::class,
			'booking'   => \AweBooking\Model\Booking::class,
		]);

		foreach ( $models as $key => $model ) {
			$router_binding->model( $key, $model );
		}
	}

	/**
	 * Register the routes.
	 *
	 * @param \FastRoute\RouteCollector $route The route collector.
	 * @access private
	 */
	public function register_routes( $route ) {
		require trailingslashit( __DIR__ ) . '/../Http/routes.php';
	}

	/**
	 * Register the admin routes.
	 *
	 * @param \FastRoute\RouteCollector $route The route collector.
	 * @access private
	 */
	public function register_admin_routes( $route ) {
		require trailingslashit( __DIR__ ) . '/../Admin/admin-routes.php';
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
		$this->awebooking->make( 'kernel' )
			->use_request_uri( $wp->query_vars['awebooking_route'] )
			->handle( $this->awebooking->make( 'request' ) );
	}

	/**
	 * Dispatch the incoming request (on admin).
	 *
	 * @access private
	 */
	public function admin_dispatch() {
		if ( defined( 'DOING_AJAX' ) || empty( $_REQUEST['awebooking'] ) ) {
			return;
		}

		// Set the headers to prevent caching for the different browsers.
		send_nosniff_header();
		nocache_headers();

		$this->awebooking->make( 'kernel' )
			->use_request_uri( $_REQUEST['awebooking'] )
			->handle( $this->awebooking->make( 'request' ) );
	}
}
