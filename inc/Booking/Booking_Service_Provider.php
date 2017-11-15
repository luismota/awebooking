<?php
namespace AweBooking\Booking;

use AweBooking\Support\Service_Provider;

class Booking_Service_Provider extends Service_Provider {
	/**
	 * Registers services on the AweBooking.
	 */
	public function register() {
		$this->awebooking->singleton( 'store.booking', function() {
			return new Store( 'awebooking_booking', 'room_id' );
		});

		$this->awebooking->singleton( 'store.availability', function() {
			return new Store( 'awebooking_availability', 'room_id' );
		});

		$this->awebooking->singleton( 'store.pricing', function() {
			return new Store( 'awebooking_pricing', 'rate_id' );
		});
	}
}
