(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['dateRange'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "dateRange component', contentArea, container, component, keditor);

            var self = this;

            if ($('[href="/static/daterangepicker/2.0.11/daterangepicker.css"]').length === 0) {
                $('head').append('<link href="/static/daterangepicker/2.0.11/daterangepicker.css" rel="stylesheet" type="text/css" />');
            }

            if ($('[href="/theme/apps/pagedatepicker-lib/jquery.pageDatePicker.css"]').length === 0) {
                $('head').append('<link href="/theme/apps/pagedatepicker-lib/jquery.pageDatePicker.css" rel="stylesheet" type="text/css" />');
            }

            $.getScript('/static/moment/2.17.1/moment.js', function () {
                $.getScript('/static/daterangepicker/2.0.11/daterangepicker.js', function () {
                    $.getScript('/theme/apps/pagedatepicker-lib/jquery.pageDatePicker.js', function () {
                        self.initPicker();
                    });
                });
            });
        },

        initPicker: function () {
            flog('initPicker');

            $('.pageDatePicker').each(function () {
                var pageDatePicker = $(this);

                if (!pageDatePicker.hasClass('initialized-pageDatePicker')) {
                    pageDatePicker.addClass('initialized-pageDatePicker');

                    var cls = pageDatePicker.attr('data-style');
                    var position = pageDatePicker.attr('data-position');
                    var showNav = pageDatePicker.attr('data-show-nav') == 'true';
                    var defaultRange = pageDatePicker.attr('data-default-range');
                    if (!defaultRange){
                        defaultRange = '7 days';
                    }
                    $.cookie('pageDatePicker-text', defaultRange);
                    pageDatePicker.pageDatePicker({
                        extraClass: cls,
                        position: position,
                        default: defaultRange,
                        showNav: showNav
                    });
                }
            });
        },

        settingEnabled: true,

        settingTitle: 'Date Range Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "dateRange" component');

            var self = this;
    
            return $.ajax({
                url: '_components/dateRange?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.defaultRange').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-default-range', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPicker();
                        });
                    });

                    form.find('[name=showNav]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-show-nav', this.value === 'true');
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPicker();
                        });
                    });

                    form.find('#cbbPickerAlign').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                
                        component.attr('data-picker-align', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPicker();
                        });
                    });

                    form.find('#cbbPickerSize').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-picker-size', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPicker();
                        });
                    });
            
                    form.find('#cbbPickerColor').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                
                        component.attr('data-picker-color', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPicker();
                        });
                    });
            
                    form.find('#txtPickerClass').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                
                        component.attr('data-picker-class', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPicker();
                        });
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "dateRange" component');
    
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('#cbbPickerAlign').val(dataAttributes['data-picker-align']);
            form.find('#cbbPickerSize').val(dataAttributes['data-picker-size']);
            form.find('#cbbPickerColor').val(dataAttributes['data-picker-color']);
            form.find('#txtPickerClass').val(dataAttributes['data-picker-class']);
            form.find('[name=showNav][value='+dataAttributes['data-show-nav']+']').prop('checked', true);
        }
    };

})(jQuery);