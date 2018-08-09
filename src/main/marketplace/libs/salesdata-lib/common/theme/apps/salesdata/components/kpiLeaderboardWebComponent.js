(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['kpiLeaderboardWeb'] = {
        settingEnabled: true,
        settingTitle: 'KPI Leaderboard',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "kpiLeaderboardWeb" component', form, keditor);

            return $.ajax({
                url: '_components/kpiLeaderboardWeb?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-sales-data-series').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-sales-data-series', this.value);
                        keditor.initDynamicContent(dynamicElement);
                        form.find('.select-kpis').find('option').not('.none').addClass('hide');
                        if (this.value){
                            form.find('.select-kpis').find('option[data-series='+this.value+']').removeClass('hide');
                        }
                        form.find('.select-kpis').val('');
                    });

                    form.find('.select-kpis').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-kpi', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-period').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-period', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.num-users').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-num-users', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txt-height').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-row-height', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=tag]').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-tag', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=panelStyle]').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-panel-class', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "kpiLeaderboardEDM" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);


            var salesDataSeries = dataAttributes['data-sales-data-series'];
            var kpi = dataAttributes['data-kpi'];

            form.find('.select-sales-data-series').val(salesDataSeries).trigger('change');
            form.find('.select-kpis').val(kpi);

            form.find('input.select-period').val(dataAttributes['data-period']);
            form.find('input.num-users').val(dataAttributes['data-num-users'] || 5);
            form.find('input.txt-height').val(dataAttributes['data-row-height'] || 25);
            form.find('[name=tag]').val(dataAttributes['data-tag'] || 'h2')
            form.find('[name=panelStyle]').val(dataAttributes['data-panel-class'] || 'panel-default')

        }
    };

})(jQuery);
