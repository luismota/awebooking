webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

var $ = window.jQuery;

var Utils = {
  getSelectorFromElement: function getSelectorFromElement(el) {
    var selector = el.getAttribute('data-target');

    if (!selector || selector === '#') {
      selector = el.getAttribute('href') || '';
    }

    try {
      var $selector = $(selector);
      return $selector.length > 0 ? selector : null;
    } catch (error) {
      return null;
    }
  }
};

module.exports = Utils;

/***/ }),
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(7);
__webpack_require__(16);
__webpack_require__(17);
module.exports = __webpack_require__(18);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_popper_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tooltip_js__ = __webpack_require__(2);
var $ = window.jQuery;
var settings = window._awebookingSettings || {};




var AweBooking = _.extend(settings, {
  Vue: __webpack_require__(3),
  Popper: __WEBPACK_IMPORTED_MODULE_0_popper_js__["default"],
  Tooltip: __WEBPACK_IMPORTED_MODULE_1_tooltip_js__["default"],

  Popup: __webpack_require__(11),
  ToggleClass: __webpack_require__(12),
  RangeDatepicker: __webpack_require__(13),
  ToggleCheckboxes: __webpack_require__(14),

  /**
   * Init the AweBooking
   */
  init: function init() {
    var self = this;

    // Init the popup, use jquery-ui-popup.
    $('[data-toggle="awebooking-popup"]').each(function () {
      $(this).data('awebooking-popup', new self.Popup(this));
    });

    $('[data-init="awebooking-toggle"]').each(function () {
      $(this).data('awebooking-toggle', new self.ToggleClass(this));
    });

    $('[data-init="awebooking-tooltip"]').each(function () {
      var options = {
        template: '<div class="awebooking-tooltip tooltip" role="tooltip"><div class="tooltip__arrow"></div><div class="tooltip__inner"></div></div>'
      };

      $(this).data('awebooking-tooltip', new self.Tooltip(this, options));
    });

    __webpack_require__(15);
  },


  /**
   * Get a translator string
   */
  trans: function trans(context) {
    return this.strings[context] ? this.strings[context] : '';
  },


  /**
   * Get the admin route.
   *
   * @param  {string} action Optional, action.
   * @return {string}
   */
  route: function route(action) {
    return this.admin_route + action;
  },


  /**
   * Make form ajax request.
   */
  ajaxSubmit: function ajaxSubmit(form, action) {
    var serialize = __webpack_require__(5);
    var data = serialize(form, { hash: true });

    // Add .ajax-loading class in to the form.
    $(form).addClass('ajax-loading');

    $.ajax({
      url: this.admin_route + action,
      type: 'POST',
      data: data
    }).always(function () {
      $(form).removeClass('ajax-loading');
    });
  }
});

$(function () {
  AweBooking.init();
});

window.TheAweBooking = AweBooking;

/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = window.jQuery;
var Utils = __webpack_require__(4);

var Popup = function () {
  /**
   * Wrapper the jquery-ui-popup.
   */
  function Popup(el) {
    _classCallCheck(this, Popup);

    this.el = el;
    this.target = Utils.getSelectorFromElement(el);

    if (this.target) {
      Popup.setup(this.target);

      $(this.el).on('click', this.open.bind(this));
      $(this.target).on('click', '[data-dismiss="awebooking-popup"]', this.close.bind(this));
    }
  }

  _createClass(Popup, [{
    key: 'open',
    value: function open(e) {
      e && e.preventDefault();
      $(this.target).dialog('open');
    }
  }, {
    key: 'close',
    value: function close(e) {
      e && e.preventDefault();
      $(this.target).dialog('close');
    }
  }], [{
    key: 'setup',
    value: function setup(target) {
      var $target = $(target);
      if (!$target.length) {
        return;
      }

      if ($target.dialog('instance')) {
        return;
      }

      var _triggerResize = function _triggerResize() {
        if ($target.dialog('isOpen')) {
          $target.dialog('option', 'position', { my: 'center', at: 'center top+25%', of: window });
        }
      };

      var dialog = $target.dialog({
        modal: true,
        width: 'auto',
        height: 'auto',
        autoOpen: false,
        draggable: true,
        resizable: false,
        closeOnEscape: true,
        dialogClass: 'wp-dialog awebooking-dialog',
        position: { my: 'center', at: 'center top+25%', of: window },
        open: function open() {
          // $('body').css({ overflow: 'hidden' });
        },
        beforeClose: function beforeClose(event, ui) {
          // $('body').css({ overflow: 'inherit' });
        }
      });

      // $(window).on('resize', _.debounce(_triggerResize, 250));

      return dialog;
    }
  }]);

  return Popup;
}();

module.exports = Popup;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = window.jQuery;
var Utils = __webpack_require__(4);

