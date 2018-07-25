(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['recognitionWall'] = {
        settingEnabled: true,

        settingTitle: 'Recognition wall',

// TODO: settings to select forum
        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/recognitionWall?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-topic').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-topic', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-is-feed').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-is-feed', $(this).prop("selected"));
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "badgesPanel" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-topic').val(dataAttributes['data-topic']);
            form.find('.select-is-feed').prop("selected", dataAttributes['data-is-feed'] == "true");
        }
    };

})(jQuery);