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
