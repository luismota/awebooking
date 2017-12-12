const $ = window.jQuery;
const awebooking = window.TheAweBooking;

const AddLineItem = require('./booking/add-line-item.js');
const EditLineItem = require('./booking/edit-line-item.js');

$(function() {

  const $form = $('#awebooking-add-line-item-form');
  if ($form.length > 0) {
    new AddLineItem($form);
  }

  new EditLineItem;

  $('.js-delete-booking-item').on('click', function() {
    if (! confirm(awebooking.trans('warning'))) {
      return false;
    }
  });

  $('#awebooking-booking-notes').on('click', '.delete_note', function(e) {
    e.preventDefault();

    const bookingID = $('#post_ID').val();
    const note = $(this).closest('li.note');

    wp.ajax.post('delete_awebooking_note', {
      note_id: $(note).attr('rel'),
      booking_id: $('#post_ID').val()
    })
    .done(function(response) {
      $(note).remove();
    });
  });

  $('#awebooking-booking-notes').on('click', 'button.add_note', function (e) {
    e.preventDefault();

    const bookingID = $('#post_ID').val();
    const noteContents = $('textarea#add_booking_note').val();

    if (! noteContents ) {
      return;
    }

    $.ajax({
      url: awebooking.route('booking/' + bookingID + '/add_note'),
      type: 'POST',
      data: {
        note: noteContents,
        note_type: $('select#booking_note_type').val(),
      },
    })
    .done(function(data) {
      $('ul.booking_notes').prepend(data.new_note);
      $('#add_booking_note').val('');
    });
  });

});
