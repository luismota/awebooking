<?php
namespace AweBooking\Http\Routing;

use Awethemes\Http\Request;
use Skeleton\Support\Validator;

abstract class Controller {
	/**
	 * Get instance of the Redirector.
	 *
	 * @return Redirector
	 */
	protected function redirect() {
		return awebooking()->make( Redirector::class );
	}

	protected function validate( Request $request, array $rules, array $labels = [] ) {
		$validator = new Validator( $request->all(), $rules );

		$validator->labels( $labels );

		if ( $validator->fails() ) {
			throw new Validation_Exception;
		}
	}
}
