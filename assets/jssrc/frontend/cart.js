jQuery(function($) {
    'use strict';

    $('.awebooking-price-info').magnificPopup({
        type:'inline',
        midClick: true,
        mainClass: 'awebooking-breakdown-popup'
    });

    $('[data-init="awebooking-dropdown"]').click(function() {
        var el = $(this);
        var data_dropdown = el.data('dropdown');
        var dropdown_content = $(data_dropdown);
        dropdown_content.toggleClass('active');
        dropdown_content.slideToggle(300);
    });

    $('.js-awebooking-add-room').on('click', function (e) {
        e.preventDefault();

        var el = $(this);
        var rate_id = el.parents('.js-awebooking-rate').attr('id');
        var rate_actions = el.parents('.js-awebooking-rate-actions');
        console.log(AweBooking.route_url + 'cart/add');
        console.log(rate_id);
        $.ajax({
            url: AweBooking.route_url + 'cart/add',
            type: 'post',
            data: {
                rate_id:rate_id
            },
            beforeSend: function() {

            },
            success: function( response ) {
                el.remove();
                rate_actions.append('Some text');
            }
        });
    });
} );
