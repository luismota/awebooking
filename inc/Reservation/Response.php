<?php
namespace AweBooking\Reservation;

use AweBooking\Calendar\Calendar;
use AweBooking\Calendar\Resource\Resource;
use AweBooking\Calendar\Provider\Pricing_Provider;
use AweBooking\Support\Decimal;
use Illuminate\Support\Arr;

class Response {
	protected $request;
	protected $asking;

	public function __construct( $request, $asking ) {
		$this->request = $request;
		$this->asking  = $asking;
	}

	public function get_pricing() {
		$stay = $this->request->get_stay();
		$room_type = $this->asking->get_room_type();

		$decimal  = Decimal::create( $room_type->get_base_price()->get_amount() );
		$resource = new Resource( $room_type->get_id(), $decimal->as_raw_value() );

		$provider = new Pricing_Provider( $resource );
		$itemized = $provider->get_events_itemized( $stay->get_check_in(), $stay->get_check_out()->subMinute() );

		$itemized = $itemized[ $resource->get_id() ];
		$pricing = [];

		foreach ( $stay->get_period() as $day ) {
			$date = $day->get_start_date();

			$index_by = $date->toDateString();
			$find_key = "{$date->year}.{$date->month}.d{$date->day}";

			$value = Decimal::from_raw_value(
				Arr::get( $itemized, $find_key, $decimal->as_raw_value() )
			)->as_numeric();

			$pricing[ $index_by ] = new Pricing\Day_Pricing( $day, $value );
		}

		dd( $pricing );
	}
}
