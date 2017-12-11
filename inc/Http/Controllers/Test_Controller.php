<?php
namespace AweBooking\Http\Controllers;

use Awethemes\Http\Request;

class Test_Controller extends Controller {
	public function step1( Request $request ) {
		$data = $request->validate([
			'name'  => 'required|min:10',
			'email' => 'required',
		]);

		dd($data);
	}

	public function step2() {
	}
}
