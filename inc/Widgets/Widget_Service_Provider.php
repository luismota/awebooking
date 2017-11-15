<?php
namespace AweBooking\Widgets;

use AweBooking\Support\Service_Provider;

class Widget_Service_Provider extends Service_Provider {
	/**
	 * Registers services on the given container.
	 */
	public function register() {
		add_action( 'widgets_init', function() {
			register_widget( Check_Availability_Widget::class );
			register_widget( Booking_Cart_Widget::class );
		});
	}
}
