(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['ecomCheckoutGoogleForm'] = {
        settingEnabled: true,

        settingTitle: 'Kcom2 Google Lookup Checkout Form',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "ecomCheckoutGoogleForm" component', form, keditor);

            return $.ajax({
                url: '_components/ecomCheckoutGoogleForm?settings',
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

                    form.find('.request-users-location').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-request-users-location', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "ecomCheckoutGoogleForm" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.success-message').val(dataAttributes['data-success-message'] || 'Your order has been successfully placed');
            form.find('.continue-shopping-url').val(dataAttributes['data-continue-shopping-url'] || '/');
            form.find('.request-users-location').prop('checked', dataAttributes['data-request-users-location'] === 'true');
        }
    };

})(jQuery);