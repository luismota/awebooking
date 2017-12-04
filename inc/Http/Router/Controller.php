<?php
namespace AweBooking\Http\Router;

use Awethemes\Http\Request;
use Skeleton\Support\Validator;

abstract class Controller {

	public function validate( Request $request, array $rules, array $labels = [] ) {
		$validator = new Validator( $request->all(), $rules );

		$validator->labels( $labels );

		if ( $validator->fails() ) {
			throw new Validation_Exception;
		}
	}
}
