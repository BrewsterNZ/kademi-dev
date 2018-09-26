(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['billingInformation'] = {
        settingEnabled: true,

        settingTitle: 'Billing Information Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "billingInformation" component');
            
            return $.ajax({
                url: '_components/billingInformation?settings',
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
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "billingInformation" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.txt-title').val(dataAttributes['data-title-text']);
        }
    };
    
})(jQuery);
