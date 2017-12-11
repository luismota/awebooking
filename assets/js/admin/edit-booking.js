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

    var el = $(this);
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

    var noteContents = $('textarea#add_booking_note').val();
    if (!noteContents) {
      return;
    }

    wp.ajax.post('add_awebooking_note', {
      booking_id: $('#post_ID').val(),
      note: $('textarea#add_booking_note').val(),
      note_type: $('select#booking_note_type').val()
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanNzcmMvYWRtaW4vZWRpdC1ib29raW5nLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi9ib29raW5nL2FkZC1saW5lLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL2Jvb2tpbmcvZWRpdC1saW5lLWl0ZW0uanMiXSwibmFtZXMiOlsiJCIsIndpbmRvdyIsImpRdWVyeSIsImF3ZWJvb2tpbmciLCJUaGVBd2VCb29raW5nIiwiQWRkTGluZUl0ZW0iLCJyZXF1aXJlIiwiRWRpdExpbmVJdGVtIiwiJGZvcm0iLCJsZW5ndGgiLCJvbiIsImNvbmZpcm0iLCJ0cmFucyIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImVsIiwibm90ZSIsImNsb3Nlc3QiLCJ3cCIsImFqYXgiLCJwb3N0Iiwibm90ZV9pZCIsImF0dHIiLCJib29raW5nX2lkIiwidmFsIiwiZG9uZSIsInJlc3BvbnNlIiwicmVtb3ZlIiwibm90ZUNvbnRlbnRzIiwibm90ZV90eXBlIiwiZGF0YSIsInByZXBlbmQiLCJuZXdfbm90ZSIsImZvcm0iLCJoYW5kbGVBZGRSb29tQ2hhbmdlcyIsImJpbmQiLCJoYW5kbGVEYXRlQ2hhbmdlcyIsImhhbmRsZUNhbGN1bGF0ZVRvdGFsIiwicHJvcCIsInByb3h5Iiwib25TdWJtaXQiLCJhamF4U3VibWl0Iiwic2V0VGltZW91dCIsInN1Ym1pdCIsImZhaWwiLCJlcnJvciIsImFsZXJ0Iiwic2VsZiIsInRvdGFsIiwiZmluZCIsImVuc3VyZUlucHV0RGF0ZXMiLCJhamF4VXBkYXRlRm9ybSIsIiRjb250YWluZXIiLCJkYXRlcGlja2VyIiwiaHRtbCIsIiRjaGVja19pbiIsIiRjaGVja19vdXQiLCJtb2R1bGUiLCJleHBvcnRzIiwiZG9pbmdBamF4IiwiY3VycmVudEFqYXgiLCIkcG9wdXAiLCJQb3B1cCIsInNldHVwIiwic3VibWl0Rm9ybSIsIm9wZW5Qb3B1cCIsIl8iLCJkZWJvdW5jZSIsImFib3J0IiwiJGlucHV0VG90YWwiLCJlZmZlY3QiLCJhbHdheXMiLCJsaW5lSXRlbSIsImN1cnJlbnRUYXJnZXQiLCJkaWFsb2ciLCJsaW5lX2l0ZW1faWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxJQUFJQyxPQUFPQyxNQUFqQjtBQUNBLElBQU1DLGFBQWFGLE9BQU9HLGFBQTFCOztBQUVBLElBQU1DLGNBQWMsbUJBQUFDLENBQVEsRUFBUixDQUFwQjtBQUNBLElBQU1DLGVBQWUsbUJBQUFELENBQVEsRUFBUixDQUFyQjs7QUFFQU4sRUFBRSxZQUFXOztBQUVYLE1BQU1RLFFBQVFSLEVBQUUsZ0NBQUYsQ0FBZDtBQUNBLE1BQUlRLE1BQU1DLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNwQixRQUFJSixXQUFKLENBQWdCRyxLQUFoQjtBQUNEOztBQUVELE1BQUlELFlBQUo7O0FBRUFQLElBQUUseUJBQUYsRUFBNkJVLEVBQTdCLENBQWdDLE9BQWhDLEVBQXlDLFlBQVc7QUFDbEQsUUFBSSxDQUFFQyxRQUFRUixXQUFXUyxLQUFYLENBQWlCLFNBQWpCLENBQVIsQ0FBTixFQUE0QztBQUMxQyxhQUFPLEtBQVA7QUFDRDtBQUNGLEdBSkQ7O0FBTUFaLElBQUUsMkJBQUYsRUFBK0JVLEVBQS9CLENBQWtDLE9BQWxDLEVBQTJDLGNBQTNDLEVBQTJELFVBQVNHLENBQVQsRUFBWTtBQUNyRUEsTUFBRUMsY0FBRjs7QUFFQSxRQUFNQyxLQUFLZixFQUFFLElBQUYsQ0FBWDtBQUNBLFFBQU1nQixPQUFPaEIsRUFBRSxJQUFGLEVBQVFpQixPQUFSLENBQWdCLFNBQWhCLENBQWI7O0FBRUFDLE9BQUdDLElBQUgsQ0FBUUMsSUFBUixDQUFhLHdCQUFiLEVBQXVDO0FBQ3JDQyxlQUFTckIsRUFBRWdCLElBQUYsRUFBUU0sSUFBUixDQUFhLEtBQWIsQ0FENEI7QUFFckNDLGtCQUFZdkIsRUFBRSxVQUFGLEVBQWN3QixHQUFkO0FBRnlCLEtBQXZDLEVBSUNDLElBSkQsQ0FJTSxVQUFT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QUVDLGNBQUY7O0FBRUFYLGlCQUFXc0MsVUFBWCxDQUFzQixJQUF0QixFQUE0QiwyQkFBNUIsRUFDR2hCLElBREgsQ0FDUSxVQUFTQyxRQUFULEVBQW1COztBQUV2QmdCLG1CQUFXLFlBQVc7QUFDcEIxQyxZQUFFLFdBQUYsRUFBZTJDLE1BQWY7QUFDRCxTQUZELEVBRUcsR0FGSDtBQUlELE9BUEgsRUFRR0MsSUFSSCxDQVFRLFVBQVNsQixRQUFULEVBQW1CO0FBQ3ZCLFlBQUlBLFNBQVNtQixLQUFiLEVBQW9CO0FBQ2xCQyxnQkFBTXBCLFNBQVNtQixLQUFmO0FBQ0Q7QUFDRixPQVpIO0FBYUQ7Ozs7OztBQUdIWSxPQUFPQyxPQUFQLEdBQWlCbkQsWUFBakIsQyIsImZpbGUiOiJcXGpzXFxhZG1pblxcZWRpdC1ib29raW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgJCA9IHdpbmRvdy5qUXVlcnk7XHJcbmNvbnN0IGF3ZWJvb2tpbmcgPSB3aW5kb3cuVGhlQXdlQm9va2luZztcclxuXHJcbmNvbnN0IEFkZExpbmVJdGVtID0gcmVxdWlyZSgnLi9ib29raW5nL2FkZC1saW5lLWl0ZW0uanMnKTtcclxuY29uc3QgRWRpdExpbmVJdGVtID0gcmVxdWlyZSgnLi9ib29raW5nL2VkaXQtbGluZS1pdGVtLmpzJyk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG5cclxuICBjb25zdCAkZm9ybSA9ICQoJyNhd2Vib29raW5nLWFkZC1saW5lLWl0ZW0tZm9ybScpO1xyXG4gIGlmICgkZm9ybS5sZW5ndGggPiAwKSB7XHJcbiAgICBuZXcgQWRkTGluZUl0ZW0oJGZvcm0pO1xyXG4gIH1cclxuXHJcbiAgbmV3IEVkaXRMaW5lSXRlbTtcclxuXHJcbiAgJCgnLmpzLWRlbGV0ZS1ib29raW5nLWl0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGlmICghIGNvbmZpcm0oYXdlYm9va2luZy50cmFucygnd2FybmluZycpKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoJyNhd2Vib29raW5nLWJvb2tpbmctbm90ZXMnKS5vbignY2xpY2snLCAnLmRlbGV0ZV9ub3RlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IGVsID0gJCh0aGlzKTtcclxuICAgIGNvbnN0IG5vdGUgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpLm5vdGUnKTtcclxuXHJcbiAgICB3cC5hamF4LnBvc3QoJ2RlbGV0ZV9hd2Vib29raW5nX25vdGUnLCB7XHJcbiAgICAgIG5vdGVfaWQ6ICQobm90ZSkuYXR0cigncmVsJyksXHJcbiAgICAgIGJvb2tpbmdfaWQ6ICQoJyNwb3N0X0lEJykudmFsKClcclxuICAgIH0pXHJcbiAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAkKG5vdGUpLnJlbW92ZSgpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gICQoJyNhd2Vib29raW5nLWJvb2tpbmctbm90ZXMnKS5vbignY2xpY2snLCAnYnV0dG9uLmFkZF9ub3RlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBjb25zdCBub3RlQ29udGVudHMgPSAkKCd0ZXh0YXJlYSNhZGRfYm9va2luZ19ub3RlJykudmFsKCk7XHJcbiAgICBpZiAoISBub3RlQ29udGVudHMgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB3cC5hamF4LnBvc3QoJ2FkZF9hd2Vib29raW5nX25vdGUnLCB7XHJcbiAgICAgIGJvb2tpbmdfaWQ6ICQoJyNwb3N0X0lEJykudmFsKCksXHJcbiAgICAgIG5vdGU6ICAgICAgICQoJ3RleHRhcmVhI2FkZF9ib29raW5nX25vdGUnKS52YWwoKSxcclxuICAgICAgbm90ZV90eXBlOiAgJCgnc2VsZWN0I2Jvb2tpbmdfbm90ZV90eXBlJykudmFsKCksXHJcbiAgICB9KVxyXG4gICAgLmRvbmUoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAkKCd1bC5ib29raW5nX25vdGVzJykucHJlcGVuZChkYXRhLm5ld19ub3RlKTtcclxuICAgICAgJCgnI2FkZF9ib29raW5nX25vdGUnKS52YWwoJycpO1xyXG4gICAgfSlcclxuICB9KTtcclxuXHJcbn0pO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vZWRpdC1ib29raW5nLmpzIiwiY29uc3QgJCA9IHdpbmRvdy5qUXVlcnk7XHJcbmNvbnN0IGF3ZWJvb2tpbmcgPSB3aW5kb3cuVGhlQXdlQm9va2luZztcclxuXHJcbmNsYXNzIEFkZExpbmVJdGVtIHtcclxuICBjb25zdHJ1Y3Rvcihmb3JtKSB7XHJcbiAgICB0aGlzLmZvcm0gID0gKGZvcm0gaW5zdGFuY2VvZiBqUXVlcnkpID8gZm9ybVswXSA6IGZvcm07XHJcbiAgICB0aGlzLiRmb3JtID0gJCh0aGlzLmZvcm0pO1xyXG5cclxuICAgIHRoaXMuJGZvcm0ub24oJ2NoYW5nZScsICcjYWRkX3Jvb20nLCB0aGlzLmhhbmRsZUFkZFJvb21DaGFuZ2VzLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy4kZm9ybS5vbignY2hhbmdlJywgJyNhZGRfY2hlY2tfaW5fb3V0XzAnLCB0aGlzLmhhbmRsZURhdGVDaGFuZ2VzLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy4kZm9ybS5vbignY2hhbmdlJywgJyNhZGRfY2hlY2tfaW5fb3V0XzEnLCB0aGlzLmhhbmRsZURhdGVDaGFuZ2VzLmJpbmQodGhpcykpO1xyXG5cclxuICAgIHRoaXMuJGZvcm0ub24oJ2NoYW5nZScsICcjYWRkX2FkdWx0cywgI2FkZF9jaGlsZHJlbiwgI2FkZF9pbmZhbnRzLCBbbmFtZT1cImFkZF9zZXJ2aWNlc1xcW1xcXVwiXScsIHRoaXMuaGFuZGxlQ2FsY3VsYXRlVG90YWwuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgJCgnYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0nLCB0aGlzLiRmb3JtKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgdGhpcy4kZm9ybS5vbignc3VibWl0JywgJC5wcm94eSh0aGlzLm9uU3VibWl0LCB0aGlzKSk7XHJcbiAgfVxyXG5cclxuICBvblN1Ym1pdChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgYXdlYm9va2luZy5hamF4U3VibWl0KHRoaXMuZm9ybSwgJ2FkZF9hd2Vib29raW5nX2xpbmVfaXRlbScpXHJcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAkKCdmb3JtI3Bvc3QnKS5zdWJtaXQoKTtcclxuICAgICAgICB9LCAyNTApO1xyXG5cclxuICAgICAgfSlcclxuICAgICAgLmZhaWwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgIGFsZXJ0KHJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2FsY3VsYXRlVG90YWwoKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICBhd2Vib29raW5nLmFqYXhTdWJtaXQodGhpcy5mb3JtLCAnYXdlYm9va2luZ19jYWxjdWxhdGVfbGluZV9pdGVtX3RvdGFsJylcclxuICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2UudG90YWwpIHtcclxuICAgICAgICAgIHNlbGYuJGZvcm0uZmluZCgnI2FkZF9wcmljZScpLnZhbChyZXNwb25zZS50b3RhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZURhdGVDaGFuZ2VzKCkge1xyXG4gICAgaWYgKCEgdGhpcy5lbnN1cmVJbnB1dERhdGVzKCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGFueSBjaGVjay1pbi9vdXQgY2hhbmdlcyxcclxuICAgIC8vIHdlIHdpbGwgcmVzZXQgdGhlIGBhZGRfcm9vbWAgaW5wdXQuXHJcbiAgICB0aGlzLiRmb3JtLmZpbmQoJyNhZGRfcm9vbScpLnZhbCgnJyk7XHJcblxyXG4gICAgLy8gVGhlbiwgY2FsbCBhamF4IHRvIHVwZGF0ZSBuZXcgdGVtcGxhdGUuXHJcbiAgICB0aGlzLmFqYXhVcGRhdGVGb3JtKCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVBZGRSb29tQ2hhbmdlcygpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGlmICghIHRoaXMuZW5zdXJlSW5wdXREYXRlcygpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFqYXhVcGRhdGVGb3JtKClcclxuICAgICAgLmRvbmUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0nLCBzZWxmLiRmb3JtKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBhamF4VXBkYXRlRm9ybSgpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgY29uc3QgJGNvbnRhaW5lciA9IHNlbGYuJGZvcm0uZmluZCgnLmF3ZWJvb2tpbmctZGlhbG9nLWNvbnRlbnRzJyk7XHJcblxyXG4gICAgcmV0dXJuIGF3ZWJvb2tpbmcuYWpheFN1Ym1pdCh0aGlzLmZvcm0sICdnZXRfYXdlYm9va2luZ19hZGRfaXRlbV9mb3JtJylcclxuICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAkKCcjYWRkX2NoZWNrX2luX291dF8wJywgJGNvbnRhaW5lcikuZGF0ZXBpY2tlcignZGVzdHJveScpO1xyXG4gICAgICAgICQoJyNhZGRfY2hlY2tfaW5fb3V0XzEnLCAkY29udGFpbmVyKS5kYXRlcGlja2VyKCdkZXN0cm95Jyk7XHJcblxyXG4gICAgICAgICRjb250YWluZXIuaHRtbChyZXNwb25zZS5odG1sKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBlbnN1cmVJbnB1dERhdGVzKCkge1xyXG4gICAgdmFyICRjaGVja19pbiAgPSB0aGlzLiRmb3JtLmZpbmQoJyNhZGRfY2hlY2tfaW5fb3V0XzAnKTtcclxuICAgIHZhciAkY2hlY2tfb3V0ID0gdGhpcy4kZm9ybS5maW5kKCcjYWRkX2NoZWNrX2luX291dF8xJyk7XHJcblxyXG4gICAgcmV0dXJuICRjaGVja19pbi52YWwoKSAmJiAkY2hlY2tfb3V0LnZhbCgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBZGRMaW5lSXRlbTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL2Jvb2tpbmcvYWRkLWxpbmUtaXRlbS5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5jb25zdCBhd2Vib29raW5nID0gd2luZG93LlRoZUF3ZUJvb2tpbmc7XHJcblxyXG5jbGFzcyBFZGl0TGluZUl0ZW0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kb2luZ0FqYXggPSBmYWxzZTtcclxuICAgIHRoaXMuY3VycmVudEFqYXggPSBudWxsO1xyXG5cclxuICAgIHRoaXMuJHBvcHVwID0gJCgnI2F3ZWJvb2tpbmctZWRpdC1saW5lLWl0ZW0tcG9wdXAnKTtcclxuICAgIGF3ZWJvb2tpbmcuUG9wdXAuc2V0dXAodGhpcy4kcG9wdXApO1xyXG5cclxuICAgICQoJ2Zvcm0nLCB0aGlzLiRwb3B1cCkub24oJ3N1Ym1pdCcsIHRoaXMuc3VibWl0Rm9ybSk7XHJcbiAgICAkKCcuanMtZWRpdC1saW5lLWl0ZW0nKS5vbignY2xpY2snLCB0aGlzLm9wZW5Qb3B1cC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLiRwb3B1cC5vbihcclxuICAgICAgJ2NoYW5nZScsICcjZWRpdF9hZHVsdHMsICNlZGl0X2NoaWxkcmVuLCAjZWRpdF9pbmZhbnRzLCAjZWRpdF9jaGVja19pbl9vdXRfMCwgI2VkaXRfY2hlY2tfaW5fb3V0XzEsIFtuYW1lPVwiZWRpdF9zZXJ2aWNlc1xcW1xcXVwiXScsXHJcbiAgICAgIF8uZGVib3VuY2UodGhpcy5oYW5kbGVDYWxjdWxhdGVUb3RhbC5iaW5kKHRoaXMpLCAyNTApXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2FsY3VsYXRlVG90YWwoKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICBpZiAodGhpcy5kb2luZ0FqYXggJiYgdGhpcy5jdXJyZW50QWpheCkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRBamF4LmFib3J0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5kb2luZ0FqYXggPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuY3VycmVudEFqYXggPSBhd2Vib29raW5nLmFqYXhTdWJtaXQodGhpcy4kcG9wdXAuZmluZCgnZm9ybScpWzBdLCAnYXdlYm9va2luZ19jYWxjdWxhdGVfdXBkYXRlX2xpbmVfaXRlbV90b3RhbCcpXHJcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgY29uc3QgJGlucHV0VG90YWwgPSBzZWxmLiRwb3B1cC5maW5kKCcjZWRpdF90b3RhbCcpO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2UudG90YWwgJiYgJGlucHV0VG90YWwudmFsKCkgIT0gcmVzcG9uc2UudG90YWwpIHtcclxuICAgICAgICAgICAgJGlucHV0VG90YWxcclxuICAgICAgICAgICAgLnZhbChyZXNwb25zZS50b3RhbClcclxuICAgICAgICAgICAgLmVmZmVjdCgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuYWx3YXlzKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuZG9pbmdBamF4ID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb3BlblBvcHVwKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBjb25zdCBsaW5lSXRlbSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdsaW5lSXRlbScpO1xyXG5cclxuICAgIHNlbGYuJHBvcHVwLmZpbmQoJy5hd2Vib29raW5nLWRpYWxvZy1jb250ZW50cycpLmh0bWwoJzxkaXYgY2xhc3M9XCJhd2Vib29raW5nLXN0YXRpYy1zcGlubmVyXCI+PHNwYW4gY2xhc3M9XCJzcGlubmVyXCI+PC9zcGFuPjwvZGl2PicpO1xyXG4gICAgc2VsZi4kcG9wdXAuZGlhbG9nKCdvcGVuJyk7XHJcblxyXG4gICAgcmV0dXJuIHdwLmFqYXgucG9zdCgnZ2V0X2F3ZWJvb2tpbmdfZWRpdF9saW5lX2l0ZW1fZm9ybScsIHsgbGluZV9pdGVtX2lkOiBsaW5lSXRlbSB9KVxyXG4gICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIHNlbGYuJHBvcHVwLmZpbmQoJy5hd2Vib29raW5nLWRpYWxvZy1jb250ZW50cycpLmh0bWwocmVzcG9uc2UuaHRtbCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3VibWl0Rm9ybShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgYXdlYm9va2luZy5hamF4U3VibWl0KHRoaXMsICdlZGl0X2F3ZWJvb2tpbmdfbGluZV9pdGVtJylcclxuICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICQoJ2Zvcm0jcG9zdCcpLnN1Ym1pdCgpO1xyXG4gICAgICAgIH0sIDI1MCk7XHJcblxyXG4gICAgICB9KVxyXG4gICAgICAuZmFpbChmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgYWxlcnQocmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVkaXRMaW5lSXRlbTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL2Jvb2tpbmcvZWRpdC1saW5lLWl0ZW0uanMiXSwic291cmNlUm9vdCI6IiJ9