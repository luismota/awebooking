<?php
namespace AweBooking\Model;

use WP_User_Query;

class Customer {
	/**
	 * Search customers and return customer IDs.
	 *
	 * @param  string     $term  //.
	 * @param  int|string $limit //.
	 * @return array
	 */
	public static function search( $term, $limit = '' ) {
		$query = new WP_User_Query( apply_filters( 'awebooking/customer/search_customers', [
			'fields'         => 'ID',
			'search'         => '*' . esc_attr( $term ) . '*',
			'search_columns' => [ 'user_login', 'user_url', 'user_email', 'user_nicename', 'display_name' ],
			'number'         => $limit,
		], $term, $limit, 'main_query' ) );

		$query2 = new WP_User_Query( apply_filters( 'awebooking/customer/search_customers', array(
			'fields'         => 'ID',
			'number'         => $limit,
			'meta_query'     => array(
				'relation' => 'OR',
				array(
					'key'     => 'first_name',
					'value'   => $term,
					'compare' => 'LIKE',
				),
				array(
					'key'     => 'last_name',
					'value'   => $term,
					'compare' => 'LIKE',
				),
			),
		), $term, $limit, 'meta_query' ) );

		$results = wp_parse_id_list(
			array_merge( $query->get_results(), $query2->get_results() )
		);

		if ( $limit && count( $results ) > $limit ) {
			$results = array_slice( $results, 0, $limit );
		}

		return $results;
	}
}
