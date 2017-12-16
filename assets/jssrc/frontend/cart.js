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
      var $dropdown_content = $(data_dropdown);
      $dropdown_content.toggleClass('active');
      $dropdown_content.slideToggle(300);
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
        data: data
      })
      .done(function(response) {
        // Refresh price
        el.parents('.js-awebooking-rate').find('ins .amount').html(response.data.total_price);

        // Update services included
        el.parents('.js-awebooking-rate').find('.js-awebooking-list-service').text(response.data.services_included);
      })
      .fail(function(xhr, status, error) {
      })
      .always(function() {
      });
    });

    // Add room to cart.
    $(document).on('click', '.js-awebooking-add-room', function (e) {
      e.preventDefault();

      var el = $(this);
      $.ajax({
        url: AweBooking.route_url + 'cart/add_room',
        type: 'post',
        data: {
          rate_id: el.parents('.js-awebooking-rate').attr('id')
        },
      })
      .done(function(response) {
        // Add item.
        $('.awebooking-cart__items ul').append(response.data.item);
        // Decrease rooms left.
        el.parents('.js-awebooking-rate').find('.js-awebooking-room-left').text(response.data.room_left);
        // Refresh total price.
        $('.js-awebooking-cart-total').text(response.data.total_price);
      })
      .fail(function(xhr, status, error) {
      })
      .always(function() {
      });
    });

    // Remove room from cart.
    $(document).on('click', '.js-awebooking-remove-room', function (e) {
      e.preventDefault();

      var el = $(this);
      console.log(el);

      el.parents('.awebooking-cart-item').remove();

      // Refresh total price.
      $('.js-awebooking-cart-total').text(0);
    });

    // Edit room from cart.
    $(document).on('click', '.js-awebooking-edit-room', function (e) {
      e.preventDefault();

      var el = $(this);
      var rate_id = el.parents('.awebooking-cart-item').data('rate');
      var $rate_el = $('#'+rate_id);

      $rate_el.addClass('editing');
      $rate_el.find('.js-awebooking-add-room').removeClass('js-awebooking-add-room').addClass('js-awebooking-save-room').text('Save');
      // Activate dropdown.
      $rate_el.find('.awebooking-rate__service-btn').addClass('active');
      $rate_el.find('.awebooking-dropdown-content').addClass('active');
      $rate_el.find('.awebooking-dropdown-content').css('display', 'block');

      $.ajax({
        url: AweBooking.route_url + 'cart/edit_room',
        type: 'post',
        data: {
          rate_id: rate_id
        },
      })
      .done(function(response) {

        // Refresh total price.
        $('.js-awebooking-cart-total').text(0);
      })
      .fail(function(xhr, status, error) {
      })
      .always(function() {
      });
    });

    // Save room from cart.
    $(document).on('click', '.js-awebooking-save-room', function (e) {
      e.preventDefault();

      var el = $(this);
      var $rate_el = el.parents('.js-awebooking-rate');
      var rate_id = $rate_el.attr('id');

      $rate_el.removeClass('editing');
      $rate_el.find('.js-awebooking-save-room').removeClass('js-awebooking-save-room').addClass('js-awebooking-add-room').text('Add room');

      $.ajax({
        url: AweBooking.route_url + 'cart/save_room',
        type: 'post',
        data: {
          rate_id: rate_id
        },
      })
      .done(function(response) {
        // Refresh total price.
        $('.js-awebooking-cart-total').text(0);
      })
      .fail(function(xhr, status, error) {
      })
      .always(function() {
      });
    });
});
