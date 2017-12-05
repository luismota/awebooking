<?php
namespace AweBooking\Providers;

use AweBooking\Calendar\Store;
use AweBooking\Money\Currency;
use AweBooking\Money\Currencies;
use AweBooking\Support\Service_Provider;

class Core_Service_Provider extends Service_Provider {
	/**
	 * Registers services on the AweBooking.
	 */
	public function register() {
		$this->awebooking->singleton( 'currencies', Currencies::class );

		$this->awebooking->singleton( 'currency', function( $a ) {
			return new Currency( $a['setting']->get( 'currency' ) );
		});

		if ( $this->awebooking->is_request( 'frontend' ) ) {
			$this->awebooking->singleton( 'cart', Cart::class );
		}
	}
}
