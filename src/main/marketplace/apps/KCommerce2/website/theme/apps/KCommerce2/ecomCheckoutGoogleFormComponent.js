(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['ecomCheckoutForm'] = {
        settingEnabled: true,

        settingTitle: 'Kcom2 Checkout Form',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "ecomCheckoutForm" component', form, keditor);

            return $.ajax({
                url: '_components/ecomCheckoutForm?settings',
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
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "ecomCheckoutForm" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.success-message').val(dataAttributes['data-success-message'] || 'Your order has been successfully placed');
            form.find('.continue-shopping-url').val(dataAttributes['data-continue-shopping-url'] || '/');
        }
    };

})(jQuery);