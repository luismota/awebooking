<?php
namespace AweBooking\Http\Controllers;

use Awethemes\Http\Request;
use Skeleton\Support\Validator;

class Cart_Ajax_Controller extends Controller {
	/**
	 * [add description]
	 */
	public function add( Request $request ) {
		$request->validate( [
			'rate_id' => 'required',
		]);

		$rate_id = $request['rate_id'];

		// TODO:..
		$room_left = 10;

		// If has rooms availability...
		if ( ! absint( $room_left ) ) {
			return [ 'error' => 'fdf']
		}




	}
}
