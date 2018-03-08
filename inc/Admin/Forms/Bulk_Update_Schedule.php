<?php
namespace AweBooking\Admin\Forms;

use AweBooking\Constants;
use AweBooking\Support\Carbonate;

class Bulk_Update_Schedule extends Form_Abstract {
	/**
	 * The form ID.
	 *
	 * @var string
	 */
	protected $form_id = 'awebooking_new_reservation_tax';

	/**
	 * {@inheritdoc}
	 */
	protected function fields() {
		$this->add_field([
			'id'          => 'room_types',
			'type'        => 'multicheck',
			'name'        => esc_html__( 'Select room type(s)', 'awebooking' ),
			'options_cb'  => wp_data_callback( 'posts', array( 'post_type' => Constants::ROOM_TYPE ,'post_status' => 'publish' ) ),
			'select_all_button' => false,
		]);

		$this->add_field([
			'id'          => 'day_options',
			'type'        => 'multicheck_inline',
			'name'        => esc_html__( 'Weekdays', 'awebooking' ),
			'options'     => $this->prints_weekday_checkbox(),
			'select_all_button' => false,
		]);

		$this->add_field([
			'id'          => 'check_in_out',
			'type'        => 'date_range',
			'name'        => esc_html__( 'Check-In and Check-Out', 'awebooking' ),
			'validate'    => 'date_period',
			'attributes'  => [ 'placeholder' => Constants::DATE_FORMAT ],
			'date_format' => Constants::DATE_FORMAT,
		]);

		$this->add_field([
			'id'              => 'price',
			'type'            => 'text_small',
			'name'            => esc_html__( 'Price', 'awebooking' ),
			/* translators: %s The currency symbol */
			'append'          => awebooking( 'currency' )->get_symbol(),
			'validate'        => 'required|price',
			'sanitization_cb' => 'awebooking_sanitize_price',
		]);
	}

	/**
	 * {@inheritdoc}
	 */
	public function output() {
		$this->prepare_validate();

		$request = $this->get_request();

		?><div class="awebooking-row">

			<div class="awebooking-column check_in_out_column">
				<?php $this['check_in_out']->display(); ?>
				<?php $this['day_options']->display(); ?>
			</div>

			<div class="awebooking-column check_in_out_column">
				<?php $this['room_types']->display(); ?>
			</div>
		</div>
		<div class="awebooking-row">
			<div class="awebooking-column check_in_out_column">
				<?php $this['price']->display(); ?>
			</div>
		</div><?php // @codingStandardsIgnoreLine
	}

	/**
	 * Get default date period.
	 *
	 * @return array
	 */
	protected function get_default_date_range() {
		return [
			Carbonate::today()->toDateString(),
			Carbonate::today()->addDay( 2 )->toDateString(),
		];
	}

	/**
	 * Get weekdays.
	 *
	 * @param  array  $args args
	 * @return array
	 */
	protected function prints_weekday_checkbox( array $args = [] ) {
		global $wp_locale;

		$args = wp_parse_args( $args, [
			'label'  => 'abbrev',
			'before' => '',
			'after'  => '',
		]);

		$options = [];
		$week_begins = (int) get_option( 'start_of_week' );

		for ( $i = 0; $i <= 6; $i++ ) {
			$wd = (int) ( $i + $week_begins ) % 7;

			$wd_name = $wp_locale->get_weekday( $wd );
			switch ( $args['label'] ) {
				case 'initial':
					$wd_label = $wp_locale->get_weekday_initial( $wd_name );
					break;
				case 'abbrev':
					$wd_label = $wp_locale->get_weekday_abbrev( $wd_name );
					break;
				default:
					$wd_label = $wd_name;
					break;
			}

			$options[$wd] = $wd_label;
		}

		return $options;
	}
}
