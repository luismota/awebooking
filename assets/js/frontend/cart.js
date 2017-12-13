webpackJsonp([3],{

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(34);


/***/ }),

/***/ 34:
/***/ (function(module, exports) {

jQuery(function ($) {
    'use strict';

    $('.js-awebooking-add-room').on('click', function (e) {
        e.preventDefault();

        var el = $(this);

        $.ajax({
            url: AweBooking.route_url + 'cart/add',
            type: 'post',
            data: {},
            beforeSend: function beforeSend() {},

            success: function success(response) {}
        });
    });
});

/***/ })

},[33]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanNzcmMvZnJvbnRlbmQvY2FydC5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCIkIiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCJlbCIsImFqYXgiLCJ1cmwiLCJBd2VCb29raW5nIiwicm91dGVfdXJsIiwidHlwZSIsImRhdGEiLCJiZWZvcmVTZW5kIiwic3VjY2VzcyIsInJlc3BvbnNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBU0MsQ0FBVCxFQUFZO0FBQ2Y7O0FBRUFBLE1BQUUseUJBQUYsRUFBNkJDLEVBQTdCLENBQWdDLE9BQWhDLEVBQXlDLFVBQVVDLENBQVYsRUFBYTtBQUNsREEsVUFBRUMsY0FBRjs7QUFFQSxZQUFJQyxLQUFLSixFQUFFLElBQUYsQ0FBVDs7QUFFQUEsVUFBRUssSUFBRixDQUFPO0FBQ0hDLGlCQUFLQyxXQUFXQyxTQUFYLEdBQXVCLFVBRHpCO0FBRUhDLGtCQUFNLE1BRkg7QUFHSEMsa0JBQU0sRUFISDtBQU1IQyx3QkFBWSxzQkFBVyxDQUN0QixDQVBFOztBQVNIQyxxQkFBUyxpQkFBVUMsUUFBVixFQUFxQixDQUU3QjtBQVhFLFNBQVA7QUFhSCxLQWxCRDtBQW1CSCxDQXRCRCxFIiwiZmlsZSI6IlxcanNcXGZyb250ZW5kXFxjYXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsialF1ZXJ5KGZ1bmN0aW9uKCQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKCcuanMtYXdlYm9va2luZy1hZGQtcm9vbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB2YXIgZWwgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IEF3ZUJvb2tpbmcucm91dGVfdXJsICsgJ2NhcnQvYWRkJyxcclxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59ICk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9qc3NyYy9mcm9udGVuZC9jYXJ0LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==