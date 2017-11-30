<?php
namespace AweBooking\Calendar\Resource;

use AweBooking\Support\Collection;

class Resource_Collection extends Collection {
	/**
	 * Create a new collection.
	 *
	 * @param  mixed $items The resource items.
	 * @return void
	 */
	public function __construct( $items = [] ) {
		foreach ( $items = $this->getArrayableItems( $items ) as $item ) {
			static::assert_is_resource( $item );
		}

		$this->items = $items;
	}

	/**
	 * {@inheritdoc}
	 */
	public function prepend( $value, $key = null ) {
		static::assert_is_resource( $value );

		parent::prepend( $value, $key );
	}

	/**
	 * {@inheritdoc}
	 */
	public function offsetSet( $key, $value ) {
		static::assert_is_resource( $value );

		parent::offsetSet( $key, $value );
	}

	/**
	 * Assert given value instance of Resource_Interface.
	 *
	 * @param  mixed $value Input value.
	 * @return void
	 *
	 * @throws \InvalidArgumentException
	 */
	protected static function assert_is_resource( $value ) {
		if ( ! $value instanceof Resource_Interface ) {
			throw new \InvalidArgumentException( 'The resource must be instance of Resource_Interface.' );
		}
	}
}
