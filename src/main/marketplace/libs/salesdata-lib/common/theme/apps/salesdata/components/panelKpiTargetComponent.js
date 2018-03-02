(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['panelKpiTarget'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "panelKpiTarget" component');
            
            $.getScriptOnce('/static/jquery-knob/1.2.13/dist/jquery.knob.min.js', function () {
                var dynamicElement = component.find('[data-dynamic-href]');
                keditor.initDynamicContent(dynamicElement).done(function () {
                    initCircleSales(dynamicElement);
                });
            });
        },
        settingEnabled: true,
        settingTitle: 'Target Panel',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "panelKpiTarget" component');
            
            return $.ajax({
                url: '_components/panelKpiTarget?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var cbbLevel = form.find('.select-level');
                    cbbLevel.on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-kpi-level', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            initCircleSales(dynamicElement);
                        });
                    });
                    
                    form.find('.select-kpi').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-kpi', this.value);
                        cbbLevel.find('option').css('display', 'none').filter('[data-kpi="' + this.value + '"]').css('display', 'block');
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            initCircleSales(dynamicElement);
                        });
                    });
                    
                    form.find('.txt-achieved-text').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-achieved-text', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            initCircleSales(dynamicElement);
                        });
                    });
                    
                    form.find('.txt-not-achieved-text').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-not-achieved-text', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            initCircleSales(dynamicElement);
                        });
                    });
                    
                    form.find('.txt-on-track-text').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-on-track-text', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            initCircleSales(dynamicElement);
                        });
                    });
                    
                    form.find('.txt-off-track-text').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-off-track-text', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            initCircleSales(dynamicElement);
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "panelKpiTarget" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-kpi').val(dataAttributes['data-kpi']);
            var cbbLevel = form.find('.select-level');
            cbbLevel.find('option').css('display', 'none').filter('[data-kpi="' + dataAttributes['data-kpi'] + '"]').css('display', 'block');
            cbbLevel.val(dataAttributes['data-kpi-level']);
            
            form.find('.txt-achieved-text').val(dataAttributes['data-achieved-text'] || '');
            form.find('.txt-not-achieved-text').val(dataAttributes['data-not-achieved-text'] || '');
            form.find('.txt-on-track-text').val(dataAttributes['data-on-track-text'] || '');
            form.find('.txt-off-track-text').val(dataAttributes['data-off-track-text'] || '');
        }
    };
    
})(jQuery);