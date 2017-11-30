<?php
namespace AweBooking\Calendar\Provider\Contracts;

interface Synchronized {
	public function get_synced_provider();
	public function get_synced_calendar_id();
	public function get_synced_link();
}
