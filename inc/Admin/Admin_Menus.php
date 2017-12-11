<?php
namespace AweBooking\Admin;

use AweBooking\Constants;
use AweBooking\AweBooking;
use AweBooking\Admin\Pages\About_Page;
use AweBooking\Admin\Pages\Settings_Page;
use AweBooking\Admin\Pages\Availability_Management;

class Admin_Menus {
	/**
	 * The AweBooking instance.
	 *
	 * @var \AweBooking\AweBooking
	 */
	protected $awebooking;

	/**
	 * Constructor
	 *
	 * @param AweBooking $awebooking The AweBooking instance.
	 */
	public function __construct( AweBooking $awebooking ) {
		$this->awebooking = $awebooking;
	}

	/**
	 * Fire the hooks.
	 *
	 * @return void
	 */
	public function hooks() {
		add_action( 'admin_menu', [ $this, 'register_admin_menu' ], 9 );
		add_action( 'admin_menu', [ $this, 'register_managements_menu' ], 20 );
		add_action( 'admin_menu', [ $this, 'regsiter_settings_menu' ], 50 );
		add_action( 'admin_menu', [ $this, 'register_about_menu' ], 100 );

		add_filter( 'custom_menu_order', '__return_true' );
		add_filter( 'menu_order', [ $this, 'menu_order' ] );

		add_action( 'admin_head', [ $this, 'cleanup_submenu' ] );
	}

	/**
	 * Add menu items.
	 *
	 * @access private
	 */
	public function register_admin_menu() {
		global $menu;

		// @codingStandardsIgnoreLine
		$menu[] = [ '', 'read', 'separator-awebooking', '', 'wp-menu-separator awebooking' ];

		$icon_url = 'data:image/svg+xml;base64,' . base64_encode( '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 448 512"><path fill="white" d="M436 480h-20V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v456H12c-6.627 0-12 5.373-12 12v20h448v-20c0-6.627-5.373-12-12-12zM128 76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76zm0 96c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40zm52 148h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12zm76 160h-64v-84c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v84zm64-172c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40z"/></svg>' );
		add_menu_page( esc_html__( 'AweBooking', 'awebooking' ), esc_html__( 'AweBooking', 'awebooking' ), 'manage_awebooking', Constants::MENU_PAGE_BOOKING, null, $icon_url, 53 );
	}

	/**
	 * Add the "managements" menu items.
	 *
	 * @access private
	 */
	public function register_managements_menu() {
		add_submenu_page( 'awebooking', esc_html__( 'AweBooking Availability', 'awebooking' ), esc_html_x( 'Availability', 'dashboard menu', 'awebooking' ), 'manage_awebooking', 'awebooking-availability', $this->create_page_callback( Availability_Management::class ) );
	}

	/**
	 * Add the "setting" menu item.
	 *
	 * @access private
	 */
	public function regsiter_settings_menu() {
		add_submenu_page( 'awebooking', esc_html__( 'AweBooking Settings', 'awebooking' ), esc_html__( 'Settings', 'awebooking' ), 'manage_awebooking', 'awebooking-settings', $this->create_page_callback( Settings_Page::class ) );
	}

	/**
	 * Add the "about" menu item.
	 *
	 * @access private
	 */
	public function register_about_menu() {
		add_submenu_page( 'awebooking', esc_html__( 'AweBooking About', 'awebooking' ), esc_html__( 'About', 'awebooking' ), 'manage_awebooking', 'awebooking-about', $this->create_page_callback( About_Page::class ) );
	}

	/**
	 * Clean-up the submenu.
	 *
	 * @access private
	 */
	public function cleanup_submenu() {
		global $submenu;

		// Remove 'AweBooking' sub menu item.
		if ( isset( $submenu[ Constants::MENU_PAGE_BOOKING ] ) ) {
			unset( $submenu[ Constants::MENU_PAGE_BOOKING ][0] );
		}

		remove_submenu_page( 'edit.php?post_type=room_type', 'post-new.php?post_type=room_type' );
	}

	/**
	 * Reorder the WP menu items in admin.
	 *
	 * @param  array $menu_order The original menu_order.
	 * @return array
	 *
	 * @access private
	 */
	public function menu_order( $menu_order ) {
		$separator_index = array_search( 'separator-awebooking', $menu_order );
		$hotel_index     = array_search( Constants::MENU_PAGE_HOTEL, $menu_order );

		$new_menu = [];
		foreach ( $menu_order as $index => $item ) {
			if ( Constants::MENU_PAGE_BOOKING == $item ) {
				$new_menu[] = 'separator-awebooking';
				$new_menu[] = $item;
				$new_menu[] = Constants::MENU_PAGE_HOTEL;

				unset( $menu_order[ $hotel_index ] );
				unset( $menu_order[ $separator_index ] );
			} elseif ( ! in_array( $item, array( 'separator-awebooking' ) ) ) {
				$new_menu[] = $item;
			}
		}

		return $new_menu;
	}

	/**
	 * Create the page callback for "add_submenu_page" function.
	 *
	 * @param  string $page_class The page class to resolve.
	 * @return Closure
	 */
	protected function create_page_callback( $page_class ) {
		return function() use ( $page_class ) {
			$this->awebooking->call( $page_class, [], 'output' );
		};
	}
}
