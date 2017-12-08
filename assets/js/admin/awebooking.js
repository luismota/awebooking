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
   * Make form ajax request.
   */
  ajaxSubmit: function ajaxSubmit(form, action) {
    var serialize = __webpack_require__(5);
    var data = serialize(form, { hash: true });

    // Add .ajax-loading class in to the form.
    $(form).addClass('ajax-loading');

    return wp.ajax.post(action, data).always(function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL2F3ZWJvb2tpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3BvcHVwLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy90b2dnbGUtY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3JhbmdlLWRhdGVwaWNrZXIuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3RvZ2dsZS1jaGVja2JveGVzLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy9pbml0LXNlbGVjdDIuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3Nhc3MvYWRtaW4uc2Nzcz9kOWU2Iiwid2VicGFjazovLy8uL2Fzc2V0cy9zYXNzL3RoZW1lLnNjc3M/ODg2YiIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc2Fzcy9hd2Vib29raW5nLnNjc3M/MTU3ZSJdLCJuYW1lcyI6WyIkIiwid2luZG93IiwialF1ZXJ5IiwiVXRpbHMiLCJnZXRTZWxlY3RvckZyb21FbGVtZW50IiwiZWwiLCJzZWxlY3RvciIsImdldEF0dHJpYnV0ZSIsIiRzZWxlY3RvciIsImxlbmd0aCIsImVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyIsInNldHRpbmdzIiwiX2F3ZWJvb2tpbmdTZXR0aW5ncyIsIkF3ZUJvb2tpbmciLCJfIiwiZXh0ZW5kIiwiVnVlIiwicmVxdWlyZSIsIlBvcHBlciIsIlRvb2x0aXAiLCJQb3B1cCIsIlRvZ2dsZUNsYXNzIiwiUmFuZ2VEYXRlcGlja2VyIiwiVG9nZ2xlQ2hlY2tib3hlcyIsImluaXQiLCJzZWxmIiwiZWFjaCIsImRhdGEiLCJvcHRpb25zIiwidGVtcGxhdGUiLCJ0cmFucyIsImNvbnRleHQiLCJzdHJpbmdzIiwiYWpheFN1Ym1pdCIsImZvcm0iLCJhY3Rpb24iLCJzZXJpYWxpemUiLCJoYXNoIiwiYWRkQ2xhc3MiLCJ3cCIsImFqYXgiLCJwb3N0IiwiYWx3YXlzIiwicmVtb3ZlQ2xhc3MiLCJUaGVBd2VCb29raW5nIiwidGFyZ2V0Iiwic2V0dXAiLCJvbiIsIm9wZW4iLCJiaW5kIiwiY2xvc2UiLCJlIiwicHJldmVudERlZmF1bHQiLCJkaWFsb2ciLCIkdGFyZ2V0IiwiX3RyaWdnZXJSZXNpemUiLCJteSIsImF0Iiwib2YiLCJtb2RhbCIsIndpZHRoIiwiaGVpZ2h0IiwiYXV0b09wZW4iLCJkcmFnZ2FibGUiLCJyZXNpemFibGUiLCJjbG9zZU9uRXNjYXBlIiwiZGlhbG9nQ2xhc3MiLCJwb3NpdGlvbiIsImJlZm9yZUNsb3NlIiwiZXZlbnQiLCJ1aSIsInBhcmVudCIsImNoaWxkcmVuIiwidG9nZ2xlQ2xhc3MiLCJkb2N1bWVudCIsImNvbnRhaW5zIiwiREFURV9GT1JNQVQiLCJmcm9tRGF0ZSIsInRvRGF0ZSIsImJlZm9yZVNob3dDYWxsYmFjayIsImRhdGVwaWNrZXIiLCJkYXRlRm9ybWF0IiwiYmVmb3JlU2hvdyIsImFwcGx5RnJvbUNoYW5nZSIsImFwcGx5VG9DaGFuZ2UiLCJtaW5EYXRlIiwicGFyc2VEYXRlIiwidmFsIiwic2V0RGF0ZSIsImdldERhdGUiLCJtYXhEYXRlIiwidGFibGUiLCIkdGFibGUiLCJ1bmNoZWNrZWQiLCJjbG9zZXN0IiwiZmluZCIsImZpbHRlciIsIm5vdCIsInByb3AiLCJpcyIsIkluaXRTZWxlY3QyIiwic2VhcmNoQ3VzdG9tZXIiLCJzZWxlY3QyX2FyZ3MiLCJhbGxvd0NsZWFyIiwicGxhY2Vob2xkZXIiLCJtaW5pbXVtSW5wdXRMZW5ndGgiLCJlc2NhcGVNYXJrdXAiLCJtIiwidXJsIiwiYWpheF91cmwiLCJkYXRhVHlwZSIsImRlbGF5IiwicGFyYW1zIiwidGVybSIsImV4Y2x1ZGUiLCJwcm9jZXNzUmVzdWx0cyIsInRlcm1zIiwiaWQiLCJ0ZXh0Iiwi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RCxPQUFPQyxJQURaO0FBRUw5RSx3QkFBVSxrQ0FGTDtBQUdMO0FBQ0ErRSx5QkFBVXBILEVBQUcsSUFBSCxFQUFVNkIsSUFBVixDQUFnQixTQUFoQjtBQUpMLGVBQVA7QUFNRCxhQVhHO0FBWUp3Riw0QkFBZ0Isd0JBQVV4RixJQUFWLEVBQWlCO0FBQy9CLGtCQUFJeUYsUUFBUSxFQUFaO0FBQ0Esa0JBQUt6RixJQUFMLEVBQVk7QUFDVjdCLGtCQUFFNEIsSUFBRixDQUFRQyxJQUFSLEVBQWMsVUFBVTBGLEVBQVYsRUFBY0MsSUFBZCxFQUFxQjtBQUNqQ0Ysd0JBQU1HLElBQU4sQ0FBVztBQUNURix3QkFBSUEsRUFESztBQUVUQywwQkFBTUE7QUFGRyxtQkFBWDtBQUlELGlCQUxEO0FBTUQ7QUFDRCxxQkFBTztBQUNMRSx5QkFBU0o7QUFESixlQUFQO0FBR0QsYUF6Qkc7QUEwQkpLLG1CQUFPO0FBMUJIO0FBUFcsU0FBbkI7O0FBcUNBM0gsVUFBRyxJQUFILEVBQVU0SCxPQUFWLENBQWtCcEIsWUFBbEIsRUFBZ0NoRSxRQUFoQyxDQUEwQyxVQUExQztBQUNELE9BdkNEO0FBeUNEOzs7Ozs7QUFHSDdCLE9BQU9DLE9BQVAsR0FBaUIsSUFBSTBGLFdBQUosRUFBakIsQzs7Ozs7O0FDdERBLHlDOzs7Ozs7QUNBQSx5Qzs7Ozs7O0FDQUEseUMiLCJmaWxlIjoiL2pzL2FkbWluL2F3ZWJvb2tpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgJCA9IHdpbmRvdy5qUXVlcnk7XG5cbmNvbnN0IFV0aWxzID0ge1xuXG4gIGdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWwpIHtcbiAgICBsZXQgc2VsZWN0b3IgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0Jyk7XG5cbiAgICBpZiAoIXNlbGVjdG9yIHx8IHNlbGVjdG9yID09PSAnIycpIHtcbiAgICAgIHNlbGVjdG9yID0gZWwuZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgJyc7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0ICRzZWxlY3RvciA9ICQoc2VsZWN0b3IpO1xuICAgICAgcmV0dXJuICRzZWxlY3Rvci5sZW5ndGggPiAwID8gc2VsZWN0b3IgOiBudWxsO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVXRpbHM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvdXRpbHMuanMiLCJjb25zdCAkID0gd2luZG93LmpRdWVyeTtcbmNvbnN0IHNldHRpbmdzID0gd2luZG93Ll9hd2Vib29raW5nU2V0dGluZ3MgfHwge307XG5cbmltcG9ydCBQb3BwZXIgZnJvbSAncG9wcGVyLmpzJztcbmltcG9ydCBUb29sdGlwIGZyb20gJ3Rvb2x0aXAuanMnO1xuXG5jb25zdCBBd2VCb29raW5nID0gXy5leHRlbmQoc2V0dGluZ3MsIHtcbiAgVnVlOiByZXF1aXJlKCd2dWUnKSxcbiAgUG9wcGVyOiBQb3BwZXIsXG4gIFRvb2x0aXA6IFRvb2x0aXAsXG5cbiAgUG9wdXA6IHJlcXVpcmUoJy4vdXRpbHMvcG9wdXAuanMnKSxcbiAgVG9nZ2xlQ2xhc3M6IHJlcXVpcmUoJy4vdXRpbHMvdG9nZ2xlLWNsYXNzLmpzJyksXG4gIFJhbmdlRGF0ZXBpY2tlcjogcmVxdWlyZSgnLi91dGlscy9yYW5nZS1kYXRlcGlja2VyLmpzJyksXG4gIFRvZ2dsZUNoZWNrYm94ZXM6IHJlcXVpcmUoJy4vdXRpbHMvdG9nZ2xlLWNoZWNrYm94ZXMuanMnKSxcblxuICAvKipcbiAgICogSW5pdCB0aGUgQXdlQm9va2luZ1xuICAgKi9cbiAgaW5pdCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIC8vIEluaXQgdGhlIHBvcHVwLCB1c2UganF1ZXJ5LXVpLXBvcHVwLlxuICAgICQoJ1tkYXRhLXRvZ2dsZT1cImF3ZWJvb2tpbmctcG9wdXBcIl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgJCh0aGlzKS5kYXRhKCdhd2Vib29raW5nLXBvcHVwJywgbmV3IHNlbGYuUG9wdXAodGhpcykpO1xuICAgIH0pO1xuXG4gICAgJCgnW2RhdGEtaW5pdD1cImF3ZWJvb2tpbmctdG9nZ2xlXCJdJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICQodGhpcykuZGF0YSgnYXdlYm9va2luZy10b2dnbGUnLCBuZXcgc2VsZi5Ub2dnbGVDbGFzcyh0aGlzKSk7XG4gICAgfSk7XG5cbiAgICAkKCdbZGF0YS1pbml0PVwiYXdlYm9va2luZy10b29sdGlwXCJdJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImF3ZWJvb2tpbmctdG9vbHRpcCB0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcF9fYXJyb3dcIj48L2Rpdj48ZGl2IGNsYXNzPVwidG9vbHRpcF9faW5uZXJcIj48L2Rpdj48L2Rpdj4nLFxuICAgICAgfTtcblxuICAgICAgJCh0aGlzKS5kYXRhKCdhd2Vib29raW5nLXRvb2x0aXAnLCBuZXcgc2VsZi5Ub29sdGlwKHRoaXMsIG9wdGlvbnMpKTtcbiAgICB9KTtcblxuICAgIHJlcXVpcmUoJy4vdXRpbHMvaW5pdC1zZWxlY3QyLmpzJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBhIHRyYW5zbGF0b3Igc3RyaW5nXG4gICAqL1xuICB0cmFucyhjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyaW5nc1tjb250ZXh0XSA/IHRoaXMuc3RyaW5nc1tjb250ZXh0XSA6ICcnO1xuICB9LFxuXG4gIC8qKlxuICAgKiBNYWtlIGZvcm0gYWpheCByZXF1ZXN0LlxuICAgKi9cbiAgYWpheFN1Ym1pdChmb3JtLCBhY3Rpb24pIHtcbiAgICBjb25zdCBzZXJpYWxpemUgPSByZXF1aXJlKCdmb3JtLXNlcmlhbGl6ZScpO1xuICAgIGNvbnN0IGRhdGEgPSBzZXJpYWxpemUoZm9ybSwgeyBoYXNoOiB0cnVlIH0pO1xuXG4gICAgLy8gQWRkIC5hamF4LWxvYWRpbmcgY2xhc3MgaW4gdG8gdGhlIGZvcm0uXG4gICAgJChmb3JtKS5hZGRDbGFzcygnYWpheC1sb2FkaW5nJyk7XG5cbiAgICByZXR1cm4gd3AuYWpheC5wb3N0KGFjdGlvbiwgZGF0YSlcbiAgICAgIC5hbHdheXMoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoZm9ybSkucmVtb3ZlQ2xhc3MoJ2FqYXgtbG9hZGluZycpO1xuICAgICAgfSk7XG4gIH0sXG59KTtcblxuJChmdW5jdGlvbigpIHtcbiAgQXdlQm9va2luZy5pbml0KCk7XG59KTtcblxud2luZG93LlRoZUF3ZUJvb2tpbmcgPSBBd2VCb29raW5nO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL2F3ZWJvb2tpbmcuanMiLCJjb25zdCAkID0gd2luZG93LmpRdWVyeTtcbmNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi91dGlscy5qcycpO1xuXG5jbGFzcyBQb3B1cCB7XG4gIC8qKlxuICAgKiBXcmFwcGVyIHRoZSBqcXVlcnktdWktcG9wdXAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbCkge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLnRhcmdldCA9IFV0aWxzLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWwpO1xuXG4gICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICBQb3B1cC5zZXR1cCh0aGlzLnRhcmdldCk7XG5cbiAgICAgICQodGhpcy5lbCkub24oJ2NsaWNrJywgdGhpcy5vcGVuLmJpbmQodGhpcykpO1xuICAgICAgJCh0aGlzLnRhcmdldCkub24oJ2NsaWNrJywgJ1tkYXRhLWRpc21pc3M9XCJhd2Vib29raW5nLXBvcHVwXCJdJywgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICBvcGVuKGUpIHtcbiAgICBlICYmIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAkKHRoaXMudGFyZ2V0KS5kaWFsb2coJ29wZW4nKTtcbiAgfVxuXG4gIGNsb3NlKGUpIHtcbiAgICBlICYmIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAkKHRoaXMudGFyZ2V0KS5kaWFsb2coJ2Nsb3NlJyk7XG4gIH1cblxuICBzdGF0aWMgc2V0dXAodGFyZ2V0KSB7XG4gICAgY29uc3QgJHRhcmdldCA9ICQodGFyZ2V0KTtcbiAgICBpZiAoISAkdGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICgkdGFyZ2V0LmRpYWxvZygnaW5zdGFuY2UnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBfdHJpZ2dlclJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCR0YXJnZXQuZGlhbG9nKCdpc09wZW4nKSkge1xuICAgICAgICAkdGFyZ2V0LmRpYWxvZygnb3B0aW9uJywgJ3Bvc2l0aW9uJywgeyBteTogJ2NlbnRlcicsIGF0OiAnY2VudGVyIHRvcCsyNSUnLCBvZjogd2luZG93IH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBkaWFsb2cgPSAkdGFyZ2V0LmRpYWxvZyh7XG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIHdpZHRoOiAnYXV0bycsXG4gICAgICBoZWlnaHQ6ICdhdXRvJyxcbiAgICAgIGF1dG9PcGVuOiBmYWxzZSxcbiAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgICBjbG9zZU9uRXNjYXBlOiB0cnVlLFxuICAgICAgZGlhbG9nQ2xhc3M6ICd3cC1kaWFsb2cgYXdlYm9va2luZy1kaWFsb2cnLFxuICAgICAgcG9zaXRpb246IHsgbXk6ICdjZW50ZXInLCBhdDogJ2NlbnRlciB0b3ArMjUlJywgb2Y6IHdpbmRvdyB9LFxuICAgICAgb3BlbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAkKCdib2R5JykuY3NzKHsgb3ZlcmZsb3c6ICdoaWRkZW4nIH0pO1xuICAgICAgfSxcbiAgICAgIGJlZm9yZUNsb3NlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcbiAgICAgICAgLy8gJCgnYm9keScpLmNzcyh7IG92ZXJmbG93OiAnaW5oZXJpdCcgfSk7XG4gICAgIH1cbiAgICB9KTtcblxuICAgIC8vICQod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShfdHJpZ2dlclJlc2l6ZSwgMjUwKSk7XG5cbiAgICByZXR1cm4gZGlhbG9nO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUG9wdXA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvcG9wdXAuanMiLCJjb25zdCAkID0gd2luZG93LmpRdWVyeTtcbmNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi91dGlscy5qcycpO1xuXG5jbGFzcyBUb2dnbGVDbGFzcyB7XG5cbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy50YXJnZXQgPSBVdGlscy5nZXRTZWxlY3RvckZyb21FbGVtZW50KGVsKTtcblxuICAgIGlmICghdGhpcy50YXJnZXQpIHtcbiAgICAgIHRoaXMudGFyZ2V0ID0gJChlbCkucGFyZW50KCkuY2hpbGRyZW4oJy5hd2Vib29raW5nLW1haW4tdG9nZ2xlJylbMF07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAkKHRoaXMuZWwpLm9uKCdjbGljaycsIHRoaXMudG9nZ2xlQ2xhc3MuYmluZCh0aGlzKSk7XG4gICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnJlbW92ZUNsYXNzLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZUNsYXNzKGUpIHtcbiAgICBlICYmIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAkKHRoaXMudGFyZ2V0KS5wYXJlbnQoKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gIH1cblxuICByZW1vdmVDbGFzcyhlKSB7XG4gICAgaWYgKGUgJiYgJC5jb250YWlucygkKHRoaXMudGFyZ2V0KS5wYXJlbnQoKVswXSwgZS50YXJnZXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJCh0aGlzLnRhcmdldCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVG9nZ2xlQ2xhc3M7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvdG9nZ2xlLWNsYXNzLmpzIiwiY29uc3QgJCA9IHdpbmRvdy5qUXVlcnk7XG5jb25zdCBEQVRFX0ZPUk1BVCA9ICd5eS1tbS1kZCc7XG5cbmNsYXNzIFJhbmdlRGF0ZXBpY2tlciB7XG5cbiAgY29uc3RydWN0b3IoZnJvbURhdGUsIHRvRGF0ZSkge1xuICAgIHRoaXMudG9EYXRlID0gdG9EYXRlO1xuICAgIHRoaXMuZnJvbURhdGUgPSBmcm9tRGF0ZTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc3QgYmVmb3JlU2hvd0NhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAkKCcjdWktZGF0ZXBpY2tlci1kaXYnKS5hZGRDbGFzcygnY21iMi1lbGVtZW50Jyk7XG4gICAgfTtcblxuICAgICQodGhpcy5mcm9tRGF0ZSkuZGF0ZXBpY2tlcih7XG4gICAgICBkYXRlRm9ybWF0OiBEQVRFX0ZPUk1BVCxcbiAgICAgIGJlZm9yZVNob3c6IGJlZm9yZVNob3dDYWxsYmFjayxcbiAgICB9KS5vbignY2hhbmdlJywgdGhpcy5hcHBseUZyb21DaGFuZ2UuYmluZCh0aGlzKSk7XG5cbiAgICAkKHRoaXMudG9EYXRlKS5kYXRlcGlja2VyKHtcbiAgICAgIGRhdGVGb3JtYXQ6IERBVEVfRk9STUFULFxuICAgICAgYmVmb3JlU2hvdzogYmVmb3JlU2hvd0NhbGxiYWNrLFxuICAgIH0pLm9uKCdjaGFuZ2UnLCB0aGlzLmFwcGx5VG9DaGFuZ2UuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmFwcGx5VG9DaGFuZ2UoKTtcbiAgICB0aGlzLmFwcGx5RnJvbUNoYW5nZSgpO1xuICB9XG5cbiAgYXBwbHlGcm9tQ2hhbmdlKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBtaW5EYXRlID0gJC5kYXRlcGlja2VyLnBhcnNlRGF0ZShEQVRFX0ZPUk1BVCwgJCh0aGlzLmZyb21EYXRlKS52YWwoKSk7XG4gICAgICBtaW5EYXRlLnNldERhdGUobWluRGF0ZS5nZXREYXRlKCkgKyAxKTtcbiAgICAgICQodGhpcy50b0RhdGUpLmRhdGVwaWNrZXIoJ29wdGlvbicsICdtaW5EYXRlJywgbWluRGF0ZSk7XG4gICAgfSBjYXRjaChlKSB7fVxuICB9XG5cbiAgYXBwbHlUb0NoYW5nZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWF4RGF0ZSA9ICQuZGF0ZXBpY2tlci5wYXJzZURhdGUoREFURV9GT1JNQVQsICQodGhpcy50b0RhdGUpLnZhbCgpKTtcbiAgICAgICQodGhpcy5mcm9tRGF0ZSkuZGF0ZXBpY2tlcignb3B0aW9uJywgJ21heERhdGUnLCBtYXhEYXRlKTtcbiAgICB9IGNhdGNoKGUpIHt9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSYW5nZURhdGVwaWNrZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvcmFuZ2UtZGF0ZXBpY2tlci5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xuXG5jbGFzcyBUb2dnbGVDaGVja2JveGVzIHtcbiAgLyoqXG4gICAqIFdyYXBwZXIgdGhlIGpxdWVyeS11aS1wb3B1cC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHRhYmxlKSB7XG4gICAgdGhpcy50YWJsZSA9IHRhYmxlO1xuICAgIGNvbnN0ICR0YWJsZSA9ICQodGhpcy50YWJsZSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgJy5jaGVjay1jb2x1bW4gOmNoZWNrYm94JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgLy8gVG9nZ2xlIHRoZSBcIlNlbGVjdCBhbGxcIiBjaGVja2JveGVzIGRlcGVuZGluZyBpZiB0aGUgb3RoZXIgb25lcyBhcmUgYWxsIGNoZWNrZWQgb3Igbm90LlxuICAgICAgdmFyIHVuY2hlY2tlZCA9ICQodGhpcykuY2xvc2VzdCgndGJvZHknKS5maW5kKCc6Y2hlY2tib3gnKS5maWx0ZXIoJzp2aXNpYmxlOmVuYWJsZWQnKS5ub3QoJzpjaGVja2VkJyk7XG5cbiAgICAgICQoZG9jdW1lbnQpLmZpbmQoJy53cC10b2dnbGUtY2hlY2tib3hlcycpLnByb3AoJ2NoZWNrZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICggMCA9PT0gdW5jaGVja2VkLmxlbmd0aCApO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oICdjbGljaycsICcud3AtdG9nZ2xlLWNoZWNrYm94ZXMnLCBmdW5jdGlvbihlKSB7XG4gICAgICAkdGFibGUuY2hpbGRyZW4oICd0Ym9keScgKS5maWx0ZXIoJzp2aXNpYmxlJylcbiAgICAgICAgLmZpbmQoJy5jaGVjay1jb2x1bW4nKS5maW5kKCc6Y2hlY2tib3gnKVxuICAgICAgICAucHJvcCgnY2hlY2tlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICggJCh0aGlzKS5pcygnOmhpZGRlbiw6ZGlzYWJsZWQnKSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICEgJCh0aGlzKS5wcm9wKCAnY2hlY2tlZCcgKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUb2dnbGVDaGVja2JveGVzO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3RvZ2dsZS1jaGVja2JveGVzLmpzIiwiY29uc3QgJCA9IHdpbmRvdy5qUXVlcnk7XG5jb25zdCBBd2VCb29raW5nID0gd2luZG93LlRoZUF3ZUJvb2tpbmc7XG5cbmNsYXNzIEluaXRTZWxlY3QyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWFyY2hDdXN0b21lcigpO1xuICB9XG5cbiAgLy8gQWpheCBjdXN0b21lciBzZWFyY2ggYm94ZXNcbiAgc2VhcmNoQ3VzdG9tZXIoKSB7XG4gICAgJCgnOmlucHV0LmF3ZWJvb2tpbmctY3VzdG9tZXItc2VhcmNoLCBzZWxlY3RbbmFtZT1cImJvb2tpbmdfY3VzdG9tZXJcIl0nKS5maWx0ZXIoICc6bm90KC5lbmhhbmNlZCknICkuZWFjaCggZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZWN0Ml9hcmdzID0ge1xuICAgICAgICBhbGxvd0NsZWFyOiAgJCggdGhpcyApLmRhdGEoICdhbGxvd0NsZWFyJyApID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICBwbGFjZWhvbGRlcjogJCggdGhpcyApLmRhdGEoICdwbGFjZWhvbGRlcicgKSA/ICQoIHRoaXMgKS5kYXRhKCAncGxhY2Vob2xkZXInICkgOiBcIlwiLFxuICAgICAgICBtaW5pbXVtSW5wdXRMZW5ndGg6ICQoIHRoaXMgKS5kYXRhKCAnbWluaW11bV9pbnB1dF9sZW5ndGgnICkgPyAkKCB0aGlzICkuZGF0YSggJ21pbmltdW1faW5wdXRfbGVuZ3RoJyApIDogJzEnLFxuICAgICAgICBlc2NhcGVNYXJrdXA6IGZ1bmN0aW9uKCBtICkge1xuICAgICAgICAgIHJldHVybiBtO1xuICAgICAgICB9LFxuICAgICAgICBhamF4OiB7XG4gICAgICAgICAgdXJsOiAgICAgICAgIEF3ZUJvb2tpbmcuYWpheF91cmwsXG4gICAgICAgICAgZGF0YVR5cGU6ICAgICdqc29uJyxcbiAgICAgICAgICBkZWxheTogICAgICAgMjUwLFxuICAgICAgICAgIGRhdGE6ICAgICAgICBmdW5jdGlvbiggcGFyYW1zICkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdGVybTogICAgIHBhcmFtcy50ZXJtLFxuICAgICAgICAgICAgICBhY3Rpb246ICAgJ2F3ZWJvb2tpbmdfanNvbl9zZWFyY2hfY3VzdG9tZXJzJyxcbiAgICAgICAgICAgICAgLy8gc2VjdXJpdHk6IHdjX2VuaGFuY2VkX3NlbGVjdF9wYXJhbXMuc2VhcmNoX2N1c3RvbWVyc19ub25jZSxcbiAgICAgICAgICAgICAgZXhjbHVkZTogICQoIHRoaXMgKS5kYXRhKCAnZXhjbHVkZScgKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByb2Nlc3NSZXN1bHRzOiBmdW5jdGlvbiggZGF0YSApIHtcbiAgICAgICAgICAgIHZhciB0ZXJtcyA9IFtdO1xuICAgICAgICAgICAgaWYgKCBkYXRhICkge1xuICAgICAgICAgICAgICAkLmVhY2goIGRhdGEsIGZ1bmN0aW9uKCBpZCwgdGV4dCApIHtcbiAgICAgICAgICAgICAgICB0ZXJtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICByZXN1bHRzOiB0ZXJtc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhY2hlOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICQoIHRoaXMgKS5zZWxlY3QyKHNlbGVjdDJfYXJncykuYWRkQ2xhc3MoICdlbmhhbmNlZCcgKTtcbiAgICB9KTtcblxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEluaXRTZWxlY3QyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL2luaXQtc2VsZWN0Mi5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvc2Fzcy9hZG1pbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL3Nhc3MvdGhlbWUuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9zYXNzL2F3ZWJvb2tpbmcuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==