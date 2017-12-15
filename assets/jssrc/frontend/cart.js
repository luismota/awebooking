jQuery(function($) {
    'use strict';

    // Pricing breakdown pop-up.
    $('.awebooking-price-info').magnificPopup({
        type:'inline',
        midClick: true,
        mainClass: 'awebooking-breakdown-popup'
    });

    // AweBooking dropdown.
    $('[data-init="awebooking-dropdown"]').on('click', function (e) {
        e.preventDefault();

        var el = $(this);
        el.toggleClass('active');

        var data_dropdown = el.data('dropdown');
        var dropdown_content = $(data_dropdown);
        dropdown_content.toggleClass('active');
        dropdown_content.slideToggle(300);
    });

    // Add service to rate.
    $('#awebooking-service-items input[type="checkbox"]').on('change', function (e) {
        var el = $(this);

        var data = $('#awebooking-booking-form').serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        data['extra-services'] = $('input[name="awebooking_services\[\]"]:checked').map(function() {
          return $(this).val();
        }).get();

        $.ajax({
            url: AweBooking.route_url + 'cart/add_service',
            type: 'post',
            data: data,
            beforeSend: function() {
            },

            success: function( response ) {
              // Refresh price
              el.parents('.js-awebooking-rate').find('ins .amount').html(response.data.total_price);

              // Update services included
              el.parents('.js-awebooking-rate').find('.js-awebooking-list-service').text(response.data.services_included)
            }
        });
    });

    // Add to cart.
    $('.js-awebooking-add-room').on('click', function (e) {
        e.preventDefault();

        var el = $(this);
        var rate_id = el.parents('.js-awebooking-rate').attr('id');

        var cart_items = $('.awebooking-cart__items ul');

        $.ajax({
            url: AweBooking.route_url + 'cart/add_room',
            type: 'post',
            data: {
                rate_id:rate_id
            },
            beforeSend: function() {
            },
            success: function( response ) {
                cart_items.append(response.data.item);
                el.parents('.js-awebooking-rate').find('.js-awebooking-room-left').text(response.data.room_left);
            }
        });
    });
} );
