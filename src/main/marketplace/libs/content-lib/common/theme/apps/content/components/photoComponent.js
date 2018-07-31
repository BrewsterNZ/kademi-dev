(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['photo'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "photo" component', component);

            var componentContent = component.children('.keditor-component-content');
            var dynamicElement = componentContent.find('[data-dynamic-href]');
            
            if (dynamicElement.length === 0) {
                flog('Old photo component. Converting to new photo component...');
                dynamicElement = $('<div data-dynamic-href="_components/photo" id="' + keditor.generateId('dynamic-element') + '"></div>');
                
                var img = componentContent.find('img');
                var a = img.parent();
                var panel = img.closest('.photo-panel');
                
                $('<img />').attr('src', img.attr('src')).on('load', function () {
                    var imgStyle = '';
                    if (img.hasClass('img-rounded')) {
                        imgStyle = 'img-rounded';
                    } else if (img.hasClass('img-circle')) {
                        imgStyle = 'img-circle';
                    } else if (img.hasClass('img-thumbnail')) {
                        imgStyle = 'img-thumbnail';
                    }
                    
                    component.attr('data-photo-src', img.attr('src') || '');
                    component.attr('data-photo-align', panel.css('text-align') || '');
                    component.attr('data-photo-valign', panel.css('text-align') || '');
                    component.attr('data-photo-style', imgStyle);
                    component.attr('data-photo-responsive', img.hasClass('img-responsive'));
                    component.attr('data-photo-width', this.width);
                    component.attr('data-photo-height', this.height);
                    component.attr('data-photo-alt', img.attr('alt') || '');
                    component.attr('data-photo-linkable', a.length > 0);
                    component.attr('data-photo-link', a.attr('href') || '');
                    component.attr('data-photo-link-target', a.attr('target') || '');
                    
                    componentContent.html(dynamicElement);
                    keditor.initDynamicContent(dynamicElement);
                    panel.remove();
                    flog('Converted to new photo component');
                });
            }
            
            var options = keditor.options;
            if (typeof options.onComponentReady === 'function') {
                options.onComponentReady.call(contentArea, component);
            }
        },
        
        settingEnabled: true,
        
        settingTitle: 'Photo Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "photo" settings', form, keditor);
            
            var self = this;
            
            return $.ajax({
                url: '_components/photo?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    $.ajax({
                        url: '/_fields',
                        type: 'get',
                        dataType: 'JSON',
                        success: function (resp) {
                            var optionsStr = '';
                            $.each(resp.data, function (i, field) {
                                optionsStr += '<option value="' + field.placeholder + '">' + field.label + '</option>';
                            });
                            
                            form.find('#photo-asset-code').append(optionsStr).on('change', function () {
                                var component = keditor.getSettingComponent();
                                var dynamicElement = component.find('[data-dynamic-href]');
                                
                                component.attr('data-photo-src', this.value);
                                component.attr('data-photo-select', "");
                                keditor.initDynamicContent(dynamicElement);
                            });
                                                     
                        }
                    });
                                     
                    
                    form.find('#photo-link').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-link', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#photo-target').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-link-target', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#photo-linkable').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-linkable', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                        form.find('#photo-link, #photo-target').prop('disabled', !this.checked);
                    });
                    
                    form.find('#photo-align').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-align', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#v-align').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-valign', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#photo-responsive').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-responsive', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#photo-style').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-style', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    var chkKeepRatio = form.find('#photo-keep-ratio');
                    var inputWidth = form.find('#photo-width');
                    var inputHeight = form.find('#photo-height');
                    inputWidth.on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        var newWidth = +this.value;
                        if (newWidth <= 0) {
                            newWidth = +chkKeepRatio.attr('data-width');
                        }
                        
                        if (chkKeepRatio.is(':checked')) {
                            var newHeight = Math.round(newWidth / +chkKeepRatio.attr('data-ratio'));
                            component.attr('data-photo-height', newHeight);
                            inputHeight.val(newHeight);
                        }
                        
                        component.attr('data-photo-width', newWidth);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    inputHeight.on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        var newHeight = +this.value;
                        if (newHeight <= 0) {
                            newHeight = +chkKeepRatio.attr('data-height');
                        }
                        
                        if (chkKeepRatio.is(':checked')) {
                            var newWidth = Math.round(newHeight * +chkKeepRatio.attr('data-ratio'));
                            component.attr('data-photo-width', newWidth);
                            inputWidth.val(newWidth);
                        }
                        
                        component.attr('data-photo-height', newHeight);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#photo-alt').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-alt', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    initMSelectImage(form.find('#photo-edit'), keditor, function (url, relUrl, type, hash, isAsset) {
                        var src = isAsset ? '/assets/' + hash : '/_hashes/files/' + hash;
                        
                        $('<img />').attr('src', src).load(function () {
                            chkKeepRatio.attr({
                                'data-width': this.width,
                                'data-height': this.height,
                                'data-ratio': this.width / this.height
                            });
                            inputWidth.val(this.width);
                            inputHeight.val(this.height);
                            
                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');
                            
                            component.attr('data-photo-src', src);
                            component.attr('data-photo-width', this.width);
                            component.attr('data-photo-height', this.height);
                            keditor.initDynamicContent(dynamicElement);
                        });
                    });

                    // =================================================================================
                    // Padding, Margin
                    // =================================================================================
                    form.find('.txt-padding, .txt-margin').on('change', function () {
                        var txt = $(this);
                        var styleName = txt.attr('data-style-name');

                        var paddingValue = this.value || '';
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (paddingValue.trim() === '') {
                            component.attr('data-'+styleName, '') ;
                        } else {
                            if (isNaN(paddingValue)) {
                                paddingValue = 0;
                                this.value = paddingValue;
                            }
                            component.attr('data-'+styleName, paddingValue + 'px');
                        }
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#photo-alt-format').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-photo-alt-format', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "photo" component', component);
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('#photo-link').prop('disabled', dataAttributes['data-photo-linkable'] !== 'true').val(dataAttributes['data-photo-link'] || '');
            form.find('#photo-target').prop('disabled', dataAttributes['data-photo-linkable'] !== 'true').val(dataAttributes['data-photo-target'] || '');
            form.find('#photo-linkable').prop('checked', dataAttributes['data-photo-linkable'] === 'true');
            form.find('#photo-align').val(dataAttributes['data-photo-align'] || '');
            form.find('#photo-valign').val(dataAttributes['data-photo-valign'] || '');
            form.find('#photo-responsive').prop('checked', dataAttributes['data-photo-responsive'] !== 'false');
            form.find('#photo-style').val(dataAttributes['data-photo-style'] || '');
            form.find('#photo-width').val(dataAttributes['data-photo-width'] || '');
            form.find('#photo-height').val(dataAttributes['data-photo-height'] || '');
            form.find('#photo-alt').val(dataAttributes['data-photo-alt'] || '');
            form.find('#photo-asset-code').val('');
            
            if (dataAttributes['data-photo-src'].indexOf('*|') === 0) {
                form.find('#photo-asset-code').val(dataAttributes['data-photo-src']);
            }
            
            $('<img />').attr('src', dataAttributes['data-photo-src']).load(function () {
                form.find('#photo-keep-ratio').attr({
                    'data-width': this.width,
                    'data-height': this.height,
                    'data-ratio': this.width / this.height
                });
            });

            form.find('.txt-padding, .txt-margin').each(function () {
                var txt = $(this);
                var styleName = txt.attr('data-style-name');

                txt.val((dataAttributes['data-'+styleName] || '').replace('px', ''));
            });

            form.find('#photo-alt-format').val(dataAttributes['data-photo-alt-format'] || '');
        }
    };
    
})(jQuery);
