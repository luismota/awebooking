<?php
namespace AweBooking\Ruler\Operator;

use Ruler\Context;
use Ruler\Operator\LessThanOrEqualTo as Base_Operator;
use AweBooking\Support\Carbonate;

class Less_Than_Or_Equal extends Base_Operator {
	/**
	 * Evaluate the operands.
	 *
	 * @param  Context $context Context with which to evaluate this Proposition.
	 * @return boolean
	 */
	public function evaluate( Context $context ) {
		list( $left, $right ) = $this->getOperands();

		$left  = $left->prepareValue( $context );
		$right = $right->prepareValue( $context );

		// Support date-time comparison.
		if ( $right->getValue() instanceof Carbonate ) {
			return Carbonate::create_datetime( $left->getValue() )->lessThanOrEqualTo( $right->getValue() );
		}

		return parent::evaluate( $context );
	}
}
