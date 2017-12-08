<?php
global $room_type;

$allowed_adults = $room_type->get_allowed_adults();
$allowed_children = $room_type->get_allowed_children();
$allowed_infants = $room_type->get_allowed_infants();

$temp = $allowed_adults;
if ( $allowed_children > $temp ) {
	$temp = $allowed_children;
}

if ( $allowed_infants > $temp ) {
	$temp = $allowed_infants;
}
?>
<div class="cmb-row">
	<div class="cmb-th">
		<label for=""><?php echo esc_html( $field->prop( 'name' ) ); ?></label>
	</div>

	<div class="cmb-td">
		<table class="table">
		  <tbody>
			<tr>
				<th scope="row"></th>
				<?php for ( $i = 1; $i <= $temp; $i++ ) : ?>
					<td><?php echo absint( $i ); ?></td>
				<?php endfor; ?>
			</tr>

			<?php if ( $allowed_adults ) : ?>
				<tr>
					<th scope="row"><?php esc_html_e( 'Adults', 'awebooking' ); ?></th>
					<?php for ( $i = 0; $i < $allowed_adults; $i++ ) : ?>
						<td><input type="text" class="cmb2-text-small" name=""></td>
					<?php endfor; ?>
				</tr>
			<?php endif; ?>

			<?php if ( awebooking( 'setting' )->get_children_bookable() && $allowed_children ) : ?>
				<tr>
					<th scope="row"><?php esc_html_e( 'Children', 'awebooking' ); ?></th>
					<?php for ( $i = 0; $i < $allowed_children; $i++ ) : ?>
						<td><input type="text" class="cmb2-text-small" name=""></td>
					<?php endfor; ?>
				</tr>
			<?php endif; ?>

			<?php if ( awebooking( 'setting' )->get_infants_bookable() && $allowed_infants ) : ?>
				<tr>
					<th scope="row"><?php esc_html_e( 'Infants', 'awebooking' ); ?></th>
					<?php for ( $i = 0; $i < $allowed_infants; $i++ ) : ?>
						<td><input type="text" class="cmb2-text-small" name=""></td>
					<?php endfor; ?>
				</tr>
			<?php endif; ?>
		  </tbody>
		</table>
	</div>
</div>
