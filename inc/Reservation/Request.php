<?php
namespace AweBooking\Reservation;

use AweBooking\Reservation\Request\Stay;
use AweBooking\Reservation\Request\Party;

class Request {
	/**
	 * The request Party instance.
	 *
	 * @var \AweBooking\Reservation\Request\Party
	 */
	protected $party;

	/**
	 * The request Stay instance.
	 *
	 * @var \AweBooking\Reservation\Request\Stay
	 */
	protected $stay;

	/**
	 * The language of user request.
	 *
	 * @var string
	 */
	protected $language;

	/**
	 * The currency of user request.
	 *
	 * @var string
	 */
	protected $currency;

	/**
	 * The Hotel object instance.
	 *
	 * @var \AweBooking\Model\Hotel
	 */
	protected $hotel;

	/**
	 * Constructor.
	 *
	 * @param Party  $party    The Party instance.
	 * @param Stay   $stay     The Stay instance.
	 * @param Hotel  $hotel    The user request for what Hotel.
	 * @param string $currency The user request currency.
	 * @param string $language The user request langiage.
	 */
	public function __construct( Party $party, Stay $stay, Hotel $hotel = null, $currency = null, $language = null ) {
		$this->stay = $stay;
		$this->party = $party;

		// $this->set_hotel( $hotel );
		// $this->set_currency( $currency );
		// $this->set_language( $language );
	}

	public function ask( Asking $asking ) {
		return new Response( $this, $asking );
	}

	/**
	 * Get the Party.
	 *
	 * @return \AweBooking\Reservation\Request\Party
	 */
	public function get_party() {
		return $this->party;
	}

	/**
	 * Set the Party.
	 *
	 * @param Party $party The Party instance.
	 */
	public function set_party( Party $party ) {
		$this->party = $party;

		return $this;
	}

	/**
	 * Get the Stay.
	 *
	 * @return \AweBooking\Reservation\Request\Party
	 */
	public function get_stay() {
		return $this->stay;
	}

	/**
	 * Set the Stay.
	 *
	 * @param Stay $stay The Stay instance.
	 */
	public function set_stay( Stay $stay ) {
		$this->stay = $stay;

		return $this;
	}
}
