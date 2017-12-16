webpackJsonp([3],{

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(34);


/***/ }),

/***/ 34:
/***/ (function(module, exports) {

jQuery(function ($) {
  'use strict';

  // Pricing breakdown pop-up.

  $('.awebooking-price-info').magnificPopup({
    type: 'inline',
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

    var data = $('#awebooking-booking-form').serializeArray().reduce(function (obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});

    data['extra-services'] = $('input[name="awebooking_services\[\]"]:checked').map(function () {
      return $(this).val();
    }).get();

    $.ajax({
      url: AweBooking.route_url + 'cart/add_service',
      type: 'post',
      data: data
    }).done(function (response) {
      // Refresh price
      el.parents('.js-awebooking-rate').find('ins .amount').html(response.data.total_price);

      // Update services included
      el.parents('.js-awebooking-rate').find('.js-awebooking-list-service').text(response.data.services_included);
    }).fail(function (xhr, status, error) {}).always(function () {});
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
      }
    }).done(function (response) {
      // Add item.
      $('.awebooking-cart__items ul').append(response.data.item);
      // Decrease rooms left.
      el.parents('.js-awebooking-rate').find('.js-awebooking-room-left').text(response.data.room_left);
      // Refresh total price.
      $('.js-awebooking-cart-total').text(response.data.total_price);
    }).fail(function (xhr, status, error) {}).always(function () {});
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
    var $rate_el = $('#' + rate_id);

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
      }
    }).done(function (response) {

      // Refresh total price.
      $('.js-awebooking-cart-total').text(0);
    }).fail(function (xhr, status, error) {}).always(function () {});
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
      }
    }).done(function (response) {
      // Refresh total price.
      $('.js-awebooking-cart-total').text(0);
    }).fail(function (xhr, status, error) {}).always(function () {});
  });
});

