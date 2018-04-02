(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['rewardStoreCategoryProducts'] = {
        settingEnabled: true,

        settingTitle: 'Reward Category Products',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "rewardStoreCategoryProducts" component');

            return $.ajax({
                url: '_components/rewardStoreCategoryProducts?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-reward').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-reward', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    })

                    form.find('.select-sort').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-sort', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-asc').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-asc', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.number-of-products').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-number-of-products', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.items-per-row').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-items-per-row', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.color-brand').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-color-brand', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "rewardStoreCategoryProducts" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-reward').val(dataAttributes['data-reward'] || '');
            form.find('.select-sort').val(dataAttributes['data-sort'] || 'title');
            form.find('.select-asc').val(dataAttributes['data-asc'] || 'true');
            form.find('.items-per-row').val(dataAttributes['data-items-per-row'] || '3');
            form.find('.number-of-products').val(dataAttributes['data-number-of-products']);
            form.find('.color-brand').val(dataAttributes['data-color-brand'] || 'primary');
        }
    };

})(jQuery);