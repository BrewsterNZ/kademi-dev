(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;

    KEditor.components['menu3'] = {
        settingEnabled: true,
        settingTitle: 'Menu 3 Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "menu" component');

            return $.ajax({
                url: '_components/menu?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    initFileBrowsing(keditor, form);

                    contentEditor.initDefaultMenuControls(form, keditor);
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "menu" component');

            contentEditor.showDefaultMenuControls(form, component, keditor);
        }

    };

})(jQuery);