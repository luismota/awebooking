<?php
namespace AweBooking\Http;

use AweBooking\AweBooking;
use Awethemes\Http\Request;
use Awethemes\Http\Kernel as Base_Kernel;
use Awethemes\Http\Resolver\Container_Resolver;
use Psr\Log\LoggerInterface;

class Kernel extends Base_Kernel {
	/**
	 * The AweBooking instance.
	 *
	 * @var AweBooking
	 */
	protected $awebooking;

	/**
	 * The application's middleware stack.
	 *
	 * @var array
	 */
	protected $middleware = [];

	/**
	 * Create a new HTTP kernel instance.
	 *
	 * @param AweBooking $awebooking The AweBooking instance.
	 */
	public function __construct( AweBooking $awebooking ) {
		$this->awebooking = $awebooking;

		$this->set_resolver( new Container_Resolver( $awebooking ) );

		$this->set_logger( $awebooking->make( LoggerInterface::class ) );
	}

	/**
	 * Register the request routes.
	 *
	 * @param  \FastRoute\RouteCollector $route The route collector.
	 * @return void
	 */
	protected function register_routes( $route ) {
		/**
		 * Register the request routes.
		 *
		 * Use FastRoute syntax to register the route,
		 *      $route->get('/get-route', 'get_handler');
		 *      $route->post('/post-route', 'post_handler');
		 *      $route->addRoute('GET', '/do-something', 'function_handler');
		 *
		 * @see https://github.com/nikic/FastRoute#usage
		 *
		 * @param \FastRoute\RouteCollector $route The route collector.
		 */
		do_action( 'awebooking/register_routes', $route );
	}

	/**
	 * Get the exception messages.
	 *
	 * @param  \Exception|\Throwable $e       The Exception.
	 * @param  integer               $status  The response status code.
	 * @return string
	 */
	protected function get_exception_message( $e, $status ) {
		switch ( $status ) {
			case 404:
				return esc_html__( 'Sorry, the page you are looking for could not be found.', 'awebooking' );
			default:
				return esc_html__( 'Whoops, looks like something went wrong.', 'awebooking' );
		}
	}
}
