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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL2F3ZWJvb2tpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3BvcHVwLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy90b2dnbGUtY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3JhbmdlLWRhdGVwaWNrZXIuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzc3JjL2FkbWluL3V0aWxzL3RvZ2dsZS1jaGVja2JveGVzLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy9pbml0LXNlbGVjdDIuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3Nhc3MvYWRtaW4uc2Nzcz9kOWU2Iiwid2VicGFjazovLy8uL2Fzc2V0cy9zYXNzL3RoZW1lLnNjc3M/ODg2YiIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc2Fzcy9hd2Vib29raW5nLnNjc3M/MTU3ZSJdLCJuYW1lcyI6WyIkIiwid2luZG93IiwialF1ZXJ5IiwiVXRpbHMiLCJnZXRTZWxlY3RvckZyb21FbGVtZW50IiwiZWwiLCJzZWxlY3RvciIsImdldEF0dHJpYnV0ZSIsIiRzZWxlY3RvciIsImxlbmd0aCIsImVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyIsInNldHRpbmdzIiwiX2F3ZWJvb2tpbmdTZXR0aW5ncyIsIkF3ZUJvb2tpbmciLCJfIiwiZXh0ZW5kIiwiVnVlIiwicmVxdWlyZSIsIlBvcHBlciIsIlRvb2x0aXAiLCJQb3B1cCIsIlRvZ2dsZUNsYXNzIiwiUmFuZ2VEYXRlcGlja2VyIiwiVG9nZ2xlQ2hlY2tib3hlcyIsImluaXQiLCJzZWxmIiwiZWFjaCIsImRhdGEiLCJvcHRpb25zIiwidGVtcGxhdGUiLCJ0cmFucyIsImNvbnRleHQiLCJzdHJpbmdzIiwicm91dGUiLCJhY3Rpb24iLCJhZG1pbl9yb3V0ZSIsImFqYXhTdWJtaXQiLCJmb3JtIiwic2VyaWFsaXplIiwiaGFzaCIsImFkZENsYXNzIiwiYWpheCIsInVybCIsInR5cGUiLCJhbHdheXMiLCJyZW1vdmVDbGFzcyIsIlRoZUF3ZUJvb2tpbmciLCJ0YXJnZXQiLCJzZXR1cCIsIm9uIiwib3BlbiIsImJpbmQiLCJjbG9zZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImRpYWxvZyIsIiR0YXJnZXQiLCJfdHJpZ2dlclJlc2l6ZSIsIm15IiwiYXQiLCJvZiIsIm1vZGFsIiwid2lkdGgiLCJoZWlnaHQiLCJhdXRvT3BlbiIsImRyYWdnYWJsZSIsInJlc2l6YWJsZSIsImNsb3NlT25Fc2NhcGUiLCJkaWFsb2dDbGFzcyIsInBvc2l0aW9uIiwiYmVmb3JlQ2xvc2UiLCJldmVudCIsInVpIiwicGFyZW50IiwiY2hpbGRyZW4iLCJ0b2dnbGVDbGFzcyIsImRvY3VtZW50IiwiY29udGFpbnMiLCJEQVRFX0ZPUk1BVCIsImZyb21EYXRlIiwidG9EYXRlIiwiYmVmb3JlU2hvd0NhbGxiYWNrIiwiZGF0ZXBpY2tlciIsImRhdGVGb3JtYXQiLCJiZWZvcmVTaG93IiwiYXBwbHlGcm9tQ2hhbmdlIiwiYXBwbHlUb0NoYW5nZSIsIm1pbkRhdGUiLCJwYXJzZURhdGUiLCJ2YWwiLCJzZXREYXRlIiwiZ2V0RGF0ZSIsIm1heERhdGUiLCJ0YWJsZSIsIiR0YWJsZSIsInVuY2hlY2tlZCIsImNsb3Nlc3QiLCJmaW5kIiwiZmlsdGVyIiwibm90IiwicHJvcCIsImlzIiwiSW5pdFNlbGVjdDIiLCJzZWFyY2hDdXN0b21lciIsInNlbGVjdDJfYXJncyIsImFsbG93Q2xlYXIiLCJwbGFjZWhvbGRlciIsIm1pbmltdW1JbnB1dExlbmd0aCIsImVzY2FwZU1hcmt1cCIsIm0iLCJhamF4X3VybCIsImRhdGFUeXBlIiwiZGVsYXkiLCJwYXJhbXMiLCJ0ZXJtIiwiZXhjbHVkZSIsInByb2Nlc3NSZXN1bHRzIiwidGVy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QU9BLENBQVA7QUFDRCxXQU5nQjtBQU9qQnBFLGdCQUFNO0FBQ0pDLGlCQUFhN0IsV0FBV2lHLFFBRHBCO0FBRUpDLHNCQUFhLE1BRlQ7QUFHSkMsbUJBQWEsR0FIVDtBQUlKckYsa0JBQWEsY0FBVXNGLE1BQVYsRUFBbUI7QUFDOUIscUJBQU87QUFDTEMsc0JBQVVELE9BQU9DLElBRFo7QUFFTGhGLHdCQUFVLGtDQUZMO0FBR0w7QUFDQWlGLHlCQUFVckgsRUFBRyxJQUFILEVBQVU2QixJQUFWLENBQWdCLFNBQWhCO0FBSkwsZUFBUDtBQU1ELGFBWEc7QUFZSnlGLDRCQUFnQix3QkFBVXpGLElBQVYsRUFBaUI7QUFDL0Isa0JBQUkwRixRQUFRLEVBQVo7QUFDQSxrQkFBSzFGLElBQUwsRUFBWTtBQUNWN0Isa0JBQUU0QixJQUFGLENBQVFDLElBQVIsRUFBYyxVQUFVMkYsRUFBVixFQUFjQyxJQUFkLEVBQXFCO0FBQ2pDRix3QkFBTUcsSUFBTixDQUFXO0FBQ1RGLHdCQUFJQSxFQURLO0FBRVRDLDBCQUFNQTtBQUZHLG1CQUFYO0FBSUQsaUJBTEQ7QUFNRDtBQUNELHFCQUFPO0FBQ0xFLHlCQUFTSjtBQURKLGVBQVA7QUFHRCxhQXpCRztBQTBCSkssbUJBQU87QUExQkg7QUFQVyxTQUFuQjs7QUFxQ0E1SCxVQUFHLElBQUgsRUFBVTZILE9BQVYsQ0FBa0JuQixZQUFsQixFQUFnQ2hFLFFBQWhDLENBQTBDLFVBQTFDO0FBQ0QsT0F2Q0Q7QUF5Q0Q7Ozs7OztBQUdIL0IsT0FBT0MsT0FBUCxHQUFpQixJQUFJNEYsV0FBSixFQUFqQixDOzs7Ozs7QUN0REEseUM7Ozs7OztBQ0FBLHlDOzs7Ozs7QUNBQSx5QyIsImZpbGUiOiIvanMvYWRtaW4vYXdlYm9va2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciAkID0gd2luZG93LmpRdWVyeTtcblxuY29uc3QgVXRpbHMgPSB7XG5cbiAgZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbCkge1xuICAgIGxldCBzZWxlY3RvciA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKTtcblxuICAgIGlmICghc2VsZWN0b3IgfHwgc2VsZWN0b3IgPT09ICcjJykge1xuICAgICAgc2VsZWN0b3IgPSBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB8fCAnJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgJHNlbGVjdG9yID0gJChzZWxlY3Rvcik7XG4gICAgICByZXR1cm4gJHNlbGVjdG9yLmxlbmd0aCA+IDAgPyBzZWxlY3RvciA6IG51bGw7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSxcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVdGlscztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy91dGlscy5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xuY29uc3Qgc2V0dGluZ3MgPSB3aW5kb3cuX2F3ZWJvb2tpbmdTZXR0aW5ncyB8fCB7fTtcblxuaW1wb3J0IFBvcHBlciBmcm9tICdwb3BwZXIuanMnO1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAndG9vbHRpcC5qcyc7XG5cbmNvbnN0IEF3ZUJvb2tpbmcgPSBfLmV4dGVuZChzZXR0aW5ncywge1xuICBWdWU6IHJlcXVpcmUoJ3Z1ZScpLFxuICBQb3BwZXI6IFBvcHBlcixcbiAgVG9vbHRpcDogVG9vbHRpcCxcblxuICBQb3B1cDogcmVxdWlyZSgnLi91dGlscy9wb3B1cC5qcycpLFxuICBUb2dnbGVDbGFzczogcmVxdWlyZSgnLi91dGlscy90b2dnbGUtY2xhc3MuanMnKSxcbiAgUmFuZ2VEYXRlcGlja2VyOiByZXF1aXJlKCcuL3V0aWxzL3JhbmdlLWRhdGVwaWNrZXIuanMnKSxcbiAgVG9nZ2xlQ2hlY2tib3hlczogcmVxdWlyZSgnLi91dGlscy90b2dnbGUtY2hlY2tib3hlcy5qcycpLFxuXG4gIC8qKlxuICAgKiBJbml0IHRoZSBBd2VCb29raW5nXG4gICAqL1xuICBpbml0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gSW5pdCB0aGUgcG9wdXAsIHVzZSBqcXVlcnktdWktcG9wdXAuXG4gICAgJCgnW2RhdGEtdG9nZ2xlPVwiYXdlYm9va2luZy1wb3B1cFwiXScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAkKHRoaXMpLmRhdGEoJ2F3ZWJvb2tpbmctcG9wdXAnLCBuZXcgc2VsZi5Qb3B1cCh0aGlzKSk7XG4gICAgfSk7XG5cbiAgICAkKCdbZGF0YS1pbml0PVwiYXdlYm9va2luZy10b2dnbGVcIl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgJCh0aGlzKS5kYXRhKCdhd2Vib29raW5nLXRvZ2dsZScsIG5ldyBzZWxmLlRvZ2dsZUNsYXNzKHRoaXMpKTtcbiAgICB9KTtcblxuICAgICQoJ1tkYXRhLWluaXQ9XCJhd2Vib29raW5nLXRvb2x0aXBcIl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXdlYm9va2luZy10b29sdGlwIHRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwX19hcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwX19pbm5lclwiPjwvZGl2PjwvZGl2PicsXG4gICAgICB9O1xuXG4gICAgICAkKHRoaXMpLmRhdGEoJ2F3ZWJvb2tpbmctdG9vbHRpcCcsIG5ldyBzZWxmLlRvb2x0aXAodGhpcywgb3B0aW9ucykpO1xuICAgIH0pO1xuXG4gICAgcmVxdWlyZSgnLi91dGlscy9pbml0LXNlbGVjdDIuanMnKTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGEgdHJhbnNsYXRvciBzdHJpbmdcbiAgICovXG4gIHRyYW5zKGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdHJpbmdzW2NvbnRleHRdID8gdGhpcy5zdHJpbmdzW2NvbnRleHRdIDogJyc7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYWRtaW4gcm91dGUuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gYWN0aW9uIE9wdGlvbmFsLCBhY3Rpb24uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHJvdXRlKGFjdGlvbikge1xuICAgIHJldHVybiB0aGlzLmFkbWluX3JvdXRlICsgYWN0aW9uO1xuICB9LFxuXG4gIC8qKlxuICAgKiBNYWtlIGZvcm0gYWpheCByZXF1ZXN0LlxuICAgKi9cbiAgYWpheFN1Ym1pdChmb3JtLCBhY3Rpb24pIHtcbiAgICBjb25zdCBzZXJpYWxpemUgPSByZXF1aXJlKCdmb3JtLXNlcmlhbGl6ZScpO1xuICAgIGNvbnN0IGRhdGEgPSBzZXJpYWxpemUoZm9ybSwgeyBoYXNoOiB0cnVlIH0pO1xuXG4gICAgLy8gQWRkIC5hamF4LWxvYWRpbmcgY2xhc3MgaW4gdG8gdGhlIGZvcm0uXG4gICAgJChmb3JtKS5hZGRDbGFzcygnYWpheC1sb2FkaW5nJyk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLmFkbWluX3JvdXRlICsgYWN0aW9uLFxuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICB9KVxuICAgIC5hbHdheXMoZnVuY3Rpb24oKSB7XG4gICAgICAkKGZvcm0pLnJlbW92ZUNsYXNzKCdhamF4LWxvYWRpbmcnKTtcbiAgICB9KTtcbiAgfSxcbn0pO1xuXG4kKGZ1bmN0aW9uKCkge1xuICBBd2VCb29raW5nLmluaXQoKTtcbn0pO1xuXG53aW5kb3cuVGhlQXdlQm9va2luZyA9IEF3ZUJvb2tpbmc7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vYXdlYm9va2luZy5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyk7XG5cbmNsYXNzIFBvcHVwIHtcbiAgLyoqXG4gICAqIFdyYXBwZXIgdGhlIGpxdWVyeS11aS1wb3B1cC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMudGFyZ2V0ID0gVXRpbHMuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbCk7XG5cbiAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgIFBvcHVwLnNldHVwKHRoaXMudGFyZ2V0KTtcblxuICAgICAgJCh0aGlzLmVsKS5vbignY2xpY2snLCB0aGlzLm9wZW4uYmluZCh0aGlzKSk7XG4gICAgICAkKHRoaXMudGFyZ2V0KS5vbignY2xpY2snLCAnW2RhdGEtZGlzbWlzcz1cImF3ZWJvb2tpbmctcG9wdXBcIl0nLCB0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW4oZSkge1xuICAgIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQodGhpcy50YXJnZXQpLmRpYWxvZygnb3BlbicpO1xuICB9XG5cbiAgY2xvc2UoZSkge1xuICAgIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQodGhpcy50YXJnZXQpLmRpYWxvZygnY2xvc2UnKTtcbiAgfVxuXG4gIHN0YXRpYyBzZXR1cCh0YXJnZXQpIHtcbiAgICBjb25zdCAkdGFyZ2V0ID0gJCh0YXJnZXQpO1xuICAgIGlmICghICR0YXJnZXQubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCR0YXJnZXQuZGlhbG9nKCdpbnN0YW5jZScpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IF90cmlnZ2VyUmVzaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHRhcmdldC5kaWFsb2coJ2lzT3BlbicpKSB7XG4gICAgICAgICR0YXJnZXQuZGlhbG9nKCdvcHRpb24nLCAncG9zaXRpb24nLCB7IG15OiAnY2VudGVyJywgYXQ6ICdjZW50ZXIgdG9wKzI1JScsIG9mOiB3aW5kb3cgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGRpYWxvZyA9ICR0YXJnZXQuZGlhbG9nKHtcbiAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgd2lkdGg6ICdhdXRvJyxcbiAgICAgIGhlaWdodDogJ2F1dG8nLFxuICAgICAgYXV0b09wZW46IGZhbHNlLFxuICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICAgIGNsb3NlT25Fc2NhcGU6IHRydWUsXG4gICAgICBkaWFsb2dDbGFzczogJ3dwLWRpYWxvZyBhd2Vib29raW5nLWRpYWxvZycsXG4gICAgICBwb3NpdGlvbjogeyBteTogJ2NlbnRlcicsIGF0OiAnY2VudGVyIHRvcCsyNSUnLCBvZjogd2luZG93IH0sXG4gICAgICBvcGVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICQoJ2JvZHknKS5jc3MoeyBvdmVyZmxvdzogJ2hpZGRlbicgfSk7XG4gICAgICB9LFxuICAgICAgYmVmb3JlQ2xvc2U6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuICAgICAgICAvLyAkKCdib2R5JykuY3NzKHsgb3ZlcmZsb3c6ICdpbmhlcml0JyB9KTtcbiAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKF90cmlnZ2VyUmVzaXplLCAyNTApKTtcblxuICAgIHJldHVybiBkaWFsb2c7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQb3B1cDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy9wb3B1cC5qcyIsImNvbnN0ICQgPSB3aW5kb3cualF1ZXJ5O1xuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyk7XG5cbmNsYXNzIFRvZ2dsZUNsYXNzIHtcblxuICBjb25zdHJ1Y3RvcihlbCkge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLnRhcmdldCA9IFV0aWxzLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWwpO1xuXG4gICAgaWYgKCF0aGlzLnRhcmdldCkge1xuICAgICAgdGhpcy50YXJnZXQgPSAkKGVsKS5wYXJlbnQoKS5jaGlsZHJlbignLmF3ZWJvb2tpbmctbWFpbi10b2dnbGUnKVswXTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICQodGhpcy5lbCkub24oJ2NsaWNrJywgdGhpcy50b2dnbGVDbGFzcy5iaW5kKHRoaXMpKTtcbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMucmVtb3ZlQ2xhc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlQ2xhc3MoZSkge1xuICAgIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQodGhpcy50YXJnZXQpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIHJlbW92ZUNsYXNzKGUpIHtcbiAgICBpZiAoZSAmJiAkLmNvbnRhaW5zKCQodGhpcy50YXJnZXQpLnBhcmVudCgpWzBdLCBlLnRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkKHRoaXMudGFyZ2V0KS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUb2dnbGVDbGFzcztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy90b2dnbGUtY2xhc3MuanMiLCJjb25zdCAkID0gd2luZG93LmpRdWVyeTtcbmNvbnN0IERBVEVfRk9STUFUID0gJ3l5LW1tLWRkJztcblxuY2xhc3MgUmFuZ2VEYXRlcGlja2VyIHtcblxuICBjb25zdHJ1Y3Rvcihmcm9tRGF0ZSwgdG9EYXRlKSB7XG4gICAgdGhpcy50b0RhdGUgPSB0b0RhdGU7XG4gICAgdGhpcy5mcm9tRGF0ZSA9IGZyb21EYXRlO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBjb25zdCBiZWZvcmVTaG93Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICQoJyN1aS1kYXRlcGlja2VyLWRpdicpLmFkZENsYXNzKCdjbWIyLWVsZW1lbnQnKTtcbiAgICB9O1xuXG4gICAgJCh0aGlzLmZyb21EYXRlKS5kYXRlcGlja2VyKHtcbiAgICAgIGRhdGVGb3JtYXQ6IERBVEVfRk9STUFULFxuICAgICAgYmVmb3JlU2hvdzogYmVmb3JlU2hvd0NhbGxiYWNrLFxuICAgIH0pLm9uKCdjaGFuZ2UnLCB0aGlzLmFwcGx5RnJvbUNoYW5nZS5iaW5kKHRoaXMpKTtcblxuICAgICQodGhpcy50b0RhdGUpLmRhdGVwaWNrZXIoe1xuICAgICAgZGF0ZUZvcm1hdDogREFURV9GT1JNQVQsXG4gICAgICBiZWZvcmVTaG93OiBiZWZvcmVTaG93Q2FsbGJhY2ssXG4gICAgfSkub24oJ2NoYW5nZScsIHRoaXMuYXBwbHlUb0NoYW5nZS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuYXBwbHlUb0NoYW5nZSgpO1xuICAgIHRoaXMuYXBwbHlGcm9tQ2hhbmdlKCk7XG4gIH1cblxuICBhcHBseUZyb21DaGFuZ2UoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1pbkRhdGUgPSAkLmRhdGVwaWNrZXIucGFyc2VEYXRlKERBVEVfRk9STUFULCAkKHRoaXMuZnJvbURhdGUpLnZhbCgpKTtcbiAgICAgIG1pbkRhdGUuc2V0RGF0ZShtaW5EYXRlLmdldERhdGUoKSArIDEpO1xuICAgICAgJCh0aGlzLnRvRGF0ZSkuZGF0ZXBpY2tlcignb3B0aW9uJywgJ21pbkRhdGUnLCBtaW5EYXRlKTtcbiAgICB9IGNhdGNoKGUpIHt9XG4gIH1cblxuICBhcHBseVRvQ2hhbmdlKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBtYXhEYXRlID0gJC5kYXRlcGlja2VyLnBhcnNlRGF0ZShEQVRFX0ZPUk1BVCwgJCh0aGlzLnRvRGF0ZSkudmFsKCkpO1xuICAgICAgJCh0aGlzLmZyb21EYXRlKS5kYXRlcGlja2VyKCdvcHRpb24nLCAnbWF4RGF0ZScsIG1heERhdGUpO1xuICAgIH0gY2F0Y2goZSkge31cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmdlRGF0ZXBpY2tlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9hZG1pbi91dGlscy9yYW5nZS1kYXRlcGlja2VyLmpzIiwiY29uc3QgJCA9IHdpbmRvdy5qUXVlcnk7XG5cbmNsYXNzIFRvZ2dsZUNoZWNrYm94ZXMge1xuICAvKipcbiAgICogV3JhcHBlciB0aGUganF1ZXJ5LXVpLXBvcHVwLlxuICAgKi9cbiAgY29uc3RydWN0b3IodGFibGUpIHtcbiAgICB0aGlzLnRhYmxlID0gdGFibGU7XG4gICAgY29uc3QgJHRhYmxlID0gJCh0aGlzLnRhYmxlKTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCAnLmNoZWNrLWNvbHVtbiA6Y2hlY2tib3gnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAvLyBUb2dnbGUgdGhlIFwiU2VsZWN0IGFsbFwiIGNoZWNrYm94ZXMgZGVwZW5kaW5nIGlmIHRoZSBvdGhlciBvbmVzIGFyZSBhbGwgY2hlY2tlZCBvciBub3QuXG4gICAgICB2YXIgdW5jaGVja2VkID0gJCh0aGlzKS5jbG9zZXN0KCd0Ym9keScpLmZpbmQoJzpjaGVja2JveCcpLmZpbHRlcignOnZpc2libGU6ZW5hYmxlZCcpLm5vdCgnOmNoZWNrZWQnKTtcblxuICAgICAgJChkb2N1bWVudCkuZmluZCgnLndwLXRvZ2dsZS1jaGVja2JveGVzJykucHJvcCgnY2hlY2tlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKCAwID09PSB1bmNoZWNrZWQubGVuZ3RoICk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgJy53cC10b2dnbGUtY2hlY2tib3hlcycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICR0YWJsZS5jaGlsZHJlbiggJ3Rib2R5JyApLmZpbHRlcignOnZpc2libGUnKVxuICAgICAgICAuZmluZCgnLmNoZWNrLWNvbHVtbicpLmZpbmQoJzpjaGVja2JveCcpXG4gICAgICAgIC5wcm9wKCdjaGVja2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCAkKHRoaXMpLmlzKCc6aGlkZGVuLDpkaXNhYmxlZCcpICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gISAkKHRoaXMpLnByb3AoICdjaGVja2VkJyApO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZUNoZWNrYm94ZXM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvdG9nZ2xlLWNoZWNrYm94ZXMuanMiLCJjb25zdCAkID0gd2luZG93LmpRdWVyeTtcbmNvbnN0IEF3ZUJvb2tpbmcgPSB3aW5kb3cuVGhlQXdlQm9va2luZztcblxuY2xhc3MgSW5pdFNlbGVjdDIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlYXJjaEN1c3RvbWVyKCk7XG4gIH1cblxuICAvLyBBamF4IGN1c3RvbWVyIHNlYXJjaCBib3hlc1xuICBzZWFyY2hDdXN0b21lcigpIHtcbiAgICAkKCc6aW5wdXQuYXdlYm9va2luZy1jdXN0b21lci1zZWFyY2gsIHNlbGVjdFtuYW1lPVwiYm9va2luZ19jdXN0b21lclwiXScpLmZpbHRlciggJzpub3QoLmVuaGFuY2VkKScgKS5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxlY3QyX2FyZ3MgPSB7XG4gICAgICAgIGFsbG93Q2xlYXI6ICAkKCB0aGlzICkuZGF0YSggJ2FsbG93Q2xlYXInICkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIHBsYWNlaG9sZGVyOiAkKCB0aGlzICkuZGF0YSggJ3BsYWNlaG9sZGVyJyApID8gJCggdGhpcyApLmRhdGEoICdwbGFjZWhvbGRlcicgKSA6IFwiXCIsXG4gICAgICAgIG1pbmltdW1JbnB1dExlbmd0aDogJCggdGhpcyApLmRhdGEoICdtaW5pbXVtX2lucHV0X2xlbmd0aCcgKSA/ICQoIHRoaXMgKS5kYXRhKCAnbWluaW11bV9pbnB1dF9sZW5ndGgnICkgOiAnMScsXG4gICAgICAgIGVzY2FwZU1hcmt1cDogZnVuY3Rpb24oIG0gKSB7XG4gICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH0sXG4gICAgICAgIGFqYXg6IHtcbiAgICAgICAgICB1cmw6ICAgICAgICAgQXdlQm9va2luZy5hamF4X3VybCxcbiAgICAgICAgICBkYXRhVHlwZTogICAgJ2pzb24nLFxuICAgICAgICAgIGRlbGF5OiAgICAgICAyNTAsXG4gICAgICAgICAgZGF0YTogICAgICAgIGZ1bmN0aW9uKCBwYXJhbXMgKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0ZXJtOiAgICAgcGFyYW1zLnRlcm0sXG4gICAgICAgICAgICAgIGFjdGlvbjogICAnYXdlYm9va2luZ19qc29uX3NlYXJjaF9jdXN0b21lcnMnLFxuICAgICAgICAgICAgICAvLyBzZWN1cml0eTogd2NfZW5oYW5jZWRfc2VsZWN0X3BhcmFtcy5zZWFyY2hfY3VzdG9tZXJzX25vbmNlLFxuICAgICAgICAgICAgICBleGNsdWRlOiAgJCggdGhpcyApLmRhdGEoICdleGNsdWRlJyApXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcHJvY2Vzc1Jlc3VsdHM6IGZ1bmN0aW9uKCBkYXRhICkge1xuICAgICAgICAgICAgdmFyIHRlcm1zID0gW107XG4gICAgICAgICAgICBpZiAoIGRhdGEgKSB7XG4gICAgICAgICAgICAgICQuZWFjaCggZGF0YSwgZnVuY3Rpb24oIGlkLCB0ZXh0ICkge1xuICAgICAgICAgICAgICAgIHRlcm1zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHJlc3VsdHM6IHRlcm1zXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FjaGU6IHRydWVcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgJCggdGhpcyApLnNlbGVjdDIoc2VsZWN0Ml9hcmdzKS5hZGRDbGFzcyggJ2VuaGFuY2VkJyApO1xuICAgIH0pO1xuXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgSW5pdFNlbGVjdDI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hc3NldHMvanNzcmMvYWRtaW4vdXRpbHMvaW5pdC1zZWxlY3QyLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9zYXNzL2FkbWluLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvc2Fzcy90aGVtZS5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL3Nhc3MvYXdlYm9va2luZy5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9