var ToggleClass = function () {
  function ToggleClass(el) {
    _classCallCheck(this, ToggleClass);

    this.el = el;
    this.target = Utils.getSelectorFromElement(el);

    if (!this.target) {
      this.target = $(el).parent().children('.awebooking-main-toggle')[0];
    }

    if (this.target) {
      $(this.el).on('click', this.toggleClass.bind(this));
      $(document).on('click', this.removeClass.bind(this));
    }
  }

  _createClass(ToggleClass, [{
    key: 'toggleClass',
    value: function toggleClass(e) {
      e && e.preventDefault();
      $(this.target).parent().toggleClass('active');
    }
  }, {
    key: 'removeClass',
    value: function removeClass(e) {
      if (e && $.contains($(this.target).parent()[0], e.target)) {
        return;
      }

      $(this.target).parent().removeClass('active');
    }
  }]);

  return ToggleClass;
}();

module.exports = ToggleClass;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = window.jQuery;
var DATE_FORMAT = 'yy-mm-dd';

var RangeDatepicker = function () {
  function RangeDatepicker(fromDate, toDate) {
    _classCallCheck(this, RangeDatepicker);

    this.toDate = toDate;
    this.fromDate = fromDate;
  }

  _createClass(RangeDatepicker, [{
    key: 'init',
    value: function init() {
      var beforeShowCallback = function beforeShowCallback() {
        $('#ui-datepicker-div').addClass('cmb2-element');
      };

      $(this.fromDate).datepicker({
        dateFormat: DATE_FORMAT,
        beforeShow: beforeShowCallback
      }).on('change', this.applyFromChange.bind(this));

      $(this.toDate).datepicker({
        dateFormat: DATE_FORMAT,
        beforeShow: beforeShowCallback
      }).on('change', this.applyToChange.bind(this));

      this.applyToChange();
      this.applyFromChange();
    }
  }, {
    key: 'applyFromChange',
    value: function applyFromChange() {
      try {
        var minDate = $.datepicker.parseDate(DATE_FORMAT, $(this.fromDate).val());
        minDate.setDate(minDate.getDate() + 1);
        $(this.toDate).datepicker('option', 'minDate', minDate);
      } catch (e) {}
    }
  }, {
    key: 'applyToChange',
    value: function applyToChange() {
      try {
        var maxDate = $.datepicker.parseDate(DATE_FORMAT, $(this.toDate).val());
        $(this.fromDate).datepicker('option', 'maxDate', maxDate);
      } catch (e) {}
    }
  }]);

  return RangeDatepicker;
}();

module.exports = RangeDatepicker;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = window.jQuery;

var ToggleCheckboxes =
/**
 * Wrapper the jquery-ui-popup.
 */
function ToggleCheckboxes(table) {
  _classCallCheck(this, ToggleCheckboxes);

  this.table = table;
  var $table = $(this.table);

  $(document).on('click', '.check-column :checkbox', function (event) {
    // Toggle the "Select all" checkboxes depending if the other ones are all checked or not.
    var unchecked = $(this).closest('tbody').find(':checkbox').filter(':visible:enabled').not(':checked');

    $(document).find('.wp-toggle-checkboxes').prop('checked', function () {
      return 0 === unchecked.length;
    });

    return true;
  });

  $(document).on('click', '.wp-toggle-checkboxes', function (e) {
    $table.children('tbody').filter(':visible').find('.check-column').find(':checkbox').prop('checked', function () {
      if ($(this).is(':hidden,:disabled')) {
        return false;
      }
      return !$(this).prop('checked');
    });
  });
};

module.exports = ToggleCheckboxes;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = window.jQuery;
var AweBooking = window.TheAweBooking;

var InitSelect2 = function () {
  function InitSelect2() {
    _classCallCheck(this, InitSelect2);

    this.searchCustomer();
  }

  // Ajax customer search boxes


  _createClass(InitSelect2, [{
    key: 'searchCustomer',
    value: function searchCustomer() {
      $(':input.awebooking-customer-search, select[name="booking_customer"]').filter(':not(.enhanced)').each(function () {
        var select2_args = {
          allowClear: $(this).data('allowClear') ? true : false,
          placeholder: $(this).data('placeholder') ? $(this).data('placeholder') : "",
          minimumInputLength: $(this).data('minimum_input_length') ? $(this).data('minimum_input_length') : '1',
          escapeMarkup: function escapeMarkup(m) {
            return m;
          },
          ajax: {
            url: AweBooking.ajax_url,
            dataType: 'json',
            delay: 250,
            data: function data(params) {
              return {
                term: params.term,
                action: 'awebooking_json_search_customers',
                // security: wc_enhanced_select_params.search_customers_nonce,
                exclude: $(this).data('exclude')
              };
            },
            processResults: function processResults(data) {
              var terms = [];
              if (data) {
                $.each(data, function (id, text) {
                  terms.push({
                    id: id,
                    text: text
                  });
                });
              }
              return {
                results: terms
              };
            },
            cache: true
          }
        };

        $(this).select2(select2_args).addClass('enhanced');
      });
    }
  }]);

  return InitSelect2;
}();

