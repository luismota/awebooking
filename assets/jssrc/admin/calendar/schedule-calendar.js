(function($, moment) {
  'use strict';

  const DATE_FORMAT = 'YYYY-MM-DD';

  const Selection = Backbone.Model.extend({
    defaults: {
      unit: null,
      endDate: null,
      startDate: null,
    },

    validate(attrs, options) {
      // ...
    },

    clearSelectedDate(newUnit) {
      this.set({ startDate: null, endDate: null });
      this.set('unit', newUnit);
    },

    getNights() {
      if (! this.has('endDate') || ! this.has('startDate')) {
        return 0;
      }

      return this.get('endDate').diff(this.get('startDate'), 'days');
    }
  });

  const ScheduleCalendar = Backbone.View.extend({
    options: {
      debug: true,
      marker: '.awebooking-schedule__marker',
    },

    events: {
      'click .awebooking-schedule__day': 'setSelectionDate',
      'mouseenter .awebooking-schedule__day': 'drawMarkerOnHover',
    },

    initialize() {
      this.model = new Selection;

      this.$marker = this.$el.find(this.options.marker);
      this.$marker.hide();

      $(document).on('keyup', this.keyup.bind(this));
      // $(document).off('keyup', this.keyup);

      this.listenTo(this.model, 'change:startDate change:endDate', this.setMarkerPosition);
      if (this.options.debug) {
        this.listenTo(this.model, 'change', this.debug);
      }

      this.$el.data('schedule-calendar', this);
    },

    debug () {
      if (this.model.has('startDate') && this.model.has('endDate')) {
        console.log(this.model.get('unit'), this.model.get('startDate').format(DATE_FORMAT) + ' - ' + this.model.get('endDate').format(DATE_FORMAT));
      } else if (this.model.has('startDate')) {
        console.log(this.model.get('unit'), this.model.get('startDate').format(DATE_FORMAT) + ' - null');
      } else if(this.model.has('endDate')) {
        console.log(this.model.get('unit'), 'null' + ' - ' + this.model.get('endDate').format(DATE_FORMAT));
      }
    },

    keyup(e) {
      if (e.keyCode == 27) {
        this.model.clearSelectedDate();
      }
    },

    setSelectionDate(e) {
      const $target = $(e.currentTarget);
      const setUnit = this.getUnitByElement($target);
      const clickDate = moment($target.data('date'));

      if (this.model.has('unit') && setUnit !== this.model.get('unit')
          || this.model.has('startDate') && this.model.has('endDate')
          || this.model.has('startDate') && clickDate.isBefore(this.model.get('startDate'), 'day')) {
        this.model.clearSelectedDate(setUnit);
      }

      if (!this.model.has('startDate') && !this.model.has('endDate')) {
        this.model.set('unit', setUnit);
        this.model.set('startDate', clickDate.clone());
      } else {
        this.model.set('endDate', clickDate.clone());
        this.trigger('apply', this.model, this);
        console.log(this.model.getNights());
      }
    },

    setMarkerPosition() {
      const endDate = this.model.get('endDate');
      const startDate = this.model.get('startDate');

      if (_.isNull(startDate) && _.isNull(endDate)) {
        this.$marker.css('width', 60).hide();
        return;
      }

      const $startDateEl = this.getElementByDate(this.model.get('unit'), startDate);
      if (_.isNull(endDate)) {
        const position = $startDateEl.position();
        this.$marker.show().css({ top: position.top, left: position.left });
      } else {
        const $endDateEl = this.getElementByDate(this.model.get('unit'), endDate);
        this.$marker.css('width', ($endDateEl.index() - $startDateEl.index() + 1) * 60);
      }
    },

    drawMarkerOnHover(e) {
      const $target = $(e.currentTarget);
      const targetUnit = this.getUnitByElement($target);

      if (!this.model.has('unit')
        || this.model.get('unit') !== targetUnit
        || !this.model.has('startDate')
        || this.model.has('startDate') && this.model.has('endDate')) {
        return;
      }

      const hoverDate = moment($target.data('date'));
      const startDate = this.model.get('startDate');

      if (startDate.isSameOrBefore(hoverDate, 'day')) {
        const $startDateEl = this.getElementByDate(targetUnit, startDate);
        this.$marker.css('width', ($target.index() - $startDateEl.index() + 1) * 60);
      }
    },

    getElementByDate(unit, date) {
      if (typeof date === 'object') {
        date = date.format(DATE_FORMAT);
      }

      return this.$el
        .find('[data-unit="' + unit + '"]')
        .find('.awebooking-schedule__day[data-date="' + date + '"]');
    },

    getUnitByElement(element) {
      let unit = $(element).data('unit');

      if (typeof unit === 'undefined') {
        unit = $(element).parent().data('unit');
      }

      unit = parseInt(unit, 10);
      return ! isNaN(unit) ? unit : 0;
    },
  });

  new ScheduleCalendar({
    el: '.awebooking-schedule'
  });

})(jQuery, TheAweBooking.momment || window.moment);
