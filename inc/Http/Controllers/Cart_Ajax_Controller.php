<?php
namespace AweBooking\Http\Controllers;

use Awethemes\Http\Request;
use Skeleton\Support\Validator;

class Cart_Ajax_Controller extends Controller {
	/**
	 * [add description]
	 */
	public function add_room( Request $request ) {
		$request->validate( [
			'rate_id' => 'required',
		]);

		$rate_id = $request['rate_id'];

		// TODO:..
		$room_left = 10;

		// If has rooms availability...
		if ( ! absint( $room_left ) ) {
			return [ 'error' => 'fdf'];
		}

		//TODO:
		$price = 150;

		// TODO:
		$item = '<li class="awebooking-cart-item">
			<div class="awebooking-cart-item__info">
				<h5 class="awebooking-cart-item__rate">
					Stay for 2 nights and get exclusive 20% discount
				</h5>

				<p class="awebooking-cart-item__guess">
					2 Adults ,2 Children ,1 Room
				</p>
			</div>

			<p class="awebooking-cart-item__price">
				8800$
			</p>

			<a href="#" class="awebooking-cart-item__remove js-awebooking-remove-cart">✕</a>
		</li>';

		return wp_send_json_success( [
			'total_price' => $price,
			'item' => $item,
			'room_left' => $room_left - 1,
		], 200 );
	}

	/**
	 * [add_service description]
	 */
	public function add_service( Request $request ) {
		// var_dump($request['extra-services']);
		$extra_services = $request['extra-services'];

		//TODO:
		$price = '<span class="awebooking-price-currencySymbol">$</span>150.00';

		$services_included = 'Buffet Breakfast, Gym Ticket';

		return wp_send_json_success( [
			'total_price' => $price,
			'services_included' => $services_included,
		], 200 );
	}
}
