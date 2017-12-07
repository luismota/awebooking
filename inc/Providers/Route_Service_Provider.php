<?php
namespace AweBooking\Providers;

use Awethemes\Http\Request;
use AweBooking\Http\Kernel;
use AweBooking\Http\Routing\Redirector;
use AweBooking\Http\Routing\Url_Generator;
use AweBooking\Http\Routing\Binding_Resolver;
use AweBooking\Support\Service_Provider;
use Awethemes\WP_Session\WP_Session;
use Psr\Log\LoggerInterface;
use Skeleton\Support\Validator;
use AweBooking\Http\Exceptions\Validation_Failed_Exception;

class Route_Service_Provider extends Service_Provider {
	/**
	 * Registers services on the AweBooking.
	 */
	public function register() {
		$this->register_request();

		$this->awebooking->singleton( 'url', Url_Generator::class );
		$this->awebooking->singleton( 'route_binder', Binding_Resolver::class );
		$this->awebooking->singleton( 'kernel', Kernel::class );

		$this->register_redirector();
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
		$router = $this->awebooking->make( Binding_Resolver::class );

		$models = apply_filters( 'awebooking/route_models_binding', [
			'rate'      => \AweBooking\Model\Rate::class,
			'room'      => \AweBooking\Model\Room::class,
			'room_type' => \AweBooking\Model\Room_Type::class,
			'amenity'   => \AweBooking\Model\Amenity::class,
			'service'   => \AweBooking\Model\Service::class,
			'booking'   => \AweBooking\Model\Booking\Booking::class,
		]);

		foreach ( $models as $key => $model ) {
			$router->model( $key, $model );
		}
	}

	/**
	 * Register the request binding.
	 *
	 * @return void
	 */
	protected function register_request() {
		Request::macro( 'validate', function( array $rules, array $labels = [] ) {
			$validator = new Validator( $this->all(), $rules );
			$validator->labels( $labels );

			if ( $validator->fails() ) {
				throw new Validation_Failed_Exception( 'The given data failed to pass validation.' );
			}

			return $this->only( array_keys( $rules ) );
		});

		$this->awebooking->singleton( 'request', function( $a ) {
			$request = Request::capture();

			$request->set_wp_session( $a['session']->get_store() );

			return $request;
		});

		$this->awebooking->alias( 'request', Request::class );
	}

	/**
	 * Register the Redirector service.
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
