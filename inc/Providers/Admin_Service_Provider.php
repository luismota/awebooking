<?php
namespace AweBooking\Providers;

use AweBooking\Factory;
use AweBooking\Constants;
use AweBooking\Support\Service_Provider;

class Admin_Service_Provider extends Service_Provider {
	/**
	 * The core metaboxes classes.
	 *
	 * @var array
	 */
	protected $metaboxes = [
		\AweBooking\Admin\Metaboxes\Room_Type_Metabox::class,
		\AweBooking\Admin\Metaboxes\Booking_Metabox::class,
		\AweBooking\Admin\Metaboxes\Service_Metabox::class,
		\AweBooking\Admin\Metaboxes\Amenity_Metabox::class,
	];

	/**
	 * The core List_Tables classes.
	 *
	 * @var array
	 */
	protected $list_tables = [
		\AweBooking\Admin\List_Tables\Booking_List_Table::class,
		\AweBooking\Admin\List_Tables\Room_Type_List_Table::class,
		\AweBooking\Admin\List_Tables\Service_List_Table::class,
	];

	/**
	 * Registers services on the AweBooking.
	 */
	public function register() {
		if ( ! is_admin() ) {
			return;
		}
	}

	/**
	 * Init (boot) the service provider.
	 *
	 * @return void
	 */
	public function init() {
		if ( ! is_admin() ) {
			return;
		}

		// Wake-up the metaboxes.
		foreach ( $this->metaboxes as $class ) {
			$this->awebooking->make( $class );
		}

		foreach ( $this->list_tables as $class ) {
			$this->awebooking->make( $class );
		}

		add_action( 'admin_init', array( $this, 'handle_admin_init' ) );
		add_filter( 'display_post_states', array( $this, 'display_post_states' ), 10, 2 );

		add_action( 'admin_menu', function() {
			add_submenu_page(
				'edit.php?post_type=room_type',
				'custom menu',
				'custom menu',
				'manage_options',
				'awebooking',
				function() {
					$room_type = Factory::get_room_type( 83 );
					$cal = new \AweBooking\Admin\Calendar\Availability_Calendar( $room_type );
					$cal->display();
				}
			);
		});
	}

	/**
	 * Handle redirects to setup/welcome page after install and updates.
	 */
	public function handle_admin_init() {
		// Setup wizard redirect.
		if ( get_transient( '_awebooking_activation_redirect' ) ) {
			delete_transient( '_awebooking_activation_redirect' );

			// Prevent redirect on some case.
			if ( ( ! empty( $_GET['page'] ) && in_array( $_GET['page'], [ 'awebooking-setup' ] ) ) || is_network_admin() ) {
				return;
			}

			// If the user needs to install, send them to the setup wizard.
			wp_safe_redirect( admin_url( 'index.php?page=awebooking-setup' ) );
			exit;
		}
	}

	/**
	 * Add state for check availability page. TODO: Move to admin page.
	 *
	 * @param  array $post_states The post_states.
	 * @param  void  $post        The post object.
	 *
	 * @return array
	 */
	public function display_post_states( $post_states, $post ) {
		if ( intval( awebooking_option( 'page_check_availability' ) ) === $post->ID ) {
			$post_states['page_check_availability'] = esc_html_x( 'Check Availability', 'Page states', 'awebooking' );
		}

		if ( intval( awebooking_option( 'page_booking' ) ) === $post->ID ) {
			$post_states['page_booking'] = esc_html_x( 'Booking Confirmation', 'Page states', 'awebooking' );
		}

		if ( intval( awebooking_option( 'page_checkout' ) ) === $post->ID ) {
			$post_states['page_checkout'] = esc_html_x( 'Checkout', 'Page states', 'awebooking' );
		}

		return $post_states;
	}
}
