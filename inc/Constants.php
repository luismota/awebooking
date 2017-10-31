<?php
namespace AweBooking;

class Constants {
	const DATE_FORMAT    = 'Y-m-d';
	const JS_DATE_FORMAT = 'yy-mm-dd';

	const BOOKING        = 'awebooking';
	const ROOM_TYPE      = 'room_type';
	const PRICING_RATE   = 'pricing_rate';
	const HOTEL_LOCATION = 'hotel_location';
	const HOTEL_AMENITY  = 'hotel_amenity';
	const HOTEL_SERVICE  = 'hotel_extra_service';

	const STATE_AVAILABLE   = 0;
	const STATE_UNAVAILABLE = 1;
	const STATE_PENDING     = 2;
	const STATE_BOOKED      = 3;
}
