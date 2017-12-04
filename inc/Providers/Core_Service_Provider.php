<?php
namespace AweBooking\Providers;

use AweBooking\Calendar\Store;
use AweBooking\Support\Service_Provider;

class Core_Service_Provider extends Service_Provider {
	/**
	 * Registers services on the AweBooking.
	 */
	public function register() {
		if ( $this->awebooking->is_request( 'frontend' ) ) {
			$this->awebooking->singleton( 'cart', Cart::class );
		}
	}
}
