(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['horzCategories'] = {
        settingEnabled: true,

        settingTitle: 'Horizontal Categories',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "horzCategories" component', form, keditor);

            return $.ajax({
                url: '_components/horzCategories?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-store').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-selected-store', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "horzCategories" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-store').val(dataAttributes['data-selected-store']);
        }
    };

})(jQuery);