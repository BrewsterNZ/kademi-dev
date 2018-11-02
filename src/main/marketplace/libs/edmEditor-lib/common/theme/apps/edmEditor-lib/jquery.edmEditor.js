var KEDITOR_EXTERNAL_URL = "";


(function ($) {
    var EDITOR_PATH = '/theme/apps/edmEditor-lib/';

    $.fn.edmEditor = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('[jquery.edmEditor] Method ' + method + ' does not exist on jquery.edmEditor');
        }
    };

    var edmEditor = {
        isDependenciesChecked: false,
        settingsHtml: '',
        defaultStyles: ''
    };

    edmEditor.DEFAULTS = {
        snippetsUrl: '',
        snippetsHandlersUrl: '',
        iframeMode: false,
        contentStyles: [],
        allGroups: [],
        pagePath: null,
        basePath: null,
        externalUrl : null,
        edmBackground: '#fafafa',
        edmPaddingTop: '20',
        edmPaddingBottom: '20',
        edmPaddingLeft: '20',
        edmPaddingRight: '20',
        bodyBackground: '#ffffff',
        textColor: '#333333',
        linkColor: '#337ab7',
        fontFamily: 'Arial, Helvetica, san-serif',
        fontSize: '14',
        lineHeight: '20',
        fontSizeH1: '36',
        lineHeightH1: '40',
        fontSizeH2: '30',
        lineHeightH2: '34',
        fontSizeH3: '24',
        lineHeightH3: '26',
        fontSizeH4: '18',
        lineHeightH4: '20',
        fontSizeH5: '14',
        lineHeightH5: '16',
        fontSizeH6: '12',
        lineHeightH6: '14',
        onReady: function () {

        }
    };

    edmEditor.dependScripts = [
        '/static/bootstrap-colorpicker/2.5.1/js/bootstrap-colorpicker.min.js'
    ];

    edmEditor.dependStyles = [
        '/static/font-awesome/4.7.0/css/font-awesome.min.css',
        EDITOR_PATH + 'jquery.edmEditor.css',
        '/static/bootstrap-colorpicker/2.5.1/css/bootstrap-colorpicker.min.css'
    ];

    edmEditor.keditorStyles = [
        '/theme/apps/keditor-lib/dist/css/keditor-0.0.0.min.css',
        '/theme/apps/keditor-lib/dist/css/keditor-components-0.0.0.min.css'
    ];

    edmEditor.checkDependencies = function (options, callback) {
        flog('[jquery.edmEditor] checkDependencies');

        if (edmEditor.isDependenciesChecked) {
            flog('[jquery.edmEditor] Dependencies are already loaded');
            callback();
        }

        if (options.iframeMode) {
            $.getStyleOnce(edmEditor.dependStyles[0]);
            if (!$.isArray(options.contentStyles)) {
                options.contentStyles = [];
            }

            $.each(edmEditor.dependStyles, function (i, style) {
                options.contentStyles.push({
                    href: style
                });
            });
            $.each(edmEditor.keditorStyles, function (i, style) {
                options.contentStyles.push({
                    href: style
                });
            });
        } else {
            $.each(edmEditor.dependStyles, function (i, style) {
                $.getStyleOnce(style);
            });
        }

        if (options.snippetsHandlersUrl) {
            edmEditor.dependScripts.push(options.snippetsHandlersUrl);
        }

        var requestSettings = $.ajax({
            url: EDITOR_PATH + 'jquery.edmEditorSettings.html',
            type: 'get',
            success: function (resp) {
                flog('[jquery.edmEditor] EDM settings are loaded');
                edmEditor.settingsHtml = resp;
            }
        });
        var requestStyles = $.ajax({
            url: EDITOR_PATH + 'jquery.edmEditorStyles.css',
            type: 'get',
            success: function (resp) {
                flog('[jquery.edmEditor] EDM default styles are loaded\n', resp);
                edmEditor.defaultStyles = resp;
            }
        });

        function loadScript(index) {
            $.getScriptOnce(edmEditor.dependScripts[index], function () {
                if (index === edmEditor.dependScripts.length - 1) {
                    $.when(requestSettings, requestStyles).done(function () {
                        flog('[jquery.edmEditor] All dependencies are loaded');
                        edmEditor.isDependenciesChecked = true;
                        callback();
                    });
                } else {
                    loadScript(index + 1);
                }
            });
        }

        loadCKEditor(function () {
            loadKEditor(true, function () {
                loadScript(0);
            });
        });
    };

    edmEditor.getPxValue = function (value) {
        if (value) {
            return value.replace('px', '');
        } else {
            return '';
        }
    };

    edmEditor.mergeStyleOptions = function (options, key, value) {
        if (value) {
            options[key] = value;
        }
    };

    edmEditor.processEdmContent = function (target, options) {
        flog('[jquery.edmEditor] processEdmContent', target, options);
        var edmContent = target.is('textarea') ? target.val() : target.html();
        var fragment = $('<div />').html(edmContent);

        flog('[jquery.edmEditor] Processing td#edm-wrapper-td...');
        var tdWrapper = fragment.find('td#edm-wrapper-td');
        edmEditor.mergeStyleOptions(options, 'edmBackground', edmEditor.rgb2Hex(tdWrapper.css('background-color')));
        edmEditor.mergeStyleOptions(options, 'edmPaddingTop', edmEditor.getPxValue(tdWrapper.css('padding-top')));
        edmEditor.mergeStyleOptions(options, 'edmPaddingBottom', edmEditor.getPxValue(tdWrapper.css('padding-bottom')));
        edmEditor.mergeStyleOptions(options, 'edmPaddingLeft', edmEditor.getPxValue(tdWrapper.css('padding-left')));
        edmEditor.mergeStyleOptions(options, 'edmPaddingRight', edmEditor.getPxValue(tdWrapper.css('padding-right')));

        flog('[jquery.edmEditor] Processing td#edm-body-td...');
        var tdBody = fragment.find('td#edm-body-td');
        edmEditor.mergeStyleOptions(options, 'bodyBackground', edmEditor.rgb2Hex(tdBody.css('background-color')));

        flog('[jquery.edmEditor] Processing table#edm-wrapper...');
        var tableWrapper = fragment.find('table#edm-wrapper');
        edmEditor.mergeStyleOptions(options, 'fontFamily', tableWrapper.attr('data-font-family'));
        edmEditor.mergeStyleOptions(options, 'textColor', tableWrapper.attr('data-text-color'));
        edmEditor.mergeStyleOptions(options, 'linkColor', tableWrapper.attr('data-link-color'));
        edmEditor.mergeStyleOptions(options, 'fontSize', tableWrapper.attr('data-font-size'));
        edmEditor.mergeStyleOptions(options, 'lineHeight', tableWrapper.attr('data-line-height'));
        edmEditor.mergeStyleOptions(options, 'fontSizeH1', tableWrapper.attr('data-font-size-h1'));
        edmEditor.mergeStyleOptions(options, 'lineHeightH1', tableWrapper.attr('data-line-height-h1'));
        edmEditor.mergeStyleOptions(options, 'fontSizeH2', tableWrapper.attr('data-font-size-h2'));
        edmEditor.mergeStyleOptions(options, 'lineHeightH2', tableWrapper.attr('data-line-height-h2'));
        edmEditor.mergeStyleOptions(options, 'fontSizeH3', tableWrapper.attr('data-font-size-h3'));
        edmEditor.mergeStyleOptions(options, 'lineHeightH3', tableWrapper.attr('data-line-height-h3'));
        edmEditor.mergeStyleOptions(options, 'fontSizeH4', tableWrapper.attr('data-font-size-h4'));
        edmEditor.mergeStyleOptions(options, 'lineHeightH4', tableWrapper.attr('data-line-height-h4'));
        edmEditor.mergeStyleOptions(options, 'fontSizeH5', tableWrapper.attr('data-font-size-h5'));
        edmEditor.mergeStyleOptions(options, 'lineHeightH5', tableWrapper.attr('data-line-height-h5'));
        edmEditor.mergeStyleOptions(options, 'fontSizeH6', tableWrapper.attr('data-font-size-h6'));
        edmEditor.mergeStyleOptions(options, 'lineHeightH6', tableWrapper.attr('data-line-height-h6'));

        flog('[jquery.edmEditor] Processing EDM header, body and footer content...');
        var edmHeaderContent = '';
        var edmBodyContent = '';
        var edmFooterContent = '';

        if( tdWrapper.length > 0 ) {
            edmHeaderContent = fragment.find('td#edm-header-td').html() || '';
            edmBodyContent = fragment.find('td#edm-body-td').html() || '';
            edmFooterContent = fragment.find('td#edm-footer-td').html() || '';
        } else {
            edmBodyContent = fragment.html() || '';
        }
        target[target.is('textarea') ? 'val' : 'html'](
            '<div id="edm-header">' + edmHeaderContent + '</div>' +
            '<div id="edm-body">' + edmBodyContent + '</div>' +
            '<div id="edm-footer">' + edmFooterContent + '</div>'
        );

        var edmStyle = fragment.find('style').html();

        return edmStyle === undefined || !edmStyle ? '' : edmStyle;
    };

    edmEditor.rgb2Hex = function (value) {
        if (!value) {
            return '';
        }

        var hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        var hex = function (x) {
            return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
        }

        value = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        if ($.isArray(value)) {
            return "#" + hex(value[1]) + hex(value[2]) + hex(value[3]);
        } else {
            return '';
        }
    };

    edmEditor.initPaddingControl = function (target, onChange) {
        flog('[jquery.edmEditor] initPaddingControl', target);

        target.on('change', function () {
            var txt = $(this);
            var number = txt.val();
            if (isNaN(number) || +number < 0) {
                number = 0;
                this.value = number;
            }

            onChange.call(target, number);
        });
    };

    edmEditor.initSimpleColorPicker = function (target, onChange) {
        flog('[jquery.edmEditor] initSimpleColorPicker', target);

        target.wrap('<div class="input-group"></div>');

        var previewer = $('<span class="input-group-addon" style="color: transparent;"><i class="fa fa-stop"></i></span>');
        target.before(previewer);
        previewer.css('color', target.val() || 'transparent');

        var getColor = function (color) {
            if (color) {
                previewer.css('color', color);
                color = edmEditor.rgb2Hex(previewer.css('color'));
            } else {
                previewer.css('color', 'transparent');
                color = '';
            }

            return color;
        };

        target.on({
            change: function () {
                var color = getColor(this.value);

                target.val(color);

                if (typeof onChange === 'function') {
                    onChange.call(target, color);
                }
            },
            update: function () {
                previewer.css('color', '');
                target.val(getColor(target.val()));
            }
        });
    };


    edmEditor.initColorPicker = function (target, onChange) {
        flog('[jquery.edmEditor] initSimpleColorPicker', target);

        var inputColor = target.val();

        var strVar = "";
        strVar += "<div class=\"input-group colorpicker-component\">";
        strVar += "    <span class=\"input-group-addon\"><i><\/i><\/span>";
        strVar += "<\/div>";

        var newElement = $($.parseHTML(strVar));
        newElement.append(target.clone());

        target.replaceWith(newElement);

        newElement.colorpicker({
            format: 'hex',
            align: 'left',
            color: inputColor,
            customClass: 'edm-color-picker',
            container: newElement.parent()
        });


        newElement.find('input').on({
            change: function () {
                var color = newElement.colorpicker('getValue', "#fff");
                if (typeof onChange === 'function') {
                    onChange.call(target, color);
                }
            }
        });
    };

    /**
     * Avoid merging padding or margin values to shorthand or color converts to rgb
     * @param name
     * @param value
     * @param target
     */
    edmEditor.setStyles = function (name, value, target) {
        target.each(function () {
            var self = $(this);
            var styles = self.attr('style');
            styles = styles ? styles.split(';') : [];
            var isExisting = false;

            for (var i = 0; i < styles.length; i++) {
                var style = (styles[i] || '').trim();
                if (style.length > 0 && style.indexOf(':') !== -1) {
                    style = style.split(':');

                    if (style[0].trim() === name) {
                        if (value) {
                            styles[i] = name + ':' + value;
                        } else {
                            styles.splice(i, 1);
                        }

                        isExisting = true;
                    } else {
                        if (style[1].trim() === '') {
                            styles.splice(i, 1);
                        }
                    }
                } else {
                    styles.splice(i, 1);
                }
            }

            if (!isExisting && value) {
                styles.push(name + ':' + value);
            }

            self.attr('style', styles.join(';'));
        });
    };

    edmEditor.initDefaultComponentControls = function (form, keditor, options) {
        flog('[jquery.edmEditor] initDefaultComponentControls', form, keditor, options);

        if (!options || !options.hidePadding) {
            form.prepend(
                '<div class="form-group">' +
                '   <div class="col-md-12">' +
                '       <label>Padding (in px)</label>' +
                '       <div class="row row-sm text-center">' +
                '           <div class="col-xs-4 col-xs-offset-4">' +
                '               <input type="number" value="" class="txt-padding form-control" data-css="padding-top" />' +
                '               <small>top</small>' +
                '           </div>' +
                '       </div>' +
                '       <div class="row row-sm text-center">' +
                '           <div class="col-xs-4">' +
                '               <input type="number" value="" class="txt-padding form-control" data-css="padding-left" />' +
                '               <small>left</small>' +
                '           </div>' +
                '           <div class="col-xs-4 col-xs-offset-4">' +
                '               <input type="number" value="" class="txt-padding form-control" data-css="padding-right" />' +
                '               <small>right</small>' +
                '           </div>' +
                '       </div>' +
                '       <div class="row row-sm text-center">' +
                '           <div class="col-xs-4 col-xs-offset-4">' +
                '               <input type="number" value="" class="txt-padding form-control" data-css="padding-bottom" />' +
                '               <small>bottom</small>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>'
            );

            form.find('.txt-padding').each(function () {
                var input = $(this);
                var dataCss = input.attr('data-css');

                edmEditor.initPaddingControl(input, function (value) {
                    var component = keditor.getSettingComponent();

                    if (options && options.dynamicComponent) {
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-' + dataCss, value);
                        keditor.initDynamicContent(dynamicElement);
                    } else {
                        var tdWrapper = component.find('td.wrapper');
                        edmEditor.setStyles(dataCss, value + 'px', tdWrapper);
                    }

                    if (options && typeof options.onPaddingChanged === 'function') {
                        options.onPaddingChanged.call(this, dataCss, value);
                    }
                });
            });
        }

        form.prepend(
            '<div class="form-group">' +
            '   <div class="col-md-12">' +
            '       <label>Background</label>' +
            '       <input type="text" value="" class="txt-bg-color form-control simple-color-picker" />' +
            '   </div>' +
            '</div>'
        );

        edmEditor.initSimpleColorPicker(form.find('.txt-bg-color'), function (color) {
            var component = keditor.getSettingComponent();
            if (options && options.dynamicComponent) {
                var dynamicElement = component.find('[data-dynamic-href]');

                component.attr('data-background-color', color);
                keditor.initDynamicContent(dynamicElement);
            } else {
                var tdWrapper = component.find('td.wrapper');
                tdWrapper.attr('bgcolor', color);
            }

            if (options && typeof options.onColorChanged === 'function') {
                options.onColorChanged.call(this, color);
            }
        });
    };

    edmEditor.showDefaultComponentControls = function (form, component, keditor, options) {
        flog('[jquery.edmEditor] showDefaultComponentControls', form, component, keditor, options);

        if (options && options.dynamicComponent) {
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);

            flog('-----------------', dataAttributes);

            form.find('.txt-padding').each(function () {
                var input = $(this);
                var dataCss = input.attr('data-css');

                input.val(dataAttributes['data-' + dataCss] || '');
            });

            form.find('.txt-bg-color').val(dataAttributes['data-background-color'] || '').trigger('update');
        } else {
            var tdWrapper = component.find('td.wrapper');
            form.find('.txt-padding').each(function () {
                var input = $(this);
                var dataCss = input.attr('data-css');

                input.val(
                    edmEditor.getPxValue(tdWrapper.css(dataCss))
                );
            });

            form.find('.txt-bg-color').val(tdWrapper.attr('bgcolor') || '').trigger('update');
        }
    };

    edmEditor.applySetting = function (keditor, input) {
        //flog('[jquery.edmEditor] applySetting', keditor, input);

        var body = keditor.body;
        var dataCss = input.attr('data-css');
        var dataTarget = input.attr('data-target');
        var dataUnit = input.attr('data-unit') || '';

        if (dataTarget === 'style') {
            var headTag = (keditor.options.iframeMode ? keditor.iframeHead : $('head'));
            var styleTags = headTag.find('style');
            var previewStyle = styleTags.filter('#preview-style');
            if (previewStyle.length === 0) {
                previewStyle = $('<style id="preview-style" type="text/css"></style>')
                headTag.append(previewStyle);
            }


            var previewStyleObj = {};
            var styleInputs = body.find('#edm-setting').find('[data-target=style]');
            styleInputs.each(function () {
                var input = $(this);
                var dataSelector = input.attr('data-selector');
                var dataCss = input.attr('data-css');
                var dataUnit = input.attr('data-unit');

                if (!(dataSelector in previewStyleObj)) {
                    previewStyleObj[dataSelector] = [];
                }

                previewStyleObj[dataSelector].push(dataCss + ':' + (input.val() || '') + (dataUnit || ''));
            });

            var previewStyleStr = '';
            $.each(previewStyleObj, function (key, value) {
                previewStyleStr += key + '{' + value.join(';') + '}';
            });
            previewStyleStr += 'a{text-decoration:none}';
            previewStyleStr += 'h1,h2,h3,h4,h5,h6{margin:0;}';

            previewStyle.html(previewStyleStr);
        } else {
            var target = dataTarget === 'body' ? body : body.find(dataTarget);
            edmEditor.setStyles(dataCss, input.val() + dataUnit, target);
        }
    };

    edmEditor.applySettings = function (keditor) {
        var body = keditor.body;
        var settingPanel = body.find('#edm-setting');

        settingPanel.find('input').each(function () {
            edmEditor.applySetting(keditor, $(this));
        });
    };

    edmEditor.initSettingPanel = function (keditor, options) {
        flog('[jquery.edmEditor] initSettingPanel', keditor, options);

        var body = keditor.body;
        var settingPanel = body.find('#edm-setting');

        $.each(options, function (key, value) {
            settingPanel.find('.' + key).val(value);
        });

        settingPanel.find('.simple-color-picker').each(function () {
            edmEditor.initSimpleColorPicker($(this), function () {
                edmEditor.applySetting(keditor, $(this));
            });
        });

        var settingInputs = settingPanel.find('input');
        settingInputs.not('.simple-color-picker').on('change', function () {
            edmEditor.applySetting(keditor, $(this));
        });

        edmEditor.applySettings(keditor);
    };

    edmEditor.initContainerSettings = function (form, keditor) {
        flog('[jquery.edmEditor] initContainerSettings', form, keditor);

        $.ajax({
            url: EDITOR_PATH + 'jquery.edmEditorContainerSettings.html',
            type: 'get',
            success: function (resp) {
                form.html(resp);

                var groupsOptions = '';
                var allGroups = keditor.options.allGroups;

                for (var name in allGroups) {
                    groupsOptions += '<div class="checkbox">';
                    groupsOptions += '    <label><input type="checkbox" value="' + name + '" />' + allGroups[name] + '</label>';
                    groupsOptions += '</div>';
                }

                var availability = form.find(".select-availability");
                availability.on('change', function () {
                    var container = keditor.getSettingContainer();
                    var table = container.find('.keditor-container-inner > table');
                    table.attr('data-availability', this.value);
                });

                var selectGroups = form.find('.select-groups');
                selectGroups.html(groupsOptions);
                var selectGroupsItems = selectGroups.find('input[type=checkbox]');

                selectGroupsItems.on('click', function () {
                    var selectedGroups = [];
                    selectGroupsItems.each(function () {
                        if (this.checked) {
                            selectedGroups.push(this.value);
                        }
                    });

                    var container = keditor.getSettingContainer();
                    var table = container.find('.keditor-container-inner > table');
                    table.attr('data-groups', selectedGroups ? selectedGroups.join(',') : '');
                });

                var cbbExperiment = form.find('.select-experiment');
                $.ajax({
                    url: '/experiments/',
                    type: 'get',
                    dataType: 'JSON',
                    data: {
                        asJson: true
                    },
                    success: function (resp) {
                        var experimentOptionsStr = '';

                        $.each(resp.data, function (i, experiment) {
                            experimentOptionsStr += '<option value="' + experiment.name + '">' + experiment.name + '</option>';

                            $.each(experiment.variants, function (k, variant) {
                                experimentOptionsStr += '<option value="' + experiment.name + '/' + variant.name + '">' + experiment.name + '/' + variant.name + '</option>';
                            });
                        });

                        cbbExperiment.append(experimentOptionsStr);
                    }
                });

                cbbExperiment.on('change', function () {
                    var container = keditor.getSettingContainer();
                    var table = container.find('.keditor-container-inner > table');
                    table.attr('data-experiment', this.value);
                });

                var visRules = form.find(".visible-rules");
                visRules.on('change', function () {
                    var container = keditor.getSettingContainer();
                    var table = container.find('.keditor-container-inner > table');
                    table.attr('data-expr', this.value);
                });

                form.find('.columns-setting').on('change', '.txt-padding', function () {
                    var txt = $(this);
                    var dataCss = txt.attr('data-css');
                    var number = txt.val();
                    if (isNaN(number) || +number < 0) {
                        number = 0;
                        this.value = number;
                    }

                    var index = +txt.attr('data-index');
                    var container = keditor.getSettingContainer();
                    var column = container.find('[data-type=container-content]').eq(index);
                    edmEditor.setStyles(dataCss, number + 'px', column);

                    // Handle width when padding is changed
                    column.find('[data-type^=component]').each(function () {
                        var component = $(this);
                        var dynamicElements = component.find('[data-dynamic-href]');
                        var componentWidth = component.width();

                        if (dynamicElements.length > 0) {
                            component.attr('data-width', componentWidth);
                            dynamicElements.each(function () {
                                keditor.initDynamicContent($(this));
                            });
                        } else {
                            var componentType = keditor.getComponentType(component);
                            var componentData = $.keditor.components[componentType];

                            if (typeof componentData.onWithChanged === 'function') {
                                componentData.onWithChanged.call(componentData, component, componentWidth, keditor);
                            }
                        }
                    });
                });

                edmEditor.initSimpleColorPicker(form.find('.txt-bg-color'), function (color) {
                    var container = keditor.getSettingContainer();
                    var target = container.find('.keditor-container-inner > table');
                    target.attr('bgcolor', color);
                });
            }
        });
    };

    edmEditor.showContainerSettings = function (form, container, keditor) {
        flog('[jquery.edmEditor] showContainerSettings', form, container, keditor);

        var table = container.find('.keditor-container-inner > table');

        var selectGroups = form.find('.select-groups');
        var selectGroupsItems = selectGroups.find('input[type=checkbox]');
        var selectedGroups = (table.attr('data-groups') || '').split(',');
        selectGroupsItems.prop('checked', false);
        $.each(selectedGroups, function (i, group) {
            selectGroupsItems.filter('[value="' + group + '"]').prop('checked', true);
        });

        var availabilitySelect = form.find(".select-availability");
        var availability = table.attr('data-availability');
        availabilitySelect.val(availability);

        var expPath = table.data("experiment");
        var txtExperiment = form.find('.select-experiment');
        txtExperiment.val(expPath);

        var visRulesExpr = table.data("expr");
        var visRules = form.find(".visible-rules");
        visRules.val(visRulesExpr);

        var columnsSettings = form.find('.columns-setting');
        columnsSettings.html('');

        form.find('.txt-bg-color').val(table.attr('bgcolor') || '').trigger('update');

        container.find('[data-type=container-content]').each(function (i) {
            var column = $(this);

            edmEditor.generateColumnSettings(columnsSettings, column, i);
        });
    };

    edmEditor.generateColumnSettings = function (columnsSettings, column, i) {
        flog('[jquery.edmEditor] generateColumnSettings', columnsSettings, column, i);

        var settingHtml = '';
        settingHtml += '<div class="form-group">';
        settingHtml += '   <div class="col-md-12">';
        settingHtml += '       <p>Padding (in px)</p>';
        settingHtml += '       <div class="row row-sm text-center">';
        settingHtml += '           <div class="col-xs-4 col-xs-offset-4">';
        settingHtml += '               <input type="number" value="' + (column.prop('style')['paddingTop'] || '').replace('px', '') + '" class="txt-padding form-control" data-css="padding-top" data-index="' + i + '" />';
        settingHtml += '               <small>top</small>';
        settingHtml += '           </div>';
        settingHtml += '       </div>';
        settingHtml += '       <div class="row row-sm text-center">';
        settingHtml += '           <div class="col-xs-4">';
        settingHtml += '               <input type="number" value="' + (column.prop('style')['paddingLeft'] || '').replace('px', '') + '" class="txt-padding form-control" data-css="padding-left" data-index="' + i + '" />';
        settingHtml += '               <small>left</small>';
        settingHtml += '           </div>';
        settingHtml += '           <div class="col-xs-4 col-xs-offset-4">';
        settingHtml += '               <input type="number" value="' + (column.prop('style')['paddingRight'] || '').replace('px', '') + '" class="txt-padding form-control" data-css="padding-right" data-index="' + i + '" />';
        settingHtml += '               <small>right</small>';
        settingHtml += '           </div>';
        settingHtml += '       </div>';
        settingHtml += '       <div class="row row-sm text-center">';
        settingHtml += '           <div class="col-xs-4 col-xs-offset-4">';
        settingHtml += '               <input type="number" value="' + (column.prop('style')['paddingBottom'] || '').replace('px', '') + '" class="txt-padding form-control" data-css="padding-bottom" data-index="' + i + '" />';
        settingHtml += '               <small>bottom</small>';
        settingHtml += '           </div>';
        settingHtml += '       </div>';
        settingHtml += '   </div>';
        settingHtml += '</div>';

        columnsSettings.append(
            (i > 0 ? '<hr />' : '') +
            '<div class="column-setting">' +
            '   <strong>Column #' + (i + 1) + '</strong>' + settingHtml +
            '</div>'
        );
    };

    edmEditor.cleanBaseStyles = function (component) {
        flog('[jquery.edmEditor] cleanBaseStyles', component);

        var tdWrapper = component.find('td.text-wrapper');
        tdWrapper.css({
            'color': '',
            'font-size': '',
            'font-family': '',
            'line-height': ''
        });
        tdWrapper.find('a').css({
            'color': ''
        });

        tdWrapper.find('h1, h2, h3, h4, h5, h6').css({
            'font-size': '',
            'line-height': ''
        });
    };

    edmEditor.fixContainerContent = function (html) {
        var newDom = $('<div />').html(html);
        newDom.find('[data-type="container-content"]').attr('height', 10);

        return newDom.html();
    };

    var methods = {
        init: function (options) {
            options = $.extend({}, edmEditor.DEFAULTS, options);

            return $(this).each(function () {
                var target = $(this);

                flog('[jquery.edmEditor] Initializing...', target, options);

                if (target.data('edmEditorOptions')) {
                    flog('[jquery.edmEditor] EDM Editor is already initialized', target);
                    return target;
                }

                var edmStyle = edmEditor.processEdmContent(target, options);

                edmEditor.checkDependencies(options, function () {
                    flog('[jquery.edmEditor] Add EDM base style');
                    if (options.iframeMode) {
                        options.contentStyles.push({
                            id: 'edm-base-style',
                            content: edmStyle || edmEditor.defaultStyles
                        });
                    } else {
                        $('head').append('<style type="text/css" id="edm-base-style">' + (edmStyle || edmEditor.defaultStyles) + '</style>');
                    }


                    target.keditor({
                        ckeditorOptions: {
                            title: false,
                            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
                            bodyId: 'editor',
                            templates_replaceContent: false,
                            toolbarGroups: [
                                {name: 'document', groups: ['mode', 'document', 'doctools']},
                                {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
                                {name: 'forms', groups: ['forms']},
                                {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                                {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
                                {name: 'links', groups: ['links']},
                                {name: 'insert', groups: ['insert']},
                                '/',
                                {name: 'clipboard', groups: ['clipboard', 'undo']},
                                {name: 'styles', groups: ['styles']},
                                {name: 'colors', groups: ['colors']},
                                {name: 'tools', groups: ['tools']},
                                {name: 'others', groups: ['others']},
                                {name: 'about', groups: ['about']}
                            ],
                            extraPlugins: 'sourcedialog,lineheight,onchange,fuse-image,kcode',
                            removePlugins: 'resize,image,save,newpage,preview,tliyoutube,image2,pbckcode,googledocs,language,table,magicline,tabletools',
                            removeButtons: 'Save,NewPage,Preview,Print,Templates,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,HiddenField,ImageButton,Button,Select,Textarea,TextField,Radio,Checkbox,Outdent,Indent,Blockquote,CreateDiv,Language,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,About,ShowBlocks,BidiLtr,BidiRtl,Flash,Image,Subscript,Superscript,Anchor',
                            enterMode: CKEDITOR.ENTER_DIV,
                            forceEnterMode: true,
                            filebrowserBrowseUrl: '/static/fckfilemanager/browser/default/browser.html?Type=Image&Connector=/fck_connector.html',
                            filebrowserUploadUrl: '/uploader/upload',
                            format_tags: 'p;h1;h2;h3;h4;h5;h6',
                            stylesSet: 'myStyles:' + stylesPath,
                            line_height: '1;1.2;1.5;2;2.2;2.5',
                            pagePath: options.pagePath,
                            basePath: options.basePath,
                            fullUrl: true
                        },
                        niceScrollEnabled: false,
                        nestedContainerEnabled: false,
                        tabContainersText: '<i class="fa fa-columns"></i>',
                        tabComponentsText: '<i class="fa fa-files-o"></i>',
                        snippetsUrl: options.snippetsUrl,
                        tabTooltipEnabled: false,
                        snippetsTooltipEnabled: false,
                        allGroups: options.allGroups,
                        iframeMode: options.iframeMode,
                        contentAreasSelector: '#edm-header, #edm-body, #edm-footer',
                        contentAreasWrapper: '<div id="edm-area"></div>',
                        contentStyles: options.contentStyles,
                        extraTabs: {
                            setting: {
                                text: '<i class="fa fa-cog"></i>',
                                title: 'Settings',
                                content: edmEditor.settingsHtml
                            }
                        },
                        onBeforeDynamicContentLoad: function (dynamicElement, component) {
                            component.removeAttr('data-font-family');
                            component.removeAttr('data-font-size');
                            component.removeAttr('data-line-height');
                            component.removeAttr('data-text-color');
                            component.removeAttr('data-link-color');
                            component.removeAttr('data-font-size-h1');
                            component.removeAttr('data-line-height-h1');
                            component.removeAttr('data-font-size-h2');
                            component.removeAttr('data-line-height-h2');
                            component.removeAttr('data-font-size-h3');
                            component.removeAttr('data-line-height-h3');
                            component.removeAttr('data-font-size-h4');
                            component.removeAttr('data-line-height-h4');
                            component.removeAttr('data-font-size-h5');
                            component.removeAttr('data-line-height-h5');
                            component.removeAttr('data-font-size-h6');
                            component.removeAttr('data-line-height-h6');
                            component.hide();
                            component.attr('data-width', component.closest('td').width());
                            component.show();
                        },
                        onInitContentArea: function (contentArea) {
                            contentArea[contentArea.children().length === 0 ? 'addClass' : 'removeClass']('empty');

                            return contentArea.find('> table');
                        },
                        onContentChanged: function (e, contentArea) {
                            var body = this.body;

                            if (!body.hasClass('content-changed')) {
                                body.addClass('content-changed');
                            }

                            contentArea[contentArea.children().length === 0 ? 'addClass' : 'removeClass']('empty');
                        },
                        onReady: function () {
                            edmEditor.initSettingPanel(this, options);

                            if (typeof options.onReady === 'function') {
                                options.onReady.call(target);
                            }
                        },
                        onComponentReady: edmEditor.cleanBaseStyles,
                        onInitComponent: edmEditor.cleanBaseStyles,
                        containerSettingEnabled: true,
                        containerSettingInitFunction: edmEditor.initContainerSettings,
                        containerSettingShowFunction: edmEditor.showContainerSettings,
                        pagePath: options.pagePath,
                        basePath: options.basePath,
                        externalUrl : options.externalUrl
                    });
                });

                KEDITOR_EXTERNAL_URL = options.externalUrl;

                target.data('edmEditorOptions', options);
            });
        },

        getContent: function () {
            var target = $(this);
            var keditor = target.data('keditor');
            var body = keditor.body;
            var edmHtml = target.keditor('getContent', true);
            var edmHeader = edmEditor.fixContainerContent(edmHtml[0]);
            var edmBody = edmEditor.fixContainerContent(edmHtml[1]);
            var edmFooter = edmEditor.fixContainerContent(edmHtml[2]);

            var fragment = $('<div />').html(
                '<table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-wrapper">' +
                '    <tbody>' +
                '        <tr>' +
                '            <td id="edm-wrapper-td" align="center">' +
                '            <!--[if (gte mso 9)|(IE)]>' +
                '                <table cellspacing="0" cellpadding="0" width="600" border="0">' +
                '                    <tr>' +
                '                        <td>' +
                '            <![endif]-->' +
                '                <table cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;" id="edm-container">' +
                '                    <tbody>' +
                '                        <tr>' +
                '                            <td>' +
                '                                <table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-header" align="center">' +
                '                                    <tbody>' +
                '                                        <tr>' +
                '                                            <td id="edm-header-td">' + edmHeader + '</td>' +
                '                                        </tr>' +
                '                                    </tbody>' +
                '                                </table>' +
                '                                <table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-body" align="center">' +
                '                                    <tbody>' +
                '                                        <tr>' +
                '                                            <td id="edm-body-td">' + edmBody + '</td>' +
                '                                        </tr>' +
                '                                    </tbody>' +
                '                                </table>' +
                '                                <table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-footer" align="center">' +
                '                                    <tbody>' +
                '                                        <tr>' +
                '                                            <td id="edm-footer-td">' + edmFooter + '</td>' +
                '                                        </tr>' +
                '                                    </tbody>' +
                '                                </table>' +
                '                            </td>' +
                '                        </tr>' +
                '                    </tbody>' +
                '                </table>' +
                '            <!--[if (gte mso 9)|(IE)]>' +
                '                        </td>' +
                '                    </tr>' +
                '                </table>' +
                '            <![endif]-->' +
                '            </td>' +
                '        </tr>' +
                '    </tbody>' +
                '</table>'
            );

            // Base styles
            var fontFamily = body.find('.fontFamily').val() || '';
            var fontSize = body.find('.fontSize').val() || '';
            var lineHeight = body.find('.lineHeight').val() || '';
            var textColor = body.find('.textColor').val() || '';
            var linkColor = body.find('.linkColor').val() || '';

            // Headings styles
            var fontSizeH1 = body.find('.fontSizeH1').val() || '';
            var lineHeightH1 = body.find('.lineHeightH1').val() || '';
            var fontSizeH2 = body.find('.fontSizeH2').val() || '';
            var lineHeightH2 = body.find('.lineHeightH2').val() || '';
            var fontSizeH3 = body.find('.fontSizeH3').val() || '';
            var lineHeightH3 = body.find('.lineHeightH3').val() || '';
            var fontSizeH4 = body.find('.fontSizeH4').val() || '';
            var lineHeightH4 = body.find('.lineHeightH4').val() || '';
            var fontSizeH5 = body.find('.fontSizeH5').val() || '';
            var lineHeightH5 = body.find('.lineHeightH5').val() || '';
            var fontSizeH6 = body.find('.fontSizeH6').val() || '';
            var lineHeightH6 = body.find('.lineHeightH6').val() || '';

            var dataBaseStyles = {
                'data-font-family': fontFamily,
                'data-font-size': fontSize,
                'data-line-height': lineHeight,
                'data-text-color': textColor,
                'data-link-color': linkColor,
                'data-font-size-h1': fontSizeH1,
                'data-line-height-h1': lineHeightH1,
                'data-font-size-h2': fontSizeH2,
                'data-line-height-h2': lineHeightH2,
                'data-font-size-h3': fontSizeH3,
                'data-line-height-h3': lineHeightH3,
                'data-font-size-h4': fontSizeH4,
                'data-line-height-h4': lineHeightH4,
                'data-font-size-h5': fontSizeH5,
                'data-line-height-h5': lineHeightH5,
                'data-font-size-h6': fontSizeH6,
                'data-line-height-h6': lineHeightH6
            };

            // Set background color for edm and store base styles in #edm-wrapper
            var edmBackground = body.find('.edmBackground').val();
            var edmWrapperTd = fragment.find('#edm-wrapper-td');
            fragment.find('#edm-wrapper').attr(dataBaseStyles).attr('bgcolor', edmBackground);
            edmEditor.setStyles('background-color', edmBackground, edmWrapperTd);

            // Set base styles for dynamic components
            fragment.find('[data-dynamic-href]').each(function () {
                $(this).closest('[data-type]').attr(dataBaseStyles);
            });

            // Set outer padding for edm
            edmEditor.setStyles('padding-top', body.find('.edmPaddingTop').val() + 'px', edmWrapperTd);
            edmEditor.setStyles('padding-bottom', body.find('.edmPaddingBottom').val() + 'px', edmWrapperTd);
            edmEditor.setStyles('padding-left', body.find('.edmPaddingLeft').val() + 'px', edmWrapperTd);
            edmEditor.setStyles('padding-right', body.find('.edmPaddingRight').val() + 'px', edmWrapperTd);

            // Set background color for edm body
            fragment.find('#edm-body').attr({
                'bgcolor': body.find('.bodyBackground').val()
            });

            fragment.find('td.text-wrapper').each(function () {
                var textWrapper = $(this);
                edmEditor.setStyles('font-size', fontSize + 'px', textWrapper);
                edmEditor.setStyles('color', textColor, textWrapper);
                edmEditor.setStyles('font-family', fontFamily, textWrapper);
                edmEditor.setStyles('line-height', lineHeight + 'px', textWrapper);

                var links = textWrapper.find('a');
                edmEditor.setStyles('text-decoration', 'none', links);
                edmEditor.setStyles('color', linkColor, links);

                var h1s = textWrapper.find('h1');
                edmEditor.setStyles('font-size', fontSizeH1 + 'px', h1s);
                edmEditor.setStyles('line-height', lineHeightH1 + 'px', h1s);
                edmEditor.setStyles('margin-top', '0', h1s);
                edmEditor.setStyles('margin-bottom', '0', h1s);

                var h2s = textWrapper.find('h2');
                edmEditor.setStyles('font-size', fontSizeH2 + 'px', h2s);
                edmEditor.setStyles('line-height', lineHeightH2 + 'px', h2s);
                edmEditor.setStyles('margin-top', '0', h2s);
                edmEditor.setStyles('margin-bottom', '0', h2s);

                var h3s = textWrapper.find('h3');
                edmEditor.setStyles('font-size', fontSizeH3 + 'px', h3s);
                edmEditor.setStyles('line-height', lineHeightH3 + 'px', h3s);
                edmEditor.setStyles('margin-top', '0', h3s);
                edmEditor.setStyles('margin-bottom', '0', h3s);

                var h4s = textWrapper.find('h4');
                edmEditor.setStyles('font-size', fontSizeH4 + 'px', h4s);
                edmEditor.setStyles('line-height', lineHeightH4 + 'px', h4s);
                edmEditor.setStyles('margin-top', '0', h4s);
                edmEditor.setStyles('margin-bottom', '0', h4s);

                var h5s = textWrapper.find('h5');
                edmEditor.setStyles('font-size', fontSizeH5 + 'px', h5s);
                edmEditor.setStyles('line-height', lineHeightH5 + 'px', h5s);
                edmEditor.setStyles('margin-top', '0', h5s);
                edmEditor.setStyles('margin-bottom', '0', h5s);

                var h6s = textWrapper.find('h6');
                edmEditor.setStyles('font-size', fontSizeH6 + 'px', h6s);
                edmEditor.setStyles('line-height', lineHeightH6 + 'px', h6s);
                edmEditor.setStyles('margin-top', '0', h6s);
                edmEditor.setStyles('margin-bottom', '0', h6s);
            });

            return (
                '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
                '<html xmlns="http://www.w3.org/1999/xhtml">' +
                '    <head>' +
                '        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
                '        <meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
                '        <title>Kademi EDM Title</title>' +
                '        <style type="text/css">' + (keditor.options.iframeMode ? keditor.iframeHead : $('head')).find('#edm-base-style').html() + '</style>' +
                '    </head>' +
                '    <body>' +
                '        <center>' + fragment.html() + '</center>' +
                '    </body>' +
                '</html>'
            );
        }
    };

    $.edmEditor = edmEditor;

})(jQuery);