(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['alerts'] = {
        settingEnabled: true,
        settingTitle: 'Alerts Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pageBody" component');
            return $.ajax({
                url: '_components/alerts?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-position').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-position', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.select-what-to-show').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-what-to-show', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "alerts" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-position').val(dataAttributes['data-position'] || 'top');
            form.find('.select-what-to-show').val(dataAttributes['data-what-to-show'] || 'unacknowledged');
        }
    };
    
})(jQuery);