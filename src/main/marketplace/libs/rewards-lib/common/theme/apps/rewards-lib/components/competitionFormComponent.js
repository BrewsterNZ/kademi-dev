(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['competitionForm'] = {
        settingEnabled: true,
        
        settingTitle: 'Competition Form Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "competitionForm" component');
            
            return $.ajax({
                url: '_components/competitionForm?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-promotion').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-promotion', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.select-photos-per-row').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photos-per-row', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chk-show-others-photo').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-others-photo', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowFirstName').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-first-name', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowSurname').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-sur-name', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowEmail').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-email', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowCompany').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-company', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowPhone').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-phone', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowMessage').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-message', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#txtSubmitText').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-submit-text', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#txtSubmitAnotherText').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-submit-another-text', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#cbbButtonSize').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-button-size', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#cbbButtonColor').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-button-color', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#txtButtonClass').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-button-class', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#txtThanksTitle').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-thanks-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#txtThanksMessage').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-thanks-message', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#path').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-path', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "competitionForm" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            
            form.find('.select-promotion').val(dataAttributes['data-promotion'] || '');
            form.find('.select-photos-per-row').val(dataAttributes['data-photos-per-row'] || '3');
            form.find('.chk-show-others-photo').prop('checked', dataAttributes['data-show-others-photo'] === 'true');
            form.find('.chkShowFirstName').prop('checked', dataAttributes['data-show-first-name'] !== 'false');
            form.find('.chkShowSurname').prop('checked', dataAttributes['data-show-sur-name'] !== 'false');
            form.find('.chkShowEmail').prop('checked', dataAttributes['data-show-email'] !== 'false');
            form.find('.chkShowPhone').prop('checked', dataAttributes['data-show-phone'] !== 'false');
            form.find('#txtSubmitText').val(dataAttributes['data-submit-text'] || 'Submit your entry');
            form.find('#txtSubmitAnotherText').val(dataAttributes['data-submit-another-text'] || 'Submit another');
            form.find('#cbbButtonSize').val(dataAttributes['data-button-size'] || 'btn-md');
            form.find('#cbbButtonColor').val(dataAttributes['data-button-color'] || 'btn-default');
            form.find('#txtButtonClass').val(dataAttributes['data-button-class'] || '');
            form.find('#txtThanksTitle').val(dataAttributes['data-thanks-title'] || 'Good Work!');
            form.find('#txtThanksMessage').val(dataAttributes['data-thanks-message'] || 'Your submission has been received.');
            form.find('#path').val(dataAttributes['data-path'] || '');
        }
    };
    
})(jQuery);