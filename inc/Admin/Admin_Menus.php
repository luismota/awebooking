<?php
namespace AweBooking\Admin;

use AweBooking\Constants;

class Admin_Menus {
	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', [ $this, 'admin_menu' ], 9 );
		add_action( 'admin_menu', [ $this, 'settings_menu' ], 50 );

		add_action( 'admin_head', [ $this, 'cleanup_submenu' ] );

		add_filter( 'custom_menu_order', '__return_true' );
		add_filter( 'menu_order', [ $this, 'menu_order' ] );
	}

	/**
	 * Add menu items.
	 *
	 * @access private
	 */
	public function admin_menu() {
		global $menu;

		// @codingStandardsIgnoreLine
		$menu[] = [ '', 'read', 'separator-awebooking', '', 'wp-menu-separator awebooking' ];

		add_menu_page( esc_html__( 'AweBooking', 'awebooking' ), esc_html__( 'AweBooking', 'awebooking' ), 'manage_awebooking', Constants::MENU_PAGE_BOOKING, null, null, 53 );
	}

	/**
	 * Add the "setting" menu item.
	 *
	 * @access private
	 */
	public function settings_menu() {
		add_submenu_page( 'awebooking', esc_html__( 'AweBooking Settings', 'awebooking' ), esc_html__( 'Settings', 'awebooking' ), 'manage_awebooking', 'awebooking-settings', '__return_null' );
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
}
