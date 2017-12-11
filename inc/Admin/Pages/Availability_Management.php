<?php
namespace AweBooking\Admin\Pages;

class Availability_Management {
	public function output() {
		$room_type = \AweBooking\Factory::get_room_type( 83 );
		$cal = new \AweBooking\Admin\Calendar\Availability_Calendar( $room_type );

		?><div class="wrap">
			<h1 class="wp-heading-inline">Availability Calendar</h1><hr class="wp-header-end">
			<?php $cal->display(); ?>
		</div><?php
	}
}
