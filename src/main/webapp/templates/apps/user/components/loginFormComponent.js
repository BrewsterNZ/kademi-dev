(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['loginForm'] = {
        settingEnabled: true,
        settingTitle: 'Login Form Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "loginForm" component');

            return $.ajax({
                url: '_components/loginForm?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    var basePath = window.location.pathname.replace('contenteditor', '');
                    if (keditor.options.basePath) {
                        basePath = keditor.options.basePath;
                    }
                    form.find('.logo-edit').mselect({
                        contentTypes: ['image'],
                        bs3Modal: true,
                        pagePath: basePath,
                        basePath: basePath,
                        onSelectFile: function (url, relativeUrl, fileType, hash) {
                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');
                            var imageUrl = 'http://' + window.location.host + '/_hashes/files/' + hash;

                            component.attr('data-logo', imageUrl);
                            keditor.initDynamicContent(dynamicElement);
                            form.find('.logo-previewer').attr('src', imageUrl);
                        }
                    });
                    form.find('.logo-delete').on('click', function (e) {
                        e.preventDefault();

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-logo', '');
                        keditor.initDynamicContent(dynamicElement);
                        form.find('.logo-previewer').attr('src', '/static/images/photo_holder.png');
                    });

                    form.find('.select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-layout', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    })
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "loginForm" component');

            var self = this;
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);

            form.find('.logo-previewer').attr('src', dataAttributes['data-logo'] || '/static/images/photo_holder.png');
            form.find('.select-layout').val(dataAttributes['data-layout'] || 'horizontal');
        }
    };

})(jQuery);