(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['purchasedProducts'] = {
        settingEnabled: true,

        settingTitle: 'Purchased Products',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "purchasedProducts" component');

            return $.ajax({
                url: '_components/purchasedProducts?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-title-text', this.value);
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

                    form.find('.chk-show-photo').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-show-product-photo', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "purchasedProducts" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.txt-title').val(dataAttributes['data-title-text']);
            form.find('.txt-cell-padding').val(dataAttributes['data-cell-padding']);
            form.find('.chk-show-photo').prop('checked', dataAttributes['data-show-product-photo'] === 'true');
        }
    };

})(jQuery);
