jQuery(function($) {
    'use strict';

    $('.js-awebooking-add-room').on('click', function (e) {
        e.preventDefault();

        var el = $(this);

        $.ajax({
            url: AweBooking.route_url + 'cart/add',
            type: 'post',
            data: {

            },
            beforeSend: function() {
            },

            success: function( response ) {

            }
        });
    });
} );
