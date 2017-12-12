webpackJsonp([2],{

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(20);


/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

var $ = window.jQuery;
var awebooking = window.TheAweBooking;

var AddLineItem = __webpack_require__(21);
var EditLineItem = __webpack_require__(22);

$(function () {

  var $form = $('#awebooking-add-line-item-form');
  if ($form.length > 0) {
    new AddLineItem($form);
  }

  new EditLineItem();

  $('.js-delete-booking-item').on('click', function () {
    if (!confirm(awebooking.trans('warning'))) {
      return false;
    }
  });

  $('#awebooking-booking-notes').on('click', '.delete_note', function (e) {
    e.preventDefault();

    var bookingID = $('#post_ID').val();
    var note = $(this).closest('li.note');

    wp.ajax.post('delete_awebooking_note', {
      note_id: $(note).attr('rel'),
      booking_id: $('#post_ID').val()
    }).done(function (response) {
      $(note).remove();
    });
  });

  $('#awebooking-booking-notes').on('click', 'button.add_note', function (e) {
    e.preventDefault();

    var bookingID = $('#post_ID').val();
    var noteContents = $('textarea#add_booking_note').val();

    if (!noteContents) {
      return;
    }

    $.ajax({
      url: awebooking.route('booking/' + bookingID + '/add_note'),
      type: 'POST',
      data: {
        note: noteContents,
        note_type: $('select#booking_note_type').val()
      }
    }).done(function (data) {
      $('ul.booking_notes').prepend(data.new_note);
      $('#add_booking_note').val('');
    });
  });
});

/***/ }),

