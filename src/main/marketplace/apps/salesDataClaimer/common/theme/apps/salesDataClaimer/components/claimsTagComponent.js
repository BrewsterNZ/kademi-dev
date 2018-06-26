(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;

    KEditor.components['claimsTag'] = {
        settingEnabled: true,

        settingTitle: 'Claims Tag Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "claimsTag" component');

            return $.ajax({
                url: '_components/claimsTag?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.txt-expire-in').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-expire-in', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.select-data-series').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-data-series', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.multiple-claims').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-multiple-claims', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "claimForm" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.txt-expire-in').val(dataAttributes['data-expire-in']);
            form.find('.select-data-series').val(dataAttributes['data-data-series']);
            form.find('.multiple-claims').val(dataAttributes['data-multiple-claims']);
            
        }
    };

})(jQuery);
