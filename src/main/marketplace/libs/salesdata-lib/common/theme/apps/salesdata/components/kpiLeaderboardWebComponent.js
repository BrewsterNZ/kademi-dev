(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
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


                        $.ajax({
                            url: "/sales/" + this.value + "?kpis",
                            type: 'GET',
                            dataType: 'json',
                            success: function (resp) {
                                flog(resp);
                                if (resp.status) {
                                    $.each(resp.data, function () {
                                        form.find(".select-kpis").append($("<option />").val(this.name).text(this.title));
                                    });
                                }
                            }
                        });

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

                    form.find('.txt-cell-padding').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number < 0) {
                            number = 0;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-cell-padding', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    edmEditor.initSimpleColorPicker(form.find('.txt-header-bg-color'), function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-header-bg-color', color);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    edmEditor.initSimpleColorPicker(form.find('.txt-body-bg-color'), function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-body-bg-color', color);
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

            form.find('.select-sales-data-series').val(salesDataSeries);

            if (salesDataSeries !== "") {

                $.ajax({
                    url: "/sales/" + salesDataSeries + "?kpis",
                    type: 'GET',
                    dataType: 'json',
                    success: function (resp) {
                        flog(resp);
                        if (resp.status) {
                            $.each(resp.data, function () {
                                form.find(".select-kpis").append($("<option />").val(this.name).text(this.title));
                            });
                        }
                        form.find('.select-kpis').val(kpi);
                    }
                });
            }

            form.find('input.select-period').val(dataAttributes['data-period']);
            form.find('input.num-users').val(dataAttributes['data-num-users'] || 5);
            form.find('input.txt-height').val(dataAttributes['data-row-height'] || 25);
            form.find('.txt-cell-padding').val(dataAttributes['data-cell-padding']);
            form.find('.txt-header-bg-color').val(dataAttributes['data-header-bg-color'] || '').trigger('update');
            form.find('.txt-body-bg-color').val(dataAttributes['data-body-bg-color'] || '').trigger('update');

        }
    };

})(jQuery);
