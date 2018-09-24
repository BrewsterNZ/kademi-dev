(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;

    KEditor.components['claimForm'] = {
        settingEnabled: true,

        settingTitle: 'Claim Form Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "claimForm" component');

            return $.ajax({
                url: '_components/claimForm?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.txt-form-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-form-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txt-form-description').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-form-description', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-claim-type').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-claim-type', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    var colorPicker = form.find('.txt-bg-color');
                    contentEditor.initSimpleColorPicker(colorPicker, function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-form-bg-color', color);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.chk-bg-transparent').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-bg-transparent', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                        colorPicker.prop('disabled', this.checked);
                    });

                    form.find('.chk-hide-preview-receipt').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-hide-preview-receipt', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.chk-hide-upload-receipt').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-hide-upload-receipt', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.chk-single-claim').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-single-claim', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "claimForm" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.txt-form-title').val(dataAttributes['data-form-title']);
            form.find('.txt-form-description').val(dataAttributes['data-form-description']);
            form.find('.select-claim-type').val(dataAttributes['data-claim-type']);
            form.find('.txt-bg-color').prop('disabled', dataAttributes['data-bg-transparent'] === 'true').val(dataAttributes['data-form-bg-color'] || '').trigger('update');
            form.find('.chk-bg-transparent').prop('checked', dataAttributes['data-bg-transparent'] === 'true');
            form.find('.chk-hide-preview-receipt').prop('checked', dataAttributes['data-hide-preview-receipt'] === 'true');
            form.find('.chk-hide-upload-receipt').prop('checked', dataAttributes['data-hide-upload-receipt'] === 'true');
            form.find('.chk-single-claim').prop('checked', dataAttributes['data-single-claim'] === 'true');
        }
    };

})(jQuery);
