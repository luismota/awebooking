<?php
namespace AweBooking\Reservation\Request;

interface Request_Node {
	/**
	 * Return human readable of the request (HTML allowed).
	 *
	 * @return string
	 */
	public function as_string();
}
