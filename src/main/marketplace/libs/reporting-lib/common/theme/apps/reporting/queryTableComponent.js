(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['queryTable'] = {
        settingEnabled: true,

        settingTitle: 'Query Table Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "queryTable" component');

            return $.ajax({
                url: '_components/queryTable?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.queryType').on('click', function () {
                        var cls = this.value;

                        form.find('.select-query').val('');
                        form.find('.select-query option').addClass('hide');
                        form.find('.' + cls).removeClass('hide');

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-query-type', cls);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-query').on('change', function () {
                        var selectedQuery = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-query', selectedQuery);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-items-per-page').on('change', function () {
                        var selectedQuery = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-items-per-page', selectedQuery);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.query-height').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (isNaN(number) || number < 200) {
                            number = 200;
                            this.value = number;
                        }

                        component.attr('data-height', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.show-headers').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this);
                        component.attr('data-headers', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            //self.initDateAgg();
                        });
                    });

                    form.find('.select-export-to-csv').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this).find(":selected");
                        component.attr('data-export-to-csv', inp.val());
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.csv-filename').on('change', function () {
                        var csvFilename = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-csv-filename', csvFilename);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-show-pagination').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this).find(":selected");
                        component.attr('data-show-pagination', inp.val());
                        keditor.initDynamicContent(dynamicElement);
                    })

                    //form.find('.show-paginator').on('change', function () {
                    //    var component = keditor.getSettingComponent();
                    //    var dynamicElement = component.find('[data-dynamic-href]');
                    //
                    //    var inp = $(this);
                    //    component.attr('data-showpaginator', inp.prop("checked"));
                    //    keditor.initDynamicContent(dynamicElement).done(function () {
                    //        //self.initDateAgg();
                    //    });
                    //});

                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "queryTable" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var selectedQueryType = dataAttributes['data-query-type'] || 'query';

            form.find('.select-query').val(dataAttributes['data-query']);
            form.find('.select-items-per-page').val(dataAttributes['data-items-per-page']);
            form.find('.query-height').val(dataAttributes['data-height']);
            form.find('.txt-title').val(dataAttributes['data-title']);
            form.find('.show-headers').prop("checked", toBool(dataAttributes['data-headers']));
            form.find('.show-paginator').prop("checked", toBool(dataAttributes['data-showpaginator']));
            form.find('.queryType[value=' + selectedQueryType + ']').prop("checked", true);
            form.find('.select-query option').addClass('hide');
            form.find('.' + selectedQueryType).removeClass('hide');
            form.find('.select-export-to-csv').find("option[value='" + (dataAttributes['data-export-to-csv'] === undefined ? "true" : dataAttributes['data-export-to-csv']) + "']").prop("selected", true);
            form.find('.select-show-pagination').find("option[value='" + (dataAttributes['data-show-pagination'] === undefined ? "true" : dataAttributes['data-show-pagination']) + "']").prop("selected", true);
            form.find('.csv-filename').val(dataAttributes['data-csv-filename'] || '');

        }
    };

    function toBool(v) {
        if (v === true) {
            return true;
        }
        var b = (v === 'true');
        return b;
    }
})(jQuery);