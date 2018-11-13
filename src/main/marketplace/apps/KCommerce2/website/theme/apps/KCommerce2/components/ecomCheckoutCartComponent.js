(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['ecomCheckoutCart'] = {
        settingEnabled: true,

        settingTitle: 'Kcom2 Checkout Cart',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "ecomCheckoutCart" component', form, keditor);
            return $.ajax({
                url: '_components/ecomCheckoutCart?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.allow-checkout-using-points').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-allow-checkout-using-points', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "ecomCheckoutCart" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.allow-checkout-using-points').prop('checked', dataAttributes['data-allow-checkout-using-points'] === 'true');
        }
    };

})(jQuery);