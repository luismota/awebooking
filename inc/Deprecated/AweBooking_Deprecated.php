<?php
namespace AweBooking\Deprecated;

trait AweBooking_Deprecated {
	// Deprecated methods.
	public function is_multi_language() {
		return $this->is_running_multilanguage();
	}

	public function is_multi_location() {
		return (bool) $this['setting']->get( 'enable_location' );
	}
}
