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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanNzcmMvYWRtaW4vZWRpdC1ib29raW5nLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi9ib29raW5nL2FkZC1saW5lLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL2Jvb2tpbmcvZWRpdC1saW5lLWl0ZW0uanMiXSwibmFtZXMiOlsiJCIsIndpbmRvdyIsImpRdWVyeSIsImF3ZWJvb2tpbmciLCJUaGVBd2VCb29raW5nIiwiQWRkTGluZUl0ZW0iLCJyZXF1aXJlIiwiRWRpdExpbmVJdGVtIiwiJGZvcm0iLCJsZW5ndGgiLCJvbiIsImNvbmZpcm0iLCJ0cmFucyIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImVsIiwibm90ZSIsImNsb3Nlc3QiLCJ3cCIsImFqYXgiLCJwb3N0Iiwibm90ZV9pZCIsImF0dHIiLCJib29raW5nX2lkIiwidmFsIiwiZG9uZSIsInJlc3BvbnNlIiwicmVtb3ZlIiwibm90ZUNvbnRlbnRzIiwibm90ZV90eXBlIiwiZGF0YSIsInByZXBlbmQiLCJuZXdfbm90ZSIsImZvcm0iLCJoYW5kbGVBZGRSb29tQ2hhbmdlcyIsImJpbmQiLCJoYW5kbGVEYXRlQ2hhbmdlcyIsImhhbmRsZUNhbGN1bGF0ZVRvdGFsIiwicHJvcCIsInByb3h5Iiwib25TdWJtaXQiLCJhamF4U3VibWl0Iiwic2V0VGltZW91dCIsInN1Ym1pdCIsImZhaWwiLCJlcnJvciIsImFsZXJ0Iiwic2VsZiIsInRvdGFsIiwiZmluZCIsImVuc3VyZUlucHV0RGF0ZXMiLCJhamF4VXBkYXRlRm9ybSIsIiRjb250YWluZXIiLCJkYXRlcGlja2VyIiwiaHRtbCIsIiRjaGVja19pbiIsIiRjaGVja19vdXQiLCJtb2R1bGUiLCJleHBvcnRzIiwiZG9pbmdBamF4IiwiY3VycmVudEFqYXgiLCIkcG9wdXAiLCJQb3B1cCIsInNldHVwIiwic3VibWl0Rm9ybSIsIm9wZW5Qb3B1cCIsIl8iLCJkZWJvdW5jZSIsImFib3J0IiwiJGlucHV0VG90YWwiLCJlZmZlY3QiLCJhbHdheXMiLCJsaW5lSXRlbSIsImN1cnJlbnRUYXJnZXQiLCJkaWFsb2ciLCJsaW5lX2l0ZW1faWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxJQUFJQyxPQUFPQyxNQUFqQjtBQUNBLElBQU1DLGFBQWFGLE9BQU9HLGFBQTFCOztBQUVBLElBQU1DLGNBQWMsbUJBQUFDLENBQVEsRUFBUixDQUFwQjtBQUNBLElBQU1DLGVBQWUsbUJBQUFELENBQVEsRUFBUixDQUFyQjs7QUFFQU4sRUFBRSxZQUFXOztBQUVYLE1BQU1RLFFBQVFSLEVBQUUsZ0NBQUYsQ0FBZDtBQUNBLE1BQUlRLE1BQU1DLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNwQixRQUFJSixXQUFKLENBQWdCRyxLQUFoQjtBQUNEOztBQUVELE1BQUlELFlBQUo7O0FBRUFQLElBQUUseUJBQUYsRUFBNkJVLEVBQTdCLENBQWdDLE9BQWhDLEVBQXlDLFlBQVc7QUFDbEQsUUFBSSxDQUFFQyxRQUFRUixXQUFXUyxLQUFYLENBQWlCLFNBQWpCLENBQVIsQ0FBTixFQUE0QztBQUMxQyxhQUFPLEtBQVA7QUFDRDtBQUNGLEdBSkQ7O0FBTUFaLElBQUUsMkJBQUYsRUFBK0JVLEVBQS9CLENBQWtDLE9BQWxDLEVBQTJDLGNBQTNDLEVBQTJELFVBQVNHLENBQVQsRUFBWTtBQUNyRUEsTUFBRUMsY0FBRjs7QUFFQSxRQUFNQyxLQUFLZixFQUFFLElBQUYsQ0FBWDtBQUNBLFFBQU1nQixPQUFPaEIsRUFBRSxJQUFGLEVBQVFpQixPQUFSLENBQWdCLFNBQWhCLENBQWI7O0FBRUFDLE9BQUdDLElBQUgsQ0FBUUMsSUFBUixDQUFhLHdCQUFiLEVBQXVDO0FBQ3JDQyxlQUFTckIsRUFBRWdCLElBQUYsRUFBUU0sSUFBUixDQUFhLEtBQWIsQ0FENEI7QUFFckNDLGtCQUFZdkIsRUFBRSxVQUFGLEVBQWN3QixHQUFkO0FBRnlCLEtBQXZDLEVBSUNDLElBSkQsQ0FJTSxVQUFT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QUVDLGNBQUY7O0FBRUFYLGlCQUFXc0MsVUFBWCxDQUFzQixJQUF0QixFQUE0QiwyQkFBNUIsRUFDR2hCLElBREgsQ0FDUSxVQUFTQyxRQUFULEVBQW1COztBQUV2QmdCLG1CQUFXLFlBQVc7QUFDcEIxQyxZQUFFLFdBQUYsRUFBZTJDLE1BQWY7QUFDRCxTQUZELEVBRUcsR0FGSDtBQUlELE9BUEgsRUFRR0MsSUFSSCxDQVFRLFVBQVNsQixRQUFULEVBQW1CO0FBQ3ZCLFlBQUlBLFNBQVNtQixLQUFiLEVBQW9CO0FBQ2xCQyxnQkFBTXBCLFNBQVNtQixLQUFmO0FBQ0Q7QUFDRixPQVpIO0FBYUQ7Ozs7OztBQUdIWSxPQUFPQyxPQUFQLEdBQWlCbkQsWUFBakIsQyIsImZpbGUiOiIvanMvYWRtaW4vZWRpdC1ib29raW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgJCA9IHdpbmRvdy5qUXVlcnk7XG5jb25zdCBhd2Vib29raW5nID0gd2luZG93LlRoZUF3ZUJvb2tpbmc7XG5cbmNvbnN0IEFkZExpbmVJdGVtID0gcmVxdWlyZSgnLi9ib29raW5nL2FkZC1saW5lLWl0ZW0uanMnKTtcbmNvbnN0IEVkaXRMaW5lSXRlbSA9IHJlcXVpcmUoJy4vYm9va2luZy9lZGl0LWxpbmUtaXRlbS5qcycpO1xuXG4kKGZ1bmN0aW9uKCkge1xuXG4gIGNvbnN0ICRmb3JtID0gJCgnI2F3ZWJvb2tpbmctYWRkLWxpbmUtaXRlbS1mb3JtJyk7XG4gIGlmICgkZm9ybS5sZW5ndGggPiAwKSB7XG4gICAgbmV3IEFkZExpbmVJdGVtKCRmb3JtKTtcbiAgfVxuXG4gIG5ldyBFZGl0TGluZUl0ZW07XG5cbiAgJCgnLmpzLWRlbGV0ZS1ib29raW5nLWl0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBpZiAoISBjb25maXJtKGF3ZWJvb2tpbmcudHJhbnMoJ3dhcm5pbmcnKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gICQoJyNhd2Vib29raW5nLWJvb2tpbmctbm90ZXMnKS5vbignY2xpY2snLCAnLmRlbGV0ZV9ub3RlJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IGVsID0gJCh0aGlzKTtcbiAgICBjb25zdCBub3RlID0gJCh0aGlzKS5jbG9zZXN0KCdsaS5ub3RlJyk7XG5cbiAgICB3cC5hamF4LnBvc3QoJ2RlbGV0ZV9hd2Vib29raW5nX25vdGUnLCB7XG4gICAgICBub3RlX2lkOiAkKG5vdGUpLmF0dHIoJ3JlbCcpLFxuICAgICAgYm9va2luZ19pZDogJCgnI3Bvc3RfSUQnKS52YWwoKVxuICAgIH0pXG4gICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICQobm90ZSkucmVtb3ZlKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gICQoJyNhd2Vib29raW5nLWJvb2tpbmctbm90ZXMnKS5vbignY2xpY2snLCAnYnV0dG9uLmFkZF9ub3RlJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBub3RlQ29udGVudHMgPSAkKCd0ZXh0YXJlYSNhZGRfYm9va2luZ19ub3RlJykudmFsKCk7XG4gICAgaWYgKCEgbm90ZUNvbnRlbnRzICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHdwLmFqYXgucG9zdCgnYWRkX2F3ZWJvb2tpbmdfbm90ZScsIHtcbiAgICAgIGJvb2tpbmdfaWQ6ICQoJyNwb3N0X0lEJykudmFsKCksXG4gICAgICBub3RlOiAgICAgICAkKCd0ZXh0YXJlYSNhZGRfYm9va2luZ19ub3RlJykudmFsKCksXG4gICAgICBub3RlX3R5cGU6ICAkKCdzZWxlY3QjYm9va2luZ19ub3RlX3R5cGUnKS52YWwoKSxcbiAgICB9KVxuICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICQoJ3VsLmJvb2tpbmdfbm90ZXMnKS5wcmVwZW5kKGRhdGEubmV3X25vdGUpO1xuICAgICAgJCgnI2FkZF9ib29raW5nX25vdGUnKS52YWwoJycpO1xuICAgIH0pXG4gIH0pO1xuXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi9lZGl0LWJvb2tpbmcuanMiLCJjb25zdCAkID0gd2luZG93LmpRdWVyeTtcbmNvbnN0IGF3ZWJvb2tpbmcgPSB3aW5kb3cuVGhlQXdlQm9va2luZztcblxuY2xhc3MgQWRkTGluZUl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihmb3JtKSB7XG4gICAgdGhpcy5mb3JtICA9IChmb3JtIGluc3RhbmNlb2YgalF1ZXJ5KSA/IGZvcm1bMF0gOiBmb3JtO1xuICAgIHRoaXMuJGZvcm0gPSAkKHRoaXMuZm9ybSk7XG5cbiAgICB0aGlzLiRmb3JtLm9uKCdjaGFuZ2UnLCAnI2FkZF9yb29tJywgdGhpcy5oYW5kbGVBZGRSb29tQ2hhbmdlcy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLiRmb3JtLm9uKCdjaGFuZ2UnLCAnI2FkZF9jaGVja19pbl9vdXRfMCcsIHRoaXMuaGFuZGxlRGF0ZUNoYW5nZXMuYmluZCh0aGlzKSk7XG4gICAgdGhpcy4kZm9ybS5vbignY2hhbmdlJywgJyNhZGRfY2hlY2tfaW5fb3V0XzEnLCB0aGlzLmhhbmRsZURhdGVDaGFuZ2VzLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy4kZm9ybS5vbignY2hhbmdlJywgJyNhZGRfYWR1bHRzLCAjYWRkX2NoaWxkcmVuLCAjYWRkX2luZmFudHMsIFtuYW1lPVwiYWRkX3NlcnZpY2VzXFxbXFxdXCJdJywgdGhpcy5oYW5kbGVDYWxjdWxhdGVUb3RhbC5iaW5kKHRoaXMpKTtcblxuICAgICQoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJywgdGhpcy4kZm9ybSkucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB0aGlzLiRmb3JtLm9uKCdzdWJtaXQnLCAkLnByb3h5KHRoaXMub25TdWJtaXQsIHRoaXMpKTtcbiAgfVxuXG4gIG9uU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBhd2Vib29raW5nLmFqYXhTdWJtaXQodGhpcy5mb3JtLCAnYWRkX2F3ZWJvb2tpbmdfbGluZV9pdGVtJylcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKCdmb3JtI3Bvc3QnKS5zdWJtaXQoKTtcbiAgICAgICAgfSwgMjUwKTtcblxuICAgICAgfSlcbiAgICAgIC5mYWlsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgIGFsZXJ0KHJlc3BvbnNlLmVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBoYW5kbGVDYWxjdWxhdGVUb3RhbCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGF3ZWJvb2tpbmcuYWpheFN1Ym1pdCh0aGlzLmZvcm0sICdhd2Vib29raW5nX2NhbGN1bGF0ZV9saW5lX2l0ZW1fdG90YWwnKVxuICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnRvdGFsKSB7XG4gICAgICAgICAgc2VsZi4kZm9ybS5maW5kKCcjYWRkX3ByaWNlJykudmFsKHJlc3BvbnNlLnRvdGFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBoYW5kbGVEYXRlQ2hhbmdlcygpIHtcbiAgICBpZiAoISB0aGlzLmVuc3VyZUlucHV0RGF0ZXMoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIGFueSBjaGVjay1pbi9vdXQgY2hhbmdlcyxcbiAgICAvLyB3ZSB3aWxsIHJlc2V0IHRoZSBgYWRkX3Jvb21gIGlucHV0LlxuICAgIHRoaXMuJGZvcm0uZmluZCgnI2FkZF9yb29tJykudmFsKCcnKTtcblxuICAgIC8vIFRoZW4sIGNhbGwgYWpheCB0byB1cGRhdGUgbmV3IHRlbXBsYXRlLlxuICAgIHRoaXMuYWpheFVwZGF0ZUZvcm0oKTtcbiAgfVxuXG4gIGhhbmRsZUFkZFJvb21DaGFuZ2VzKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCEgdGhpcy5lbnN1cmVJbnB1dERhdGVzKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmFqYXhVcGRhdGVGb3JtKClcbiAgICAgIC5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCdidXR0b25bdHlwZT1cInN1Ym1pdFwiXScsIHNlbGYuJGZvcm0pLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgfSk7XG4gIH1cblxuICBhamF4VXBkYXRlRm9ybSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCAkY29udGFpbmVyID0gc2VsZi4kZm9ybS5maW5kKCcuYXdlYm9va2luZy1kaWFsb2ctY29udGVudHMnKTtcblxuICAgIHJldHVybiBhd2Vib29raW5nLmFqYXhTdWJtaXQodGhpcy5mb3JtLCAnZ2V0X2F3ZWJvb2tpbmdfYWRkX2l0ZW1fZm9ybScpXG4gICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkKCcjYWRkX2NoZWNrX2luX291dF8wJywgJGNvbnRhaW5lcikuZGF0ZXBpY2tlcignZGVzdHJveScpO1xuICAgICAgICAkKCcjYWRkX2NoZWNrX2luX291dF8xJywgJGNvbnRhaW5lcikuZGF0ZXBpY2tlcignZGVzdHJveScpO1xuXG4gICAgICAgICRjb250YWluZXIuaHRtbChyZXNwb25zZS5odG1sKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZW5zdXJlSW5wdXREYXRlcygpIHtcbiAgICB2YXIgJGNoZWNrX2luICA9IHRoaXMuJGZvcm0uZmluZCgnI2FkZF9jaGVja19pbl9vdXRfMCcpO1xuICAgIHZhciAkY2hlY2tfb3V0ID0gdGhpcy4kZm9ybS5maW5kKCcjYWRkX2NoZWNrX2luX291dF8xJyk7XG5cbiAgICByZXR1cm4gJGNoZWNrX2luLnZhbCgpICYmICRjaGVja19vdXQudmFsKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBZGRMaW5lSXRlbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi9ib29raW5nL2FkZC1saW5lLWl0ZW0uanMiLCJjb25zdCAkID0gd2luZG93LmpRdWVyeTtcbmNvbnN0IGF3ZWJvb2tpbmcgPSB3aW5kb3cuVGhlQXdlQm9va2luZztcblxuY2xhc3MgRWRpdExpbmVJdGVtIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kb2luZ0FqYXggPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRBamF4ID0gbnVsbDtcblxuICAgIHRoaXMuJHBvcHVwID0gJCgnI2F3ZWJvb2tpbmctZWRpdC1saW5lLWl0ZW0tcG9wdXAnKTtcbiAgICBhd2Vib29raW5nLlBvcHVwLnNldHVwKHRoaXMuJHBvcHVwKTtcblxuICAgICQoJ2Zvcm0nLCB0aGlzLiRwb3B1cCkub24oJ3N1Ym1pdCcsIHRoaXMuc3VibWl0Rm9ybSk7XG4gICAgJCgnLmpzLWVkaXQtbGluZS1pdGVtJykub24oJ2NsaWNrJywgdGhpcy5vcGVuUG9wdXAuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLiRwb3B1cC5vbihcbiAgICAgICdjaGFuZ2UnLCAnI2VkaXRfYWR1bHRzLCAjZWRpdF9jaGlsZHJlbiwgI2VkaXRfaW5mYW50cywgI2VkaXRfY2hlY2tfaW5fb3V0XzAsICNlZGl0X2NoZWNrX2luX291dF8xLCBbbmFtZT1cImVkaXRfc2VydmljZXNcXFtcXF1cIl0nLFxuICAgICAgXy5kZWJvdW5jZSh0aGlzLmhhbmRsZUNhbGN1bGF0ZVRvdGFsLmJpbmQodGhpcyksIDI1MClcbiAgICApO1xuICB9XG5cbiAgaGFuZGxlQ2FsY3VsYXRlVG90YWwoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5kb2luZ0FqYXggJiYgdGhpcy5jdXJyZW50QWpheCkge1xuICAgICAgdGhpcy5jdXJyZW50QWpheC5hYm9ydCgpO1xuICAgIH1cblxuICAgIHNlbGYuZG9pbmdBamF4ID0gdHJ1ZTtcblxuICAgIHRoaXMuY3VycmVudEFqYXggPSBhd2Vib29raW5nLmFqYXhTdWJtaXQodGhpcy4kcG9wdXAuZmluZCgnZm9ybScpWzBdLCAnYXdlYm9va2luZ19jYWxjdWxhdGVfdXBkYXRlX2xpbmVfaXRlbV90b3RhbCcpXG4gICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjb25zdCAkaW5wdXRUb3RhbCA9IHNlbGYuJHBvcHVwLmZpbmQoJyNlZGl0X3RvdGFsJyk7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLnRvdGFsICYmICRpbnB1dFRvdGFsLnZhbCgpICE9IHJlc3BvbnNlLnRvdGFsKSB7XG4gICAgICAgICAgICAkaW5wdXRUb3RhbFxuICAgICAgICAgICAgLnZhbChyZXNwb25zZS50b3RhbClcbiAgICAgICAgICAgIC5lZmZlY3QoJ2hpZ2hsaWdodCcpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmFsd2F5cyhmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5kb2luZ0FqYXggPSBmYWxzZTtcbiAgICAgIH0pO1xuICB9XG5cbiAgb3BlblBvcHVwKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgbGluZUl0ZW0gPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnbGluZUl0ZW0nKTtcblxuICAgIHNlbGYuJHBvcHVwLmZpbmQoJy5hd2Vib29raW5nLWRpYWxvZy1jb250ZW50cycpLmh0bWwoJzxkaXYgY2xhc3M9XCJhd2Vib29raW5nLXN0YXRpYy1zcGlubmVyXCI+PHNwYW4gY2xhc3M9XCJzcGlubmVyXCI+PC9zcGFuPjwvZGl2PicpO1xuICAgIHNlbGYuJHBvcHVwLmRpYWxvZygnb3BlbicpO1xuXG4gICAgcmV0dXJuIHdwLmFqYXgucG9zdCgnZ2V0X2F3ZWJvb2tpbmdfZWRpdF9saW5lX2l0ZW1fZm9ybScsIHsgbGluZV9pdGVtX2lkOiBsaW5lSXRlbSB9KVxuICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgc2VsZi4kcG9wdXAuZmluZCgnLmF3ZWJvb2tpbmctZGlhbG9nLWNvbnRlbnRzJykuaHRtbChyZXNwb25zZS5odG1sKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgc3VibWl0Rm9ybShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgYXdlYm9va2luZy5hamF4U3VibWl0KHRoaXMsICdlZGl0X2F3ZWJvb2tpbmdfbGluZV9pdGVtJylcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKCdmb3JtI3Bvc3QnKS5zdWJtaXQoKTtcbiAgICAgICAgfSwgMjUwKTtcblxuICAgICAgfSlcbiAgICAgIC5mYWlsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgIGFsZXJ0KHJlc3BvbnNlLmVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0TGluZUl0ZW07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vYm9va2luZy9lZGl0LWxpbmUtaXRlbS5qcyJdLCJzb3VyY2VSb290IjoiIn0=