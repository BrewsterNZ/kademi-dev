(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['ecomCheckoutFormPointsOnly'] = {
        settingEnabled: true,

        settingTitle: 'Kcom2 Points Only Checkout Form',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "ecomCheckoutFormPointsOnly" component', form, keditor);
            return $.ajax({
                url: '_components/ecomCheckoutFormPointsOnly?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.success-message').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-success-message', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.continue-shopping-url').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-continue-shopping-url', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.allow-org-address').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-allow-org-address', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.allow-profile-address').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-allow-profile-address', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.allow-manual-address').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-allow-manual-address', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "ecomCheckoutFormPointsOnly" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.success-message').val(dataAttributes['data-success-message'] || 'Your order has been successfully placed');
            form.find('.continue-shopping-url').val(dataAttributes['data-continue-shopping-url'] || '/');
            form.find('.allow-org-address').prop('checked', dataAttributes['data-allow-org-address'] === 'true');
            form.find('.allow-profile-address').prop('checked', dataAttributes['data-allow-profile-address'] === 'true');
            form.find('.allow-manual-address').prop('checked', dataAttributes['data-allow-manual-address'] === 'true');
        }
    };

})(jQuery);