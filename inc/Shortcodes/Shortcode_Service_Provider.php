<?php
namespace AweBooking\Shortcodes;

use AweBooking\Support\Service_Provider;

class Shortcode_Service_Provider extends Service_Provider {
	/**
	 * Init the shortcodes.
	 */
	public function init() {
		Shortcodes::init();
	}
}
