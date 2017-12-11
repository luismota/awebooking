<?php
namespace AweBooking\Providers;

use AweBooking\Constants;
use AweBooking\Support\Flash_Message;
use AweBooking\Support\Service_Provider;

class Frontend_Service_Provider extends Service_Provider {
	/**
	 * Registers services on the AweBooking.
	 */
	public function register() {
		$this->awebooking->singleton( 'flash_message', function() {
			return new Flash_Message( $a['session'] );
		});
	}

	/**
	 * Init (boot) the service provider.
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'template_include', [ $this, 'overwrite_template' ] );
		add_filter( 'body_class', [ $this, 'modify_body_class' ] );
	}

	/**
	 * Overwrite awebooking template in some case.
	 *
	 * @param  string $template The template file-path.
	 * @return string
	 *
	 * @access private
	 */
	public function overwrite_template( $template ) {
		if ( is_embed() ) {
			return $template;
		}

		if ( $overwrite_template = $this->find_overwrite_template() ) {
			$template = awebooking_locate_template( $overwrite_template );
		}

		return $template;
	}

	/**
	 * Modify body classes in awebooking pages.
	 *
	 * @param  array $classes Body classes.
	 * @return array
	 *
	 * @access private
	 */
	public function modify_body_class( $classes ) {
		switch ( true ) {
			case is_awebooking():
				$classes[] = 'awebooking';
				$classes[] = 'awebooking-page';
				break;

			case is_room_type_archive():
				$classes[] = 'awebooking-room-type-archive';
				break;

			case is_room_type():
				$classes[] = 'awebooking-room-type';
				break;

			case is_check_availability_page():
				$classes[] = 'awebooking-check-availability-page';
				break;

			case is_booking_info_page():
				$classes[] = 'awebooking-booking-info-page';
				break;

			case is_booking_checkout_page():
				$classes[] = 'awebooking-checkout-page';
				break;
		}

		return $classes;
	}

	/**
	 * Find the overwrite template by guest current context.
	 *
	 * @return string
	 */
	protected function find_overwrite_template() {
		$template = '';

		switch ( true ) {
			case is_singular( Constants::ROOM_TYPE ):
				$template = 'single-room-type.php';
				break;

			case is_post_type_archive( Constants::ROOM_TYPE ):
				$template = 'archive-room-type.php';
				break;
		}

		return $template;
	}
}
