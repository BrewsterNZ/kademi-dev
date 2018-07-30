/**!
 * KEditor - Kademi content editor
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap (optional), FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['accordion'] = {
        settingEnabled: true,
        settingTitle: 'Accordion Settings',

        init: function (contentArea, container, component, keditor) {
            var options = keditor.options;
            var doc = options.iframeMode ? keditor.iframeDoc : $(document);
            var id = keditor.generateId('accordion');
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.accordionWrap .panel-group').attr('id', id);
            componentContent.find('.accordionWrap a[data-toggle]').attr('data-parent', '#' + id);


            var panels = componentContent.find('.panel');
            panels.each(function (index, item) {
                var p = $(item);
                var itemId = keditor.generateId('heading' + index);
                var panelCollapseId = keditor.generateId('collapse' + index);
                p.find('.panel-heading').attr('id', itemId);
                p.find('.panel-collapse').attr('aria-labelledby', itemId).attr('id', panelCollapseId);
                p.find('a[data-toggle]').attr('href', '#' + panelCollapseId).attr('aria-controls', '#' + panelCollapseId);

                // backward compatibility
                if (!p.find('a[data-toggle]').find('.accHeadingText').length){
                    var headingText = $('<div class="accHeadingText" style="display: inline-block; width: 90%"></div>');
                    var headingIcon = $('<div style="display: inline-block; width: 5%; float: right; text-align: right"><i class="fa fa-angle-double-down panelIconCollapsed"></i><i class="fa panelIconExpanded fa-angle-double-up"></i></div>')
                    var text = p.find('a[data-toggle]').text().trim();
                    headingText.text(text);
                    p.find('a[data-toggle]').html('').append(headingText).append(headingIcon);
                }
            });

            componentContent.find('.accordionWrap .panel-collapse').collapse('show');
            componentContent.find('.panel-footer, .btnAddAccordionItem').removeClass('hide');
            componentContent.find('.panel-title a .accHeadingText').prop('contenteditable', true);
            componentContent.find('.panel-collapse .panel-body').prop('contenteditable', true);

            componentContent.find('.panel-title a .accHeadingText, .panel-collapse .panel-body').on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(keditor, e, component, contentArea);
                }
                
                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(keditor, e, container, contentArea);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(keditor, e, contentArea);
                }
            });

            var editor = componentContent.find('.panel-title a .accHeadingText, .panel-collapse .panel-body').ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);

                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });


            doc.off('click', '.btnDeleteAccordionItem').on('click', '.btnDeleteAccordionItem', function (e) {
                e.preventDefault();

                if (confirm('Are you sure you want to delete this item?')) {
                    var panelsCount = componentContent.find('.panel').length;
                    if (panelsCount > 1) {
                        $(this).parents('.panel').remove();
                    } else {
                        Msg.error('You cant delete the last item');
                    }
                }
            });

            doc.off('click', '.btnAddAccordionItem').on('click', '.btnAddAccordionItem', function (e) {
                e.preventDefault();
                debugger;
                var clone = componentContent.find('.panel').first().clone();
                var itemId = keditor.generateId('heading');
                var panelCollapseId = keditor.generateId('collapse');
                clone.find('.panel-heading').attr('id', itemId);
                clone.find('.panel-collapse').attr('aria-labelledby', itemId).attr('id', panelCollapseId);
                clone.find('a[data-toggle]').attr('href', '#' + panelCollapseId);
                componentContent.find('.accordionWrap .panel-group').append(clone);
                var editor = clone.find('.panel-title a .accHeadingText, .panel-collapse .panel-body').ckeditor(options.ckeditorOptions).editor;
                editor.on('instanceReady', function () {
                    flog('CKEditor is ready', component);

                    if (typeof options.onComponentReady === 'function') {
                        options.onComponentReady.call(contentArea, component, editor);
                    }
                });
            });
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.panel-collapse .panel-body').each(function () {
                var h = $(this).html();
                $(this).replaceWith('<div class="panel-body">' + h + '</div>');
            });
            if (component.attr('data-initial-collapsed') == 'true'){
                componentContent.find('.panel').each(function () {
                    var panelTitle = $(this).find('.panel-heading a');
                    var panelCollapse = $(this).find('.panel-collapse');
                    panelCollapse.addClass('collapse').attr('aria-expanded', 'false').removeClass('in');
                    panelTitle.addClass('collapsed').attr('aria-expanded', 'false');
                });
            }
            componentContent.find('.panel-footer, .btnAddAccordionItem').addClass('hide');
            componentContent.find('[contenteditable]').removeAttr('contenteditable');
            componentContent.find('.accHeadingText').each(function () {
               $(this).css('outline', 'none').text($(this).text());
            });
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            flog('destroy "text" component', component);

            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        },
        initSettingForm: function (form, keditor) {
            flog('init "accordion" settings', form);

            return $.ajax({
                url: '/theme/apps/keditor-lib/componentAccordionSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.collapsedAll').on('click', function () {
                        var comp = keditor.getSettingComponent();
                        comp.attr('data-initial-collapsed', this.checked);
                    });

                    form.find('.panelStyle').on('change', function (e) {
                        var comp = keditor.getSettingComponent();
                        var old = comp.attr('data-panel-style') || 'panel-default';
                        comp.attr('data-panel-style', this.value);
                        comp.find('.panel').removeClass(old).addClass(this.value);
                    });
                    
                    $.getStyleOnce('/static/bootstrap-iconpicker/1.7.0/css/bootstrap-iconpicker.min.css');
                    $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
                        $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                            form.find('.btn-collapsed-icon, .btn-expanded-icon').iconpicker({
                                iconset: 'fontawesome',
                                cols: 10,
                                rows: 4,
                                placement: 'left'
                            });
                            
                            form.find('.btn-collapsed-icon').on('change', function (e) {
                                var component = keditor.getSettingComponent();
                                component.attr('data-collapsed-icon', e.icon);
                                component.find('.panelIconCollapsed').each(function () {
                                    this.className = "panelIconCollapsed fa "+ e.icon;
                                })
                            });
                            
                            form.find('.btn-expanded-icon').on('change', function (e) {
                                var component = keditor.getSettingComponent();
                                component.attr('data-expanded-icon', e.icon);
                                component.find('.panelIconExpanded').each(function () {
                                    this.className = "panelIconExpanded fa "+ e.icon;
                                })
                            });
                        });
                    });
                            
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "Accordion" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            
            form.find('.collapsedAll').prop('checked', component.attr('data-initial-collapsed') == 'true');
            form.find('.panelStyle').val(component.attr('data-panel-style'));
            
            $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
                $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                    var iconCollapsed = dataAttributes['data-collapsed-icon'] || 'fa-caret-up';
                    form.find('.btn-collapsed-icon').find('i').attr('class', 'fa ' + iconCollapsed).end().find('input').val(iconCollapsed);
                    var iconExpanded = dataAttributes['data-expanded-icon'] || 'fa-caret-down';
                    form.find('.btn-expanded-icon').find('i').attr('class', 'fa ' + iconExpanded).end().find('input').val(iconExpanded);
                });
            });
        }
    };
})(jQuery);


(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['audio'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "audio" component', component);
            
            this.component = component;
            var img = component.find('img[data-src]');
            var componentId = '';
            if (!img.attr('id')) {
                componentId = keditor.generateId('component-audio');
                img.attr('id', componentId);
            } else {
                componentId = img.attr('id');
            }
            if (!img.parent().hasClass('audio-wrapper')) {
                img.wrap('<div class="audio-wrapper"></div>');
            }
            this.src = img.attr('data-src');
            this.width = img.attr('data-width');
            this.autostart = img.attr('data-autostart') === 'true';
            this.buildJWAudioPlayerPreview(componentId);
        },
        
        getContent: function (component, keditor) {
            flog('getContent "audio" component', component);
            
            var img = component.find('img[data-src]');
            var componentId = img.attr('id');
            
            var html = '<img data-componentId="' + componentId + '" src="/theme/apps/content/preview/audio.png" data-autostart="' + this.autostart + '" data-width="' + this.width + '" data-src="' + this.src + '" data-kaudio="' + this.src + '" />';
            return html;
        },
        
        settingEnabled: true,
        
        settingTitle: 'Audio settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "audio" settings', form);
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentAudioSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "audio" component', form, component);
            
            var instance = this;
            var btnAudioFileInput = form.find('.btn-audioFileInput');
            btnAudioFileInput.mselect({
                contentType: 'audio',
                bs3Modal: true,
                pagePath: keditor.options.pagePath,
                basePath: keditor.options.basePath,
                onSelectFile: function (url) {
                    instance.src = url;
                    var component = keditor.getSettingComponent();
                    var img = component.find('object');
                    var componentId = img.attr('id');
                    instance.componentId = componentId;
                    instance.refreshAudioPlayerPreview();
                }
            });
            

            var autoplayToggle = form.find('#audio-autoplay');
            if (this.autostart) {
                autoplayToggle.prop('checked', true);
            }
            autoplayToggle.on('click', function (e) {
                var component = keditor.getSettingComponent();
                var img = component.find('object');
                var componentId = img.attr('id');
                instance.autostart = this.checked;
                instance.buildJWAudioPlayerPreview(componentId);
            });
            
            var audioWidth = form.find('#audio-width');
            audioWidth.val(this.width);
            audioWidth.on('change', function () {
                var component = keditor.getSettingComponent();
                var img = component.find('object');
                var componentId = img.attr('id');
                instance.componentId = componentId;
                instance.width = this.value;
                instance.resizeAudioPlayerPreview();
            });
        },
        
        buildJWAudioPlayerPreview: function (componentId) {
            var width = this.width;
            var src = this.src;
            var autostart = this.autostart;
            var playerInstance = jwplayer(componentId);
            playerInstance.setup({
                file: src,
                width: width,
                height: 30,
                autostart: autostart,
                flashplayer: window.JWPLAYER_LIB_PATH_FLASH,
                html5player: window.JWPLAYER_LIB_PATH_HTML5,
                primary: "flash"
            });
            playerInstance.onReady(function () {
                log('jwplayer preview init done');
            });
        },
        
        refreshAudioPlayerPreview: function () {
            var instance = this;
            var playerInstance = jwplayer(instance.componentId);
            var src = instance.src;
            playerInstance.load([{
                file: src
            }]);
            playerInstance.play();
        },
        
        resizeAudioPlayerPreview: function () {
            var instance = this;
            var playerInstance = jwplayer(instance.componentId);
            var width = instance.width;
            
            playerInstance.resize(width, 30);
        }
    };
    
})(jQuery);

(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['carousel'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "carousel" component', component);
            var componentContent = component.children('.keditor-component-content');
            var carousel = componentContent.find('.carousel');
            
            if (carousel.find('.carousel-img').length === 0 && carousel.find('.carousel-content').length === 0) {
                var self = this;
                var images = [];
                
                carousel.addClass('carousel-fixed-height');
                carousel.find('.carousel-inner .item').each(function () {
                    var item = $(this);
                    
                    images.push({
                        src: item.find('img').attr('src'),
                        hash: item.attr('data-hash')
                    });
                });
                
                carousel.attr('data-height', 300).css('height', 300);
                carousel.find('.carousel-inner').html('');
                carousel.find('.carousel-indicators').html('');
                
                $.each(images, function (i, image) {
                    self.addItemToCarousel(component, {
                        src: image.src,
                        hash: image.hash
                    });
                });
            }
            
            var id = keditor.generateId('component-carousel');
            carousel.attr('id', id);
            carousel.find('.carousel-indicators li').attr('data-target', '#' + id);
            carousel.find('.carousel-control').attr('href', '#' + id);
        },
        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.carousel-inner').children().removeClass('active').eq(0).addClass('active');
            
            return componentContent.html();
        },
        settingEnabled: true,
        
        settingTitle: 'Carousel settings',
        
        editingItemId: '',
        
        initSettingForm: function (form, keditor) {
            flog('init "carousel" settings', form);
            
            var self = this;
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentCarouselSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    $.getStyleOnce('/static/bootstrap-iconpicker/1.7.0/css/bootstrap-iconpicker.min.css');
                    $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
                        $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                            form.find('.btn-prev-icon, .btn-next-icon').iconpicker({
                                iconset: 'fontawesome',
                                cols: 10,
                                rows: 4,
                                placement: 'left'
                            });
                            
                            form.find('.btn-prev-icon').on('change', function (e) {
                                var carousel = keditor.getSettingComponent().find('.carousel');
                                carousel.find('.glyphicon-chevron-left').attr('class', 'fa glyphicon-chevron-left ' + e.icon);
                            });
                            
                            form.find('.btn-next-icon').on('change', function (e) {
                                var carousel = keditor.getSettingComponent().find('.carousel');
                                carousel.find('.glyphicon-chevron-right').attr('class', 'fa glyphicon-chevron-right ' + e.icon);
                            });
                        });
                    });
                    
                    var carouselAddImage = form.find('.carouselAddImage');
                    var carouselItemsWrap = form.find('.carouselItemsWrap');
                    
                    initMSelectImage(carouselAddImage, keditor, function (url, relUrl, type, hash, isAsset) {
                        flog('Keditor carousel selected a file', url, hash);

                        self.addItemToList(form, {
                            src: url,
                            hash: hash,
                            caption: ''
                        });
                        
                        self.refreshCarousel(keditor.getSettingComponent(), form);
                        self.editingItemId = '';
                    });
                    
                    carouselItemsWrap.sortable({
                        handle: '.btn-sort-item',
                        items: '> .carouselItem',
                        axis: 'y',
                        tolerance: 'pointer',
                        sort: function () {
                            $(this).removeClass('ui-state-default');
                        },
                        update: function () {
                            self.refreshCarousel(keditor.getSettingComponent(), form);
                        }
                    });
                    
                    // Content modal
                    var editorContent = self.initModalContent(form, keditor)
                    var modalContent = $('#modal-carousel-content');
                    
                    // Caption modal
                    var editorCaption = self.initModalCaption(form, keditor)
                    var modalCaption = $('#modal-carousel-caption');
                    
                    form.find('.carouselAddImage').on('click', function (e) {
                        e.preventDefault();
                    });
                    
                    form.find('.carouselAddContent').on('click', function (e) {
                        e.preventDefault();
                        modalContent.modal('show');
                    });
                    
                    form.on('click', '.carouselItem a.btn-remove-item', function (e) {
                        e.preventDefault();
                        
                        if (confirm('Are you sure that you want to delete this image?')) {
                            var btn = $(this);
                            var hash = btn.closest('.btn-group').siblings('[data-hash]').attr('data-hash');
                            
                            var carousel = keditor.getSettingComponent().find('.carousel');
                            carousel.find('[data-hash=' + hash + ']').remove();
                            btn.closest('.carouselItem').remove();
                            
                            self.refreshCarousel(keditor.getSettingComponent(), form);
                        }
                    });
                    
                    form.on('click', '.carouselItem a.btn-edit-item', function (e) {
                        e.preventDefault();
                        
                        var carouselItem = $(this).closest('.carouselItem');
                        self.editingItemId = carouselItem.attr('id');
                        var txtCarouselContent = carouselItem.find('.txt-carousel-content');
                        
                        if (txtCarouselContent.length > 0) {
                            editorContent.setData(txtCarouselContent.val() || '');
                            form.find('.carouselAddContent').trigger('click');
                        } else {
                            form.find('.carouselAddImage').trigger('click');
                        }
                    });
                    
                    
                    form.on('click', '.carouselItem a.btn-edit-caption-item', function (e) {
                        e.preventDefault();
                        
                        var carouselItem = $(this).closest('.carouselItem');
                        self.editingItemId = carouselItem.attr('id');
                        var txtCarouselCaption = carouselItem.find('.txt-carousel-caption');
                        
                        editorCaption.setData(txtCarouselCaption.val() || '');
                        modalCaption.modal('show');
                    });
                    
                    form.find('.carouselHeight').on('change', function (e) {
                        var value = this.value;
                        
                        if (isNaN(value) || +value < 200) {
                            value = 200;
                            this.value = 200;
                        }
                        
                        var carousel = keditor.getSettingComponent().find('.carousel');
                        carousel.attr('data-height', value);
                        carousel.css('height', value);
                    });
                    
                    form.find('.carouselPause').on('change', function (e) {
                        e.preventDefault();
                        var comp = keditor.getSettingComponent().find('.carousel');
                        comp.attr('data-pause', this.value);
                    });
                    
                    form.find('.carouselInterval').on('change', function (e) {
                        e.preventDefault();
                        var comp = keditor.getSettingComponent().find('.carousel');
                        comp.attr('data-interval', this.value);
                    });
                    
                    form.find('.carouselWrap').on('click', function (e) {
                        var comp = keditor.getSettingComponent().find('.carousel');
                        if (this.checked) {
                            comp.attr('data-wrap', 'true');
                        } else {
                            comp.attr('data-wrap', 'false');
                        }
                    });
                    
                    form.find('.select-image-size').on('change', function () {
                        var carousel = keditor.getSettingComponent().find('.carousel');
                        
                        carousel.attr('data-image-size', this.value);
                        
                        carousel.find('.carousel-img').css('background-size', this.value === 'centered' ? 'unset' : '');
                    });
                }
            });
        },
        
        initModalContent: function (form, keditor) {
            var self = this;
            
            var modalContent = $(
                '<div class="modal fade" tabindex="-1" id="modal-carousel-content">' +
                '    <div class="modal-dialog modal-lg">' +
                '        <div class="modal-content">' +
                '            <div class="modal-header">' +
                '                <button type="button" class="close" data-dismiss="modal">&times;</button>' +
                '                <h4 class="modal-title">Edit content</h4>' +
                '            </div>' +
                '            <div class="modal-body">' +
                '                <textarea id="modal-carousel-content-body" class="form-control" rows="12"></textarea>' +
                '            </div>' +
                '            <div class="modal-footer">' +
                '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                '                <button type="button" class="btn btn-primary btn-carousel-save-content">Save</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>'
            ).appendTo(document.body);
            
            var contentOptions = $.extend({}, keditor.options.ckeditorOptions);
            contentOptions.removePlugins = contentOptions.removePlugins.replace(',autogrow', '') + ',sourcedialog';
            contentOptions.extraPlugins = contentOptions.extraPlugins + ',autogrow';
            var editorContent = $('#modal-carousel-content-body').ckeditor(contentOptions).editor;
            
            modalContent.on('hidden.bs.modal', function () {
                editorContent.setData('');
                self.editingItemId = '';
            });
            
            modalContent.find('.btn-carousel-save-content').on('click', function (e) {
                e.preventDefault();
                
                flog('Keditor carousel add content');
                
                var carouselContent = editorContent.getData() || '';
                self.addItemToList(form, {
                    content: carouselContent
                });
                
                self.refreshCarousel(keditor.getSettingComponent(), form);
                modalContent.modal('hide');
            });
            
            return editorContent;
        },
        
        initModalCaption: function (form, keditor) {
            var self = this;
            
            var modalCaption = $(
                '<div class="modal fade" tabindex="-1" id="modal-carousel-caption">' +
                '    <div class="modal-dialog modal-lg">' +
                '        <div class="modal-content">' +
                '            <div class="modal-header">' +
                '                <button type="button" class="close" data-dismiss="modal">&times;</button>' +
                '                <h4 class="modal-title">Edit caption</h4>' +
                '            </div>' +
                '            <div class="modal-body">' +
                '                <textarea id="modal-carousel-caption-body" class="form-control" rows="12"></textarea>' +
                '            </div>' +
                '            <div class="modal-footer">' +
                '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                '                <button type="button" class="btn btn-primary btn-carousel-save-caption">Save</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>'
            ).appendTo(document.body);
            
            var captionOptions = $.extend({}, keditor.options.ckeditorOptions);
            captionOptions.removePlugins = captionOptions.removePlugins.replace(',autogrow', '') + ',sourcedialog';
            captionOptions.extraPlugins = captionOptions.extraPlugins + ',autogrow';
            captionOptions.toolbarGroups = toolbarSets['Lite'];
            var editorCaption = $('#modal-carousel-caption-body').ckeditor(captionOptions).editor;
            
            modalCaption.on('hidden.bs.modal', function () {
                editorCaption.setData('');
                self.editingItemId = '';
            });
            
            modalCaption.find('.btn-carousel-save-caption').on('click', function (e) {
                e.preventDefault();
                
                flog('Keditor carousel add content');
                
                var carouselCaption = editorCaption.getData() || '';
                var item = form.find('#' + self.editingItemId).find('.img-responsive');
                self.addItemToList(form, {
                    src: item.attr('src'),
                    hash: item.attr('data-hash'),
                    caption: carouselCaption
                });
                
                self.refreshCarousel(keditor.getSettingComponent(), form);
                modalCaption.modal('hide');
            });
            
            return editorCaption;
        },
        
        showSettingForm: function (form, component, keditor) {
            var self = this;
            self.editingItemId = '';
            form.find('.carouselItemsWrap').html('');
            component.find('.carousel-inner > .item').each(function () {
                var item = $(this);
                var carouselImg = item.find('.carousel-img');
                var carouselContent = item.find('.carousel-content');
                
                if (carouselContent.length > 0) {
                    self.addItemToList(form, {
                        content: carouselContent.html()
                    });
                } else {
                    var url = carouselImg.css('background-image');
                    url = url.slice(4, -1).replace(/['"]/g, '');
                    var hash = $(item).attr('data-hash');
                    var caption = item.find('.carousel-caption');
                    
                    self.addItemToList(form, {
                        src: url,
                        hash: hash,
                        caption: caption.html() || ''
                    });
                }
            });
            
            var carousel = component.find('.carousel');
            var isWrap = carousel.attr('data-wrap');
            var pause = carousel.attr('data-pause');
            var interval = carousel.attr('data-interval');
            var height = carousel.attr('data-height');
            
            form.find('.carouselPause').val(pause);
            form.find('.carouselInterval').val(interval);
            form.find('.carouselWrap').prop('checked', isWrap === 'true');
            form.find('.carouselHeight').val(height);
            form.find('.select-image-size').val(carousel.attr('data-image-size') || 'stretched');
            
            $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
                $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                    var iconPrev = carousel.find('.glyphicon-chevron-left').attr('class') || '';
                    iconPrev = iconPrev.replace('glyphicon-chevron-left', '').replace('fa', '').trim();
                    form.find('.btn-prev-icon').find('i').attr('class', 'fa ' + iconPrev).end().find('input').val(iconPrev);
                    
                    var iconNext = carousel.find('.glyphicon-chevron-right').attr('class') || '';
                    iconNext = iconNext.replace('glyphicon-chevron-right', '').replace('fa', '').trim();
                    form.find('.btn-next-icon').find('i').attr('class', 'fa ' + iconNext).end().find('input').val(iconNext);
                });
            });
        },
        
        addItemToCarousel: function (component, data) {
            flog('addItemToCarousel', component, data);
            
            var carousel = component.find('.carousel');
            var carouselInner = carousel.find('.carousel-inner');
            var id = carousel.attr('id');
            var index = carouselInner.children().length;
            var cls = index === 0 ? 'active' : '';
            var backgroundUrl = "background-image: url('" + data.src + "')";
            var backgroundSize = carousel.attr('data-image-size') === 'centered' ? ';background-size: unset' : '';
            
            carousel.find('.carousel-indicators').append(
                '<li data-target="#' + id + '" data-slide-to="' + index + '" class="' + cls + '"></li>'
            );
            
            var itemStr = '';
            if (data.content) {
                itemStr += '<div class="item ' + cls + '">';
                itemStr += '   <div class="carousel-content clearfix">' + data.content + '</div>';
                itemStr += '   <div class="carousel-caption"></div>';
                itemStr += '</div>';
            } else {
                itemStr += '<div data-hash="' + data.hash + '" class="item ' + cls + '">';
                itemStr += '   <div class="carousel-img" style="' + backgroundUrl + backgroundSize + '"></div>';
                itemStr += '   <div class="carousel-caption">' + data.caption + '</div>';
                itemStr += '</div>';
            }
            
            carouselInner.append(itemStr);
        },
        
        addItemToList: function (form, data) {
            flog('addItemToList', form, data);
            
            var editCaption = '';
            
            var itemStr = '';
            if (data.content) {
                itemStr += '<img class="img-responsive" src="/theme/apps/keditor-lib/componentCarouselContent.png" />';
                itemStr += '<textarea style="display: none" class="txt-carousel-content">' + data.content + '</textarea>';
            } else {
                itemStr += '<img class="img-responsive" src="' + data.src + '" data-hash="' + data.hash + '" />';
                itemStr += '<textarea style="display: none" class="txt-carousel-caption">' + data.caption + '</textarea>';
                editCaption = '<a title="Edit caption" class="btn btn-success btn-edit-caption-item" href="#"><i class="fa fa-file"></i></a>';
            }
            
            itemStr += '   <div class="btn-group btn-group-xs">';
            itemStr += '       <a title="Reorder item" class="btn btn-info btn-sort-item" href="#"><i class="fa fa-sort"></i></a>';
            itemStr += '       <a title="Edit item" class="btn btn-primary btn-edit-item" href="#"><i class="fa fa-edit"></i></a>' + editCaption;
            itemStr += '       <a title="Delete item" class="btn btn-danger btn-remove-item" href="#"><i class="fa fa-trash"></i></a>';
            itemStr += '   </div>';
            
            if (this.editingItemId) {
                form.find('#' + this.editingItemId).html(itemStr);
                this.editingItemId = '';
            } else {
                form.find('.carouselItemsWrap').append(
                    '<div class="carouselItem" id="carouselItem-' + (new Date()).getTime() + '">' + itemStr + '</div>'
                );
            }
        },
        
        refreshCarousel: function (component, form) {
            var self = this;
            var carousel = component.find('.carousel');
            carousel.find('.carousel-inner').html('');
            carousel.find('.carousel-indicators').html('');
            
            form.find('.carouselItemsWrap').find('.carouselItem').each(function () {
                var carouselItem = $(this);
                var txtContent = carouselItem.find('.txt-carousel-content');
                var txtCaption = carouselItem.find('.txt-carousel-caption');
                var img = carouselItem.find('img');
                
                if (txtContent.length === 0) {
                    self.addItemToCarousel(component, {
                        src: img.attr('src'),
                        hash: img.attr('data-hash'),
                        caption: txtCaption.val()
                    });
                } else {
                    self.addItemToCarousel(component, {
                        content: txtContent.val()
                    });
                }
            });
        }
    }
    
})(jQuery);
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['form'] = {
        initFormBuilder: function (component) {
            var self = this;
            
            $.getScriptOnce('/static/formBuilder/2.5.3/form-builder.min.js', function () {
                $.getScriptOnce('/static/formBuilder/2.5.3/form-render.min.js', function () {
                    var formBuilderArea = component.find('.form-builder-area');
                    var formData = component.find('.form-data');
                    var formContent = component.find('.form-content');
                    
                    component.find('.keditor-component-content').prepend(
                        '<p class="form-builder-tools" style="text-align: right;">' +
                        '    <a href="#" class="btn btn-primary btn-preview-form">Preview form</a> ' +
                        '    <a href="#" class="btn btn-info btn-edit-form disabled">Edit form</a>' +
                        '</p>'
                    );
                    
                    var btnEditForm = component.find('.btn-edit-form');
                    var btnPreviewForm = component.find('.btn-preview-form');
                    
                    formBuilderArea.formBuilder({
                        disableInjectedStyle: true,
                        showActionButtons: false,
                        dataType: 'json',
                        formData: formData.html(),
                        disableFields: [
                            'autocomplete',
                            'paragraph',
                            'header'
                        ],
                        disabledAttrs: ['access'],
                        
                        typeUserDisabledAttrs: {
                            'checkbox-group': [
                                'toggle',
                                'inline'
                            ]
                        }
                    });
                    
                    btnEditForm.on('click', function (e) {
                        e.preventDefault();
                        
                        if (!btnEditForm.hasClass('disabled')) {
                            formBuilderArea.show();
                            formContent.hide();
                            btnEditForm.addClass('disabled');
                            btnPreviewForm.removeClass('disabled');
                        }
                    });
                    
                    btnPreviewForm.on('click', function (e) {
                        e.preventDefault();
                        
                        if (!btnPreviewForm.hasClass('disabled')) {
                            self.renderForm(component);
                            
                            formBuilderArea.hide();
                            formContent.show();
                            btnEditForm.removeClass('disabled');
                            btnPreviewForm.addClass('disabled');
                        }
                    });
                })
            });
        },
        
        renderForm: function (component, formBuilder) {
            var formContent = component.find('.form-content');
            
            if (!formBuilder) {
                var formBuilderArea = component.find('.form-builder-area');
                formBuilder = formBuilderArea.data('formBuilder');
            }
            
            formContent.formRender({
                dataType: 'json',
                formData: formBuilder.actions.getData('json')
            });
            
            if (formContent.hasClass('form-horizontal')) {
                formContent.children('div').each(function () {
                    var div = $(this);
                    var dataGrid = formContent.attr('data-grid') || '4-8';
                    dataGrid = dataGrid.split('-');
                    
                    if (div.attr('class')) {
                        if (div.hasClass('fb-button')) {
                            div.find('button').wrap('<div class="col-sm-' + dataGrid[1] + ' col-sm-offset-' + dataGrid[0] + '"></div>');
                        } else {
                            var label = div.children('label');
                            var input = div.children('input, select, textarea');
                            var subDiv = div.children('div');
                            
                            label.addClass('control-label col-sm-' + dataGrid[0]);
                            
                            if (subDiv.length > 0) {
                                subDiv.addClass('col-sm-' + dataGrid[1]);
                            } else {
                                input.addClass('form-control').wrap('<div class="col-sm-' + dataGrid[1] + '"></div>');
                            }
                        }
                    }
                });
            }
        },
        
        init: function (contentArea, container, component, keditor) {
            flog('init "form" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var formBuilder = component.find('.form-builder-area');
            var formContent = component.find('.form-content');
            var formData = component.find('.form-data');
            
            if (formData.length === 0) {
                componentContent.append('<div class="form-data" style="display: none !important;"></div>')
            }
            
            if (formContent.length === 0) {
                componentContent.append('<form class="form-content" style="display: none !important;"></form>')
            } else {
                formContent.hide()
            }
            
            if (formBuilder.length === 0) {
                formBuilder = $('<div class="form-builder-area clearfix"></div>');
                componentContent.append(formBuilder);
            }
            
            this.initFormBuilder(component);
        },
        
        getContent: function (component, keditor) {
            flog('getContent "form" component', component);
            
            var self = this;
            var componentContent = component.find('.keditor-component-content');
            var formData = component.find('.form-data');
            var formBuilderArea = $('#' + component.attr('id')).find('.form-builder-area');
            var formBuilder = formBuilderArea.data('formBuilder');
            
            self.renderForm(component, formBuilder);
            formData.html(formBuilder.actions.getData('json'));
            component.find('.form-builder-area, .form-builder-tools').remove();
            component.find('.form-content').show();
            
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'Form Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "form" component');
            
            var self = this;
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentFormSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.txt-form-action').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var formContent = component.find('.form-content');
                        
                        formContent.attr('action', this.value);
                    });
                    
                    form.find('.select-method').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var formContent = component.find('.form-content');
                        
                        formContent.attr('action', this.value);
                    });
                    
                    form.find('.select-enctype').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var formContent = component.find('.form-content');
                        
                        formContent.attr('enctype', this.value);
                    });
                    
                    form.find('.select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var formContent = component.find('.form-content');
                        
                        formContent.removeClass('form-inline form-horizontal');
                        if (this.value) {
                            formContent.addClass(this.value);
                        }
                        self.renderForm(component);
                        form.find('.select-grid-wrapper').css('display', this.value === 'form-horizontal' ? 'block' : 'none');
                    });
                    
                    form.find('.select-grid').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var formContent = component.find('.form-content');
                        
                        formContent.attr('data-grid', this.value);
                        self.renderForm(component);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "form" component', component);
            var formContent = component.find('.form-content');
            
            var layout = '';
            if (formContent.hasClass('form-inline')) {
                layout = 'form-inline';
            } else if (formContent.hasClass('form-horizontal')) {
                layout = 'form-horizontal';
            }
            
            form.find('.txt-form-action').val(formContent.attr('action') || '');
            form.find('.select-method').val(formContent.attr('method') || 'get');
            form.find('.select-enctype').val(formContent.attr('enctype'));
            form.find('.select-layout').val(layout);
            form.find('.select-grid-wrapper').css('display', layout === 'form-horizontal' ? 'block' : 'none');
            form.find('.select-grid').val(formContent.attr('data-grid') || '4-8');
        }
    };
    
})(jQuery);

(function ($, window) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['googlemap'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "googlemap" component', component);
            
            this.callWhenGoogleMapReady(function () {
                initKGoogleMap(component);
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "googlemap" component', component);
            
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.googlemap-cover').remove();
            component.find('.kgooglemap').html('');
            
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'Google Map Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "googlemap" settings', form);
            var self = this;
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentGoogleMapSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    self.callWhenGoogleMapReady(function () {
                        var component = keditor.getSettingComponent();
                        self.initAutocomplete(component, form);
                    });
                    
                    var mapTypes = form.find('.map-type');
                    form.find('.mapType').on('click', function () {
                        mapTypes.hide().filter('.' + this.value).show();
                        
                        var component = keditor.getSettingComponent();
                        var iframe = component.find('iframe');
                        var kgooglemap = component.find('.kgooglemap');
                        component.attr('data-maptype', this.value);
                        
                        iframe[this.value === 'manually' ? 'hide' : 'show']();
                        kgooglemap[this.value === 'manually' ? 'show' : 'hide']();
                        
                        if (this.value === 'manually') {
                            self.makeGoogleMapFresh(form, component);
                        }
                    });
                    
                    form.find('[name=mapEmbedCode]').on('change', function () {
                        var iframe = $(this.value);
                        var src = iframe.attr('src');
                        if (iframe.length > 0 && src && src.length > 0) {
                            keditor.getSettingComponent().find('.embed-responsive-item').attr('src', src);
                        } else {
                            alert('Your Google Map embed code is invalid!');
                        }
                    });
                    
                    form.find('[name=mapRatio]').on('click', function () {
                        var component = keditor.getSettingComponent();
                        
                        component.find('.embed-responsive').removeClass('embed-responsive-4by3 embed-responsive-16by9').addClass('embed-responsive-' + this.value);
                    });
                }
            });
        },
        
        callWhenGoogleMapReady: function (callback) {
            var self = this;
            var apiKey = 'AIzaSyBUcuZxwpBXCPztG7ot-rITXJbycPuS7gs';
            var url = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places';
            
            if (window.google && window.google.maps && google.maps.places) {
                callback.call(self);
            } else {
                $.getScriptOnce(url, function () {
                    callback.call(self);
                });
            }
        },
        
        makeGoogleMapFresh: function (form, component) {
            var input = form.find('[name=mapAddress]')[0];
            
            setTimeout(function () {
                try {
                    $(input).trigger('focus');
                    // google.maps.event.trigger(input, 'focus');
                    google.maps.event.trigger(input, 'keydown', {
                        keyCode: 13
                    });
                } catch (e) {
                    flog('===================', e);
                }
            }, 1000);
            
            var map = component.find('.kgooglemap').data('map');
            setTimeout(function () {
                google.maps.event.trigger(map, "resize");
            }, 100);
        },
        
        showSettingForm: function (form, component, keditor) {
            var self = this;
            
            self.callWhenGoogleMapReady(function () {
                var maptype = component.attr('data-maptype') || 'embed';
                var place = component.attr('data-place');
                
                var ratio = component.find('.embed-responsive').hasClass('embed-responsive-16by9') ? '16by9' : '4by3';
                form.find('.mapRatio[value=' + ratio + ']').prop('checked', true);
                form.find('.mapType[value=' + maptype + ']').prop('checked', true);
                
                var src = component.find('iframe').attr('src');
                var iframe = '<iframe class="embed-responsive-item" src="' + src + '"></iframe>';
                if (!place) {
                    place = 'Hanoi, Vietnam';
                }
                form.find('[name=mapAddress]').val(place);
                form.find('[name=mapEmbedCode]').val(iframe);
                
                form.find('.map-type').hide().filter('.' + maptype).show();
                
                if (!component.find('.kgooglemap').data('map')) {
                    self.initAutocomplete(component, form);
                    
                    if (maptype === 'manually') {
                        self.makeGoogleMapFresh(form, component);
                    }
                } else {
                    if (maptype === 'manually') {
                        self.makeGoogleMapFresh(form, component);
                    }
                }
            });
        },
        
        initAutocomplete: function (component, form) {
            if (component.find('.kgooglemap').data('map')) {
                this.makeGoogleMapFresh(form, component);
            } else {
                var mapDiv = component.find('.kgooglemap')[0];
                var map = new google.maps.Map(mapDiv, {
                    zoom: 13,
                    mapTypeId: 'roadmap'
                });
                
                // Create the search box and link it to the UI element.
                var input = form.find('[name=mapAddress]')[0];
                var searchBox = new google.maps.places.SearchBox(input);
                
                // Bias the SearchBox results towards current map's viewport.
                map.addListener('bounds_changed', function () {
                    searchBox.setBounds(map.getBounds());
                });
                
                var markers = [];
                searchBox.addListener('places_changed', function () {
                    var places = searchBox.getPlaces();
                    
                    if (places.length == 0) {
                        return;
                    }
                    
                    // Clear out the old markers.
                    markers.forEach(function (marker) {
                        marker.setMap(null);
                    });
                    markers = [];
                    
                    // For each place, get the icon, name and location.
                    var bounds = new google.maps.LatLngBounds();
                    places.forEach(function (place) {
                        if (!place.geometry) {
                            console.log("Returned place contains no geometry");
                            return;
                        }
                        
                        var icon = {
                            url: place.icon,
                            size: new google.maps.Size(71, 71),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(17, 34),
                            scaledSize: new google.maps.Size(25, 25)
                        };
                        
                        // Create a marker for each place.
                        markers.push(new google.maps.Marker({
                            map: map,
                            icon: icon,
                            title: place.name,
                            position: place.geometry.location
                        }));
                        
                        if (place.geometry.viewport) {
                            // Only geocodes have viewport.
                            bounds.union(place.geometry.viewport);
                        } else {
                            bounds.extend(place.geometry.location);
                        }
                    });
                    map.fitBounds(bounds);
                    component.attr('data-place', input.value);
                });
                
                component.find('.kgooglemap').data('map', map);
            }
        }
    };
    
})(jQuery, window);

(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;
    
    KEditor.components['jumbotron'] = {
        settingEnabled: true,
        
        settingTitle: 'Jumbotron Settings',
        init: function (contentArea, container, component, keditor) {
            var self = this;
            var options = keditor.options;
            
            var componentContent = component.children('.keditor-component-content');
            componentContent.prop('contenteditable', true);
            
            componentContent.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(keditor, e, component, contentArea);
                }
                
                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(keditor, e, container, contentArea);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(keditor, e, contentArea);
                }
            });
            
            var editor = componentContent.ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
                
                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "jumbotron" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var id = componentContent.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                return editor.getData();
            } else {
                return componentContent.html();
            }
        },
        
        initSettingForm: function (form, keditor) {
            flog('init "jumbotron" settings', form);
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentJumbotronSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.chk-inverse').on('click', function () {
                        var comp = keditor.getSettingComponent();
                        comp.find('.jumbotron')[this.checked ? 'addClass' : 'removeClass']('jumbotron-inverse');
                    });
                    
                    var buttonColorPicker = form.find('.button-color-picker');
                    contentEditor.initSimpleColorPicker(buttonColorPicker, function (color) {
                        var comp = keditor.getSettingComponent();
                        comp.find('.jumbotron').css('background-color', color);
                        comp.attr('data-bgcolor', color);
                    });
                    
                    var paddingSettings = form.find('.paddingSettings');
                    paddingSettings.on('change', function () {
                        var paddingValue = this.value || '';
                        var component = keditor.getSettingComponent();
                        var paddingProp = $(this).attr('name');
                        if (paddingValue.trim() === '') {
                            component.find('.jumbotron').css(paddingProp, '');
                        } else {
                            if (isNaN(paddingValue)) {
                                paddingValue = 0;
                                this.value = paddingValue;
                            }
                            component.find('.jumbotron').css(paddingProp, paddingValue + 'px');
                        }
                    });
                    
                    var marginSettings = form.find('.marginSettings');
                    marginSettings.on('change', function () {
                        var paddingValue = this.value || '';
                        var component = keditor.getSettingComponent();
                        var paddingProp = $(this).attr('name');
                        if (paddingValue.trim() === '') {
                            component.find('.jumbotron').css(paddingProp, '');
                        } else {
                            if (isNaN(paddingValue)) {
                                paddingValue = 0;
                                this.value = paddingValue;
                            }
                            component.find('.jumbotron').css(paddingProp, paddingValue + 'px');
                        }
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "jumbotron" component', component);
            form.find('[name=button-color]').val(component.attr('data-bgcolor')).trigger('update');
            form.find('.paddingSettings').each(function () {
                $(this).val(component.find('.jumbotron').css($(this).attr('name')).replace('px', ''));
            });
            form.find('.marginSettings').each(function () {
                $(this).val(component.find('.jumbotron').css($(this).attr('name')).replace('px', ''));
            });
            form.find('[name=showButton][value=false]').prop('checked', component.find('a').hasClass('hide'));
            form.find('.chk-inverse').prop('checked', component.find('.jumbotron').hasClass('jumbotron-inverse'));
        },
        
        destroy: function (component, keditor) {
            flog('destroy "text" component', component);
            
            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        }
    };
    
})(jQuery);


(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['ksvgmap'] = {
        init: function (contentArea, container, component, keditor) {
            var script = component.find('script');
            if (script.length) {
                script.remove();
            }
            if (component.attr('data-height')) {
                component.find('.ksvgmap').css('height', +component.attr('data-height'));
            }
            $.getScriptOnce('/static/jquery-jvectormap/jquery-jvectormap-2.0.3.min.js', function () {
                $.getScriptOnce('/static/jquery-jvectormap/jquery-jvectormap-au-mill.js', function () {
                    component.find('.ksvgmap').vectorMap({
                        map: 'au_mill',
                        backgroundColor: '#fff',
                        zoomButtons: false,
                        focusOn: {
                            x: 0.5,
                            y: 0.5,
                            scale: 1
                        },
                        regionStyle: {
                            initial: {
                                fill: '#efefef'
                            },
                            hover: {
                                fill: "#00aa90"
                            }
                        },
                        onRegionTipShow: function (e, el, code) {
                            if (component.attr('data-' + code))
                                el.html(el.html() + ' - ' + component.attr('data-' + code));
                        }
                    });
                    var i = setInterval(function () {
                        try {
                            var map = component.find('.ksvgmap').vectorMap('get', 'mapObject');
                            map.updateSize();
                            clearInterval(i);
                        } catch (e) {
                            flog('trying to get jvectormap object');
                        }
                    }, 50);
                });
            });
        },
        getContent: function (component, keditor) {
            flog('getContent "svgmap" component', component);
            var componentContent = component.children('.keditor-component-content');
            var script = '<script>$(function(){$(document.body).hasClass("content-editor-page")||$.getScriptOnce("/static/jquery-jvectormap/jquery-jvectormap-2.0.3.min.js",function(){$.getScriptOnce("/static/jquery-jvectormap/jquery-jvectormap-au-mill.js",function(){$(".ksvgmap").each(function(){var a=$(this).parents("[data-type=component-ksvgmap]");a.hasClass("ksvgInit")||(a.addClass("ksvgInit"),$(this).vectorMap({map:"au_mill",backgroundColor:"#fff",zoomButtons:!1,scale:5,regionStyle:{initial:{fill:"#efefef"},hover:{fill:"#00aa90"}},onRegionTipShow:function(b,c,d){a.attr("data-"+d)&&c.html("<span class=\'vectormap-tip-region-name\'>"+c.html()+"</span><span class=\'vectormap-tip-separator\'> - </span><span class=\'vectormap-tip-region-data\'>"+a.attr("data-"+d)+"</span>")}}))})})})});</script>';
            var css = '<link rel="stylesheet" href="/static/jquery-jvectormap/jquery-jvectormap-2.0.3.css">';
            component.find('.jvectormap-container').remove();
            var arr = $(document.body).find('[data-type="component-ksvgmap"]:not(.keditor-snippet)');
            if (arr.length > 0) {
                if ($(arr[arr.length - 1]).attr('id') === component.attr('id')) {
                    $(css).insertBefore(component.find('.ksvgmap'));
                    $(script).insertAfter(component.find('.ksvgmap'));
                }
            }
            
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'SVGMap Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "svgmap" settings', form);
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentKsvgMapSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var component = keditor.getSettingComponent();
                    form.find('.state').on('change', function (e) {
                        var val = component.attr('data-' + this.value);
                        form.find('.stateMessage').val(val);
                    });
                    form.find('.stateMessage').on('change', function (e) {
                        var currentState = form.find('.state').val();
                        component.attr('data-' + currentState, this.value);
                    });
                    form.find('.height').on('change', function (e) {
                        component.attr('data-height', this.value);
                        component.find('.ksvgmap').css('height', this.value);
                        var map = component.find('.ksvgmap').vectorMap('get', 'mapObject');
                        map.updateSize();
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            var height = component.attr('data-height');
            var defaultState = form.find('.state').val();
            form.find('.height').val(height);
            form.find('.stateMessage').val(component.attr('data-' + defaultState));
        }
    };
})(jQuery);

(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['media'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "media" component', component);
            
            var options = keditor.options;
            var componentContent = component.children('.keditor-component-content');
            
            var mediaBody = componentContent.find('.media-body');
            mediaBody.addClass('clearfix');
            
            var mediaLeft = componentContent.find('.media-left');
            var mediaLeftInner = componentContent.find('.media-left-inner');
            if (mediaLeftInner.length === 0) {
                mediaLeft.html('<div class="media-left-inner">' + mediaLeft.html() + '</div>');
            }
            
            if (!mediaBody.attr('id')) {
                mediaBody.attr('id', keditor.generateId('component-text-content-inner'));
            }
            
            mediaBody.prop('contenteditable', true);
            mediaBody.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(keditor, e, component, contentArea);
                }
                
                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(keditor, e, container, contentArea);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(keditor, e, contentArea);
                }
            });
            
            var editor = mediaBody.ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
                
                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "media" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var mediaBody = componentContent.find('.media-body');
            
            var id = mediaBody.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                mediaBody.replaceWith('<div class="media-body clearfix">' + editor.getData() + '</div>');
            }
            
            return componentContent.html();
        },
        
        destroy: function (component, keditor) {
            flog('destroy "text" component', component);
            
            var id = component.find('.media-body').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        },
        
        settingEnabled: true,
        
        settingTitle: 'Media Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "media" component');
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentMediaSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    var txtLink = form.find('.photo-link');
                    txtLink.on('change', function () {
                        var link = this.value.trim();
                        keditor.getSettingComponent().find('a').attr('href', link);
                    });
                    
                    var cbbTarget = form.find('.photo-target');
                    cbbTarget.on('change', function () {
                        keditor.getSettingComponent().find('a').attr('target', this.value);
                    });
                    
                    var chkLinkable = form.find('.photo-linkable');
                    chkLinkable.on('click', function () {
                        var img = keditor.getSettingComponent().find('img.media-object');
                        
                        if (chkLinkable.is(':checked')) {
                            txtLink.prop('disabled', false);
                            cbbTarget.prop('disabled', false);
                            img.wrap('<a href=""></a>');
                        } else {
                            txtLink.prop('disabled', true);
                            cbbTarget.prop('disabled', true);
                            img.unwrap('a');
                        }
                    });
                    
                    form.find('.photo-v-align').on('change', function () {
                        var mediaLeft = keditor.getSettingComponent().find('.media-left');
                        mediaLeft.css('vertical-align', this.value);
                    });
                    
                    form.find('.photo-responsive').on('click', function () {
                        keditor.getSettingComponent().find('img')[this.checked ? 'addClass' : 'removeClass']('img-responsive');
                    });
                    
                    form.find('.photo-style').on('change', function () {
                        var img = keditor.getSettingComponent().find('img.media-object');
                        var val = this.value;
                        
                        img.removeClass('img-rounded img-circle img-thumbnail');
                        if (val) {
                            img.addClass(val);
                        }
                    });
                    
                    form.find('.photo-width').on('change', function () {
                        var img = keditor.getSettingComponent().find('img.media-object');
                        img.attr('width', this.value);
                    });
                    
                    initMSelectImage(form.find('.photo-edit'), keditor, function (url, relativeUrl, fileType, hash, isAsset) {
                        var img = keditor.getSettingComponent().find('img.media-object');
                        var imgUrl = '/_hashes/files/' + hash;
                        if (isAsset){
                            imgUrl = url;
                        }
                        img.attr('src', '/_hashes/files/' + hash);
                    });
                    
                    form.find('.left-width').on('change', function () {
                        var mediaLeftInner = keditor.getSettingComponent().find('.media-left-inner');
                        mediaLeftInner.css('width', this.value);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "media" component', component);
            
            var inputVAlign = form.find('.photo-v-align');
            var inputResponsive = form.find('.photo-responsive');
            var inputWidth = form.find('.photo-width');
            var cbbStyle = form.find('.photo-style');
            var txtLink = form.find('.photo-link');
            var cbbTarget = form.find('.photo-target');
            var chkLinkable = form.find('.photo-linkable');
            
            var img = component.find('img.media-object');
            var mediaLeft = component.find('.media-left');
            var mediaLeftInner = component.find('.media-left-inner');
            
            form.find('.left-width').val((mediaLeftInner.get(0).style.width || '').replace('px', ''));
            
            var a = img.parent('a');
            if (a.length > 0) {
                chkLinkable.prop('checked', true);
                txtLink.prop('disabled', false).val(a.attr('href'));
                cbbTarget.prop('disabled', false).val(a.attr('target'));
            } else {
                chkLinkable.prop('checked', false);
                txtLink.prop('disabled', true).val('');
                cbbTarget.prop('disabled', true).val('');
            }
            
            var valign = mediaLeft.css('vertical-align') || 'top';
            
            if (img.hasClass('img-rounded')) {
                cbbStyle.val('img-rounded');
            } else if (img.hasClass('img-circle')) {
                cbbStyle.val('img-circle');
            } else if (img.hasClass('img-thumbnail')) {
                cbbStyle.val('img-thumbnail');
            } else {
                cbbStyle.val('');
            }
            
            inputVAlign.val(valign);
            inputResponsive.prop('checked', img.hasClass('img-responsive'));
            inputWidth.val(img.attr('width'));
        }
    };
    
})(jQuery);

(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;
    
    CKEDITOR.disableAutoInline = true;
    CKEDITOR.dtd.$removeEmpty['i'] = false;
    
    // Text component
    // ---------------------------------------------------------------------
    KEditor.components['text'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "text" component', component);
            
            var options = keditor.options;
            
            var componentContent = component.find('.keditor-component-content');
            var ckeditorPlace = componentContent.find('.keditor-component-text-content-inner');
            
            if (ckeditorPlace.length === 0) {
                var contentHtml = componentContent.html();
                ckeditorPlace = $('<div class="keditor-component-text-content-inner clearfix"></div>');
                componentContent.html(ckeditorPlace);
                ckeditorPlace.html(contentHtml);
                ckeditorPlace.wrap('<div class="keditor-component-text-content"></div>');
            }
            
            if (!ckeditorPlace.attr('id')) {
                ckeditorPlace.attr('id', keditor.generateId('component-text-content-inner'));
            }
            
            ckeditorPlace.prop('contenteditable', true);
            ckeditorPlace.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(keditor, e, component, contentArea);
                }
                
                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(keditor, e, container, contentArea);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(keditor, e, contentArea);
                }
            });
            
            var editor = ckeditorPlace.ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function (e) {
                flog('CKEditor is ready', component);
                
                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
                if (options.iframeMode){
                    e.editor.on('focus', function (e) {
                        setTimeout(function () {
                            $('#'+e.editor.id + '_top').parents('.'+e.editor.id).css('top', 0).css('position', 'fixed');
                        }, 0);
                    });
                }
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "text" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var componentTextContent = componentContent.find('.keditor-component-text-content');
            
            var id = componentTextContent.children().attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                componentTextContent.html('<div class="keditor-component-text-content-inner clearfix">' + editor.getData() + '</div>');
            }
            
            return componentContent.html();
        },
        
        destroy: function (component, keditor) {
            flog('destroy "text" component', component);
            
            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        },
        
        settingEnabled: true,
        
        settingTitle: 'Text Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "text" component');
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentTextSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    // =================================================================================
                    // Backgrounds
                    // =================================================================================
                    initMSelectImage(form.find('.background-image-edit'), keditor, function (url, relUrl, type, hash, isAsset) {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        var imageUrl = 'http://' + window.location.host + '/_hashes/files/' + hash;
                        if (isAsset){
                            imageUrl = url;
                        }
                        target.css('background-image', 'url("' + imageUrl + '")');
                        form.find('.background-image-previewer').attr('src', imageUrl);
                    });
                    form.find('.background-image-delete').on('click', function (e) {
                        e.preventDefault();
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('background-image', '');
                        form.find('.background-image-previewer').attr('src', '/static/images/photo_holder.png');
                    });
                    
                    var colorPicker = form.find('.txt-bg-color');
                    contentEditor.initColorPicker(colorPicker, function (color) {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('background-color', color);
                    });

                    var textColorPicker = form.find('.txt-text-color');
                    contentEditor.initColorPicker(textColorPicker, function (color) {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('color', color);
                    });
                    
                    form.find('.select-bg-repeat').on('change', function () {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        
                        target.css('background-repeat', this.value);
                    });
                    
                    form.find('.select-bg-size').on('change', function () {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        
                        target.css('background-size', this.value);
                    });
                    
                    form.find('.select-bg-position').on('change', function () {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        
                        target.css('background-position', this.value);
                    });
                    
                    // =================================================================================
                    // Padding
                    // =================================================================================
                    form.find('.txt-padding').each(function () {
                        var txt = $(this);
                        var styleName = txt.attr('data-style-name');
                        
                        txt.on('change', function () {
                            var paddingValue = this.value || '';
                            var target = keditor.getSettingComponent().find('.keditor-component-text-content').get(0);
                            
                            if (paddingValue.trim() === '') {
                                target.style[styleName] = '';
                            } else {
                                if (isNaN(paddingValue)) {
                                    paddingValue = 0;
                                    this.value = paddingValue;
                                }
                                target.style[styleName] = paddingValue + 'px';
                            }
                        });
                    });
                    
                    // =================================================================================
                    // Margin
                    // =================================================================================
                    form.find('.txt-margin').each(function () {
                        var txt = $(this);
                        var styleName = txt.attr('data-style-name');
                        
                        txt.on('change', function () {
                            var marginValue = this.value || '';
                            var target = keditor.getSettingComponent().find('.keditor-component-text-content').get(0);
                            
                            if (marginValue.trim() === '') {
                                target.style[styleName] = '';
                            } else {
                                if (isNaN(marginValue)) {
                                    marginValue = 0;
                                    this.value = marginValue;
                                }
                                target.style[styleName] = marginValue + 'px';
                            }
                        });
                    });
                    
                    // =================================================================================
                    // Width and Height
                    // =================================================================================
                    form.find('.txt-height').on('change', function () {
                        var height = this.value || '';
                        if (isNaN(height)) {
                            height = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('height', height);
                    });
                    
                    form.find('.txt-min-height').on('change', function () {
                        var minHeight = this.value || '';
                        if (isNaN(minHeight)) {
                            minHeight = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('min-height', minHeight + 'px');
                    });
                    
                    form.find('.txt-max-height').on('change', function () {
                        var maxHeight = this.value || '';
                        if (isNaN(maxHeight)) {
                            maxHeight = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('max-height', maxHeight + 'px');
                    });
                    
                    form.find('.txt-width').on('change', function () {
                        var width = this.value || '';
                        if (isNaN(width)) {
                            width = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('width', width);
                    });
                    
                    form.find('.txt-min-width').on('change', function () {
                        var minWidth = this.value || '';
                        if (isNaN(minWidth)) {
                            minWidth = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('min-width', minWidth + 'px');
                    });
                    
                    form.find('.txt-max-width').on('change', function () {
                        var maxWidth = this.value || '';
                        if (isNaN(maxWidth)) {
                            maxWidth = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('max-width', maxWidth + 'px');
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "text" component', component);
            
            var target = component.find('.keditor-component-text-content').get(0);
            
            var imageUrl = target.style.backgroundImage;
            imageUrl = (imageUrl || '').replace(/^url\(['"]+(.+)['"]+\)$/, '$1');
            form.find('.background-image-previewer').attr('src', imageUrl !== 'none' && imageUrl !== '' ? imageUrl : '/static/images/photo_holder.png');
            
            form.find('.select-bg-repeat').val(target.style.backgroundRepeat || 'repeat');
            form.find('.select-bg-position').val(target.style.backgroundPosition || '0% 0%');
            form.find('.select-bg-size').val(target.style.backgroundSize || 'auto');

            if (target.style.backgroundColor){
                form.find('.txt-bg-color').colorpicker('setValue', target.style.backgroundColor);
            }
            if (target.style.color){
                form.find('.txt-text-color').colorpicker('setValue', target.style.color);
            }

            form.find('.txt-padding').each(function () {
                var txt = $(this);
                var styleName = txt.attr('data-style-name');
                
                txt.val((target.style[styleName] || '').replace('px', ''));
            });
            form.find('.txt-margin').each(function () {
                var txt = $(this);
                var styleName = txt.attr('data-style-name');
                
                txt.val((target.style[styleName] || '').replace('px', ''));
            });
            
            form.find('.txt-height').val((target.style.height || '').replace('px', ''));
            form.find('.txt-min-height').val((target.style.minHeight || '').replace('px', ''));
            form.find('.txt-max-height').val((target.style.maxHeight || '').replace('px', ''));
            form.find('.txt-width').val((target.style.width || '').replace('px', ''));
            form.find('.txt-min-with').val((target.style.minWidth || '').replace('px', ''));
            form.find('.txt-max-with').val((target.style.maxWidth || '').replace('px', ''));
        }
    };
    
})(jQuery);

(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['thumbnail'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "thumbnail" component', component);
            
            var options = keditor.options;
            var componentContent = component.children('.keditor-component-content');
            
            var caption = componentContent.find('.caption');
            caption.addClass('clearfix');
            
            var captionInner = caption.find('.caption-inner');
            if (captionInner.length === 0) {
                caption.html('<div class="caption-inner">' + caption.html() + '</div>');
                captionInner = caption.find('.caption-inner');
            }
            
            if (!captionInner.attr('id')) {
                captionInner.attr('id', keditor.generateId('component-text-content-inner'));
            }
            
            captionInner.prop('contenteditable', true);
            captionInner.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(keditor, e, component, contentArea);
                }
                
                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(keditor, e, container, contentArea);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(keditor, e, contentArea);
                }
            });
            
            var editor = captionInner.ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
                
                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "thumbnail" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var caption = componentContent.find('.caption');
            var captionInner = caption.find('.caption-inner');
            
            var id = captionInner.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                caption.html(editor.getData());
            }
            
            return componentContent.html();
        },
        
        destroy: function (component, keditor) {
            flog('destroy "text" component', component);
            
            var id = component.find('.caption-inner').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        },
        
        settingEnabled: true,
        
        settingTitle: 'Thumbnail Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "thumbnail" component');
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentThumbnailSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    initMSelectImage(form.find('.photo-edit'), keditor, function (url, relativeUrl, fileType, hash, isAsset) {
                        var img = keditor.getSettingComponent().find('.thumbnail img');
                        var imgUrl = '/_hashes/files/' + hash;
                        if (isAsset){
                            imgUrl = url;
                        }
                        img.attr('src', imgUrl);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "thumbnail" component', component);
        }
    };
    
})(jQuery);

(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['vimeo'] = {
        getContent: function (component, keditor) {
            flog('getContent "vimeo" component', component);
            
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.vimeo-cover').remove();
            
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'Vimeo Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "vimeo" settings', form);
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentVimeoSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var btnEdit = form.find('.btn-vimeo-edit');
                    btnEdit.on('click', function (e) {
                        e.preventDefault();
                        
                        var inputData = prompt('Please enter Vimeo URL in here:');
                        var vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
                        var match = inputData.match(vimeoRegex);
                        if (match && match[1]) {
                            keditor.getSettingComponent().find('.embed-responsive-item').attr('src', 'https://player.vimeo.com/video/' + match[1] + '?byline=0&portrait=0&badge=0');
                        } else {
                            alert('Your Vimeo URL is invalid!');
                        }
                    });
                    
                    var btn169 = form.find('.btn-vimeo-169');
                    btn169.on('click', function (e) {
                        e.preventDefault();
                        
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
                    });
                    
                    var btn43 = form.find('.btn-vimeo-43');
                    btn43.on('click', function (e) {
                        e.preventDefault();
                        
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
                    });
                    
                    var chkAutoplay = form.find('#vimeo-autoplay');
                    chkAutoplay.on('click', function () {
                        var embedItem = keditor.getSettingComponent().find('.embed-responsive-item');
                        var currentUrl = embedItem.attr('src');
                        var newUrl = (currentUrl.replace(/(\?.+)+/, '')) + '?byline=0&portrait=0&badge=0&autoplay=' + (chkAutoplay.is(':checked') ? 1 : 0);
                        
                        flog('Current url: ' + currentUrl, 'New url: ' + newUrl);
                        embedItem.attr('src', newUrl);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "vimeo" component', component);
            
            var embedItem = component.find('.embed-responsive-item');
            var chkAutoplay = form.find('#vimeo-autoplay');
            var src = embedItem.attr('src');
            
            chkAutoplay.prop('checked', src.indexOf('autoplay=1') !== -1);
        }
    };
    
})(jQuery);

(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['youtube'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "youtube" component', component);
            
            component.find('iframe').attr('allowfullscreen', 'allowfullscreen');
        },
        
        getContent: function (component, keditor) {
            flog('getContent "youtube" component', component);
            
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.youtube-cover').remove();
            
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'Youtube Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "youtube" settings', form);
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentYoutubeSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var btnEdit = form.find('.btn-youtube-edit');
                    btnEdit.on('click', function (e) {
                        e.preventDefault();
                        
                        var inputData = prompt('Please enter Youtube URL in here:');
                        if (inputData !== null) {
                            var youtubeRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/;
                            var match = (inputData || '').match(youtubeRegex);
                            if (match && match[1]) {
                                keditor.getSettingComponent().find('.embed-responsive-item').attr('src', 'https://www.youtube.com/embed/' + match[1]);
                            } else {
                                alert('Your Youtube URL is invalid!');
                            }
                        }
                    });
                    
                    var btn169 = form.find('.btn-youtube-169');
                    btn169.on('click', function (e) {
                        e.preventDefault();
                        
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
                    });
                    
                    var btn43 = form.find('.btn-youtube-43');
                    btn43.on('click', function (e) {
                        e.preventDefault();
                        
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
                    });
                    
                    var chkAutoplay = form.find('#youtube-autoplay');
                    chkAutoplay.on('click', function () {
                        var embedItem = keditor.getSettingComponent().find('.embed-responsive-item');
                        var currentUrl = embedItem.attr('src');
                        var newUrl = (currentUrl.replace(/(\?.+)+/, '')) + '?autoplay=' + (chkAutoplay.is(':checked') ? 1 : 0);
                        
                        flog('Current url: ' + currentUrl, 'New url: ' + newUrl);
                        embedItem.attr('src', newUrl);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "youtube" component', component);
            
            var embedItem = component.find('.embed-responsive-item');
            var chkAutoplay = form.find('#youtube-autoplay');
            var src = embedItem.attr('src');
            
            chkAutoplay.prop('checked', src.indexOf('autoplay=1') !== -1);
        }
    };
    
})(jQuery);
