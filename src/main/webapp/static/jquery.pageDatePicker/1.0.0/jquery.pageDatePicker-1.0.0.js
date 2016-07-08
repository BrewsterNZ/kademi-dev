/**
 *
 * jquery.pageDatePicker.js
 * @version: 1.0.0
 * @require: momentjs
 *
 * Configuration:
 */

(function ($) {
    $.fn.pageDatePicker = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('[jquery.pageDatePicker] Method ' + method + ' does not exist on jquery.pageDatePicker');
        }
    };

    // Version for jquery.orgFinder
    $.fn.pageDatePicker.version = '1.0.0';

    // Default configuration
    $.fn.pageDatePicker.DEFAULT = {
        navUnit: '1-day',
        ranges: {
            '3 days': [moment().subtract(2, 'days'), moment()],
            '7 days': [moment().subtract(6, 'days'), moment()],
            '1 month': [moment().subtract(1, 'month'), moment()],
            '3 months': [moment().subtract(3, 'month'), moment()],
            '1 year': [moment().subtract(1, 'year'), moment()]
        },
        dateFormat: 'DD/MM/YYYY',
        onSelect: function (text, startDate, endDate) {
        },
        default: ($.cookie('pageDatePicker-startDate') && $.cookie('pageDatePicker-endDate')) ? $.cookie('pageDatePicker-startDate') + '-' + $.cookie('pageDatePicker-endDate') : '7-day',
        extraClass: '',
        position: 'right'
    };

    function PageDatePicker(container, options) {
        this.container = container;
        this.options = options;
        this.init();
    }

    PageDatePicker.prototype = {
        init: function () {
            flog('[jquery.pageDatePicker] init');

            var self = this;
            var options = self.options;
            var container = self.container;
            var randomId = (new Date()).getTime();

            container.append(
                '<div class="dropdown pageDatePicker-wrapper">' +
                '   <a class="dropdown-toggle pageDatePicker-dropdown-trigger ' + options.extraClass + '">' +
                '       <span class="pageDatePicker-text"></span>' +
                '       <span class="caret"></span>' +
                '   </a>' +
                '   <div class="dropdown-menu ' + (options.position === 'right' ? 'dropdown-menu-right' : '') + ' pageDatePicker-dropdown">' +
                '       <button type="button" class="close pageDatePicker-dropdown-closer">&times;</button>' +
                '       <ul class="nav nav-tabs tab-blue">' +
                '           <li class="active"><a href="#pageDatePicker-endingNowTab' + randomId + '" data-toggle="tab">Ending Now</a></li>' +
                '           <li><a href="#pageDatePicker-customDateTab' + randomId + '" data-toggle="tab">Custom Date</a></li>' +
                '       </ul>' +
                '       <div class="tab-content">' +
                '           <div class="tab-pane fade in active pageDatePicker-endingNowTab" id="pageDatePicker-endingNowTab' + randomId + '"></div>' +
                '           <div class="tab-pane fade pageDatePicker-customDateTab" id="pageDatePicker-customDateTab' + randomId + '"></div>' +
                '       </div>' +
                '   </div>' +
                '</div>'
            );

            self.dropDownTrigger = container.find('.pageDatePicker-dropdown-trigger');
            self.dropDown = container.find('.pageDatePicker-dropdown');
            self.previewText = container.find('.pageDatePicker-text');
            self.tabTriggers = container.find('.pageDatePicker-tab-trigger').children();
            self.endingNowTab = container.find('.pageDatePicker-endingNowTab');
            self.customDateTab = container.find('.pageDatePicker-customDateTab');

            self.initDropDown();
            self.initTabSwitcher();
            self.initEndingNowTab();
            self.initCustomDateTab();
            self.initOriginRange();
        },

        initDropDown: function () {
            flog('[jquery.pageDatePicker] initDropDown');

            var self = this;
            var dropDownTrigger = self.dropDownTrigger;
            var dropDown = self.dropDown;

            dropDownTrigger.on('click', function (e) {
                e.preventDefault();

                flog('[jquery.pageDatePicker] Dropdown trigger is clicked');

                if (dropDown.hasClass('showed')) {
                    dropDown.removeClass('showed');
                } else {
                    dropDown.addClass('showed');
                }
            });

            self.container.find('.pageDatePicker-dropdown-closer').on('click', function (e) {
                e.preventDefault();

                dropDown.removeClass('showed');
            });
        },

        initTabSwitcher: function () {
            flog('[jquery.pageDatePicker] initTabSwitcher');

            var self = this;
            var tabTriggers = self.tabTriggers;

            tabTriggers.each(function () {
                var trigger = $(this);

                trigger.on('click', function (e) {
                    e.preventDefault();

                    trigger.find('a').tab('show');
                });
            });
        },

        initEndingNowTab: function () {
            flog('[jquery.pageDatePicker] initEndingNowTab');

            var self = this;
            var options = self.options;
            var endingNowTab = self.endingNowTab;

            endingNowTab.append(
                '<div class="pageDatePicker-ranges clearfix"></div>' +
                '<div class="pageDatePicker-nav clearfix"></div>'
            );

            var rangeWrapper = self.rangeWrapper = endingNowTab.find('.pageDatePicker-ranges');
            var rangeHtml = '';
            for (var rangeText in options.ranges) {
                var dates = options.ranges[rangeText];
                var startDate = dates[0].format(options.dateFormat);
                var endDate = dates[1].format(options.dateFormat);

                rangeHtml += '<a href="#" data-start-date="' + startDate + '" data-end-date="' + endDate +'" class="pageDatePicker-range"><span>' + rangeText + '</span></a>';
            }
            rangeWrapper.html(rangeHtml);

            var rangeItems = self.rangeItems = rangeWrapper.find('.pageDatePicker-range');
            var totalItems = rangeItems.length;
            rangeItems.css('width', 'calc(100% / ' + totalItems + ')').on('click', function (e) {
                e.preventDefault();

                var item = $(this);
                var text = item.text().trim();

                flog('[jquery.pageDatePicker] Range item is clicked', text);

                if (!item.hasClass('active')) {
                    var startDate = item.attr('data-start-date');
                    var endDate = item.attr('data-end-date');

                    self.selectRange(startDate, endDate, text, item);
                }
            });

            //var navWrapper = self.navWrapper = endingNowTab.find('.pageDatePicker-nav');
            //var navText = options.navUnit.replace('-', ' ');
            //navWrapper.append(
            //    '<a href="#"><i class="fa fa-angle-left"></i> Back ' + navText + '</a>' +
            //    '<a href="#">Forward ' + navText + ' <i class="fa fa-angle-right"></i></a>'
            //);
        },

        initCustomDateTab: function () {
            flog('[jquery.pageDatePicker] initCustomDateTab');

            var self = this;
            var options = self.options;
            var customDateTab = self.customDateTab;
            var randomId = 'pageDatePicker-daterange-wrapper-' + (new Date()).getTime();

            customDateTab.append(
                '<div class="pageDatePicker-daterange-wrapper clearfix" id="' + randomId + '">' +
                '    <div class="pageDatePicker-daterange"></div>' +
                '</div>'
            );

            var dateRange = self.dateRange = customDateTab.find('.pageDatePicker-daterange');
            dateRange.daterangepicker({
                parentEl: '#' + randomId,
                autoApply: true,
                opens: 'left',
                maxDate: moment()
            });

            dateRange.on('apply.daterangepicker', function (ev, picker) {
                flog('[jquery.pageDatePicker] on "apply.daterangepicker"', ev, picker);

                var startDate = picker.startDate.format(options.dateFormat);
                var endDate = picker.endDate.format(options.dateFormat);

                self.selectRange(startDate, endDate);
            });

            dateRange.click();
        },

        selectRange: function (startDate, endDate, text, trigger) {
            flog('[jquery.pageDatePicker] selectRange', startDate, endDate, text, trigger);

            var self = this;
            var options = self.options;
            var previewText = self.previewText;

            self.rangeItems.filter('.active').removeClass('active');

            if (trigger) {
                trigger.addClass('active');
            }

            if (text) {
                previewText.text(text + ' ago');
            } else {
                previewText.text('from ' + startDate + ' to ' + endDate);
            }

            // See QueryService.java
            $.cookie('pageDatePicker-startDate', startDate, {
                path: '/',
                expires: 999
            });

            $.cookie('pageDatePicker-endDate', endDate, {
                path: '/',
                expires: 999
            });

            if (options.onSelect === 'function') {
                options.onSelect.call(self, startDate, endDate);
            }

            flog("fire event");
            $(document.body).trigger('pageDateChanged', [startDate, endDate, self.container]);
        },

        initOriginRange: function () {
            flog('[jquery.pageDatePicker] initOriginRange');

            var self = this;
            var options = self.options;
            var rangeItems = self.rangeItems;
            var startDate;
            var endDate;

            flog('[jquery.pageDatePicker] Default value: ' + options.default);

            var defaultValue = options.default.split('-');
            if (moment(defaultValue[0], options.dateFormat).isValid() && moment(defaultValue[1], options.dateFormat).isValid()) {
                flog('[jquery.pageDatePicker] Default is range');

                startDate = defaultValue[0];
                endDate = defaultValue[1];
            } else {
                flog('[jquery.pageDatePicker] Default is time ago');

                var now = moment();
                var from = moment().subtract(+defaultValue[0] - 1, defaultValue[1]);
                startDate = from.format(options.dateFormat);
                endDate = now.format(options.dateFormat);
            }

            var trigger = rangeItems.filter('[data-start-date="' + startDate + '"][data-end-date="' + endDate + '"]');
            if (trigger.length > 0) {
                trigger.trigger('click');
            } else {
                self.selectRange(startDate, endDate);
            }
        }
    };

    var methods = {
        init: function (options) {
            options = $.extend({}, $.fn.pageDatePicker.DEFAULT, options);

            $(this).each(function () {
                var container = $(this);
                if (!container.data('pageDatePicker')) {
                    var pageDatePicker = new PageDatePicker(container, options);
                    container.data('pageDatePicker', pageDatePicker);
                }
            });
        }
    };

})(jQuery);
