(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['contactForm'] = {
        settingEnabled: true,

        settingTitle: 'Contact Form Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "contactForm" component');

            return $.ajax({
                url: '_components/contactForm?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('#chkFirstName').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-first-name', this.checked);                        
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#chkSurname').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-sur-name', this.checked);                        
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#chkEmail').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-email', this.checked);                        
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#chkCompany').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-company', this.checked);                        
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#chkPhone').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-phone', this.checked);                        
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#chkMessage').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-message', this.checked);                        
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#txtSubmitText').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-submit-text', this.value || 'Send message');
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#cbbSubmitSize').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-submit-size', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#cbbSubmitColor').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-submit-color', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#txtSubmitClass').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-submit-class', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#thankYou').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-thank-you', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#path').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-path', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=showOptins]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-show-optins', this.value === 'true');
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find(".optins").on('click', function () {
                        var optins = form.find('.optins');
                        var arr = [];
                        optins.each(function () {
                            if (this.checked){
                                arr.push(this.value);
                            }
                        });
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-optins', arr.join(","));
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#redirectUrl').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-redirect-url', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "contactForm" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('#chkFirstName').prop('checked', dataAttributes['data-first-name'] === 'true');
            form.find('#chkSurname').prop('checked', dataAttributes['data-sur-name'] === 'true');
            form.find('#chkEmail').prop('checked', dataAttributes['data-email'] === 'true');
            form.find('#chkCompany').prop('checked', dataAttributes['data-company'] === 'true');
            form.find('#chkPhone').prop('checked', dataAttributes['data-phone'] === 'true');
            form.find('#chkMessage').prop('checked', dataAttributes['data-message'] === 'true');
            form.find('#txtSubmitText').val(dataAttributes['data-submit-text'] || '');
            form.find('#cbbSubmitSize').val(dataAttributes['data-submit-size'] || '');
            form.find('#cbbSubmitColor').val(dataAttributes['data-submit-color'] || '');
            form.find('#txtSubmitClass').val(dataAttributes['data-submit-class'] || '');
            form.find('#thankYou').val(dataAttributes['data-thank-you'] || '');
            form.find('#path').val(dataAttributes['data-path'] || '');
            form.find('[name=showOptins][value='+dataAttributes['data-show-optins']+']').prop('checked', true);
            form.find('.optins').each(function () {
                if (dataAttributes['data-optins'].indexOf(this.value) != -1){
                    this.checked = true;
                }
            });
            form.find('#redirectUrl').val(dataAttributes['data-redirect-url'] || '');
        }
    };

})(jQuery);