module.exports = new InitSelect2();

/***/ }),
/* 16 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 17 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 18 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
],[6]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL2F3ZWJvb2tpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3BvcHVwLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy90b2dnbGUtY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3JhbmdlLWRhdGVwaWNrZXIuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3RvZ2dsZS1jaGVja2JveGVzLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy9pbml0LXNlbGVjdDIuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3Nhc3MvYWRtaW4uc2NzcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc2Fzcy90aGVtZS5zY3NzIiwid2VicGFjazovLy8uL2Fzc2V0cy9zYXNzL2F3ZWJvb2tpbmcuc2NzcyJdLCJuYW1lcyI6WyIkIiwid2luZG93IiwialF1ZXJ5IiwiVXRpbHMiLCJnZXRTZWxlY3RvckZyb21FbGVtZW50IiwiZWwiLCJzZWxlY3RvciIsImdldEF0dHJpYnV0ZSIsIiRzZWxlY3RvciIsImxlbmd0aCIsImVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyIsInNldHRpbmdzIiwiX2F3ZWJvb2tpbmdTZXR0aW5ncyIsIkF3ZUJvb2tpbmciLCJfIiwiZXh0ZW5kIiwiVnVlIiwicmVxdWlyZSIsIlBvcHBlciIsIlRvb2x0aXAiLCJQb3B1cCIsIlRvZ2dsZUNsYXNzIiwiUmFuZ2VEYXRlcGlja2VyIiwiVG9nZ2xlQ2hlY2tib3hlcyIsImluaXQiLCJzZWxmIiwiZWFjaCIsImRhdGEiLCJvcHRpb25zIiwidGVtcGxhdGUiLCJ0cmFucyIsImNvbnRleHQiLCJzdHJpbmdzIiwicm91dGUiLCJhY3Rpb24iLCJhZG1pbl9yb3V0ZSIsImFqYXhTdWJtaXQiLCJmb3JtIiwic2VyaWFsaXplIiwiaGFzaCIsImFkZENsYXNzIiwiYWpheCIsInVybCIsInR5cGUiLCJhbHdheXMiLCJyZW1vdmVDbGFzcyIsIlRoZUF3ZUJvb2tpbmciLCJ0YXJnZXQiLCJzZXR1cCIsIm9uIiwib3BlbiIsImJpbmQiLCJjbG9zZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImRpYWxvZyIsIiR0YXJnZXQiLCJfdHJpZ2dlclJlc2l6ZSIsIm15IiwiYXQiLCJvZiIsIm1vZGFsIiwid2lkdGgiLCJoZWlnaHQiLCJhdXRvT3BlbiIsImRyYWdnYWJsZSIsInJlc2l6YWJsZSIsImNsb3NlT25Fc2NhcGUiLCJkaWFsb2dDbGFzcyIsInBvc2l0aW9uIiwiYmVmb3JlQ2xvc2UiLCJldmVudCIsInVpIiwicGFyZW50IiwiY2hpbGRyZW4iLCJ0b2dnbGVDbGFzcyIsImRvY3VtZW50IiwiY29udGFpbnMiLCJEQVRFX0ZPUk1BVCIsImZyb21EYXRlIiwidG9EYXRlIiwiYmVmb3JlU2hvd0NhbGxiYWNrIiwiZGF0ZXBpY2tlciIsImRhdGVGb3JtYXQiLCJiZWZvcmVTaG93IiwiYXBwbHlGcm9tQ2hhbmdlIiwiYXBwbHlUb0NoYW5nZSIsIm1pbkRhdGUiLCJwYXJzZURhdGUiLCJ2YWwiLCJzZXREYXRlIiwiZ2V0RGF0ZSIsIm1heERhdGUiLCJ0YWJsZSIsIiR0YWJsZSIsInVuY2hlY2tlZCIsImNsb3Nlc3QiLCJmaW5kIiwiZmlsdGVyIiwibm90IiwicHJvcCIsImlzIiwiSW5pdFNlbGVjdDIiLCJzZWFyY2hDdXN0b21lciIsInNlbGVjdDJfYXJncyIsImFsbG93Q2xlYXIiLCJwbGFjZWhvbGRlciIsIm1pbmltdW1JbnB1dExlbmd0aCIsImVzY2FwZU1hcmt1cCIsIm0iLCJhamF4X3VybCIsImRhdGFUeXBlIiwiZGVsYXkiLCJwYXJhbXMiLCJ0ZXJtIiwiZXhjbHVkZSIsInByb2Nlc3NSZXN1bHRzIiwidGVybXMiLCJpZCIsInRleHQi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QU5nQjtBQU9qQnBFLGdCQUFNO0FBQ0pDLGlCQUFhN0IsV0FBV2lHLFFBRHBCO0FBRUpDLHNCQUFhLE1BRlQ7QUFHSkMsbUJBQWEsR0FIVDtBQUlKckYsa0JBQWEsY0FBVXNGLE1BQVYsRUFBbUI7QUFDOUIscUJBQU87QUFDTEMsc0JBQVVELE9BQU9DLElBRFo7QUFFTGhGLHdCQUFVLGtDQUZMO0FBR0w7QUFDQWlGLHlCQUFVckgsRUFBRyxJQUFILEVBQVU2QixJQUFWLENBQWdCLFNBQWhCO0FBSkwsZUFBUDtBQU1ELGFBWEc7QUFZSnlGLDRCQUFnQix3QkFBVXpGLElBQVYsRUFBaUI7QUFDL0Isa0JBQUkwRixRQUFRLEVBQVo7QUFDQSxrQkFBSzFGLElBQUwsRUFBWTtBQUNWN0Isa0JBQUU0QixJQUFGLENBQVFDLElBQVIsRUFBYyxVQUFVMkYsRUFBVixFQUFjQyxJQUFkLEVBQXFCO0FBQ2pDRix3QkFBTUcsSUFBTixDQUFXO0FBQ1RGLHdCQUFJQSxFQURLO0FBRVRDLDBCQUFNQTtBQUZHLG1CQUFYO0FBSUQsaUJBTEQ7QUFNRDtBQUNELHFCQUFPO0FBQ0xFLHlCQUFTSjtBQURKLGVBQVA7QUFHRCxhQXpCRztBQTBCSkssbUJBQU87QUExQkg7QUFQVyxTQUFuQjs7QUFxQ0E1SCxVQUFHLElBQUgsRUFBVTZILE9BQVYsQ0FBa0JuQixZQUFsQixFQUFnQ2hFLFFBQWhDLENBQTBDLFVBQTFDO0FBQ0QsT0F2Q0Q7QUF5Q0Q7Ozs7OztBQUdIL0IsT0FBT0MsT0FBUCxHQUFpQixJQUFJNEYsV0FBSixFQUFqQixDOzs7Ozs7QUN0REEseUM7Ozs7OztBQ0FBLHlDOzs7Ozs7QUNBQSx5QyIsImZpbGUiOiJcXGpzXFxhZG1pblxcYXdlYm9va2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciAkID0gd2luZG93LmpRdWVyeTtcclxuXHJcbmNvbnN0IFV0aWxzID0ge1xyXG5cclxuICBnZXRTZWxlY3RvckZyb21FbGVtZW50KGVsKSB7XHJcbiAgICBsZXQgc2VsZWN0b3IgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0Jyk7XHJcblxyXG4gICAgaWYgKCFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gJyMnKSB7XHJcbiAgICAgIHNlbGVjdG9yID0gZWwuZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgJyc7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgJHNlbGVjdG9yID0gJChzZWxlY3Rvcik7XHJcbiAgICAgIHJldHVybiAkc2VsZWN0b3IubGVuZ3RoID4gMCA/IHNlbGVjdG9yIDogbnVsbDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVdGlscztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3V0aWxzLmpzIiwiY29uc3QgJCA9IHdpbmRvdy5qUXVlcnk7XHJcbmNvbnN0IHNldHRpbmdzID0gd2luZG93Ll9hd2Vib29raW5nU2V0dGluZ3MgfHwge307XHJcblxyXG5pbXBvcnQgUG9wcGVyIGZyb20gJ3BvcHBlci5qcyc7XHJcbmltcG9ydCBUb29sdGlwIGZyb20gJ3Rvb2x0aXAuanMnO1xyXG5cclxuY29uc3QgQXdlQm9va2luZyA9IF8uZXh0ZW5kKHNldHRpbmdzLCB7XHJcbiAgVnVlOiByZXF1aXJlKCd2dWUnKSxcclxuICBQb3BwZXI6IFBvcHBlcixcclxuICBUb29sdGlwOiBUb29sdGlwLFxyXG5cclxuICBQb3B1cDogcmVxdWlyZSgnLi91dGlscy9wb3B1cC5qcycpLFxyXG4gIFRvZ2dsZUNsYXNzOiByZXF1aXJlKCcuL3V0aWxzL3RvZ2dsZS1jbGFzcy5qcycpLFxyXG4gIFJhbmdlRGF0ZXBpY2tlcjogcmVxdWlyZSgnLi91dGlscy9yYW5nZS1kYXRlcGlja2VyLmpzJyksXHJcbiAgVG9nZ2xlQ2hlY2tib3hlczogcmVxdWlyZSgnLi91dGlscy90b2dnbGUtY2hlY2tib3hlcy5qcycpLFxyXG5cclxuICAvKipcclxuICAgKiBJbml0IHRoZSBBd2VCb29raW5nXHJcbiAgICovXHJcbiAgaW5pdCgpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIC8vIEluaXQgdGhlIHBvcHVwLCB1c2UganF1ZXJ5LXVpLXBvcHVwLlxyXG4gICAgJCgnW2RhdGEtdG9nZ2xlPVwiYXdlYm9va2luZy1wb3B1cFwiXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICQodGhpcykuZGF0YSgnYXdlYm9va2luZy1wb3B1cCcsIG5ldyBzZWxmLlBvcHVwKHRoaXMpKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJ1tkYXRhLWluaXQ9XCJhd2Vib29raW5nLXRvZ2dsZVwiXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICQodGhpcykuZGF0YSgnYXdlYm9va2luZy10b2dnbGUnLCBuZXcgc2VsZi5Ub2dnbGVDbGFzcyh0aGlzKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCdbZGF0YS1pbml0PVwiYXdlYm9va2luZy10b29sdGlwXCJdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhd2Vib29raW5nLXRvb2x0aXAgdG9vbHRpcFwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXBfX2Fycm93XCI+PC9kaXY+PGRpdiBjbGFzcz1cInRvb2x0aXBfX2lubmVyXCI+PC9kaXY+PC9kaXY+JyxcclxuICAgICAgfTtcclxuXHJcbiAgICAgICQodGhpcykuZGF0YSgnYXdlYm9va2luZy10b29sdGlwJywgbmV3IHNlbGYuVG9vbHRpcCh0aGlzLCBvcHRpb25zKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXF1aXJlKCcuL3V0aWxzL2luaXQtc2VsZWN0Mi5qcycpO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhIHRyYW5zbGF0b3Igc3RyaW5nXHJcbiAgICovXHJcbiAgdHJhbnMoY29udGV4dCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RyaW5nc1tjb250ZXh0XSA/IHRoaXMuc3RyaW5nc1tjb250ZXh0XSA6ICcnO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgYWRtaW4gcm91dGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGFjdGlvbiBPcHRpb25hbCwgYWN0aW9uLlxyXG4gICAqIEByZXR1cm4ge3N0cmluZ31cclxuICAgKi9cclxuICByb3V0ZShhY3Rpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmFkbWluX3JvdXRlICsgYWN0aW9uO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2UgZm9ybSBhamF4IHJlcXVlc3QuXHJcbiAgICovXHJcbiAgYWpheFN1Ym1pdChmb3JtLCBhY3Rpb24pIHtcclxuICAgIGNvbnN0IHNlcmlhbGl6ZSA9IHJlcXVpcmUoJ2Zvcm0tc2VyaWFsaXplJyk7XHJcbiAgICBjb25zdCBkYXRhID0gc2VyaWFsaXplKGZvcm0sIHsgaGFzaDogdHJ1ZSB9KTtcclxuXHJcbiAgICAvLyBBZGQgLmFqYXgtbG9hZGluZyBjbGFzcyBpbiB0byB0aGUgZm9ybS5cclxuICAgICQoZm9ybSkuYWRkQ2xhc3MoJ2FqYXgtbG9hZGluZycpO1xyXG5cclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogdGhpcy5hZG1pbl9yb3V0ZSArIGFjdGlvbixcclxuICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICBkYXRhOiBkYXRhLFxyXG4gICAgfSlcclxuICAgIC5hbHdheXMoZnVuY3Rpb24oKSB7XHJcbiAgICAgICQoZm9ybSkucmVtb3ZlQ2xhc3MoJ2FqYXgtbG9hZGluZycpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gIEF3ZUJvb2tpbmcuaW5pdCgpO1xyXG59KTtcclxuXHJcbndpbmRvdy5UaGVBd2VCb29raW5nID0gQXdlQm9va2luZztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL2F3ZWJvb2tpbmcuanMiLCJjb25zdCAkID0gd2luZG93LmpRdWVyeTtcclxuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyk7XHJcblxyXG5jbGFzcyBQb3B1cCB7XHJcbiAgLyoqXHJcbiAgICogV3JhcHBlciB0aGUganF1ZXJ5LXVpLXBvcHVwLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGVsKSB7XHJcbiAgICB0aGlzLmVsID0gZWw7XHJcbiAgICB0aGlzLnRhcmdldCA9IFV0aWxzLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWwpO1xyXG5cclxuICAgIGlmICh0aGlzLnRhcmdldCkge1xyXG4gICAgICBQb3B1cC5zZXR1cCh0aGlzLnRhcmdldCk7XHJcblxyXG4gICAgICAkKHRoaXMuZWwpLm9uKCdjbGljaycsIHRoaXMub3Blbi5iaW5kKHRoaXMpKTtcclxuICAgICAgJCh0aGlzLnRhcmdldCkub24oJ2NsaWNrJywgJ1tkYXRhLWRpc21pc3M9XCJhd2Vib29raW5nLXBvcHVwXCJdJywgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9wZW4oZSkge1xyXG4gICAgZSAmJiBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAkKHRoaXMudGFyZ2V0KS5kaWFsb2coJ29wZW4nKTtcclxuICB9XHJcblxyXG4gIGNsb3NlKGUpIHtcclxuICAgIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJCh0aGlzLnRhcmdldCkuZGlhbG9nKCdjbG9zZScpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNldHVwKHRhcmdldCkge1xyXG4gICAgY29uc3QgJHRhcmdldCA9ICQodGFyZ2V0KTtcclxuICAgIGlmICghICR0YXJnZXQubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJHRhcmdldC5kaWFsb2coJ2luc3RhbmNlJykpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBfdHJpZ2dlclJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoJHRhcmdldC5kaWFsb2coJ2lzT3BlbicpKSB7XHJcbiAgICAgICAgJHRhcmdldC5kaWFsb2coJ29wdGlvbicsICdwb3NpdGlvbicsIHsgbXk6ICdjZW50ZXInLCBhdDogJ2NlbnRlciB0b3ArMjUlJywgb2Y6IHdpbmRvdyB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBkaWFsb2cgPSAkdGFyZ2V0LmRpYWxvZyh7XHJcbiAgICAgIG1vZGFsOiB0cnVlLFxyXG4gICAgICB3aWR0aDogJ2F1dG8nLFxyXG4gICAgICBoZWlnaHQ6ICdhdXRvJyxcclxuICAgICAgYXV0b09wZW46IGZhbHNlLFxyXG4gICAgICBkcmFnZ2FibGU6IHRydWUsXHJcbiAgICAgIHJlc2l6YWJsZTogZmFsc2UsXHJcbiAgICAgIGNsb3NlT25Fc2NhcGU6IHRydWUsXHJcbiAgICAgIGRpYWxvZ0NsYXNzOiAnd3AtZGlhbG9nIGF3ZWJvb2tpbmctZGlhbG9nJyxcclxuICAgICAgcG9zaXRpb246IHsgbXk6ICdjZW50ZXInLCBhdDogJ2NlbnRlciB0b3ArMjUlJywgb2Y6IHdpbmRvdyB9LFxyXG4gICAgICBvcGVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gJCgnYm9keScpLmNzcyh7IG92ZXJmbG93OiAnaGlkZGVuJyB9KTtcclxuICAgICAgfSxcclxuICAgICAgYmVmb3JlQ2xvc2U6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG4gICAgICAgIC8vICQoJ2JvZHknKS5jc3MoeyBvdmVyZmxvdzogJ2luaGVyaXQnIH0pO1xyXG4gICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vICQod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShfdHJpZ2dlclJlc2l6ZSwgMjUwKSk7XHJcblxyXG4gICAgcmV0dXJuIGRpYWxvZztcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUG9wdXA7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy9wb3B1cC5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5jb25zdCBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcclxuXHJcbmNsYXNzIFRvZ2dsZUNsYXNzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoZWwpIHtcclxuICAgIHRoaXMuZWwgPSBlbDtcclxuICAgIHRoaXMudGFyZ2V0ID0gVXRpbHMuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLnRhcmdldCkge1xyXG4gICAgICB0aGlzLnRhcmdldCA9ICQoZWwpLnBhcmVudCgpLmNoaWxkcmVuKCcuYXdlYm9va2luZy1tYWluLXRvZ2dsZScpWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRhcmdldCkge1xyXG4gICAgICAkKHRoaXMuZWwpLm9uKCdjbGljaycsIHRoaXMudG9nZ2xlQ2xhc3MuYmluZCh0aGlzKSk7XHJcbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMucmVtb3ZlQ2xhc3MuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0b2dnbGVDbGFzcyhlKSB7XHJcbiAgICBlICYmIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICQodGhpcy50YXJnZXQpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUNsYXNzKGUpIHtcclxuICAgIGlmIChlICYmICQuY29udGFpbnMoJCh0aGlzLnRhcmdldCkucGFyZW50KClbMF0sIGUudGFyZ2V0KSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgJCh0aGlzLnRhcmdldCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb2dnbGVDbGFzcztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3RvZ2dsZS1jbGFzcy5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5jb25zdCBEQVRFX0ZPUk1BVCA9ICd5eS1tbS1kZCc7XHJcblxyXG5jbGFzcyBSYW5nZURhdGVwaWNrZXIge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihmcm9tRGF0ZSwgdG9EYXRlKSB7XHJcbiAgICB0aGlzLnRvRGF0ZSA9IHRvRGF0ZTtcclxuICAgIHRoaXMuZnJvbURhdGUgPSBmcm9tRGF0ZTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBjb25zdCBiZWZvcmVTaG93Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgJCgnI3VpLWRhdGVwaWNrZXItZGl2JykuYWRkQ2xhc3MoJ2NtYjItZWxlbWVudCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkKHRoaXMuZnJvbURhdGUpLmRhdGVwaWNrZXIoe1xyXG4gICAgICBkYXRlRm9ybWF0OiBEQVRFX0ZPUk1BVCxcclxuICAgICAgYmVmb3JlU2hvdzogYmVmb3JlU2hvd0NhbGxiYWNrLFxyXG4gICAgfSkub24oJ2NoYW5nZScsIHRoaXMuYXBwbHlGcm9tQ2hhbmdlLmJpbmQodGhpcykpO1xyXG5cclxuICAgICQodGhpcy50b0RhdGUpLmRhdGVwaWNrZXIoe1xyXG4gICAgICBkYXRlRm9ybWF0OiBEQVRFX0ZPUk1BVCxcclxuICAgICAgYmVmb3JlU2hvdzogYmVmb3JlU2hvd0NhbGxiYWNrLFxyXG4gICAgfSkub24oJ2NoYW5nZScsIHRoaXMuYXBwbHlUb0NoYW5nZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLmFwcGx5VG9DaGFuZ2UoKTtcclxuICAgIHRoaXMuYXBwbHlGcm9tQ2hhbmdlKCk7XHJcbiAgfVxyXG5cclxuICBhcHBseUZyb21DaGFuZ2UoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBtaW5EYXRlID0gJC5kYXRlcGlja2VyLnBhcnNlRGF0ZShEQVRFX0ZPUk1BVCwgJCh0aGlzLmZyb21EYXRlKS52YWwoKSk7XHJcbiAgICAgIG1pbkRhdGUuc2V0RGF0ZShtaW5EYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAkKHRoaXMudG9EYXRlKS5kYXRlcGlja2VyKCdvcHRpb24nLCAnbWluRGF0ZScsIG1pbkRhdGUpO1xyXG4gICAgfSBjYXRjaChlKSB7fVxyXG4gIH1cclxuXHJcbiAgYXBwbHlUb0NoYW5nZSgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IG1heERhdGUgPSAkLmRhdGVwaWNrZXIucGFyc2VEYXRlKERBVEVfRk9STUFULCAkKHRoaXMudG9EYXRlKS52YWwoKSk7XHJcbiAgICAgICQodGhpcy5mcm9tRGF0ZSkuZGF0ZXBpY2tlcignb3B0aW9uJywgJ21heERhdGUnLCBtYXhEYXRlKTtcclxuICAgIH0gY2F0Y2goZSkge31cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmFuZ2VEYXRlcGlja2VyO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvcmFuZ2UtZGF0ZXBpY2tlci5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5cclxuY2xhc3MgVG9nZ2xlQ2hlY2tib3hlcyB7XHJcbiAgLyoqXHJcbiAgICogV3JhcHBlciB0aGUganF1ZXJ5LXVpLXBvcHVwLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHRhYmxlKSB7XHJcbiAgICB0aGlzLnRhYmxlID0gdGFibGU7XHJcbiAgICBjb25zdCAkdGFibGUgPSAkKHRoaXMudGFibGUpO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCAnLmNoZWNrLWNvbHVtbiA6Y2hlY2tib3gnLCBmdW5jdGlvbiggZXZlbnQgKSB7XHJcbiAgICAgIC8vIFRvZ2dsZSB0aGUgXCJTZWxlY3QgYWxsXCIgY2hlY2tib3hlcyBkZXBlbmRpbmcgaWYgdGhlIG90aGVyIG9uZXMgYXJlIGFsbCBjaGVja2VkIG9yIG5vdC5cclxuICAgICAgdmFyIHVuY2hlY2tlZCA9ICQodGhpcykuY2xvc2VzdCgndGJvZHknKS5maW5kKCc6Y2hlY2tib3gnKS5maWx0ZXIoJzp2aXNpYmxlOmVuYWJsZWQnKS5ub3QoJzpjaGVja2VkJyk7XHJcblxyXG4gICAgICAkKGRvY3VtZW50KS5maW5kKCcud3AtdG9nZ2xlLWNoZWNrYm94ZXMnKS5wcm9wKCdjaGVja2VkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICggMCA9PT0gdW5jaGVja2VkLmxlbmd0aCApO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oICdjbGljaycsICcud3AtdG9nZ2xlLWNoZWNrYm94ZXMnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICR0YWJsZS5jaGlsZHJlbiggJ3Rib2R5JyApLmZpbHRlcignOnZpc2libGUnKVxyXG4gICAgICAgIC5maW5kKCcuY2hlY2stY29sdW1uJykuZmluZCgnOmNoZWNrYm94JylcclxuICAgICAgICAucHJvcCgnY2hlY2tlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaWYgKCAkKHRoaXMpLmlzKCc6aGlkZGVuLDpkaXNhYmxlZCcpICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gISAkKHRoaXMpLnByb3AoICdjaGVja2VkJyApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZUNoZWNrYm94ZXM7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy90b2dnbGUtY2hlY2tib3hlcy5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5jb25zdCBBd2VCb29raW5nID0gd2luZG93LlRoZUF3ZUJvb2tpbmc7XHJcblxyXG5jbGFzcyBJbml0U2VsZWN0MiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlYXJjaEN1c3RvbWVyKCk7XHJcbiAgfVxyXG5cclxuICAvLyBBamF4IGN1c3RvbWVyIHNlYXJjaCBib3hlc1xyXG4gIHNlYXJjaEN1c3RvbWVyKCkge1xyXG4gICAgJCgnOmlucHV0LmF3ZWJvb2tpbmctY3VzdG9tZXItc2VhcmNoLCBzZWxlY3RbbmFtZT1cImJvb2tpbmdfY3VzdG9tZXJcIl0nKS5maWx0ZXIoICc6bm90KC5lbmhhbmNlZCknICkuZWFjaCggZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxlY3QyX2FyZ3MgPSB7XHJcbiAgICAgICAgYWxsb3dDbGVhcjogICQoIHRoaXMgKS5kYXRhKCAnYWxsb3dDbGVhcicgKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICBwbGFjZWhvbGRlcjogJCggdGhpcyApLmRhdGEoICdwbGFjZWhvbGRlcicgKSA/ICQoIHRoaXMgKS5kYXRhKCAncGxhY2Vob2xkZXInICkgOiBcIlwiLFxyXG4gICAgICAgIG1pbmltdW1JbnB1dExlbmd0aDogJCggdGhpcyApLmRhdGEoICdtaW5pbXVtX2lucHV0X2xlbmd0aCcgKSA/ICQoIHRoaXMgKS5kYXRhKCAnbWluaW11bV9pbnB1dF9sZW5ndGgnICkgOiAnMScsXHJcbiAgICAgICAgZXNjYXBlTWFya3VwOiBmdW5jdGlvbiggbSApIHtcclxuICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWpheDoge1xyXG4gICAgICAgICAgdXJsOiAgICAgICAgIEF3ZUJvb2tpbmcuYWpheF91cmwsXHJcbiAgICAgICAgICBkYXRhVHlwZTogICAgJ2pzb24nLFxyXG4gICAgICAgICAgZGVsYXk6ICAgICAgIDI1MCxcclxuICAgICAgICAgIGRhdGE6ICAgICAgICBmdW5jdGlvbiggcGFyYW1zICkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIHRlcm06ICAgICBwYXJhbXMudGVybSxcclxuICAgICAgICAgICAgICBhY3Rpb246ICAgJ2F3ZWJvb2tpbmdfanNvbl9zZWFyY2hfY3VzdG9tZXJzJyxcclxuICAgICAgICAgICAgICAvLyBzZWN1cml0eTogd2NfZW5oYW5jZWRfc2VsZWN0X3BhcmFtcy5zZWFyY2hfY3VzdG9tZXJzX25vbmNlLFxyXG4gICAgICAgICAgICAgIGV4Y2x1ZGU6ICAkKCB0aGlzICkuZGF0YSggJ2V4Y2x1ZGUnIClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBwcm9jZXNzUmVzdWx0czogZnVuY3Rpb24oIGRhdGEgKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXJtcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoIGRhdGEgKSB7XHJcbiAgICAgICAgICAgICAgJC5lYWNoKCBkYXRhLCBmdW5jdGlvbiggaWQsIHRleHQgKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIHJlc3VsdHM6IHRlcm1zXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2FjaGU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkKCB0aGlzICkuc2VsZWN0MihzZWxlY3QyX2FyZ3MpLmFkZENsYXNzKCAnZW5oYW5jZWQnICk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBJbml0U2VsZWN0MjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL2luaXQtc2VsZWN0Mi5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvc2Fzcy9hZG1pbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL3Nhc3MvdGhlbWUuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9zYXNzL2F3ZWJvb2tpbmcuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==