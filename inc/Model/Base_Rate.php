<?php
namespace AweBooking\Model;

use AweBooking\Factory;
use AweBooking\Constants;
use AweBooking\Support\Fluent;
use AweBooking\Support\Collection;

class Base_Rate implements Contracts\Rate_Plan {
	/**
	 * The room-type instance.
	 *
	 * @var \AweBooking\Model\Room_Type
	 */
	protected $instance;

	/**
	 * The line rates.
	 *
	 * @var \AweBooking\Support\Collection
	 */
	protected $rates;

	/**
	 * Create base-rate instance from a room-type.
	 *
	 * @param mixed $instance The room-type ID or instance.
	 */
	public function __construct( $instance ) {
		$this->instance = Factory::get_room_type( $instance );
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_id() {
		return $this->instance->get_id();
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_name() {
		return $this->instance->get_title();
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_private_name() {
		return esc_html__( 'Base Rate', 'awebooking' );
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_inclusions() {
		return $this->instance->get_meta( '_rate_inclusions' );
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_policies() {
		return $this->instance->get_meta( '_rate_policies' );
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_priority() {
		return 0;
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_rates() {
		if ( is_null( $this->rates ) ) {
			$this->rates = apply_filters( 'awebooking/base_rate/rates', $this->setup_rates(), $this );
		}

		return $this->rates;
	}

	/**
	 * Setup the rates.
	 *
	 * @return \AweBooking\Support\Collection
	 */
	protected function setup_rates() {
		$rates = new Collection;

		$rates->push( $this->get_line_rate() );

		return $rates;
	}

	/**
	 * Return a instance of line rates.
	 *
	 * @return \AweBooking\Model\Base_Rate_Item
	 */
	protected function get_line_rate() {
		return new Base_Rate_Item( $this->instance );
	}
}
