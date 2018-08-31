(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['featuredProductList'] = {
        settingEnabled: true,

        settingTitle: 'Featured Product list',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "featuredProductList" component', form, keditor);

            return $.ajax({
                url: '_components/featuredProductList?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-store').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-store', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-category').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-category', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-layout', this.value);
                        keditor.initDynamicContent(dynamicElement);

                        form.find('.items-per-row-wrapper').css('display', this.value === 'grid' ? 'block' : 'none');
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
            form.find('.select-store').val(dataAttributes['data-store']);
            form.find('.select-category').val(dataAttributes['data-category']);
            form.find('.select-layout').val(dataAttributes['data-layout']);
            form.find('.number-of-products').val(dataAttributes['data-number-of-products']);
            form.find('.items-per-row').val(dataAttributes['data-items-per-row']);
            form.find('.items-per-row-wrapper').css('display', dataAttributes['data-layout'] === 'grid' ? 'block' : 'none');
        }
    };

})(jQuery);