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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL2F3ZWJvb2tpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3BvcHVwLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy90b2dnbGUtY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3JhbmdlLWRhdGVwaWNrZXIuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3RvZ2dsZS1jaGVja2JveGVzLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy9pbml0LXNlbGVjdDIuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3Nhc3MvYWRtaW4uc2NzcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc2Fzcy90aGVtZS5zY3NzIiwid2VicGFjazovLy8uL2Fzc2V0cy9zYXNzL2F3ZWJvb2tpbmcuc2NzcyJdLCJuYW1lcyI6WyIkIiwid2luZG93IiwialF1ZXJ5IiwiVXRpbHMiLCJnZXRTZWxlY3RvckZyb21FbGVtZW50IiwiZWwiLCJzZWxlY3RvciIsImdldEF0dHJpYnV0ZSIsIiRzZWxlY3RvciIsImxlbmd0aCIsImVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyIsInNldHRpbmdzIiwiX2F3ZWJvb2tpbmdTZXR0aW5ncyIsIkF3ZUJvb2tpbmciLCJfIiwiZXh0ZW5kIiwiVnVlIiwicmVxdWlyZSIsIlBvcHBlciIsIlRvb2x0aXAiLCJQb3B1cCIsIlRvZ2dsZUNsYXNzIiwiUmFuZ2VEYXRlcGlja2VyIiwiVG9nZ2xlQ2hlY2tib3hlcyIsImluaXQiLCJzZWxmIiwiZWFjaCIsImRhdGEiLCJvcHRpb25zIiwidGVtcGxhdGUiLCJ0cmFucyIsImNvbnRleHQiLCJzdHJpbmdzIiwiYWpheFN1Ym1pdCIsImZvcm0iLCJhY3Rpb24iLCJzZXJpYWxpemUiLCJoYXNoIiwiYWRkQ2xhc3MiLCJ3cCIsImFqYXgiLCJwb3N0IiwiYWx3YXlzIiwicmVtb3ZlQ2xhc3MiLCJUaGVBd2VCb29raW5nIiwidGFyZ2V0Iiwic2V0dXAiLCJvbiIsIm9wZW4iLCJiaW5kIiwiY2xvc2UiLCJlIiwicHJldmVudERlZmF1bHQiLCJkaWFsb2ciLCIkdGFyZ2V0IiwiX3RyaWdnZXJSZXNpemUiLCJteSIsImF0Iiwib2YiLCJtb2RhbCIsIndpZHRoIiwiaGVpZ2h0IiwiYXV0b09wZW4iLCJkcmFnZ2FibGUiLCJyZXNpemFibGUiLCJjbG9zZU9uRXNjYXBlIiwiZGlhbG9nQ2xhc3MiLCJwb3NpdGlvbiIsImJlZm9yZUNsb3NlIiwiZXZlbnQiLCJ1aSIsInBhcmVudCIsImNoaWxkcmVuIiwidG9nZ2xlQ2xhc3MiLCJkb2N1bWVudCIsImNvbnRhaW5zIiwiREFURV9GT1JNQVQiLCJmcm9tRGF0ZSIsInRvRGF0ZSIsImJlZm9yZVNob3dDYWxsYmFjayIsImRhdGVwaWNrZXIiLCJkYXRlRm9ybWF0IiwiYmVmb3JlU2hvdyIsImFwcGx5RnJvbUNoYW5nZSIsImFwcGx5VG9DaGFuZ2UiLCJtaW5EYXRlIiwicGFyc2VEYXRlIiwidmFsIiwic2V0RGF0ZSIsImdldERhdGUiLCJtYXhEYXRlIiwidGFibGUiLCIkdGFibGUiLCJ1bmNoZWNrZWQiLCJjbG9zZXN0IiwiZmluZCIsImZpbHRlciIsIm5vdCIsInByb3AiLCJpcyIsIkluaXRTZWxlY3QyIiwic2VhcmNoQ3VzdG9tZXIiLCJzZWxlY3QyX2FyZ3MiLCJhbGxvd0NsZWFyIiwicGxhY2Vob2xkZXIiLCJtaW5pbXVtSW5wdXRMZW5ndGgiLCJlc2NhcGVNYXJrdXAiLCJtIiwidXJsIiwiYWpheF91cmwiLCJkYXRhVHlwZSIsImRlbGF5IiwicGFyYW1zIiwidGVybSIsImV4Y2x1ZGUiLCJwcm9jZXNzUmVzdWx0cyIsInRlcm1zIiwiaWQiLCJ0ZXh0IiwicHVzaCIsInJlc3VsdHMi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RUw5RSx3QkFBVSxrQ0FGTDtBQUdMO0FBQ0ErRSx5QkFBVXBILEVBQUcsSUFBSCxFQUFVNkIsSUFBVixDQUFnQixTQUFoQjtBQUpMLGVBQVA7QUFNRCxhQVhHO0FBWUp3Riw0QkFBZ0Isd0JBQVV4RixJQUFWLEVBQWlCO0FBQy9CLGtCQUFJeUYsUUFBUSxFQUFaO0FBQ0Esa0JBQUt6RixJQUFMLEVBQVk7QUFDVjdCLGtCQUFFNEIsSUFBRixDQUFRQyxJQUFSLEVBQWMsVUFBVTBGLEVBQVYsRUFBY0MsSUFBZCxFQUFxQjtBQUNqQ0Ysd0JBQU1HLElBQU4sQ0FBVztBQUNURix3QkFBSUEsRUFESztBQUVUQywwQkFBTUE7QUFGRyxtQkFBWDtBQUlELGlCQUxEO0FBTUQ7QUFDRCxxQkFBTztBQUNMRSx5QkFBU0o7QUFESixlQUFQO0FBR0QsYUF6Qkc7QUEwQkpLLG1CQUFPO0FBMUJIO0FBUFcsU0FBbkI7O0FBcUNBM0gsVUFBRyxJQUFILEVBQVU0SCxPQUFWLENBQWtCcEIsWUFBbEIsRUFBZ0NoRSxRQUFoQyxDQUEwQyxVQUExQztBQUNELE9BdkNEO0FBeUNEOzs7Ozs7QUFHSDdCLE9BQU9DLE9BQVAsR0FBaUIsSUFBSTBGLFdBQUosRUFBakIsQzs7Ozs7O0FDdERBLHlDOzs7Ozs7QUNBQSx5Qzs7Ozs7O0FDQUEseUMiLCJmaWxlIjoiXFxqc1xcYWRtaW5cXGF3ZWJvb2tpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgJCA9IHdpbmRvdy5qUXVlcnk7XHJcblxyXG5jb25zdCBVdGlscyA9IHtcclxuXHJcbiAgZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbCkge1xyXG4gICAgbGV0IHNlbGVjdG9yID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpO1xyXG5cclxuICAgIGlmICghc2VsZWN0b3IgfHwgc2VsZWN0b3IgPT09ICcjJykge1xyXG4gICAgICBzZWxlY3RvciA9IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0ICRzZWxlY3RvciA9ICQoc2VsZWN0b3IpO1xyXG4gICAgICByZXR1cm4gJHNlbGVjdG9yLmxlbmd0aCA+IDAgPyBzZWxlY3RvciA6IG51bGw7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9LFxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXRpbHM7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy91dGlscy5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5jb25zdCBzZXR0aW5ncyA9IHdpbmRvdy5fYXdlYm9va2luZ1NldHRpbmdzIHx8IHt9O1xyXG5cclxuaW1wb3J0IFBvcHBlciBmcm9tICdwb3BwZXIuanMnO1xyXG5pbXBvcnQgVG9vbHRpcCBmcm9tICd0b29sdGlwLmpzJztcclxuXHJcbmNvbnN0IEF3ZUJvb2tpbmcgPSBfLmV4dGVuZChzZXR0aW5ncywge1xyXG4gIFZ1ZTogcmVxdWlyZSgndnVlJyksXHJcbiAgUG9wcGVyOiBQb3BwZXIsXHJcbiAgVG9vbHRpcDogVG9vbHRpcCxcclxuXHJcbiAgUG9wdXA6IHJlcXVpcmUoJy4vdXRpbHMvcG9wdXAuanMnKSxcclxuICBUb2dnbGVDbGFzczogcmVxdWlyZSgnLi91dGlscy90b2dnbGUtY2xhc3MuanMnKSxcclxuICBSYW5nZURhdGVwaWNrZXI6IHJlcXVpcmUoJy4vdXRpbHMvcmFuZ2UtZGF0ZXBpY2tlci5qcycpLFxyXG4gIFRvZ2dsZUNoZWNrYm94ZXM6IHJlcXVpcmUoJy4vdXRpbHMvdG9nZ2xlLWNoZWNrYm94ZXMuanMnKSxcclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdCB0aGUgQXdlQm9va2luZ1xyXG4gICAqL1xyXG4gIGluaXQoKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAvLyBJbml0IHRoZSBwb3B1cCwgdXNlIGpxdWVyeS11aS1wb3B1cC5cclxuICAgICQoJ1tkYXRhLXRvZ2dsZT1cImF3ZWJvb2tpbmctcG9wdXBcIl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAkKHRoaXMpLmRhdGEoJ2F3ZWJvb2tpbmctcG9wdXAnLCBuZXcgc2VsZi5Qb3B1cCh0aGlzKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCdbZGF0YS1pbml0PVwiYXdlYm9va2luZy10b2dnbGVcIl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAkKHRoaXMpLmRhdGEoJ2F3ZWJvb2tpbmctdG9nZ2xlJywgbmV3IHNlbGYuVG9nZ2xlQ2xhc3ModGhpcykpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnW2RhdGEtaW5pdD1cImF3ZWJvb2tpbmctdG9vbHRpcFwiXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXdlYm9va2luZy10b29sdGlwIHRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwX19hcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwX19pbm5lclwiPjwvZGl2PjwvZGl2PicsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkKHRoaXMpLmRhdGEoJ2F3ZWJvb2tpbmctdG9vbHRpcCcsIG5ldyBzZWxmLlRvb2x0aXAodGhpcywgb3B0aW9ucykpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmVxdWlyZSgnLi91dGlscy9pbml0LXNlbGVjdDIuanMnKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYSB0cmFuc2xhdG9yIHN0cmluZ1xyXG4gICAqL1xyXG4gIHRyYW5zKGNvbnRleHQpIHtcclxuICAgIHJldHVybiB0aGlzLnN0cmluZ3NbY29udGV4dF0gPyB0aGlzLnN0cmluZ3NbY29udGV4dF0gOiAnJztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBNYWtlIGZvcm0gYWpheCByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIGFqYXhTdWJtaXQoZm9ybSwgYWN0aW9uKSB7XHJcbiAgICBjb25zdCBzZXJpYWxpemUgPSByZXF1aXJlKCdmb3JtLXNlcmlhbGl6ZScpO1xyXG4gICAgY29uc3QgZGF0YSA9IHNlcmlhbGl6ZShmb3JtLCB7IGhhc2g6IHRydWUgfSk7XHJcblxyXG4gICAgLy8gQWRkIC5hamF4LWxvYWRpbmcgY2xhc3MgaW4gdG8gdGhlIGZvcm0uXHJcbiAgICAkKGZvcm0pLmFkZENsYXNzKCdhamF4LWxvYWRpbmcnKTtcclxuXHJcbiAgICByZXR1cm4gd3AuYWpheC5wb3N0KGFjdGlvbiwgZGF0YSlcclxuICAgICAgLmFsd2F5cyhmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGZvcm0pLnJlbW92ZUNsYXNzKCdhamF4LWxvYWRpbmcnKTtcclxuICAgICAgfSk7XHJcbiAgfSxcclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gIEF3ZUJvb2tpbmcuaW5pdCgpO1xyXG59KTtcclxuXHJcbndpbmRvdy5UaGVBd2VCb29raW5nID0gQXdlQm9va2luZztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL2F3ZWJvb2tpbmcuanMiLCJjb25zdCAkID0gd2luZG93LmpRdWVyeTtcclxuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyk7XHJcblxyXG5jbGFzcyBQb3B1cCB7XHJcbiAgLyoqXHJcbiAgICogV3JhcHBlciB0aGUganF1ZXJ5LXVpLXBvcHVwLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGVsKSB7XHJcbiAgICB0aGlzLmVsID0gZWw7XHJcbiAgICB0aGlzLnRhcmdldCA9IFV0aWxzLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWwpO1xyXG5cclxuICAgIGlmICh0aGlzLnRhcmdldCkge1xyXG4gICAgICBQb3B1cC5zZXR1cCh0aGlzLnRhcmdldCk7XHJcblxyXG4gICAgICAkKHRoaXMuZWwpLm9uKCdjbGljaycsIHRoaXMub3Blbi5iaW5kKHRoaXMpKTtcclxuICAgICAgJCh0aGlzLnRhcmdldCkub24oJ2NsaWNrJywgJ1tkYXRhLWRpc21pc3M9XCJhd2Vib29raW5nLXBvcHVwXCJdJywgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9wZW4oZSkge1xyXG4gICAgZSAmJiBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAkKHRoaXMudGFyZ2V0KS5kaWFsb2coJ29wZW4nKTtcclxuICB9XHJcblxyXG4gIGNsb3NlKGUpIHtcclxuICAgIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJCh0aGlzLnRhcmdldCkuZGlhbG9nKCdjbG9zZScpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNldHVwKHRhcmdldCkge1xyXG4gICAgY29uc3QgJHRhcmdldCA9ICQodGFyZ2V0KTtcclxuICAgIGlmICghICR0YXJnZXQubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJHRhcmdldC5kaWFsb2coJ2luc3RhbmNlJykpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBfdHJpZ2dlclJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoJHRhcmdldC5kaWFsb2coJ2lzT3BlbicpKSB7XHJcbiAgICAgICAgJHRhcmdldC5kaWFsb2coJ29wdGlvbicsICdwb3NpdGlvbicsIHsgbXk6ICdjZW50ZXInLCBhdDogJ2NlbnRlciB0b3ArMjUlJywgb2Y6IHdpbmRvdyB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBkaWFsb2cgPSAkdGFyZ2V0LmRpYWxvZyh7XHJcbiAgICAgIG1vZGFsOiB0cnVlLFxyXG4gICAgICB3aWR0aDogJ2F1dG8nLFxyXG4gICAgICBoZWlnaHQ6ICdhdXRvJyxcclxuICAgICAgYXV0b09wZW46IGZhbHNlLFxyXG4gICAgICBkcmFnZ2FibGU6IHRydWUsXHJcbiAgICAgIHJlc2l6YWJsZTogZmFsc2UsXHJcbiAgICAgIGNsb3NlT25Fc2NhcGU6IHRydWUsXHJcbiAgICAgIGRpYWxvZ0NsYXNzOiAnd3AtZGlhbG9nIGF3ZWJvb2tpbmctZGlhbG9nJyxcclxuICAgICAgcG9zaXRpb246IHsgbXk6ICdjZW50ZXInLCBhdDogJ2NlbnRlciB0b3ArMjUlJywgb2Y6IHdpbmRvdyB9LFxyXG4gICAgICBvcGVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gJCgnYm9keScpLmNzcyh7IG92ZXJmbG93OiAnaGlkZGVuJyB9KTtcclxuICAgICAgfSxcclxuICAgICAgYmVmb3JlQ2xvc2U6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG4gICAgICAgIC8vICQoJ2JvZHknKS5jc3MoeyBvdmVyZmxvdzogJ2luaGVyaXQnIH0pO1xyXG4gICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vICQod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShfdHJpZ2dlclJlc2l6ZSwgMjUwKSk7XHJcblxyXG4gICAgcmV0dXJuIGRpYWxvZztcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUG9wdXA7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy9wb3B1cC5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5jb25zdCBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcclxuXHJcbmNsYXNzIFRvZ2dsZUNsYXNzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoZWwpIHtcclxuICAgIHRoaXMuZWwgPSBlbDtcclxuICAgIHRoaXMudGFyZ2V0ID0gVXRpbHMuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLnRhcmdldCkge1xyXG4gICAgICB0aGlzLnRhcmdldCA9ICQoZWwpLnBhcmVudCgpLmNoaWxkcmVuKCcuYXdlYm9va2luZy1tYWluLXRvZ2dsZScpWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRhcmdldCkge1xyXG4gICAgICAkKHRoaXMuZWwpLm9uKCdjbGljaycsIHRoaXMudG9nZ2xlQ2xhc3MuYmluZCh0aGlzKSk7XHJcbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMucmVtb3ZlQ2xhc3MuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0b2dnbGVDbGFzcyhlKSB7XHJcbiAgICBlICYmIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICQodGhpcy50YXJnZXQpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUNsYXNzKGUpIHtcclxuICAgIGlmIChlICYmICQuY29udGFpbnMoJCh0aGlzLnRhcmdldCkucGFyZW50KClbMF0sIGUudGFyZ2V0KSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgJCh0aGlzLnRhcmdldCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb2dnbGVDbGFzcztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3RvZ2dsZS1jbGFzcy5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5jb25zdCBEQVRFX0ZPUk1BVCA9ICd5eS1tbS1kZCc7XHJcblxyXG5jbGFzcyBSYW5nZURhdGVwaWNrZXIge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihmcm9tRGF0ZSwgdG9EYXRlKSB7XHJcbiAgICB0aGlzLnRvRGF0ZSA9IHRvRGF0ZTtcclxuICAgIHRoaXMuZnJvbURhdGUgPSBmcm9tRGF0ZTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBjb25zdCBiZWZvcmVTaG93Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgJCgnI3VpLWRhdGVwaWNrZXItZGl2JykuYWRkQ2xhc3MoJ2NtYjItZWxlbWVudCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkKHRoaXMuZnJvbURhdGUpLmRhdGVwaWNrZXIoe1xyXG4gICAgICBkYXRlRm9ybWF0OiBEQVRFX0ZPUk1BVCxcclxuICAgICAgYmVmb3JlU2hvdzogYmVmb3JlU2hvd0NhbGxiYWNrLFxyXG4gICAgfSkub24oJ2NoYW5nZScsIHRoaXMuYXBwbHlGcm9tQ2hhbmdlLmJpbmQodGhpcykpO1xyXG5cclxuICAgICQodGhpcy50b0RhdGUpLmRhdGVwaWNrZXIoe1xyXG4gICAgICBkYXRlRm9ybWF0OiBEQVRFX0ZPUk1BVCxcclxuICAgICAgYmVmb3JlU2hvdzogYmVmb3JlU2hvd0NhbGxiYWNrLFxyXG4gICAgfSkub24oJ2NoYW5nZScsIHRoaXMuYXBwbHlUb0NoYW5nZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLmFwcGx5VG9DaGFuZ2UoKTtcclxuICAgIHRoaXMuYXBwbHlGcm9tQ2hhbmdlKCk7XHJcbiAgfVxyXG5cclxuICBhcHBseUZyb21DaGFuZ2UoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBtaW5EYXRlID0gJC5kYXRlcGlja2VyLnBhcnNlRGF0ZShEQVRFX0ZPUk1BVCwgJCh0aGlzLmZyb21EYXRlKS52YWwoKSk7XHJcbiAgICAgIG1pbkRhdGUuc2V0RGF0ZShtaW5EYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAkKHRoaXMudG9EYXRlKS5kYXRlcGlja2VyKCdvcHRpb24nLCAnbWluRGF0ZScsIG1pbkRhdGUpO1xyXG4gICAgfSBjYXRjaChlKSB7fVxyXG4gIH1cclxuXHJcbiAgYXBwbHlUb0NoYW5nZSgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IG1heERhdGUgPSAkLmRhdGVwaWNrZXIucGFyc2VEYXRlKERBVEVfRk9STUFULCAkKHRoaXMudG9EYXRlKS52YWwoKSk7XHJcbiAgICAgICQodGhpcy5mcm9tRGF0ZSkuZGF0ZXBpY2tlcignb3B0aW9uJywgJ21heERhdGUnLCBtYXhEYXRlKTtcclxuICAgIH0gY2F0Y2goZSkge31cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmFuZ2VEYXRlcGlja2VyO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvcmFuZ2UtZGF0ZXBpY2tlci5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5cclxuY2xhc3MgVG9nZ2xlQ2hlY2tib3hlcyB7XHJcbiAgLyoqXHJcbiAgICogV3JhcHBlciB0aGUganF1ZXJ5LXVpLXBvcHVwLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHRhYmxlKSB7XHJcbiAgICB0aGlzLnRhYmxlID0gdGFibGU7XHJcbiAgICBjb25zdCAkdGFibGUgPSAkKHRoaXMudGFibGUpO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCAnLmNoZWNrLWNvbHVtbiA6Y2hlY2tib3gnLCBmdW5jdGlvbiggZXZlbnQgKSB7XHJcbiAgICAgIC8vIFRvZ2dsZSB0aGUgXCJTZWxlY3QgYWxsXCIgY2hlY2tib3hlcyBkZXBlbmRpbmcgaWYgdGhlIG90aGVyIG9uZXMgYXJlIGFsbCBjaGVja2VkIG9yIG5vdC5cclxuICAgICAgdmFyIHVuY2hlY2tlZCA9ICQodGhpcykuY2xvc2VzdCgndGJvZHknKS5maW5kKCc6Y2hlY2tib3gnKS5maWx0ZXIoJzp2aXNpYmxlOmVuYWJsZWQnKS5ub3QoJzpjaGVja2VkJyk7XHJcblxyXG4gICAgICAkKGRvY3VtZW50KS5maW5kKCcud3AtdG9nZ2xlLWNoZWNrYm94ZXMnKS5wcm9wKCdjaGVja2VkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICggMCA9PT0gdW5jaGVja2VkLmxlbmd0aCApO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oICdjbGljaycsICcud3AtdG9nZ2xlLWNoZWNrYm94ZXMnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICR0YWJsZS5jaGlsZHJlbiggJ3Rib2R5JyApLmZpbHRlcignOnZpc2libGUnKVxyXG4gICAgICAgIC5maW5kKCcuY2hlY2stY29sdW1uJykuZmluZCgnOmNoZWNrYm94JylcclxuICAgICAgICAucHJvcCgnY2hlY2tlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaWYgKCAkKHRoaXMpLmlzKCc6aGlkZGVuLDpkaXNhYmxlZCcpICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gISAkKHRoaXMpLnByb3AoICdjaGVja2VkJyApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZUNoZWNrYm94ZXM7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy90b2dnbGUtY2hlY2tib3hlcy5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5jb25zdCBBd2VCb29raW5nID0gd2luZG93LlRoZUF3ZUJvb2tpbmc7XHJcblxyXG5jbGFzcyBJbml0U2VsZWN0MiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlYXJjaEN1c3RvbWVyKCk7XHJcbiAgfVxyXG5cclxuICAvLyBBamF4IGN1c3RvbWVyIHNlYXJjaCBib3hlc1xyXG4gIHNlYXJjaEN1c3RvbWVyKCkge1xyXG4gICAgJCgnOmlucHV0LmF3ZWJvb2tpbmctY3VzdG9tZXItc2VhcmNoLCBzZWxlY3RbbmFtZT1cImJvb2tpbmdfY3VzdG9tZXJcIl0nKS5maWx0ZXIoICc6bm90KC5lbmhhbmNlZCknICkuZWFjaCggZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxlY3QyX2FyZ3MgPSB7XHJcbiAgICAgICAgYWxsb3dDbGVhcjogICQoIHRoaXMgKS5kYXRhKCAnYWxsb3dDbGVhcicgKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICBwbGFjZWhvbGRlcjogJCggdGhpcyApLmRhdGEoICdwbGFjZWhvbGRlcicgKSA/ICQoIHRoaXMgKS5kYXRhKCAncGxhY2Vob2xkZXInICkgOiBcIlwiLFxyXG4gICAgICAgIG1pbmltdW1JbnB1dExlbmd0aDogJCggdGhpcyApLmRhdGEoICdtaW5pbXVtX2lucHV0X2xlbmd0aCcgKSA/ICQoIHRoaXMgKS5kYXRhKCAnbWluaW11bV9pbnB1dF9sZW5ndGgnICkgOiAnMScsXHJcbiAgICAgICAgZXNjYXBlTWFya3VwOiBmdW5jdGlvbiggbSApIHtcclxuICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWpheDoge1xyXG4gICAgICAgICAgdXJsOiAgICAgICAgIEF3ZUJvb2tpbmcuYWpheF91cmwsXHJcbiAgICAgICAgICBkYXRhVHlwZTogICAgJ2pzb24nLFxyXG4gICAgICAgICAgZGVsYXk6ICAgICAgIDI1MCxcclxuICAgICAgICAgIGRhdGE6ICAgICAgICBmdW5jdGlvbiggcGFyYW1zICkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIHRlcm06ICAgICBwYXJhbXMudGVybSxcclxuICAgICAgICAgICAgICBhY3Rpb246ICAgJ2F3ZWJvb2tpbmdfanNvbl9zZWFyY2hfY3VzdG9tZXJzJyxcclxuICAgICAgICAgICAgICAvLyBzZWN1cml0eTogd2NfZW5oYW5jZWRfc2VsZWN0X3BhcmFtcy5zZWFyY2hfY3VzdG9tZXJzX25vbmNlLFxyXG4gICAgICAgICAgICAgIGV4Y2x1ZGU6ICAkKCB0aGlzICkuZGF0YSggJ2V4Y2x1ZGUnIClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBwcm9jZXNzUmVzdWx0czogZnVuY3Rpb24oIGRhdGEgKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXJtcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoIGRhdGEgKSB7XHJcbiAgICAgICAgICAgICAgJC5lYWNoKCBkYXRhLCBmdW5jdGlvbiggaWQsIHRleHQgKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIHJlc3VsdHM6IHRlcm1zXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2FjaGU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkKCB0aGlzICkuc2VsZWN0MihzZWxlY3QyX2FyZ3MpLmFkZENsYXNzKCAnZW5oYW5jZWQnICk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBJbml0U2VsZWN0MjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL2luaXQtc2VsZWN0Mi5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvc2Fzcy9hZG1pbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL3Nhc3MvdGhlbWUuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9zYXNzL2F3ZWJvb2tpbmcuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==