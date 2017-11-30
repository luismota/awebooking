<?php
namespace AweBooking\Calendar\Event;

use AweBooking\Support\Collection;

class Event_Collection extends Collection {
	/* Constants */
	const INDEX_FORMAT = 'Y-m-d';

	/**
	 * Create a new collection.
	 *
	 * @param  mixed $items The event items.
	 * @return void
	 */
	public function __construct( $items = [] ) {
		foreach ( $items = $this->getArrayableItems( $items ) as $item ) {
			static::assert_is_event( $item );
		}

		$this->items = $items;
	}

	/**
	 * {@inheritdoc}
	 */
	public function prepend( $value, $key = null ) {
		static::assert_is_event( $value );

		parent::prepend( $value, $key );
	}

	/**
	 * {@inheritdoc}
	 */
	public function offsetSet( $key, $value ) {
		static::assert_is_event( $value );

		parent::offsetSet( $key, $value );
	}

	/**
	 * Assert given value instance of Event_Interface.
	 *
	 * @param  mixed $value Input value.
	 * @return void
	 *
	 * @throws \InvalidArgumentException
	 */
	protected static function assert_is_event( $value ) {
		if ( ! $value instanceof Event_Interface ) {
			throw new \InvalidArgumentException( 'The resource must be instance of Event_Interface.' );
		}
	}
}
