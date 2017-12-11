<?php
namespace AweBooking\Reservation\Pricing;

use Decimal;
use AweBooking\Calendar\Period\Day;

class Day_Pricing {
	protected $day;

	public function __construct( Day $day, $amount ) {
		$this->day = $day;
		$this->amount = $amount;
	}
}
