<?php
namespace AweBooking\Admin;

use Skeleton\Menu_Page;
use AweBooking\Installer;
use AweBooking\AweBooking;
use AweBooking\Support\Service_Hooks;

class Admin_Hooks extends Service_Hooks {
	/**
	 * Determine run init action only in admin.
	 *
	 * @var bool
	 */
	public $in_admin = true;

	/**
	 * Registers services on the given container.
	 *
	 * This method should only be used to configure services and parameters.
	 *
	 * @param Container $container Container instance.
	 */
	public function register( $container ) {
		$container->singleton( 'admin_notices', Admin_Notices::class );

		$container->singleton( 'admin_menu', function() {
			return new Admin_Menu;
		});
	}

	/**
	 * Init service provider.
	 *
	 * This method will be run after container booted.
	 *
	 * @param Skeleton $awebooking AweBooking Container instance.
	 */
	public function init( $awebooking ) {
		$awebooking['admin_menu']->init();

		new Admin_Ajax;
		new Action_Handler;

		new Admin_Settings;
		new Pages\Permalink_Settings;
		new Pages\Admin_Email_Preview;
		new Pages\Admin_Setup_Wizard;

		new List_Tables\Booking_List_Table;
		new List_Tables\Room_Type_List_Table;
		new List_Tables\Service_List_Table;

		new Metaboxes\Booking_Metabox;
		new Metaboxes\Service_Metabox;
		new Metaboxes\Room_Type_Metabox;
		new Metaboxes\Amenity_Metabox;

		add_action( 'admin_notices', [ $awebooking['admin_notices'], 'display' ] );
	}
}
