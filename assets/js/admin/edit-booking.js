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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanNzcmMvYWRtaW4vZWRpdC1ib29raW5nLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi9ib29raW5nL2FkZC1saW5lLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL2Jvb2tpbmcvZWRpdC1saW5lLWl0ZW0uanMiXSwibmFtZXMiOlsiJCIsIndpbmRvdyIsImpRdWVyeSIsImF3ZWJvb2tpbmciLCJUaGVBd2VCb29raW5nIiwiQWRkTGluZUl0ZW0iLCJyZXF1aXJlIiwiRWRpdExpbmVJdGVtIiwiJGZvcm0iLCJsZW5ndGgiLCJvbiIsImNvbmZpcm0iLCJ0cmFucyIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImJvb2tpbmdJRCIsInZhbCIsIm5vdGUiLCJjbG9zZXN0Iiwid3AiLCJhamF4IiwicG9zdCIsIm5vdGVfaWQiLCJhdHRyIiwiYm9va2luZ19pZCIsImRvbmUiLCJyZXNwb25zZSIsInJlbW92ZSIsIm5vdGVDb250ZW50cyIsInVybCIsInJvdXRlIiwidHlwZSIsImRhdGEiLCJub3RlX3R5cGUiLCJwcmVwZW5kIiwibmV3X25vdGUiLCJmb3JtIiwiaGFuZGxlQWRkUm9vbUNoYW5nZXMiLCJiaW5kIiwiaGFuZGxlRGF0ZUNoYW5nZXMiLCJoYW5kbGVDYWxjdWxhdGVUb3RhbCIsInByb3AiLCJwcm94eSIsIm9uU3VibWl0IiwiYWpheFN1Ym1pdCIsInNldFRpbWVvdXQiLCJzdWJtaXQiLCJmYWlsIiwiZXJyb3IiLCJhbGVydCIsInNlbGYiLCJ0b3RhbCIsImZpbmQiLCJlbnN1cmVJbnB1dERhdGVzIiwiYWpheFVwZGF0ZUZvcm0iLCIkY29udGFpbmVyIiwiZGF0ZXBpY2tlciIsImh0bWwiLCIkY2hlY2tfaW4iLCIkY2hlY2tfb3V0IiwibW9kdWxlIiwiZXhwb3J0cyIsImRvaW5nQWpheCIsImN1cnJlbnRBamF4IiwiJHBvcHVwIiwiUG9wdXAiLCJzZXR1cCIsInN1Ym1pdEZvcm0iLCJvcGVuUG9wdXAiLCJfIiwiZGVib3VuY2UiLCJhYm9ydCIsIiRpbnB1dFRvdGFsIiwiZWZmZWN0IiwiYWx3YXlzIiwibGluZUl0ZW0iLCJjdXJyZW50VGFyZ2V0IiwiZGlhbG9nIiwibGluZV9pdGVtX2lkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsSUFBSUMsT0FBT0MsTUFBakI7QUFDQSxJQUFNQyxhQUFhRixPQUFPRyxhQUExQjs7QUFFQSxJQUFNQyxjQUFjLG1CQUFBQyxDQUFRLEVBQVIsQ0FBcEI7QUFDQSxJQUFNQyxlQUFlLG1CQUFBRCxDQUFRLEVBQVIsQ0FBckI7O0FBRUFOLEVBQUUsWUFBVzs7QUFFWCxNQUFNUSxRQUFRUixFQUFFLGdDQUFGLENBQWQ7QUFDQSxNQUFJUSxNQUFNQyxNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDcEIsUUFBSUosV0FBSixDQUFnQkcsS0FBaEI7QUFDRDs7QUFFRCxNQUFJRCxZQUFKOztBQUVBUCxJQUFFLHlCQUFGLEVBQTZCVSxFQUE3QixDQUFnQyxPQUFoQyxFQUF5QyxZQUFXO0FBQ2xELFFBQUksQ0FBRUMsUUFBUVIsV0FBV1MsS0FBWCxDQUFpQixTQUFqQixDQUFSLENBQU4sRUFBNEM7QUFDMUMsYUFBTyxLQUFQO0FBQ0Q7QUFDRixHQUpEOztBQU1BWixJQUFFLDJCQUFGLEVBQStCVSxFQUEvQixDQUFrQyxPQUFsQyxFQUEyQyxjQUEzQyxFQUEyRCxVQUFTRyxDQUFULEVBQVk7QUFDckVBLE1BQUVDLGNBQUY7O0FBRUEsUUFBTUMsWUFBWWYsRUFBRSxVQUFGLEVBQWNnQixHQUFkLEVBQWxCO0FBQ0EsUUFBTUMsT0FBT2pCLEVBQUUsSUFBRixFQUFRa0IsT0FBUixDQUFnQixTQUFoQixDQUFiOztBQUVBQyxPQUFHQyxJQUFILENBQVFDLElBQVIsQ0FBYSx3QkFBYixFQUF1QztBQUNyQ0MsZUFBU3RCLEVBQUVpQixJQUFGLEVBQVFNLElBQVIsQ0FBYSxLQUFiLENBRDRCO0FBRXJDQyxrQkFBWXhCLEVBQUUsVUFBRixFQUFj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QWpCLEVBQWdESyxJQUFoRCxDQUFxRC9CLFNBQVMrQixJQUE5RDtBQUNELE9BSEksQ0FBUDtBQUlEOzs7K0JBRVU1QyxDLEVBQUc7QUFDWkEsUUFBRUMsY0FBRjs7QUFFQVgsaUJBQVd5QyxVQUFYLENBQXNCLElBQXRCLEVBQTRCLDJCQUE1QixFQUNHbkIsSUFESCxDQUNRLFVBQVNDLFFBQVQsRUFBbUI7O0FBRXZCbUIsbUJBQVcsWUFBVztBQUNwQjdDLFlBQUUsV0FBRixFQUFlOEMsTUFBZjtBQUNELFNBRkQsRUFFRyxHQUZIO0FBSUQsT0FQSCxFQVFHQyxJQVJILENBUVEsVUFBU3JCLFFBQVQsRUFBbUI7QUFDdkIsWUFBSUEsU0FBU3NCLEtBQWIsRUFBb0I7QUFDbEJDLGdCQUFNdkIsU0FBU3NCLEtBQWY7QUFDRDtBQUNGLE9BWkg7QUFhRDs7Ozs7O0FBR0hZLE9BQU9DLE9BQVAsR0FBaUJ0RCxZQUFqQixDIiwiZmlsZSI6IlxcanNcXGFkbWluXFxlZGl0LWJvb2tpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCAkID0gd2luZG93LmpRdWVyeTtcclxuY29uc3QgYXdlYm9va2luZyA9IHdpbmRvdy5UaGVBd2VCb29raW5nO1xyXG5cclxuY29uc3QgQWRkTGluZUl0ZW0gPSByZXF1aXJlKCcuL2Jvb2tpbmcvYWRkLWxpbmUtaXRlbS5qcycpO1xyXG5jb25zdCBFZGl0TGluZUl0ZW0gPSByZXF1aXJlKCcuL2Jvb2tpbmcvZWRpdC1saW5lLWl0ZW0uanMnKTtcclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcblxyXG4gIGNvbnN0ICRmb3JtID0gJCgnI2F3ZWJvb2tpbmctYWRkLWxpbmUtaXRlbS1mb3JtJyk7XHJcbiAgaWYgKCRmb3JtLmxlbmd0aCA+IDApIHtcclxuICAgIG5ldyBBZGRMaW5lSXRlbSgkZm9ybSk7XHJcbiAgfVxyXG5cclxuICBuZXcgRWRpdExpbmVJdGVtO1xyXG5cclxuICAkKCcuanMtZGVsZXRlLWJvb2tpbmctaXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCEgY29uZmlybShhd2Vib29raW5nLnRyYW5zKCd3YXJuaW5nJykpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCgnI2F3ZWJvb2tpbmctYm9va2luZy1ub3RlcycpLm9uKCdjbGljaycsICcuZGVsZXRlX25vdGUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgYm9va2luZ0lEID0gJCgnI3Bvc3RfSUQnKS52YWwoKTtcclxuICAgIGNvbnN0IG5vdGUgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpLm5vdGUnKTtcclxuXHJcbiAgICB3cC5hamF4LnBvc3QoJ2RlbGV0ZV9hd2Vib29raW5nX25vdGUnLCB7XHJcbiAgICAgIG5vdGVfaWQ6ICQobm90ZSkuYXR0cigncmVsJyksXHJcbiAgICAgIGJvb2tpbmdfaWQ6ICQoJyNwb3N0X0lEJykudmFsKClcclxuICAgIH0pXHJcbiAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAkKG5vdGUpLnJlbW92ZSgpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gICQoJyNhd2Vib29raW5nLWJvb2tpbmctbm90ZXMnKS5vbignY2xpY2snLCAnYnV0dG9uLmFkZF9ub3RlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBjb25zdCBib29raW5nSUQgPSAkKCcjcG9zdF9JRCcpLnZhbCgpO1xyXG4gICAgY29uc3Qgbm90ZUNvbnRlbnRzID0gJCgndGV4dGFyZWEjYWRkX2Jvb2tpbmdfbm90ZScpLnZhbCgpO1xyXG5cclxuICAgIGlmICghIG5vdGVDb250ZW50cyApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogYXdlYm9va2luZy5yb3V0ZSgnYm9va2luZy8nICsgYm9va2luZ0lEICsgJy9hZGRfbm90ZScpLFxyXG4gICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBub3RlOiBub3RlQ29udGVudHMsXHJcbiAgICAgICAgbm90ZV90eXBlOiAkKCdzZWxlY3QjYm9va2luZ19ub3RlX3R5cGUnKS52YWwoKSxcclxuICAgICAgfSxcclxuICAgIH0pXHJcbiAgICAuZG9uZShmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICQoJ3VsLmJvb2tpbmdfbm90ZXMnKS5wcmVwZW5kKGRhdGEubmV3X25vdGUpO1xyXG4gICAgICAkKCcjYWRkX2Jvb2tpbmdfbm90ZScpLnZhbCgnJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbn0pO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vZWRpdC1ib29raW5nLmpzIiwiY29uc3QgJCA9IHdpbmRvdy5qUXVlcnk7XHJcbmNvbnN0IGF3ZWJvb2tpbmcgPSB3aW5kb3cuVGhlQXdlQm9va2luZztcclxuXHJcbmNsYXNzIEFkZExpbmVJdGVtIHtcclxuICBjb25zdHJ1Y3Rvcihmb3JtKSB7XHJcbiAgICB0aGlzLmZvcm0gID0gKGZvcm0gaW5zdGFuY2VvZiBqUXVlcnkpID8gZm9ybVswXSA6IGZvcm07XHJcbiAgICB0aGlzLiRmb3JtID0gJCh0aGlzLmZvcm0pO1xyXG5cclxuICAgIHRoaXMuJGZvcm0ub24oJ2NoYW5nZScsICcjYWRkX3Jvb20nLCB0aGlzLmhhbmRsZUFkZFJvb21DaGFuZ2VzLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy4kZm9ybS5vbignY2hhbmdlJywgJyNhZGRfY2hlY2tfaW5fb3V0XzAnLCB0aGlzLmhhbmRsZURhdGVDaGFuZ2VzLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy4kZm9ybS5vbignY2hhbmdlJywgJyNhZGRfY2hlY2tfaW5fb3V0XzEnLCB0aGlzLmhhbmRsZURhdGVDaGFuZ2VzLmJpbmQodGhpcykpO1xyXG5cclxuICAgIHRoaXMuJGZvcm0ub24oJ2NoYW5nZScsICcjYWRkX2FkdWx0cywgI2FkZF9jaGlsZHJlbiwgI2FkZF9pbmZhbnRzLCBbbmFtZT1cImFkZF9zZXJ2aWNlc1xcW1xcXVwiXScsIHRoaXMuaGFuZGxlQ2FsY3VsYXRlVG90YWwuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgJCgnYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0nLCB0aGlzLiRmb3JtKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgdGhpcy4kZm9ybS5vbignc3VibWl0JywgJC5wcm94eSh0aGlzLm9uU3VibWl0LCB0aGlzKSk7XHJcbiAgfVxyXG5cclxuICBvblN1Ym1pdChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgYXdlYm9va2luZy5hamF4U3VibWl0KHRoaXMuZm9ybSwgJ2FkZF9hd2Vib29raW5nX2xpbmVfaXRlbScpXHJcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAkKCdmb3JtI3Bvc3QnKS5zdWJtaXQoKTtcclxuICAgICAgICB9LCAyNTApO1xyXG5cclxuICAgICAgfSlcclxuICAgICAgLmZhaWwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgIGFsZXJ0KHJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2FsY3VsYXRlVG90YWwoKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICBhd2Vib29raW5nLmFqYXhTdWJtaXQodGhpcy5mb3JtLCAnYXdlYm9va2luZ19jYWxjdWxhdGVfbGluZV9pdGVtX3RvdGFsJylcclxuICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2UudG90YWwpIHtcclxuICAgICAgICAgIHNlbGYuJGZvcm0uZmluZCgnI2FkZF9wcmljZScpLnZhbChyZXNwb25zZS50b3RhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZURhdGVDaGFuZ2VzKCkge1xyXG4gICAgaWYgKCEgdGhpcy5lbnN1cmVJbnB1dERhdGVzKCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGFueSBjaGVjay1pbi9vdXQgY2hhbmdlcyxcclxuICAgIC8vIHdlIHdpbGwgcmVzZXQgdGhlIGBhZGRfcm9vbWAgaW5wdXQuXHJcbiAgICB0aGlzLiRmb3JtLmZpbmQoJyNhZGRfcm9vbScpLnZhbCgnJyk7XHJcblxyXG4gICAgLy8gVGhlbiwgY2FsbCBhamF4IHRvIHVwZGF0ZSBuZXcgdGVtcGxhdGUuXHJcbiAgICB0aGlzLmFqYXhVcGRhdGVGb3JtKCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVBZGRSb29tQ2hhbmdlcygpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGlmICghIHRoaXMuZW5zdXJlSW5wdXREYXRlcygpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFqYXhVcGRhdGVGb3JtKClcclxuICAgICAgLmRvbmUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0nLCBzZWxmLiRmb3JtKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBhamF4VXBkYXRlRm9ybSgpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgY29uc3QgJGNvbnRhaW5lciA9IHNlbGYuJGZvcm0uZmluZCgnLmF3ZWJvb2tpbmctZGlhbG9nLWNvbnRlbnRzJyk7XHJcblxyXG4gICAgcmV0dXJuIGF3ZWJvb2tpbmcuYWpheFN1Ym1pdCh0aGlzLmZvcm0sICdnZXRfYXdlYm9va2luZ19hZGRfaXRlbV9mb3JtJylcclxuICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAkKCcjYWRkX2NoZWNrX2luX291dF8wJywgJGNvbnRhaW5lcikuZGF0ZXBpY2tlcignZGVzdHJveScpO1xyXG4gICAgICAgICQoJyNhZGRfY2hlY2tfaW5fb3V0XzEnLCAkY29udGFpbmVyKS5kYXRlcGlja2VyKCdkZXN0cm95Jyk7XHJcblxyXG4gICAgICAgICRjb250YWluZXIuaHRtbChyZXNwb25zZS5odG1sKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBlbnN1cmVJbnB1dERhdGVzKCkge1xyXG4gICAgdmFyICRjaGVja19pbiAgPSB0aGlzLiRmb3JtLmZpbmQoJyNhZGRfY2hlY2tfaW5fb3V0XzAnKTtcclxuICAgIHZhciAkY2hlY2tfb3V0ID0gdGhpcy4kZm9ybS5maW5kKCcjYWRkX2NoZWNrX2luX291dF8xJyk7XHJcblxyXG4gICAgcmV0dXJuICRjaGVja19pbi52YWwoKSAmJiAkY2hlY2tfb3V0LnZhbCgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBZGRMaW5lSXRlbTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL2Jvb2tpbmcvYWRkLWxpbmUtaXRlbS5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5jb25zdCBhd2Vib29raW5nID0gd2luZG93LlRoZUF3ZUJvb2tpbmc7XHJcblxyXG5jbGFzcyBFZGl0TGluZUl0ZW0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kb2luZ0FqYXggPSBmYWxzZTtcclxuICAgIHRoaXMuY3VycmVudEFqYXggPSBudWxsO1xyXG5cclxuICAgIHRoaXMuJHBvcHVwID0gJCgnI2F3ZWJvb2tpbmctZWRpdC1saW5lLWl0ZW0tcG9wdXAnKTtcclxuICAgIGF3ZWJvb2tpbmcuUG9wdXAuc2V0dXAodGhpcy4kcG9wdXApO1xyXG5cclxuICAgICQoJ2Zvcm0nLCB0aGlzLiRwb3B1cCkub24oJ3N1Ym1pdCcsIHRoaXMuc3VibWl0Rm9ybSk7XHJcbiAgICAkKCcuanMtZWRpdC1saW5lLWl0ZW0nKS5vbignY2xpY2snLCB0aGlzLm9wZW5Qb3B1cC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLiRwb3B1cC5vbihcclxuICAgICAgJ2NoYW5nZScsICcjZWRpdF9hZHVsdHMsICNlZGl0X2NoaWxkcmVuLCAjZWRpdF9pbmZhbnRzLCAjZWRpdF9jaGVja19pbl9vdXRfMCwgI2VkaXRfY2hlY2tfaW5fb3V0XzEsIFtuYW1lPVwiZWRpdF9zZXJ2aWNlc1xcW1xcXVwiXScsXHJcbiAgICAgIF8uZGVib3VuY2UodGhpcy5oYW5kbGVDYWxjdWxhdGVUb3RhbC5iaW5kKHRoaXMpLCAyNTApXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2FsY3VsYXRlVG90YWwoKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICBpZiAodGhpcy5kb2luZ0FqYXggJiYgdGhpcy5jdXJyZW50QWpheCkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRBamF4LmFib3J0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5kb2luZ0FqYXggPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuY3VycmVudEFqYXggPSBhd2Vib29raW5nLmFqYXhTdWJtaXQodGhpcy4kcG9wdXAuZmluZCgnZm9ybScpWzBdLCAnYXdlYm9va2luZ19jYWxjdWxhdGVfdXBkYXRlX2xpbmVfaXRlbV90b3RhbCcpXHJcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgY29uc3QgJGlucHV0VG90YWwgPSBzZWxmLiRwb3B1cC5maW5kKCcjZWRpdF90b3RhbCcpO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2UudG90YWwgJiYgJGlucHV0VG90YWwudmFsKCkgIT0gcmVzcG9uc2UudG90YWwpIHtcclxuICAgICAgICAgICAgJGlucHV0VG90YWxcclxuICAgICAgICAgICAgLnZhbChyZXNwb25zZS50b3RhbClcclxuICAgICAgICAgICAgLmVmZmVjdCgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuYWx3YXlzKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuZG9pbmdBamF4ID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb3BlblBvcHVwKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBjb25zdCBsaW5lSXRlbSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdsaW5lSXRlbScpO1xyXG5cclxuICAgIHNlbGYuJHBvcHVwLmZpbmQoJy5hd2Vib29raW5nLWRpYWxvZy1jb250ZW50cycpLmh0bWwoJzxkaXYgY2xhc3M9XCJhd2Vib29raW5nLXN0YXRpYy1zcGlubmVyXCI+PHNwYW4gY2xhc3M9XCJzcGlubmVyXCI+PC9zcGFuPjwvZGl2PicpO1xyXG4gICAgc2VsZi4kcG9wdXAuZGlhbG9nKCdvcGVuJyk7XHJcblxyXG4gICAgcmV0dXJuIHdwLmFqYXgucG9zdCgnZ2V0X2F3ZWJvb2tpbmdfZWRpdF9saW5lX2l0ZW1fZm9ybScsIHsgbGluZV9pdGVtX2lkOiBsaW5lSXRlbSB9KVxyXG4gICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIHNlbGYuJHBvcHVwLmZpbmQoJy5hd2Vib29raW5nLWRpYWxvZy1jb250ZW50cycpLmh0bWwocmVzcG9uc2UuaHRtbCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3VibWl0Rm9ybShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgYXdlYm9va2luZy5hamF4U3VibWl0KHRoaXMsICdlZGl0X2F3ZWJvb2tpbmdfbGluZV9pdGVtJylcclxuICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICQoJ2Zvcm0jcG9zdCcpLnN1Ym1pdCgpO1xyXG4gICAgICAgIH0sIDI1MCk7XHJcblxyXG4gICAgICB9KVxyXG4gICAgICAuZmFpbChmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgYWxlcnQocmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVkaXRMaW5lSXRlbTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL2Jvb2tpbmcvZWRpdC1saW5lLWl0ZW0uanMiXSwic291cmNlUm9vdCI6IiJ9