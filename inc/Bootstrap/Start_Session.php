<?php
namespace AweBooking\Bootstrap;

use AweBooking\AweBooking;
use AweBooking\Support\Flash_Message;
use Awethemes\WP_Session\WP_Session;

class Start_Session {
	/**
	 * The AweBooking instance.
	 *
	 * @var \AweBooking\AweBooking
	 */
	protected $awebooking;

	/**
	 * Start session bootstrapper.
	 *
	 * @param AweBooking $awebooking The AweBooking instance.
	 */
	public function __construct( AweBooking $awebooking ) {
		$this->awebooking = $awebooking;
	}

	/**
	 * Bootstrap the AweBooking.
	 *
	 * @return void
	 */
	public function bootstrap() {
		if ( $this->awebooking->is_request( 'frontend' ) ) {
			$this->register_session_bindings();

			$this->register_flash_bindings();

			$this->start_session();
		}
	}

	/**
	 * Start the session.
	 *
	 * @return void
	 */
	protected function start_session() {
		// Start the session.
		$this->awebooking->make( WP_Session::class )->hooks();

		if ( did_action( 'plugins_loaded' ) ) {
			$this->awebooking['session']->start_session();
		}
	}

	/**
	 * Register the wp-session binding.
	 *
	 * @return void
	 */
	protected function register_session_bindings() {
		// Binding the session manager.
		$this->awebooking->singleton( 'session', function() {
			return new WP_Session( 'awebooking_session', [ 'lifetime' => 120 ] );
		});

		$this->awebooking->alias( 'session', WP_Session::class );
	}

	/**
	 * Register the flash message bindings.
	 *
	 * @return void
	 */
	protected function register_flash_bindings() {
		$this->awebooking->singleton( 'flash_message', Flash_Message::class );
	}
}
