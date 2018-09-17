(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['assetQueryText'] = {
        settingEnabled: true,
        settingTitle: 'Asset Text Query Settings',
        initSettingForm: function (form, keditor) {
            var self = this;
            flog('initSettingForm "assetQueryText" component');

            return $.ajax({
                url: '_components/assetQueryText?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('#asset-query-select').on('change', function () {
                        var comp = keditor.getSettingComponent();
                        comp.attr('data-query', this.value);

                        var dynamicElement = comp.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });
                    form.find('#asset-single-select').on('change', function () {
                        var comp = keditor.getSettingComponent();
                        comp.attr('data-asset-id', this.value);

                        var dynamicElement = comp.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },

        // getContent: function (component, keditor) {
        //     return '<div data-dynamic-href="_components/assetQueryText"></div>';
        // },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "assetQueryText" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);

            form.find('#asset-query-select').val(dataAttributes['data-query'] || '');
            form.find('#asset-single-select').val(dataAttributes['data-asset-id'] || '');

            form.find('.select-asset').assetFinder();
        }
    };

})(jQuery);