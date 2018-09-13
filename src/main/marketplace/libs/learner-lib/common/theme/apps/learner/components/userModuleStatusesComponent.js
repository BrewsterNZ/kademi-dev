(function ($) {
    var KEditor = $.keditor;

    KEditor.components['userModuleStatuses'] = {
        settingEnabled: true,

        settingTitle: 'Module Status Table',

        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/userModuleStatuses?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

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

                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-table-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.complete').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-complete', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.programCode').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-program-code', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.courseCode').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-course-code', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.moduleCode').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-module-code', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.chk-show-cpd-hours').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-show-cpd-hours', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.chk-show-start-date').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-show-start-date', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.chk-show-certificates').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-show-certificates', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.chk-show-thumbnail').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-show-thumbnail', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.query-height').val(dataAttributes['data-height']);
            form.find('.txt-title').val(dataAttributes['data-table-title']);
            form.find('.complete').val(dataAttributes['data-complete']);
            form.find('.programCode').val(dataAttributes['data-program-code']);
            form.find('.courseCode').val(dataAttributes['data-course-code']);
            form.find('.moduleCode').val(dataAttributes['data-module-code']);
            form.find('.chk-show-cpd-hours').prop('checked', dataAttributes['data-show-cpd-hours'] === 'true');
            form.find('.chk-show-start-date').prop('checked', dataAttributes['data-show-start-date'] === 'true');
            form.find('.chk-show-certificates').prop('checked', dataAttributes['data-show-certificates'] === 'true');
            form.find('.chk-show-thumbnail').prop('checked', dataAttributes['data-show-thumbnail'] === 'true');
        }
    };
})(jQuery);