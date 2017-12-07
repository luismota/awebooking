<?php
namespace AweBooking\Reservation\Pricing;

use AweBooking\Calendar\Period\Day;

class Day_Pricing {
	protected $day;
	protected $amount;

	public function __construct( Day $day, $amount ) {
		$this->day = $day;
		$this->amount = $amount;
	}
}
