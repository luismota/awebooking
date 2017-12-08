<?php

$packages = [
	// __DIR__ . '/awethemes/skeleton/skeleton.php',
	// __DIR__ . '/awethemes/skeleton/vendor/autoload.php',
	// __DIR__ . '/awethemes/container/vendor/autoload.php',
	// __DIR__ . '/awethemes/wp-http/vendor/autoload.php',
	// __DIR__ . '/awethemes/wp-object/vendor/autoload.php',
	// __DIR__ . '/awethemes/wp-session/vendor/autoload.php',
];

foreach ( $packages as $path ) {
	require $path;
}

use AweBooking\Support\Carbonate;
use AweBooking\Calendar\Resource\Resource;
use AweBooking\Calendar\Provider\Pricing_Provider;

add_action( 'awebooking/booted', function () {

	// include __DIR__ . '/inc/Reservation/Reservation.php';
	// exit;

});

function awebooking_availability_template( $atts ) {
	$atts = shortcode_atts( array(
		'foo' => 'no foo',
	), $atts, 'awebooking_availability_template' );

	?>
	<ul class="room_types awebooking-availability-room-types">
		<li class="awebooking-availability-room-type">

			<div class="awebooking-availability-room-type__media">
				<div class="awebooking-availability-room-type__thumbnail">
					<a href="http://demo.awethemes.com/awebooking/our-rooms/classic-room/">
						<img width="553" height="400" src="http://demo.awethemes.com/awebooking/wp-content/uploads/2017/06/classic-room-1.jpg" class="attachment-awebooking_catalog size-awebooking_catalog wp-post-image" alt="" srcset="http://demo.awethemes.com/awebooking/wp-content/uploads/2017/06/classic-room-1.jpg 1050w, http://demo.awethemes.com/awebooking/wp-content/uploads/2017/06/classic-room-1-300x217.jpg 300w, http://demo.awethemes.com/awebooking/wp-content/uploads/2017/06/classic-room-1-768x556.jpg 768w, http://demo.awethemes.com/awebooking/wp-content/uploads/2017/06/classic-room-1-1024x741.jpg 1024w" sizes="(max-width: 553px) 85vw, 553px">
					</a>

					<h2 class="awebooking-availability-room-type__title">
						<a href="http://demo.awethemes.com/awebooking/our-rooms/classic-room/" rel="bookmark">
							Classic Room
						</a>
					</h2>

				</div>

			</div>

			<div class="awebooking-availability-room-type__info">
				<div class="awebooking-rates">

					<div class="awebooking-rate">
						<div class="awebooking-rate__body">
							<div class="awebooking-discount">
								<span>Special Deal</span>
							</div>

							<h2 class="awebooking-rate__name">Stay for 2 nights and get exclusive 20% discount</h2>

							<div class="awebooking-rate__content">
								<div class="awebooking-rate__info">
									<p class="awebooking-rate__occupancy">Maximum Occupancy: 2 adults, 1 child</p>
									<p class="awebooking-rate__desc">Tax included in room price</p>
									<p class="awebooking-rate__included">Breakfast included , Free Cancellation</p>
								</div>

								<div class="awebooking-rate__price">
									<div class="price">
										<del>
											<span class="awebooking-price-amount amount">
												<span class="awebooking-price-currencySymbol">$</span>99.00
											</span>
										</del>

										<ins>
											<span class="awebooking-price-amount amount">
												<span class="awebooking-price-currencySymbol">$</span>87.00
											</span>
										</ins>
									</div>

									<div class="awebooking-rate__price_detail">
										<p>price for 61 Nights</p>
										<p>2 Adults , 1 Child,  1 Room</p>
									</div>
								</div>
							</div>
						</div>

						<div class="awebooking-rate__bottom">
							<div class="awebooking-rate__actions-left">
								<a href="#">Room Info</a>
								<a href="#">Enquire</a>
							</div>

							<div class="awebooking-rate__actions-right">
								<span class="awebooking-rate__rooms"><span class="count">10</span> Rooms Left</span>
								<a class="awebooking-rate__book" href="http://demo.awethemes.com/awebooking/booking/?booking-action=view&amp;start-date=2017-12-14&amp;end-date=2017-12-15&amp;adults=1&amp;children=0&amp;room-type=19">Add room</a>
							</div>

						</div>
					</div>

					<div class="awebooking-rate">
						<div class="awebooking-rate__body">
							<div class="awebooking-discount">
								<span>Special Deal</span>
							</div>

							<h2 class="awebooking-rate__name">Exclude</h2>

							<div class="awebooking-rate__content">
								<div class="awebooking-rate__info">
									<p class="awebooking-rate__occupancy">Maximum Occupancy: 2 adults, 1 child</p>
									<p class="awebooking-rate__desc">Tax included in room price</p>
									<p class="awebooking-rate__included">Breakfast included , Free Cancellation</p>
								</div>

								<div class="awebooking-rate__price">
									<div class="price">
										<del>
											<span class="awebooking-price-amount amount">
												<span class="awebooking-price-currencySymbol">$</span>99.00
											</span>
										</del>

										<ins>
											<span class="awebooking-price-amount amount">
												<span class="awebooking-price-currencySymbol">$</span>87.00
											</span>
										</ins>
									</div>

									<div class="awebooking-rate__price_detail">
										<p>price for 61 Nights</p>
										<p>2 Adults , 1 Child,  1 Room</p>
									</div>
								</div>
							</div>
						</div>

						<div class="awebooking-rate__bottom">
							<div class="awebooking-rate__actions-left">
								<a href="#">Room Info</a>
								<a href="#">Enquire</a>
							</div>

							<div class="awebooking-rate__actions-right">
								<span class="awebooking-rate__rooms"><span class="count">10</span> Rooms Left</span>
								<a class="awebooking-rate__book" href="http://demo.awethemes.com/awebooking/booking/?booking-action=view&amp;start-date=2017-12-14&amp;end-date=2017-12-15&amp;adults=1&amp;children=0&amp;room-type=19">Add room</a>
							</div>

						</div>
					</div>

				</div>
			</div>
		</li>
	</ul>
	<?php
}
add_shortcode( 'awebooking_availability_template', 'awebooking_availability_template' );
