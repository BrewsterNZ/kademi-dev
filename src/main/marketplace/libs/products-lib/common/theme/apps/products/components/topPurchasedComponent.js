(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['topPurchased'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "topPurchased" component', component);

            if (!component.attr('data-table-id')) {
                component.attr('data-table-id', keditor.generateId('top-purchased'))
            }
        },

        settingEnabled: true,
        
        settingTitle: 'Top Purchased Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "topPurchased" component');
            
            return $.ajax({
                url: '_components/topPurchased?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.txt-height').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        if (isNaN(number) || (+number !== 0 && +number < 200)) {
                            number = 200;
                            this.value = number;
                        }
                        
                        component.attr('data-height', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txt-displayed-items').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (isNaN(number) || number < 0) {
                            number = 1;
                            this.value = number;
                        }

                        component.attr('data-displayed-items', number);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chk-show-headers').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        var inp = $(this);
                        component.attr('data-show-headers', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "topPurchased" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.txt-displayed-items').val(dataAttributes['data-displayed-items']);
            form.find('.txt-height').val(dataAttributes['data-height']);
            form.find('.txt-title').val(dataAttributes['data-title']);
            form.find('.show-headers').prop("checked", dataAttributes['data-show-headers'] == 'true' );
            
        }
    };

})(jQuery);