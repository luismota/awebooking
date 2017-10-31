<?php
namespace AweBooking\Cart;

use AweBooking\Support\Service_Provider;

class Cart_Service_Provider extends Service_Provider {
	/**
	 * Registers services on the AweBooking.
	 */
	public function register() {
		$this->awebooking->singleton( 'cart', Cart::class );
	}
}
