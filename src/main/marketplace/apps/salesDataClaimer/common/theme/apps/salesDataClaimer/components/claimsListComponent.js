(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;

    KEditor.components['claimsList'] = {
        settingEnabled: true,

        settingTitle: 'Claims List Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "claimsList" component');

            return $.ajax({
                url: '_components/claimsList?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.chk-hide-add-button').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-hide-add-button', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.chk-show-extra-fields').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-show-extra-fields', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "claimsList" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.chk-hide-add-button').prop('checked', dataAttributes['data-hide-add-button'] === 'true');
            form.find('.chk-show-extra-fields').prop('checked', dataAttributes['data-show-extra-fields'] !== 'false');
        }
    };

})(jQuery);
