<?php
namespace AweBooking\Admin\Controllers;

use AweBooking\Setting;
use AweBooking\AweBooking;
use Awethemes\Http\Request;
use Awethemes\Http\Redirect_Response;
use AweBooking\Admin\Controllers\Controller_Abstract;

class Check_Availability_Controller extends Controller_Abstract {

	public function check( Request $request ) {
		// return $this->redirect( $this->url->get_admin_setting_url() );
	}

}