/***/ 21:
/***/ (function(module, exports) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = window.jQuery;
var awebooking = window.TheAweBooking;

var AddLineItem = function () {
  function AddLineItem(form) {
    _classCallCheck(this, AddLineItem);

    this.form = form instanceof jQuery ? form[0] : form;
    this.$form = $(this.form);

    this.$form.on('change', '#add_room', this.handleAddRoomChanges.bind(this));
    this.$form.on('change', '#add_check_in_out_0', this.handleDateChanges.bind(this));
    this.$form.on('change', '#add_check_in_out_1', this.handleDateChanges.bind(this));

    this.$form.on('change', '#add_adults, #add_children, #add_infants, [name="add_services\[\]"]', this.handleCalculateTotal.bind(this));

    $('button[type="submit"]', this.$form).prop('disabled', true);
    this.$form.on('submit', $.proxy(this.onSubmit, this));
  }

  _createClass(AddLineItem, [{
    key: 'onSubmit',
    value: function onSubmit(e) {
      e.preventDefault();

      awebooking.ajaxSubmit(this.form, 'add_awebooking_line_item').done(function (response) {

        setTimeout(function () {
          $('form#post').submit();
        }, 250);
      }).fail(function (response) {
        if (response.error) {
          alert(response.error);
        }
      });
    }
  }, {
    key: 'handleCalculateTotal',
    value: function handleCalculateTotal() {
      var self = this;

      awebooking.ajaxSubmit(this.form, 'awebooking_calculate_line_item_total').done(function (response) {
        if (response.total) {
          self.$form.find('#add_price').val(response.total);
        }
      });
    }
  }, {
    key: 'handleDateChanges',
    value: function handleDateChanges() {
      if (!this.ensureInputDates()) {
        return;
      }

      // If any check-in/out changes,
      // we will reset the `add_room` input.
      this.$form.find('#add_room').val('');

      // Then, call ajax to update new template.
      this.ajaxUpdateForm();
    }
  }, {
    key: 'handleAddRoomChanges',
    value: function handleAddRoomChanges() {
      var self = this;

      if (!this.ensureInputDates()) {
        return;
      }

      this.ajaxUpdateForm().done(function () {
        $('button[type="submit"]', self.$form).prop('disabled', false);
      });
    }
  }, {
    key: 'ajaxUpdateForm',
    value: function ajaxUpdateForm() {
      var self = this;
      var $container = self.$form.find('.awebooking-dialog-contents');

      return awebooking.ajaxSubmit(this.form, 'get_awebooking_add_item_form').done(function (response) {
        $('#add_check_in_out_0', $container).datepicker('destroy');
        $('#add_check_in_out_1', $container).datepicker('destroy');

        $container.html(response.html);
      });
    }
  }, {
    key: 'ensureInputDates',
    value: function ensureInputDates() {
      var $check_in = this.$form.find('#add_check_in_out_0');
      var $check_out = this.$form.find('#add_check_in_out_1');

      return $check_in.val() && $check_out.val();
    }
  }]);

  return AddLineItem;
}();

module.exports = AddLineItem;

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = window.jQuery;
var awebooking = window.TheAweBooking;

var EditLineItem = function () {
  function EditLineItem() {
    _classCallCheck(this, EditLineItem);

    this.doingAjax = false;
    this.currentAjax = null;

    this.$popup = $('#awebooking-edit-line-item-popup');
    awebooking.Popup.setup(this.$popup);

    $('form', this.$popup).on('submit', this.submitForm);
    $('.js-edit-line-item').on('click', this.openPopup.bind(this));

    this.$popup.on('change', '#edit_adults, #edit_children, #edit_infants, #edit_check_in_out_0, #edit_check_in_out_1, [name="edit_services\[\]"]', _.debounce(this.handleCalculateTotal.bind(this), 250));
  }

  _createClass(EditLineItem, [{
    key: 'handleCalculateTotal',
    value: function handleCalculateTotal() {
      var self = this;

      if (this.doingAjax && this.currentAjax) {
        this.currentAjax.abort();
      }

      self.doingAjax = true;

      this.currentAjax = awebooking.ajaxSubmit(this.$popup.find('form')[0], 'awebooking_calculate_update_line_item_total').done(function (response) {
        var $inputTotal = self.$popup.find('#edit_total');

        if (response.total && $inputTotal.val() != response.total) {
          $inputTotal.val(response.total).effect('highlight');
        }
      }).always(function () {
        self.doingAjax = false;
      });
    }
  }, {
    key: 'openPopup',
    value: function openPopup(e) {
      e.preventDefault();

      var self = this;
      var lineItem = $(e.currentTarget).data('lineItem');

      self.$popup.find('.awebooking-dialog-contents').html('<div class="awebooking-static-spinner"><span class="spinner"></span></div>');
      self.$popup.dialog('open');

      return wp.ajax.post('get_awebooking_edit_line_item_form', { line_item_id: lineItem }).done(function (response) {
        self.$popup.find('.awebooking-dialog-contents').html(response.html);
      });
    }
  }, {
    key: 'submitForm',
    value: function submitForm(e) {
      e.preventDefault();

      awebooking.ajaxSubmit(this, 'edit_awebooking_line_item').done(function (response) {

        setTimeout(function () {
          $('form#post').submit();
        }, 250);
      }).fail(function (response) {
        if (response.error) {
          alert(response.error);
        }
      });
    }
  }]);

  return EditLineItem;
}();

module.exports = EditLineItem;

/***/ })

},[19]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanNzcmMvYWRtaW4vZWRpdC1ib29raW5nLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi9ib29raW5nL2FkZC1saW5lLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL2Jvb2tpbmcvZWRpdC1saW5lLWl0ZW0uanMiXSwibmFtZXMiOlsiJCIsIndpbmRvdyIsImpRdWVyeSIsImF3ZWJvb2tpbmciLCJUaGVBd2VCb29raW5nIiwiQWRkTGluZUl0ZW0iLCJyZXF1aXJlIiwiRWRpdExpbmVJdGVtIiwiJGZvcm0iLCJsZW5ndGgiLCJvbiIsImNvbmZpcm0iLCJ0cmFucyIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImJvb2tpbmdJRCIsInZhbCIsIm5vdGUiLCJjbG9zZXN0Iiwid3AiLCJhamF4IiwicG9zdCIsIm5vdGVfaWQiLCJhdHRyIiwiYm9va2luZ19pZCIsImRvbmUiLCJyZXNwb25zZSIsInJlbW92ZSIsIm5vdGVDb250ZW50cyIsInVybCIsInJvdXRlIiwidHlwZSIsImRhdGEiLCJub3RlX3R5cGUiLCJwcmVwZW5kIiwibmV3X25vdGUiLCJmb3JtIiwiaGFuZGxlQWRkUm9vbUNoYW5nZXMiLCJiaW5kIiwiaGFuZGxlRGF0ZUNoYW5nZXMiLCJoYW5kbGVDYWxjdWxhdGVUb3RhbCIsInByb3AiLCJwcm94eSIsIm9uU3VibWl0IiwiYWpheFN1Ym1pdCIsInNldFRpbWVvdXQiLCJzdWJtaXQiLCJmYWlsIiwiZXJyb3IiLCJhbGVydCIsInNlbGYiLCJ0b3RhbCIsImZpbmQiLCJlbnN1cmVJbnB1dERhdGVzIiwiYWpheFVwZGF0ZUZvcm0iLCIkY29udGFpbmVyIiwiZGF0ZXBpY2tlciIsImh0bWwiLCIkY2hlY2tfaW4iLCIkY2hlY2tfb3V0IiwibW9kdWxlIiwiZXhwb3J0cyIsImRvaW5nQWpheCIsImN1cnJlbnRBamF4IiwiJHBvcHVwIiwiUG9wdXAiLCJzZXR1cCIsInN1Ym1pdEZvcm0iLCJvcGVuUG9wdXAiLCJfIiwiZGVib3VuY2UiLCJhYm9ydCIsIiRpbnB1dFRvdGFsIiwiZWZmZWN0IiwiYWx3YXlzIiwibGluZUl0ZW0iLCJjdXJyZW50VGFyZ2V0IiwiZGlhbG9nIiwibGluZV9pdGVtX2lkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsSUFBSUMsT0FBT0MsTUFBakI7QUFDQSxJQUFNQyxhQUFhRixPQUFPRyxhQUExQjs7QUFFQSxJQUFNQyxjQUFjLG1CQUFBQyxDQUFRLEVBQVIsQ0FBcEI7QUFDQSxJQUFNQyxlQUFlLG1CQUFBRCxDQUFRLEVBQVIsQ0FBckI7O0FBRUFOLEVBQUUsWUFBVzs7QUFFWCxNQUFNUSxRQUFRUixFQUFFLGdDQUFGLENBQWQ7QUFDQSxNQUFJUSxNQUFNQyxNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDcEIsUUFBSUosV0FBSixDQUFnQkcsS0FBaEI7QUFDRDs7QUFFRCxNQUFJRCxZQUFKOztBQUVBUCxJQUFFLHlCQUFGLEVBQTZCVSxFQUE3QixDQUFnQyxPQUFoQyxFQUF5QyxZQUFXO0FBQ2xELFFBQUksQ0FBRUMsUUFBUVIsV0FBV1MsS0FBWCxDQUFpQixTQUFqQixDQUFSLENBQU4sRUFBNEM7QUFDMUMsYUFBTyxLQUFQO0FBQ0Q7QUFDRixHQUpEOztBQU1BWixJQUFFLDJCQUFGLEVBQStCVSxFQUEvQixDQUFrQyxPQUFsQyxFQUEyQyxjQUEzQyxFQUEyRCxVQUFTRyxDQUFULEVBQVk7QUFDckVBLE1BQUVDLGNBQUY7O0FBRUEsUUFBTUMsWUFBWWYsRUFBRSxVQUFGLEVBQWNnQixHQUFkLEVBQWxCO0FBQ0EsUUFBTUMsT0FBT2pCLEVBQUUsSUFBRixFQUFRa0IsT0FBUixDQUFnQixTQUFoQixDQUFiOztBQUVBQyxPQUFHQyxJQUFILENBQVFDLElBQVIsQ0FBYSx3QkFBYixFQUF1QztBQUNyQ0MsZUFBU3RCLEVBQUVpQixJQUFGLEVBQVFNLElBQVIsQ0FBYSxLQUFiLENBRDRCO0FBRXJDQyxrQkFBWXhCLEVBQUUsVUFBRixFQUFj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QWpCLEVBQWdESyxJQUFoRCxDQUFxRC9CLFNBQVMrQixJQUE5RDtBQUNELE9BSEksQ0FBUDtBQUlEOzs7K0JBRVU1QyxDLEVBQUc7QUFDWkEsUUFBRUMsY0FBRjs7QUFFQVgsaUJBQVd5QyxVQUFYLENBQXNCLElBQXRCLEVBQTRCLDJCQUE1QixFQUNHbkIsSUFESCxDQUNRLFVBQVNDLFFBQVQsRUFBbUI7O0FBRXZCbUIsbUJBQVcsWUFBVztBQUNwQjdDLFlBQUUsV0FBRixFQUFlOEMsTUFBZjtBQUNELFNBRkQsRUFFRyxHQUZIO0FBSUQsT0FQSCxFQVFHQyxJQVJILENBUVEsVUFBU3JCLFFBQVQsRUFBbUI7QUFDdkIsWUFBSUEsU0FBU3NCLEtBQWIsRUFBb0I7QUFDbEJDLGdCQUFNdkIsU0FBU3NCLEtBQWY7QUFDRDtBQUNGLE9BWkg7QUFhRDs7Ozs7O0FBR0hZLE9BQU9DLE9BQVAsR0FBaUJ0RCxZQUFqQixDIiwiZmlsZSI6Ii9qcy9hZG1pbi9lZGl0LWJvb2tpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCAkID0gd2luZG93LmpRdWVyeTtcbmNvbnN0IGF3ZWJvb2tpbmcgPSB3aW5kb3cuVGhlQXdlQm9va2luZztcblxuY29uc3QgQWRkTGluZUl0ZW0gPSByZXF1aXJlKCcuL2Jvb2tpbmcvYWRkLWxpbmUtaXRlbS5qcycpO1xuY29uc3QgRWRpdExpbmVJdGVtID0gcmVxdWlyZSgnLi9ib29raW5nL2VkaXQtbGluZS1pdGVtLmpzJyk7XG5cbiQoZnVuY3Rpb24oKSB7XG5cbiAgY29uc3QgJGZvcm0gPSAkKCcjYXdlYm9va2luZy1hZGQtbGluZS1pdGVtLWZvcm0nKTtcbiAgaWYgKCRmb3JtLmxlbmd0aCA+IDApIHtcbiAgICBuZXcgQWRkTGluZUl0ZW0oJGZvcm0pO1xuICB9XG5cbiAgbmV3IEVkaXRMaW5lSXRlbTtcblxuICAkKCcuanMtZGVsZXRlLWJvb2tpbmctaXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIGlmICghIGNvbmZpcm0oYXdlYm9va2luZy50cmFucygnd2FybmluZycpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgJCgnI2F3ZWJvb2tpbmctYm9va2luZy1ub3RlcycpLm9uKCdjbGljaycsICcuZGVsZXRlX25vdGUnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgYm9va2luZ0lEID0gJCgnI3Bvc3RfSUQnKS52YWwoKTtcbiAgICBjb25zdCBub3RlID0gJCh0aGlzKS5jbG9zZXN0KCdsaS5ub3RlJyk7XG5cbiAgICB3cC5hamF4LnBvc3QoJ2RlbGV0ZV9hd2Vib29raW5nX25vdGUnLCB7XG4gICAgICBub3RlX2lkOiAkKG5vdGUpLmF0dHIoJ3JlbCcpLFxuICAgICAgYm9va2luZ19pZDogJCgnI3Bvc3RfSUQnKS52YWwoKVxuICAgIH0pXG4gICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICQobm90ZSkucmVtb3ZlKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gICQoJyNhd2Vib29raW5nLWJvb2tpbmctbm90ZXMnKS5vbignY2xpY2snLCAnYnV0dG9uLmFkZF9ub3RlJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBib29raW5nSUQgPSAkKCcjcG9zdF9JRCcpLnZhbCgpO1xuICAgIGNvbnN0IG5vdGVDb250ZW50cyA9ICQoJ3RleHRhcmVhI2FkZF9ib29raW5nX25vdGUnKS52YWwoKTtcblxuICAgIGlmICghIG5vdGVDb250ZW50cyApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiBhd2Vib29raW5nLnJvdXRlKCdib29raW5nLycgKyBib29raW5nSUQgKyAnL2FkZF9ub3RlJyksXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG5vdGU6IG5vdGVDb250ZW50cyxcbiAgICAgICAgbm90ZV90eXBlOiAkKCdzZWxlY3QjYm9va2luZ19ub3RlX3R5cGUnKS52YWwoKSxcbiAgICAgIH0sXG4gICAgfSlcbiAgICAuZG9uZShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAkKCd1bC5ib29raW5nX25vdGVzJykucHJlcGVuZChkYXRhLm5ld19ub3RlKTtcbiAgICAgICQoJyNhZGRfYm9va2luZ19ub3RlJykudmFsKCcnKTtcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL2VkaXQtYm9va2luZy5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xuY29uc3QgYXdlYm9va2luZyA9IHdpbmRvdy5UaGVBd2VCb29raW5nO1xuXG5jbGFzcyBBZGRMaW5lSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGZvcm0pIHtcbiAgICB0aGlzLmZvcm0gID0gKGZvcm0gaW5zdGFuY2VvZiBqUXVlcnkpID8gZm9ybVswXSA6IGZvcm07XG4gICAgdGhpcy4kZm9ybSA9ICQodGhpcy5mb3JtKTtcblxuICAgIHRoaXMuJGZvcm0ub24oJ2NoYW5nZScsICcjYWRkX3Jvb20nLCB0aGlzLmhhbmRsZUFkZFJvb21DaGFuZ2VzLmJpbmQodGhpcykpO1xuICAgIHRoaXMuJGZvcm0ub24oJ2NoYW5nZScsICcjYWRkX2NoZWNrX2luX291dF8wJywgdGhpcy5oYW5kbGVEYXRlQ2hhbmdlcy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLiRmb3JtLm9uKCdjaGFuZ2UnLCAnI2FkZF9jaGVja19pbl9vdXRfMScsIHRoaXMuaGFuZGxlRGF0ZUNoYW5nZXMuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLiRmb3JtLm9uKCdjaGFuZ2UnLCAnI2FkZF9hZHVsdHMsICNhZGRfY2hpbGRyZW4sICNhZGRfaW5mYW50cywgW25hbWU9XCJhZGRfc2VydmljZXNcXFtcXF1cIl0nLCB0aGlzLmhhbmRsZUNhbGN1bGF0ZVRvdGFsLmJpbmQodGhpcykpO1xuXG4gICAgJCgnYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0nLCB0aGlzLiRmb3JtKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIHRoaXMuJGZvcm0ub24oJ3N1Ym1pdCcsICQucHJveHkodGhpcy5vblN1Ym1pdCwgdGhpcykpO1xuICB9XG5cbiAgb25TdWJtaXQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGF3ZWJvb2tpbmcuYWpheFN1Ym1pdCh0aGlzLmZvcm0sICdhZGRfYXdlYm9va2luZ19saW5lX2l0ZW0nKVxuICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQoJ2Zvcm0jcG9zdCcpLnN1Ym1pdCgpO1xuICAgICAgICB9LCAyNTApO1xuXG4gICAgICB9KVxuICAgICAgLmZhaWwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgYWxlcnQocmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUNhbGN1bGF0ZVRvdGFsKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgYXdlYm9va2luZy5hamF4U3VibWl0KHRoaXMuZm9ybSwgJ2F3ZWJvb2tpbmdfY2FsY3VsYXRlX2xpbmVfaXRlbV90b3RhbCcpXG4gICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2UudG90YWwpIHtcbiAgICAgICAgICBzZWxmLiRmb3JtLmZpbmQoJyNhZGRfcHJpY2UnKS52YWwocmVzcG9uc2UudG90YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZURhdGVDaGFuZ2VzKCkge1xuICAgIGlmICghIHRoaXMuZW5zdXJlSW5wdXREYXRlcygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgYW55IGNoZWNrLWluL291dCBjaGFuZ2VzLFxuICAgIC8vIHdlIHdpbGwgcmVzZXQgdGhlIGBhZGRfcm9vbWAgaW5wdXQuXG4gICAgdGhpcy4kZm9ybS5maW5kKCcjYWRkX3Jvb20nKS52YWwoJycpO1xuXG4gICAgLy8gVGhlbiwgY2FsbCBhamF4IHRvIHVwZGF0ZSBuZXcgdGVtcGxhdGUuXG4gICAgdGhpcy5hamF4VXBkYXRlRm9ybSgpO1xuICB9XG5cbiAgaGFuZGxlQWRkUm9vbUNoYW5nZXMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoISB0aGlzLmVuc3VyZUlucHV0RGF0ZXMoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYWpheFVwZGF0ZUZvcm0oKVxuICAgICAgLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJywgc2VsZi4kZm9ybSkucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGFqYXhVcGRhdGVGb3JtKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBzZWxmLiRmb3JtLmZpbmQoJy5hd2Vib29raW5nLWRpYWxvZy1jb250ZW50cycpO1xuXG4gICAgcmV0dXJuIGF3ZWJvb2tpbmcuYWpheFN1Ym1pdCh0aGlzLmZvcm0sICdnZXRfYXdlYm9va2luZ19hZGRfaXRlbV9mb3JtJylcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICQoJyNhZGRfY2hlY2tfaW5fb3V0XzAnLCAkY29udGFpbmVyKS5kYXRlcGlja2VyKCdkZXN0cm95Jyk7XG4gICAgICAgICQoJyNhZGRfY2hlY2tfaW5fb3V0XzEnLCAkY29udGFpbmVyKS5kYXRlcGlja2VyKCdkZXN0cm95Jyk7XG5cbiAgICAgICAgJGNvbnRhaW5lci5odG1sKHJlc3BvbnNlLmh0bWwpO1xuICAgICAgfSk7XG4gIH1cblxuICBlbnN1cmVJbnB1dERhdGVzKCkge1xuICAgIHZhciAkY2hlY2tfaW4gID0gdGhpcy4kZm9ybS5maW5kKCcjYWRkX2NoZWNrX2luX291dF8wJyk7XG4gICAgdmFyICRjaGVja19vdXQgPSB0aGlzLiRmb3JtLmZpbmQoJyNhZGRfY2hlY2tfaW5fb3V0XzEnKTtcblxuICAgIHJldHVybiAkY2hlY2tfaW4udmFsKCkgJiYgJGNoZWNrX291dC52YWwoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFkZExpbmVJdGVtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL2Jvb2tpbmcvYWRkLWxpbmUtaXRlbS5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xuY29uc3QgYXdlYm9va2luZyA9IHdpbmRvdy5UaGVBd2VCb29raW5nO1xuXG5jbGFzcyBFZGl0TGluZUl0ZW0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRvaW5nQWpheCA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudEFqYXggPSBudWxsO1xuXG4gICAgdGhpcy4kcG9wdXAgPSAkKCcjYXdlYm9va2luZy1lZGl0LWxpbmUtaXRlbS1wb3B1cCcpO1xuICAgIGF3ZWJvb2tpbmcuUG9wdXAuc2V0dXAodGhpcy4kcG9wdXApO1xuXG4gICAgJCgnZm9ybScsIHRoaXMuJHBvcHVwKS5vbignc3VibWl0JywgdGhpcy5zdWJtaXRGb3JtKTtcbiAgICAkKCcuanMtZWRpdC1saW5lLWl0ZW0nKS5vbignY2xpY2snLCB0aGlzLm9wZW5Qb3B1cC5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuJHBvcHVwLm9uKFxuICAgICAgJ2NoYW5nZScsICcjZWRpdF9hZHVsdHMsICNlZGl0X2NoaWxkcmVuLCAjZWRpdF9pbmZhbnRzLCAjZWRpdF9jaGVja19pbl9vdXRfMCwgI2VkaXRfY2hlY2tfaW5fb3V0XzEsIFtuYW1lPVwiZWRpdF9zZXJ2aWNlc1xcW1xcXVwiXScsXG4gICAgICBfLmRlYm91bmNlKHRoaXMuaGFuZGxlQ2FsY3VsYXRlVG90YWwuYmluZCh0aGlzKSwgMjUwKVxuICAgICk7XG4gIH1cblxuICBoYW5kbGVDYWxjdWxhdGVUb3RhbCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICh0aGlzLmRvaW5nQWpheCAmJiB0aGlzLmN1cnJlbnRBamF4KSB7XG4gICAgICB0aGlzLmN1cnJlbnRBamF4LmFib3J0KCk7XG4gICAgfVxuXG4gICAgc2VsZi5kb2luZ0FqYXggPSB0cnVlO1xuXG4gICAgdGhpcy5jdXJyZW50QWpheCA9IGF3ZWJvb2tpbmcuYWpheFN1Ym1pdCh0aGlzLiRwb3B1cC5maW5kKCdmb3JtJylbMF0sICdhd2Vib29raW5nX2NhbGN1bGF0ZV91cGRhdGVfbGluZV9pdGVtX3RvdGFsJylcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnN0ICRpbnB1dFRvdGFsID0gc2VsZi4kcG9wdXAuZmluZCgnI2VkaXRfdG90YWwnKTtcblxuICAgICAgICBpZiAocmVzcG9uc2UudG90YWwgJiYgJGlucHV0VG90YWwudmFsKCkgIT0gcmVzcG9uc2UudG90YWwpIHtcbiAgICAgICAgICAgICRpbnB1dFRvdGFsXG4gICAgICAgICAgICAudmFsKHJlc3BvbnNlLnRvdGFsKVxuICAgICAgICAgICAgLmVmZmVjdCgnaGlnaGxpZ2h0Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuYWx3YXlzKGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLmRvaW5nQWpheCA9IGZhbHNlO1xuICAgICAgfSk7XG4gIH1cblxuICBvcGVuUG9wdXAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBjb25zdCBsaW5lSXRlbSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdsaW5lSXRlbScpO1xuXG4gICAgc2VsZi4kcG9wdXAuZmluZCgnLmF3ZWJvb2tpbmctZGlhbG9nLWNvbnRlbnRzJykuaHRtbCgnPGRpdiBjbGFzcz1cImF3ZWJvb2tpbmctc3RhdGljLXNwaW5uZXJcIj48c3BhbiBjbGFzcz1cInNwaW5uZXJcIj48L3NwYW4+PC9kaXY+Jyk7XG4gICAgc2VsZi4kcG9wdXAuZGlhbG9nKCdvcGVuJyk7XG5cbiAgICByZXR1cm4gd3AuYWpheC5wb3N0KCdnZXRfYXdlYm9va2luZ19lZGl0X2xpbmVfaXRlbV9mb3JtJywgeyBsaW5lX2l0ZW1faWQ6IGxpbmVJdGVtIH0pXG4gICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBzZWxmLiRwb3B1cC5maW5kKCcuYXdlYm9va2luZy1kaWFsb2ctY29udGVudHMnKS5odG1sKHJlc3BvbnNlLmh0bWwpO1xuICAgICAgfSk7XG4gIH1cblxuICBzdWJtaXRGb3JtKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBhd2Vib29raW5nLmFqYXhTdWJtaXQodGhpcywgJ2VkaXRfYXdlYm9va2luZ19saW5lX2l0ZW0nKVxuICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQoJ2Zvcm0jcG9zdCcpLnN1Ym1pdCgpO1xuICAgICAgICB9LCAyNTApO1xuXG4gICAgICB9KVxuICAgICAgLmZhaWwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgYWxlcnQocmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVkaXRMaW5lSXRlbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi9ib29raW5nL2VkaXQtbGluZS1pdGVtLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==