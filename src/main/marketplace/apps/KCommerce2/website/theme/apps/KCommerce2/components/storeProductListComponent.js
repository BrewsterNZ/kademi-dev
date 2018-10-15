(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['storeProductList'] = {
        settingEnabled: true,

        settingTitle: 'Product List Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "storeProductList" component', form, keditor);

            return $.ajax({
                url: '_components/storeProductList?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-layout', this.value);
                        keditor.initDynamicContent(dynamicElement);

                        form.find('.items-per-row-wrapper').css('display', this.value === 'grid' ? 'block' : 'none');
                    });

                    form.find('.page-size').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-page-size', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.items-per-row').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-items-per-row', number);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "storeProductList" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-layout').val(dataAttributes['data-layout']);
            form.find('.page-size').val(dataAttributes['data-page-size'] || 12);
            form.find('.items-per-row').val(dataAttributes['data-items-per-row']);
            form.find('.items-per-row-wrapper').css('display', dataAttributes['data-layout'] === 'grid' ? 'block' : 'none');
        }
    };

})(jQuery);