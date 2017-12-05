<?php
namespace AweBooking\Availability\Request;

class Party {
	/**
	 * The number of adults in party.
	 *
	 * @var int
	 */
	protected $adults;

	/**
	 * The number of children in party.
	 *
	 * @var int
	 */
	protected $children;

	/**
	 * The number of infants in party.
	 *
	 * @var int
	 */
	protected $infants;

	/**
	 * Constructor.
	 *
	 * @param int $adults   The number of adults.
	 * @param int $children The number of children.
	 * @param int $infants  The number of infants.
	 */
	public function __construct( $adults, $children = null, $infants = null ) {
		$this->adults = absint( $adults );

		if ( ! is_null( $children ) ) {
			$this->children = absint( $children );
		}

		if ( ! is_null( $infants ) ) {
			$this->infants = absint( $infants );
		}
	}
}
