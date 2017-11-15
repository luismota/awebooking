<?php
namespace AweBooking\Providers;

use Skeleton\Skeleton;
use Valitron\Validator;
use AweBooking\Support\Service_Provider;
use AweBooking\Admin\Fields\Date_Range_Field;
use AweBooking\Admin\Fields\Service_List_Field;

class Skeleton_Service_Provider extends Service_Provider {
	/**
	 * Registers services on the AweBooking.
	 */
	public function register() {
		$skeleton = $this->awebooking->make( Skeleton::class );
		$field_manager = $skeleton->get_fields();

		$field_manager->register_field( 'date_range', Date_Range_Field::class );
		$field_manager->register_field( 'awebooking_services', Service_List_Field::class );

		$this->register_validator_rules();
	}

	/**
	 * Register the validator rules.
	 *
	 * @return void
	 */
	protected function register_validator_rules() {
		Validator::addRule( 'datePeriod', function( $field, $value, array $params ) {
			$strict = isset( $params[0] ) && $params[0];

			$sanitized = awebooking_sanitize_period( $value, $strict );

			return ! empty( $sanitized );
		});

		Validator::addRule( 'price', function( $field, $value, array $params ) {
			if ( 0 == $value ) {
				return true;
			}

			$allow_negative = ( isset( $params[0] ) && $params[0] );
			$sanitized = awebooking_sanitize_price( $value );

			if ( ! $allow_negative ) {
				return $sanitized > 0;
			}

			return 0 != $sanitized;
		});
	}
}
