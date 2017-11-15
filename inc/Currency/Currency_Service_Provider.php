<?php
namespace AweBooking\Currency;

use AweBooking\Support\Service_Provider;

class Currency_Service_Provider extends Service_Provider {
	/**
	 * Registers services on the AweBooking.
	 */
	public function register() {
		$this->awebooking->singleton( 'currency_manager', Currency_Manager::class );

		$this->awebooking->singleton( 'currency', function ( $a ) {
			return new Currency( $a['setting']->get( 'currency' ) );
		});

		$this->awebooking->alias( 'currency', Currency::class );
	}
}
