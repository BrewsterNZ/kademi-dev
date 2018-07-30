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

