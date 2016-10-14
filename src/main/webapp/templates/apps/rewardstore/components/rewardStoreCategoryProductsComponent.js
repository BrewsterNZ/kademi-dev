(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['rewardStoreCategoryProducts'] = {
        settingEnabled: true,

        settingTitle: 'Blog Article List Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "rewardStoreCategoryProducts" component');

            return $.ajax({
                url: '_components/rewardStoreCategoryProducts?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

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
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "rewardStoreCategoryProducts" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-sort').val(dataAttributes['data-sort']);
            form.find('.select-asc').val(dataAttributes['data-asc']);
        }
    };

})(jQuery);