/***/ })

},[33]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanNzcmMvZnJvbnRlbmQvY2FydC5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCIkIiwibWFnbmlmaWNQb3B1cCIsInR5cGUiLCJtaWRDbGljayIsIm1haW5DbGFzcyIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZWwiLCJ0b2dnbGVDbGFzcyIsImRhdGFfZHJvcGRvd24iLCJkYXRhIiwiJGRyb3Bkb3duX2NvbnRlbnQiLCJzbGlkZVRvZ2dsZSIsInNlcmlhbGl6ZUFycmF5IiwicmVkdWNlIiwib2JqIiwiaXRlbSIsIm5hbWUiLCJ2YWx1ZSIsIm1hcCIsInZhbCIsImdldCIsImFqYXgiLCJ1cmwiLCJBd2VCb29raW5nIiwicm91dGVfdXJsIiwiZG9uZSIsInJlc3BvbnNlIiwicGFyZW50cyIsImZpbmQiLCJodG1sIiwidG90YWxfcHJpY2UiLCJ0ZXh0Iiwic2VydmljZXNfaW5jbHVkZWQiLCJmYWlsIiwieGhyIiwic3RhdHVzIiwiZXJyb3IiLCJhbHdheXMiLCJkb2N1bWVudCIsInJhdGVfaWQiLCJhdHRyIiwiYXBwZW5kIiwicm9vbV9sZWZ0IiwiY29uc29sZSIsImxvZyIsInJlbW92ZSIsIiRyYXRlX2VsIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImNzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQVNDLENBQVQsRUFBWTtBQUNmOztBQUVBOztBQUNBQSxJQUFFLHdCQUFGLEVBQTRCQyxhQUE1QixDQUEwQztBQUN4Q0MsVUFBSyxRQURtQztBQUV4Q0MsY0FBVSxJQUY4QjtBQUd4Q0MsZUFBVztBQUg2QixHQUExQzs7QUFNQTtBQUNBSixJQUFFLG1DQUFGLEVBQXVDSyxFQUF2QyxDQUEwQyxPQUExQyxFQUFtRCxVQUFVQyxDQUFWLEVBQWE7QUFDOURBLE1BQUVDLGNBQUY7O0FBRUEsUUFBSUMsS0FBS1IsRUFBRSxJQUFGLENBQVQ7QUFDQVEsT0FBR0MsV0FBSCxDQUFlLFFBQWY7O0FB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anNcXGZyb250ZW5kXFxjYXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsialF1ZXJ5KGZ1bmN0aW9uKCQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvLyBQcmljaW5nIGJyZWFrZG93biBwb3AtdXAuXHJcbiAgICAkKCcuYXdlYm9va2luZy1wcmljZS1pbmZvJykubWFnbmlmaWNQb3B1cCh7XHJcbiAgICAgIHR5cGU6J2lubGluZScsXHJcbiAgICAgIG1pZENsaWNrOiB0cnVlLFxyXG4gICAgICBtYWluQ2xhc3M6ICdhd2Vib29raW5nLWJyZWFrZG93bi1wb3B1cCdcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEF3ZUJvb2tpbmcgZHJvcGRvd24uXHJcbiAgICAkKCdbZGF0YS1pbml0PVwiYXdlYm9va2luZy1kcm9wZG93blwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHZhciBlbCA9ICQodGhpcyk7XHJcbiAgICAgIGVsLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgIHZhciBkYXRhX2Ryb3Bkb3duID0gZWwuZGF0YSgnZHJvcGRvd24nKTtcclxuICAgICAgdmFyICRkcm9wZG93bl9jb250ZW50ID0gJChkYXRhX2Ryb3Bkb3duKTtcclxuICAgICAgJGRyb3Bkb3duX2NvbnRlbnQudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAkZHJvcGRvd25fY29udGVudC5zbGlkZVRvZ2dsZSgzMDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQWRkIHNlcnZpY2UgdG8gcmF0ZS5cclxuICAgICQoJyNhd2Vib29raW5nLXNlcnZpY2UtaXRlbXMgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciBlbCA9ICQodGhpcyk7XHJcblxyXG4gICAgICB2YXIgZGF0YSA9ICQoJyNhd2Vib29raW5nLWJvb2tpbmctZm9ybScpLnNlcmlhbGl6ZUFycmF5KCkucmVkdWNlKGZ1bmN0aW9uKG9iaiwgaXRlbSkge1xyXG4gICAgICAgICAgb2JqW2l0ZW0ubmFtZV0gPSBpdGVtLnZhbHVlO1xyXG4gICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgfSwge30pO1xyXG5cclxuICAgICAgZGF0YVsnZXh0cmEtc2VydmljZXMnXSA9ICQoJ2lucHV0W25hbWU9XCJhd2Vib29raW5nX3NlcnZpY2VzXFxbXFxdXCJdOmNoZWNrZWQnKS5tYXAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICQodGhpcykudmFsKCk7XHJcbiAgICAgIH0pLmdldCgpO1xyXG5cclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IEF3ZUJvb2tpbmcucm91dGVfdXJsICsgJ2NhcnQvYWRkX3NlcnZpY2UnLFxyXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgIH0pXHJcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgLy8gUmVmcmVzaCBwcmljZVxyXG4gICAgICAgIGVsLnBhcmVudHMoJy5qcy1hd2Vib29raW5nLXJhdGUnKS5maW5kKCdpbnMgLmFtb3VudCcpLmh0bWwocmVzcG9uc2UuZGF0YS50b3RhbF9wcmljZSk7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSBzZXJ2aWNlcyBpbmNsdWRlZFxyXG4gICAgICAgIGVsLnBhcmVudHMoJy5qcy1hd2Vib29raW5nLXJhdGUnKS5maW5kKCcuanMtYXdlYm9va2luZy1saXN0LXNlcnZpY2UnKS50ZXh0KHJlc3BvbnNlLmRhdGEuc2VydmljZXNfaW5jbHVkZWQpO1xyXG4gICAgICB9KVxyXG4gICAgICAuZmFpbChmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3IpIHtcclxuICAgICAgfSlcclxuICAgICAgLmFsd2F5cyhmdW5jdGlvbigpIHtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBZGQgcm9vbSB0byBjYXJ0LlxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1hd2Vib29raW5nLWFkZC1yb29tJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgdmFyIGVsID0gJCh0aGlzKTtcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IEF3ZUJvb2tpbmcucm91dGVfdXJsICsgJ2NhcnQvYWRkX3Jvb20nLFxyXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByYXRlX2lkOiBlbC5wYXJlbnRzKCcuanMtYXdlYm9va2luZy1yYXRlJykuYXR0cignaWQnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pXHJcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgLy8gQWRkIGl0ZW0uXHJcbiAgICAgICAgJCgnLmF3ZWJvb2tpbmctY2FydF9faXRlbXMgdWwnKS5hcHBlbmQocmVzcG9uc2UuZGF0YS5pdGVtKTtcclxuICAgICAgICAvLyBEZWNyZWFzZSByb29tcyBsZWZ0LlxyXG4gICAgICAgIGVsLnBhcmVudHMoJy5qcy1hd2Vib29raW5nLXJhdGUnKS5maW5kKCcuanMtYXdlYm9va2luZy1yb29tLWxlZnQnKS50ZXh0KHJlc3BvbnNlLmRhdGEucm9vbV9sZWZ0KTtcclxuICAgICAgICAvLyBSZWZyZXNoIHRvdGFsIHByaWNlLlxyXG4gICAgICAgICQoJy5qcy1hd2Vib29raW5nLWNhcnQtdG90YWwnKS50ZXh0KHJlc3BvbnNlLmRhdGEudG90YWxfcHJpY2UpO1xyXG4gICAgICB9KVxyXG4gICAgICAuZmFpbChmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3IpIHtcclxuICAgICAgfSlcclxuICAgICAgLmFsd2F5cyhmdW5jdGlvbigpIHtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBSZW1vdmUgcm9vbSBmcm9tIGNhcnQuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWF3ZWJvb2tpbmctcmVtb3ZlLXJvb20nLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB2YXIgZWwgPSAkKHRoaXMpO1xyXG4gICAgICBjb25zb2xlLmxvZyhlbCk7XHJcblxyXG4gICAgICBlbC5wYXJlbnRzKCcuYXdlYm9va2luZy1jYXJ0LWl0ZW0nKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIC8vIFJlZnJlc2ggdG90YWwgcHJpY2UuXHJcbiAgICAgICQoJy5qcy1hd2Vib29raW5nLWNhcnQtdG90YWwnKS50ZXh0KDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRWRpdCByb29tIGZyb20gY2FydC5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtYXdlYm9va2luZy1lZGl0LXJvb20nLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB2YXIgZWwgPSAkKHRoaXMpO1xyXG4gICAgICB2YXIgcmF0ZV9pZCA9IGVsLnBhcmVudHMoJy5hd2Vib29raW5nLWNhcnQtaXRlbScpLmRhdGEoJ3JhdGUnKTtcclxuICAgICAgdmFyICRyYXRlX2VsID0gJCgnIycrcmF0ZV9pZCk7XHJcblxyXG4gICAgICAkcmF0ZV9lbC5hZGRDbGFzcygnZWRpdGluZycpO1xyXG4gICAgICAkcmF0ZV9lbC5maW5kKCcuanMtYXdlYm9va2luZy1hZGQtcm9vbScpLnJlbW92ZUNsYXNzKCdqcy1hd2Vib29raW5nLWFkZC1yb29tJykuYWRkQ2xhc3MoJ2pzLWF3ZWJvb2tpbmctc2F2ZS1yb29tJykudGV4dCgnU2F2ZScpO1xyXG4gICAgICAvLyBBY3RpdmF0ZSBkcm9wZG93bi5cclxuICAgICAgJHJhdGVfZWwuZmluZCgnLmF3ZWJvb2tpbmctcmF0ZV9fc2VydmljZS1idG4nKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICRyYXRlX2VsLmZpbmQoJy5hd2Vib29raW5nLWRyb3Bkb3duLWNvbnRlbnQnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICRyYXRlX2VsLmZpbmQoJy5hd2Vib29raW5nLWRyb3Bkb3duLWNvbnRlbnQnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBBd2VCb29raW5nLnJvdXRlX3VybCArICdjYXJ0L2VkaXRfcm9vbScsXHJcbiAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJhdGVfaWQ6IHJhdGVfaWRcclxuICAgICAgICB9LFxyXG4gICAgICB9KVxyXG4gICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cclxuICAgICAgICAvLyBSZWZyZXNoIHRvdGFsIHByaWNlLlxyXG4gICAgICAgICQoJy5qcy1hd2Vib29raW5nLWNhcnQtdG90YWwnKS50ZXh0KDApO1xyXG4gICAgICB9KVxyXG4gICAgICAuZmFpbChmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3IpIHtcclxuICAgICAgfSlcclxuICAgICAgLmFsd2F5cyhmdW5jdGlvbigpIHtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTYXZlIHJvb20gZnJvbSBjYXJ0LlxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1hd2Vib29raW5nLXNhdmUtcm9vbScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHZhciBlbCA9ICQodGhpcyk7XHJcbiAgICAgIHZhciAkcmF0ZV9lbCA9IGVsLnBhcmVudHMoJy5qcy1hd2Vib29raW5nLXJhdGUnKTtcclxuICAgICAgdmFyIHJhdGVfaWQgPSAkcmF0ZV9lbC5hdHRyKCdpZCcpO1xyXG5cclxuICAgICAgJHJhdGVfZWwucmVtb3ZlQ2xhc3MoJ2VkaXRpbmcnKTtcclxuICAgICAgJHJhdGVfZWwuZmluZCgnLmpzLWF3ZWJvb2tpbmctc2F2ZS1yb29tJykucmVtb3ZlQ2xhc3MoJ2pzLWF3ZWJvb2tpbmctc2F2ZS1yb29tJykuYWRkQ2xhc3MoJ2pzLWF3ZWJvb2tpbmctYWRkLXJvb20nKS50ZXh0KCdBZGQgcm9vbScpO1xyXG5cclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IEF3ZUJvb2tpbmcucm91dGVfdXJsICsgJ2NhcnQvc2F2ZV9yb29tJyxcclxuICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmF0ZV9pZDogcmF0ZV9pZFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pXHJcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgLy8gUmVmcmVzaCB0b3RhbCBwcmljZS5cclxuICAgICAgICAkKCcuanMtYXdlYm9va2luZy1jYXJ0LXRvdGFsJykudGV4dCgwKTtcclxuICAgICAgfSlcclxuICAgICAgLmZhaWwoZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKSB7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5hbHdheXMoZnVuY3Rpb24oKSB7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvZnJvbnRlbmQvY2FydC5qcyJdLCJzb3VyY2VSb290IjoiIn0=