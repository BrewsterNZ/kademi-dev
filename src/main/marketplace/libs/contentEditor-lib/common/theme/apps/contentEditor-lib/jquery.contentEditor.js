(function ($) {
    var EDITOR_PATH = '/theme/apps/contentEditor-lib/';

    $.fn.contentEditor = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('[jquery.contentEditor] Method ' + method + ' does not exist on jquery.contentEditor');
        }
    };

    var contentEditor = {
        isDependenciesChecked: false,
        settingsHtml: '',
        defaultStyles: ''
    };

    contentEditor.DEFAULTS = {
        snippetsUrl: '',
        snippetsHandlersUrl: '',
        iframeMode: false,
        contentStyles: [{
            href: '/static/bootstrap/3.3.7/css/bootstrap.css'
        }],
        allGroups: [],
        pagePath: null,
        basePath: null,
        isCustomApp: false,
        onReady: function () {

        }
    };

    contentEditor.dependScripts = [
        '/static/bootstrap-colorpicker/2.5.1/js/bootstrap-colorpicker.min.js'
    ];

    contentEditor.dependStyles = [
        '/static/font-awesome/4.7.0/css/font-awesome.min.css',
        EDITOR_PATH + 'jquery.contentEditor.css',
        '/static/bootstrap-colorpicker/2.5.1/css/bootstrap-colorpicker.min.css'
    ];

    contentEditor.keditorStyles = [
        '/theme/apps/keditor-lib/dist/css/keditor-0.0.0.min.css',
        '/theme/apps/keditor-lib/dist/css/keditor-components-0.0.0.min.css'
    ];

    contentEditor.checkDependencies = function (options, callback) {
        flog('[jquery.contentEditor] checkDependencies');

        if (contentEditor.isDependenciesChecked) {
            flog('[jquery.contentEditor] Dependencies are already loaded');
            callback();
        }

        if (options.iframeMode) {
            $.getStyleOnce(contentEditor.dependStyles[0]);
            if (!$.isArray(options.contentStyles)) {
                options.contentStyles = [];
            }

            $.each(contentEditor.dependStyles, function (i, style) {
                options.contentStyles.push({
                    href: style
                });
            });

            $.each(contentEditor.keditorStyles, function (i, style) {
                options.contentStyles.push({
                    href: style
                });
            });
        } else {
            $.each(contentEditor.dependStyles, function (i, style) {
                $.getStyleOnce(style);
            });
        }

        if (options.snippetsHandlersUrl) {
            contentEditor.dependScripts.push(options.snippetsHandlersUrl);
        }

        function loadScript(index) {
            $.getScriptOnce(contentEditor.dependScripts[index], function () {
                if (index === contentEditor.dependScripts.length - 1) {
                    flog('[jquery.edmEditor] All dependencies are loaded');
                    contentEditor.isDependenciesChecked = true;
                    callback();
                } else {
                    loadScript(index + 1);
                }
            });
        }

        loadCKEditor(function () {
            loadKEditor(function () {
                loadScript(0);
            });
        });
    };

    contentEditor.getContainerElement = function (container, selector) {
        return container.find(selector).filter(function () {
            if (container.hasClass('keditor-sub-container')) {
                return true;
            } else {
                return $(this).closest('.keditor-sub-container').length === 0;
            }
        });
    };

    contentEditor.getContainerBgElement = function (container, form) {
        return contentEditor.getContainerElement(container, '.' + form.find('.select-bg-for').val());
    };

    contentEditor.initContainerSetting = function (form, keditor) {
        flog('[jquery.contentEditor] initContainerSetting', form, keditor);

        var options = keditor.options;
        var allGroups = options.allGroups;

        return $.ajax({
            url: EDITOR_PATH + 'jquery.contentEditorContainerSettings.html',
            type: 'get',
            success: function (resp) {
                form.html(resp);

                var groupsOptions = '';
                groupsOptions += '<div class="checkbox">';
                groupsOptions += '    <label><input type="checkbox" value="Anonymous" />Anonymous</label>';
                groupsOptions += '</div>';
                for (var name in allGroups) {
                    groupsOptions += '<div class="checkbox">';
                    groupsOptions += '    <label><input type="checkbox" value="' + name + '" />' + allGroups[name] + '</label>';
                    groupsOptions += '</div>';
                }

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

                    selectedGroups = selectedGroups ? selectedGroups.join(',') : '';
                    var isAnonymous = selectedGroups === 'Anonymous';

                    if (selectedGroups) {
                        selectGroupsItems.filter('[value=Anonymous]')
                            .prop('disabled', !isAnonymous)
                            .parent()[!isAnonymous ? 'addClass' : 'removeClass']('text-muted');

                        selectGroupsItems.not('[value=Anonymous]').each(function () {
                            var target = $(this);

                            target
                                .prop('disabled', isAnonymous)
                                .parent()[isAnonymous ? 'addClass' : 'removeClass']('text-muted');
                        })
                    } else {
                        selectGroupsItems.prop('disabled', false).parent().removeClass('text-muted');
                    }

                    var container = keditor.getSettingContainer();
                    contentEditor.getContainerElement(container, '.container-bg').attr('data-groups', selectedGroups);
                });

                var cbbExperiment = form.find('.select-experiment');
                flog("cbbExperiment");
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
                    contentEditor.getContainerElement(container, '.container-bg').attr('data-experiment', this.value);
                });

                var visRules = form.find(".visible-rules");
                visRules.on('change', function () {
                    var container = keditor.getSettingContainer();
                    contentEditor.getContainerElement(container, '.container-bg').attr('data-expr', this.value);
                });

                var availability = form.find(".select-availability");
                availability.on('change', function () {
                    var container = keditor.getSettingContainer();
                    contentEditor.getContainerElement(container, '.container-bg').attr('data-availability', this.value);
                });


                form.find('.bgImagesPreview .btn-edit-image').on('click', function (e) {
                    e.preventDefault();

                    form.find('.currentMselect').val('.bgImagesPreview .btn-edit-image');
                    form.find('#btnAddImagesBGs').trigger('click');
                });

                form.find('.bgImagesPreview .btn-delete-image').on('click', function (e) {
                    e.preventDefault();
                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');
                    var target = contentEditor.getContainerBgElement(container, form);
                    var oldImageUrl = form.find('.bgImagesPreview img').attr('src');
                    var images = form.find('.bgImagesPreview [data-images]').attr('data-images');
                    if (images) {
                        var imagesArr = images.split(',');
                        var index = imagesArr.indexOf(oldImageUrl);
                        if (index != -1) {
                            imagesArr.splice(index, 1);
                        }
                        if (imagesArr.length) {
                            form.find('.bgImagesPreview img').attr('src', imagesArr[0]);
                            target.css('background-image', 'url("' + imagesArr[0] + '")');
                        }
                        form.find('.bgImagesPreview [data-images]').attr('data-images', imagesArr.join(','));
                        containerBg.attr('data-images', imagesArr.join(','));
                    }
                });

                initMSelectImage(form.find('#btnAddImagesBGs'), keditor, function (url, relativeUrl, fileType, hash, isAsset) {
                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');
                    var imageUrl = '/_hashes/files/' + hash;
                    if (isAsset){
                        imageUrl = url;
                    }
                    var currentMselect = form.find('.currentMselect').val();
                    var target = contentEditor.getContainerBgElement(container, form);

                    if (currentMselect === '.bgImagesPreview .btn-edit-image') {
                        var oldImageUrl = form.find('.bgImagesPreview img').attr('src');
                        form.find('.bgImagesPreview img').attr('src', imageUrl);
                        var images = form.find('.bgImagesPreview [data-images]').attr('data-images');
                        if (images) {
                            var imagesArr = images.split(',');
                            var index = imagesArr.indexOf(oldImageUrl);
                            imagesArr[index] = imageUrl;
                            form.find('.bgImagesPreview [data-images]').attr('data-images', imagesArr.join(','));
                            containerBg.attr('data-images', imagesArr.join(','));
                        }
                        target.css('background-image', 'url("' + imagesArr[0] + '")');
                    } else if (currentMselect === '#background-image-edit') {
                        target.css('background-image', 'url("' + imageUrl + '")');
                        form.find('#background-image-previewer').attr('src', imageUrl);
                    } else {
                        form.find('.bgImagesPreview img').attr('src', imageUrl);
                        var images = form.find('.bgImagesPreview [data-images]').attr('data-images');
                        if (images) {
                            var imagesArr = images.split(',');
                            imagesArr.push(imageUrl);
                            form.find('.bgImagesPreview [data-images]').attr('data-images', imagesArr.join(','));
                            containerBg.attr('data-images', imagesArr.join(','));
                        }
                    }

                    form.find('.currentMselect').val('');
                });

                form.find('.bgImagesPreview .btn-nav').on('click', function (e) {
                    e.preventDefault();

                    var currentImage = $(this).siblings('p').find('img').attr('src');
                    var images = $(this).siblings('p').attr('data-images');
                    if (images) {
                        var imagesArr = images.split(',');
                        var currIndex = imagesArr.indexOf(currentImage);
                        if ($(this).hasClass('btn-nav-right')) {
                            currIndex++;
                        }
                        if ($(this).hasClass('btn-nav-left')) {
                            currIndex--;
                        }
                        if (currIndex > imagesArr.length - 1) {
                            currIndex = 0;
                        }

                        if (currIndex < 0) {
                            currIndex = imagesArr.length - 1;
                        }

                        $(this).siblings('p').find('img').attr('src', imagesArr[currIndex]);
                    }
                });

                var txtTransition = form.find('.txt-transition');
                txtTransition.on('change', function () {
                    var transition = this.value || '';
                    if (isNaN(transition)) {
                        height = 2;
                    }

                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');

                    containerBg.attr('data-bg-transition', transition);
                });

                form.find('.multiple-background').on('click', function (e) {
                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');
                    var target = contentEditor.getContainerBgElement(container, form);

                    if (this.checked) {
                        form.find('.single-background-settings').addClass('hide');
                        form.find('.multiple-background-settings').removeClass('hide');
                        target.css('background-image', 'url("' + form.find('.bgImagesPreview img').attr('src') + '")');
                    } else {
                        form.find('.single-background-settings').removeClass('hide');
                        form.find('.multiple-background-settings').addClass('hide');
                        target.css('background-image', 'url("' + form.find('#background-image-previewer').attr('src') + '")');
                    }

                    containerBg.attr('data-multiple-bg', this.checked);
                });

                form.find('#background-image-edit').on('click', function (e) {
                    e.preventDefault();

                    form.find('.currentMselect').val('#background-image-edit');
                    form.find('#btnAddImagesBGs').trigger('click');
                });

                form.find('#background-image-delete').on('click', function (e) {
                    e.preventDefault();

                    var container = keditor.getSettingContainer();
                    var target = contentEditor.getContainerBgElement(container, form);
                    target.css('background-image', '');
                    form.find('#background-image-previewer').attr('src', '/static/images/photo_holder.png');
                });

                form.find('.select-bg-for').on('change', function () {
                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');
                    var containerContent = contentEditor.getContainerElement(container, '.container-content-wrapper');

                    if (this.value === 'container-bg') {
                        var style = containerContent.prop('style');
                        containerBg.get(0).style.backgroundColor = style.backgroundColor;
                        containerBg.get(0).style.backgroundImage = style.backgroundImage;
                        containerBg.get(0).style.backgroundRepeat = style.backgroundRepeat;
                        containerBg.get(0).style.backgroundPosition = style.backgroundPosition;
                        containerBg.get(0).style.backgroundSize = style.backgroundSize;
                        containerContent.css('background', '');
                        containerBg.addClass('background-for');
                    } else {
                        var style = containerBg.prop('style');
                        containerContent.get(0).style.backgroundColor = style.backgroundColor;
                        containerContent.get(0).style.backgroundImage = style.backgroundImage;
                        containerContent.get(0).style.backgroundRepeat = style.backgroundRepeat;
                        containerContent.get(0).style.backgroundPosition = style.backgroundPosition;
                        containerContent.get(0).style.backgroundSize = style.backgroundSize;
                        containerBg.css('background', '');
                        containerBg.removeClass('background-for');
                    }
                });

                var txtBgColor = form.find('.txt-bg-color');
                contentEditor.initColorPicker(txtBgColor, function (color) {
                    var container = keditor.getSettingContainer();
                    var target = contentEditor.getContainerBgElement(container, form);
                    target.css('background-color', color);
                });

                form.find('.select-bg-repeat').on('change', function () {
                    var container = keditor.getSettingContainer();
                    var target = contentEditor.getContainerBgElement(container, form);

                    target.css('background-repeat', this.value);
                });

                form.find('.select-bg-size').on('change', function () {
                    var container = keditor.getSettingContainer();
                    var target = contentEditor.getContainerBgElement(container, form);

                    target.css('background-size', this.value);
                });

                form.find('.select-bg-position').on('change', function () {
                    var container = keditor.getSettingContainer();
                    var target = contentEditor.getContainerBgElement(container, form);

                    target.css('background-position', this.value);
                });

                form.find('.txt-extra-class').on('change', function () {
                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');

                    containerBg.attr('class', 'container-bg ' + (containerBg.hasClass('background-for') ? 'background-for' : '') + " " + this.value.trim());
                });

                form.find('.chk-inverse').on('click', function () {
                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');

                    containerBg[this.checked ? 'addClass' : 'removeClass']('container-inverse');
                });

                var win = $(keditor.window);
                var winTimer;
                win.on('resize', function () {
                    clearTimeout(winTimer);
                    winTimer = setTimeout(function () {
                        keditor.body.find('.container-full-height').css('min-height', win.height());
                    }, 250);
                }).trigger('resize');

                var txtHeight = form.find('.txt-height');
                txtHeight.on('change', function () {
                    var height = this.value || '';
                    if (isNaN(height)) {
                        height = '';
                    }

                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');

                    containerBg.css('height', height);
                });
                form.find('.chk-full-height').on('click', function () {
                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');

                    txtHeight.prop('disabled', this.checked).val('');
                    containerBg[this.checked ? 'addClass' : 'removeClass']('container-full-height').css('min-height', this.checked ? win.height() : '');
                });

                form.find('.chk-tile-layout').on('click', function () {
                    var container = keditor.getSettingContainer();
                    var containerContent = container.find('[data-type="container-content"]');
                    var tileClass = form.find('.select-tile-class').val();
                    if (this.checked){
                        containerContent.addClass('container-tile-layout');
                        containerContent.attr('data-tile-class', tileClass);
                        form.find('.select-tile-class').removeProp('disabled');
                        containerContent.find('.keditor-component').each(function () {
                            if (this.className.search(/col-(sm|lg|md)-[2,3,4,6]{1}/ig) != -1){
                                this.className = this.className.replace(/col-(sm|lg|md)-[2,3,4,6]{1}/ig, '')
                                this.className = this.className.trim() + ' ' + tileClass;
                            } else {
                                this.className = this.className.trim() + ' ' + tileClass;
                            }
                        });
                    } else {
                        containerContent.removeClass('container-tile-layout');
                        containerContent.attr('data-tile-class', '');
                        form.find('.select-tile-class').prop('disabled', true);
                        containerContent.find('.keditor-component').each(function () {
                            this.className = this.className.replace(/col-(sm|lg|md)-[2,3,4,6]{1}/ig, '')
                        });
                    }
                });

                form.find('.select-tile-class').on('change', function () {
                    var container = keditor.getSettingContainer();
                    var containerContent = container.find('[data-type="container-content"]');
                    containerContent.attr('data-tile-class', this.value);
                    var classes = containerContent.find('.keditor-component').first().attr('class');
                    if (classes && classes.search(/col-(sm|lg|md)-[2,3,4,6]{1}/ig) != -1){
                        classes = classes.replace(/col-(sm|lg|md)-[2,3,4,6]{1}/ig, '');
                        classes = classes.trim() + ' ' + this.value;
                        containerContent.find('.keditor-component').attr('class', classes);
                    } else {
                        containerContent.find('.keditor-component').addClass(this.value);
                    }
                });

                form.find('.chk-tile-layout-center').on('click', function () {
                    var container = keditor.getSettingContainer();
                    var containerContent = container.find('[data-type="container-content"]');

                    if (this.checked) {
                        containerContent.addClass('tile-layout-center');
                        containerContent.find('.keditor-component').addClass('tile-component-center');
                    } else {
                        containerContent.removeClass('tile-layout-center');
                        containerContent.find('.keditor-component').removeClass('tile-component-center');
                    }
                });

                form.find('.txt-padding').each(function () {
                    var txt = $(this);
                    var styleName = txt.attr('data-style-name');

                    txt.on('change', function () {
                        var value = this.value || '';
                        var container = keditor.getSettingContainer();
                        var containerContent = contentEditor.getContainerElement(container, '.container-content-wrapper').get(0);

                        if (value.trim() === '') {
                            containerContent.style[styleName] = '';
                        } else {
                            if (isNaN(value)) {
                                value = 0;
                                this.value = value;
                            }
                            containerContent.style[styleName] = value + 'px';
                        }
                    });
                });

                form.find('.txt-margin').each(function () {
                    var txt = $(this);
                    var styleName = txt.attr('data-style-name');

                    txt.on('change', function () {
                        var value = this.value || '';
                        var container = keditor.getSettingContainer();
                        var containerContent = contentEditor.getContainerElement(container, '.container-bg').get(0);

                        if (value.trim() === '') {
                            containerContent.style[styleName] = '';
                        } else {
                            if (isNaN(value)) {
                                value = 0;
                                this.value = value;
                            }
                            containerContent.style[styleName] = value + 'px';
                        }
                    });
                });

                form.find('.select-layout').on('change', function () {
                    var container = keditor.getSettingContainer();
                    var containerLayout = contentEditor.getContainerElement(container, '.container-layout');
                    var containerContent = contentEditor.getContainerElement(container, '.container-content-wrapper');

                    containerLayout.removeClass('container container-fluid');
                    containerContent.removeClass('container container-fluid');
                    containerLayout.addClass(this.value);
                });

                form.find('.parallax-enabled').on('click', function () {
                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');
                    var parallaxOptionsWrapper = form.find('.parallax-options-wrapper');
                    var parallaxBtn = form.find('.btn-add-data');

                    if (this.checked) {
                        parallaxOptionsWrapper.css('display', 'block');
                        parallaxBtn.css('display', 'block');
                        containerBg.addClass('parallax-skrollr');
                    } else {
                        parallaxOptionsWrapper.css('display', 'none');
                        form.find('.parallax-options').html('');
                        parallaxBtn.css('display', 'none');
                        containerBg.removeClass('parallax-skrollr');
                        $.each(containerBg.get(0).attributes, function (index, attr) {
                            if (attr.name.indexOf('data-') === 0) {
                                containerBg.removeAttr(attr.name);
                            }
                        });
                    }
                });

                form.find('.btn-add-data').on('click', function (e) {
                    e.preventDefault();

                    contentEditor.addDataTransition(form);
                });

                form.find('.parallax-options-wrapper').on('change', '.txt-data-name, .txt-data-value', function () {
                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');
                    var inputGroup = $(this).closest('.checkbox');
                    var name = inputGroup.find('.txt-data-name').val() || '';
                    name = name.trim();
                    var value = inputGroup.find('.txt-data-value').val() || '';
                    value = value.trim();

                    if (name !== '' && value !== '') {
                        containerBg.attr('data-' + name, value);
                    } else {
                        containerBg.removeAttr('data-' + name);
                    }
                });

                form.find('.select-dock-type').on('change', function () {
                    var container = keditor.getSettingContainer();
                    var containerBg = contentEditor.getContainerElement(container, '.container-bg');

                    containerBg.removeClass('navbar-fixed-top navbar-fixed-bottom navbar-fixed-middle');
                    if (this.value !== '') {
                        containerBg.addClass('navbar-fixed-' + this.value);
                    }
                });

                // ===============================================================================
                // Settings for grid
                // ===============================================================================
                form.on('change', '.select-row-size', function () {
                    var container = keditor.getSettingContainer();
                    var row = contentEditor.getContainerElement(container, '.row');
                    row.removeClass('row-sm row-no-gutter');
                    row.addClass(this.value);
                });

                form.on('change', '.txt-extra-class-column', function () {
                    var txt = $(this);
                    var index = txt.attr('data-index');
                    var container = keditor.getSettingContainer();
                    var targetContainerContent = contentEditor.getContainerElement(container, '[data-type=container-content]').eq(+index);
                    var originClasses = contentEditor.getContainerContentClasses(targetContainerContent)[0];

                    targetContainerContent.attr('class', originClasses + ' ' + this.value);
                });

                form.on('click', '.chk-inverse-column', function () {
                    var chk = $(this);
                    var index = chk.attr('data-index');
                    var container = keditor.getSettingContainer();
                    var targetContainerContent = contentEditor.getContainerElement(container, '[data-type=container-content]').eq(+index);

                    targetContainerContent[this.checked ? 'addClass' : 'removeClass']('col-inverse');
                });

                // ===============================================================================
                // Settings for tab
                // ===============================================================================
                var tabsList = form.find('.tabs-list');
                form.find('.btn-add-tab').on('click', function (e) {
                    e.preventDefault();

                    var container = keditor.getSettingContainer();
                    var tabbable = container.find('.tabbable');

                    tabsList.append(
                        '<p class="input-group input-group-sm tab-item">' +
                        '    <input type="text" class="form-control txt-tab-name" value="New tab" placeholder="Tab name" />' +
                        '    <span class="input-group-btn">' +
                        '        <a href="#" class="btn btn-danger btn-delete-tab"><i class="fa fa-times"></i></a>' +
                        '    </span>' +
                        '</p>'
                    );

                    var newTabId = keditor.generateId('tab');
                    tabbable.find('.nav-tabs').append('<li><a href="#' + newTabId + '" data-toggle="tab">New tab</a></li>');
                    tabbable.find('.tab-content').append(
                        '<div class="tab-pane" id="' + newTabId + '">' +
                        '    <div data-type="container-content" class="clearfix"></div>' +
                        '</div>'
                    );

                    var newContainerContent = $('#' + newTabId).find('[data-type="container-content"]');
                    var contentArea = container.closest('.keditor-content-area');
                    var isNested = container.closest('[data-type="container-content"]').length > 0;

                    keditor.initContainerContent(contentArea, container, newContainerContent, isNested);
                });

                form.on('change', '.txt-tab-name', function () {
                    var txt = $(this);
                    var tabItem = txt.closest('.tab-item');
                    var tabIndex = tabItem.index();

                    var container = keditor.getSettingContainer();
                    var tabbable = container.find('.tabbable');

                    tabbable.find('.nav-tabs').children().eq(tabIndex).find('a').html(txt.val());
                });

                form.on('click', '.btn-delete-tab', function (e) {
                    e.preventDefault();

                    var totalTab = tabsList.find('.tab-item').length;

                    if (totalTab === 1) {
                        alert('You can not delete last tab');

                        return;
                    }

                    if (confirm('Are you sure you want to delete this tab? This action can not be undo!')) {
                        var tabItem = $(this).closest('.tab-item');
                        var tabIndex = tabItem.index();
                        var container = keditor.getSettingContainer();
                        var tabbable = container.find('.tabbable');

                        tabbable.find('.nav-tabs').children().eq(tabIndex).remove();
                        tabbable.find('.tab-pane').eq(tabIndex).remove();
                        tabItem.remove();
                    }
                });
            }
        });
    };

    contentEditor.addDataTransition = function (form, name, value) {
        flog('[jquery.contentEditor] addDataTransition', form, name, value);

        name = name || '';
        value = value || '';

        form.find('.parallax-options').append(
            '<div class="checkbox">' +
            '    <div class="input-group input-group-sm">' +
            '        <span class="input-group-addon"><span style="display: inline-block; width: 40px;">Name</span></span>' +
            '        <input type="text" value="' + name + '" class="txt-data-name form-control" />' +
            '    </div>' +
            '    <div class="input-group input-group-sm">' +
            '        <span class="input-group-addon"><span style="display: inline-block; width: 40px;">Value</span></span>' +
            '        <input type="text" value="' + value + '" class="txt-data-value form-control" />' +
            '    </div>' +
            '</div>'
        );
    };

    contentEditor.showContainerSettings = function (form, container, keditor) {
        flog('[jquery.contentEditor] showContainerSettings', form, container, keditor);

        var containerBg = contentEditor.getContainerElement(container, '.container-bg');
        var containerLayout = contentEditor.getContainerElement(container, '.container-layout');
        var containerContent = contentEditor.getContainerElement(container, '.container-content-wrapper');
        form.find('.parallax-options').html('');

        if (containerLayout.length === 0) {
            var layoutClass = '';
            if (containerContent.hasClass('container')) {
                layoutClass = 'container';
            } else if (containerContent.hasClass('container-fluid')) {
                layoutClass = 'container-fluid';
            }
            containerContent.wrap('<div class="container-layout ' + layoutClass + '"></div>');
            containerContent.removeClass('container container-fluid');
            containerLayout = contentEditor.getContainerElement(container, '.container-layout');
        }

        if (containerBg.hasClass('parallax-skrollr')) {
            form.find('.parallax-enabled').prop('checked', true);
            form.find('.parallax-options-wrapper').css('display', 'block');
            form.find('.btn-add-data').css('display', 'block');

            var dataAttributes = keditor.getDataAttributes(containerBg, null, false);
            for (var name in dataAttributes) {
                contentEditor.addDataTransition(form, name.replace('data-', ''), dataAttributes[name]);
            }
        } else {
            form.find('.parallax-enabled').prop('checked', false);
            form.find('.parallax-options-wrapper').css('display', 'none');
            form.find('.btn-add-data').css('display', 'none');
        }

        var imageUrl;
        var bgTarget;
        var bgImageBg = containerBg.get(0).style.backgroundImage;
        var bgImageContent = containerContent.get(0).style.backgroundImage;
        if (containerBg.hasClass('background-for')) {
            imageUrl = bgImageBg;
            bgTarget = containerBg;
            form.find('.select-bg-for').val('container-bg');
        } else {
            imageUrl = bgImageContent;
            bgTarget = containerContent;
            form.find('.select-bg-for').val('container-content-wrapper');
        }

        imageUrl = imageUrl ? imageUrl.replace(/^url\(['"]+(.+)['"]+\)$/, '$1') : '';
        form.find('#background-image-previewer').attr('src', imageUrl || '/static/images/photo_holder.png');

        form.find('.select-bg-repeat').val(bgTarget.get(0).style.backgroundRepeat || 'repeat');
        form.find('.select-bg-position').val(bgTarget.get(0).style.backgroundPosition || '0% 0%');
        form.find('.select-bg-size').val(bgTarget.get(0).style.backgroundSize || 'auto');
        form.find('.txt-bg-color').val(bgTarget.get(0).style.backgroundColor || '').trigger('change');

        var layout = '';
        if (containerLayout.hasClass('container')) {
            layout = 'container';
        } else if (containerLayout.hasClass('container-fluid')) {
            layout = 'container-fluid';
        }
        form.find('.select-layout').val(layout);

        var chkTileLayout = form.find('.chk-tile-layout');
        var chkTileCenter = form.find('.chk-tile-layout-center');
        var selectTileClass = form.find('.select-tile-class');
        var containerContent = containerBg.find('[data-type="container-content"]');
        var tileClass = containerContent.attr('data-tile-class') || selectTileClass.val();
        if (containerContent.hasClass('container-tile-layout')) {
            chkTileLayout.prop('checked', true);
            selectTileClass.removeProp('disabled').val(tileClass);
        } else {
            chkTileLayout.prop('checked', false);
            selectTileClass.prop('disabled', true);
        }
        if (containerContent.hasClass('tile-layout-center')){
            chkTileCenter.prop('checked', true);
        } else {
            chkTileCenter.prop('checked', false);
        }

        form.find('.txt-padding').each(function () {
            var txt = $(this);
            var styleName = txt.attr('data-style-name');

            txt.val((containerContent.get(0).style[styleName] || '').replace('px', ''));
        });

        form.find('.txt-margin').each(function () {
            var txt = $(this);
            var styleName = txt.attr('data-style-name');

            txt.val((containerBg.get(0).style[styleName] || '').replace('px', ''));
        });

        var txtHeight = form.find('.txt-height');
        var chkFullHeight = form.find('.chk-full-height');
        if (containerBg.hasClass('container-full-height')) {
            txtHeight.prop('disabled', true).val('');
            chkFullHeight.prop('checked', true);
        } else {
            txtHeight.prop('disabled', false).val(containerBg.css('height').replace('px', '') || '');
            chkFullHeight.prop('checked', false);
        }

        var selectGroups = form.find('.select-groups');
        var selectGroupsItems = selectGroups.find('input[type=checkbox]');
        var selectedGroups = containerBg.attr('data-groups') || '';
        var avaiability = containerBg.attr('data-available') || 'available';
        var isAnonymous = selectedGroups === 'Anonymous';
        selectedGroups = selectedGroups ? selectedGroups.split(',') : [];

        if (selectedGroups.length > 0) {
            selectGroupsItems.filter('[value=Anonymous]')
                .prop('disabled', !isAnonymous)
                .parent()[!isAnonymous ? 'addClass' : 'removeClass']('text-muted');

            selectGroupsItems.not('[value=Anonymous]').each(function () {
                var target = $(this);

                target
                    .prop('disabled', isAnonymous)
                    .parent()[isAnonymous ? 'addClass' : 'removeClass']('text-muted');
            })
        } else {
            selectGroupsItems.prop('disabled', false).parent().removeClass('text-muted');
        }
        selectGroupsItems.prop('checked', false);
        $.each(selectedGroups, function (i, group) {
            selectGroupsItems.filter('[value="' + group + '"]').prop('checked', true);
        });

        var expPath = containerBg.data("experiment");
        var txtExperiment = form.find('.select-experiment');
        txtExperiment.val(expPath);

        var availabilitySelect = form.find(".select-availability");
        availabilitySelect.val(avaiability);

        var visRulesExpr = containerBg.data("expr");
        var visRules = form.find(".visible-rules");
        visRules.val(visRulesExpr);

        form.find('.txt-extra-class').val(containerBg.attr('class').replace('container-bg', '').replace('background-for', '').trim());
        form.find('.chk-inverse').prop('checked', containerBg.hasClass('container-inverse'));

        var dockType = '';
        if (containerBg.hasClass('navbar-fixed-top')) {
            dockType = 'top';
        } else if (containerBg.hasClass('navbar-fixed-middle')) {
            dockType = 'middle';
        } else if (containerBg.hasClass('navbar-fixed-bottom')) {
            dockType = 'bottom';
        }
        form.find('.select-dock-type').val(dockType);

        var isMultiBg = containerBg.attr('data-multiple-bg') == 'true';
        if (isMultiBg) {
            form.find('.multiple-background-settings').removeClass('hide');
            form.find('.single-background-settings').addClass('hide');
        } else {
            form.find('.multiple-background-settings').addClass('hide');
            form.find('.single-background-settings').removeClass('hide');
        }

        var imagesStr = containerBg.attr('data-images');
        if (imagesStr) {
            var imagesArr = imagesStr.split(',');
            form.find('.bgImagesPreview img').attr('src', imagesArr[0]);
            form.find('.bgImagesPreview p').attr('data-images', imagesArr.join(','));
        }

        form.find('.multiple-background').prop('checked', isMultiBg);
        var transition = containerBg.attr('data-bg-transition');
        form.find('.txt-transition').val(transition || 2);

        var row = contentEditor.getContainerElement(container, '.row');
        var rowSizes = ['row-sm', 'row-no-gutter'];
        var rowSize = '';
        $.each(rowSizes, function (i, value) {
            if (row.hasClass(value)) {
                rowSize = value;

                return false;
            }
        });
        form.find('.select-row-size').val(rowSize);

        var tabbable = container.find('.tabbable');
        if (tabbable.length > 0) {
            form.find('.container-tab-settings').css('display', 'block');
            form.find('.container-grid-settings').css('display', 'none');
            contentEditor.initTabListForContainer(form, container, keditor);
        } else {
            form.find('.container-tab-settings').css('display', 'none');
            form.find('.container-grid-settings').css('display', 'block');
            contentEditor.buildExtraClassForColumns(form, container, keditor);
        }
    };

    contentEditor.initTabListForContainer = function (form, container, keditor) {
        flog('[jquery.contentEditor] initTabListForContainer', form, container, keditor);

        var tabsList = form.find('.tabs-list');
        tabsList.html('');

        var tabsStr = '';
        var tabbble = container.find('.tabbable');
        tabbble.find('.nav-tabs li a').each(function () {
            tabsStr += '<p class="input-group input-group-sm tab-item">';
            tabsStr += '    <input type="text" class="form-control txt-tab-name" value="' + $(this).html().trim() + '" placeholder="Tab name" />';
            tabsStr += '    <span class="input-group-btn">';
            tabsStr += '        <a href="#" class="btn btn-danger btn-delete-tab"><i class="fa fa-times"></i></a>';
            tabsStr += '    </span>';
            tabsStr += '</p>';
        });
        tabsList.html(tabsStr);
    };

    contentEditor.getContainerContentClasses = function (containerContent) {
        flog('[jquery.contentEditor] getContainerContentClasses', containerContent);

        var classes = containerContent.attr('class').split(' ');
        var customClasses = [];
        var originClasses = [];

        for (var i = 0; i < classes.length; i++) {
            var _class = classes[i];

            if (_class) {
                if (_class.indexOf('col-') !== 0 && (' keditor-container-content ui-droppable ui-sortable ').indexOf(' ' + _class + ' ') === -1) {
                    customClasses.push(_class);
                } else {
                    originClasses.push(_class);
                }
            }
        }

        return [originClasses.join(' '), customClasses.join(' ')];
    };

    contentEditor.buildExtraClassForColumns = function (form, container, keditor) {
        flog('[jquery.contentEditor] buildExtraClassForColumns', form, container, keditor);
        var htmlStr = '';

        contentEditor.getContainerElement(container, '[data-type=container-content]').each(function (index) {
            var containerContent = $(this);
            var customClasses = contentEditor.getContainerContentClasses(containerContent)[1];
            var isInverse = containerContent.hasClass('col-inverse');

            htmlStr += '<div class="clearfix">';
            if (index !== 0) {
                htmlStr += '    <br />';
            }
            htmlStr += '    Column #' + (index + 1);
            htmlStr += '    <input type="text" class="form-control txt-extra-class-column" placeholder="Extra class" data-index="' + index + '" value="' + customClasses + '" />';
            htmlStr += '    <label class="checkbox-inline">';
            htmlStr += '        <input type="checkbox" class="chk-inverse-column" data-index="' + index + '" ' + (isInverse ? 'checked="checked"' : '') + ' /> Is inverse';
            htmlStr += '    </label>';
            htmlStr += '</div>';
        });

        form.find('.columns-setting').html(htmlStr);
    };

    contentEditor.toMenuData = function (ol, list) {
        flog('[jquery.contentEditor] toMenuData', ol, list);

        var parentId = ol.attr('data-id');

        ol.find('> li').each(function (i) {
            var li = $(this);

            flog('[jquery.contentEditor] toMenuData - item', li);

            var menuItem = li.children('.menuItem');
            var itemId = menuItem.attr('data-id');
            var itemHref = menuItem.attr('data-href');
            var itemText = menuItem.children('.menuItemText').text().trim();
            var cssClass = menuItem.children('.menuItemIcon').find('i').attr('class');
            var isCustom = itemId.startsWith('menu-custom-'); // different format to native menu items
            var hidden = menuItem.attr('data-hidden');

            flog();

            list.push({
                id: itemId,
                text: itemText,
                href: itemHref,
                ordering: i,
                parentId: parentId,
                custom: isCustom,
                hidden: hidden,
                cssClass: cssClass
            });

            contentEditor.toMenuData(li.children('.menuList'), list);
        });
    };

    contentEditor.generateMenuItemHtml = function (menuItem, items, isRootChild) {
        var itemHtml = '';
        itemHtml += '<li>';
        itemHtml += '    <div data-id="' + menuItem.id + '" data-href="' + (menuItem.href || '') + '" data-hidden="' + (menuItem.hidden || 'false') + '" class="menuItem">';
        itemHtml += '        <span class="btn-group btn-group-xs small">';
        itemHtml += '            <a class="btn btn-success btnAddMenuItem btn-xs" href="#">';
        itemHtml += '                <span class="fa fa-plus small"></span>';
        itemHtml += '            </a>';
        itemHtml += '            <a class="btn btn-info btnSortMenuItem btn-xs" href="#">';
        itemHtml += '                <span class="fa fa-sort small"></span>';
        itemHtml += '            </a>';
        itemHtml += '            <a class="btn btn-primary btnEditMenuItem btn-xs" href="#">';
        itemHtml += '                <span class="fa fa-pencil small"></span>';
        itemHtml += '            </a>';
        itemHtml += '        </span>';
        itemHtml += '        <span class="menuItemIcon"><i class="' + (menuItem.cssClass || '') + '"></i></span>';
        itemHtml += '        <span class="menuItemText">' + (menuItem.text || '') + '</span>';
        itemHtml += '    </div>';
        itemHtml += '    <ol class="menuList" data-id="' + menuItem.id + '">';

        if (isRootChild) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].parentId === menuItem.id) {
                    itemHtml += contentEditor.generateMenuItemHtml(items[i], items);
                }
            }
        }

        itemHtml += '    </ol>';
        itemHtml += '</li>';

        return itemHtml;
    };

    contentEditor.initMenuEditor = function (form, keditor) {
        flog('[jquery.contentEditor] initMenuEditor', form, keditor);

        var menuItemEditor = form.find('.editMenuItem');
        var menuEditor = form.find('.menuEditor');
        var editItem = null;

        var groupsStr = '';
        $.each(keditor.options.allGroups, function (name, title) {
            groupsStr += '<option value="' + name + '">Visible only for "' + title + '"</option>';
        });
        menuItemEditor.find('[name=hidden]').append(groupsStr);

        $.getStyleOnce('/static/bootstrap-iconpicker/1.7.0/css/bootstrap-iconpicker.min.css');
        $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
            $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                menuItemEditor.find('.btn-menu-icon').iconpicker({
                    iconset: 'fontawesome',
                    cols: 10,
                    rows: 4,
                    placement: 'left'
                });
            });
        });

        var tree = form.find('.menuTree ol').not('.rootMenuList');
        tree.sortable({
            handle: '.btnSortMenuItem',
            items: '> li',
            axis: 'y',
            tolerance: 'pointer'
        });

        form.on('click', '.btnAddMenuItem', function (e) {
            e.preventDefault();

            var li = $(this).closest('li');
            var ol = li.children('ol');
            var isRootChild = li.hasClass('rootMenuItem');
            var btnAddHtml = '';

            if (isRootChild) {
                btnAddHtml += '<a class="btn btn-success btnAddMenuItem btn-xs" href="#">';
                btnAddHtml += '     <span class="fa fa-plus small"></span>';
                btnAddHtml += '</a>';
            }

            var newId = 'menu-custom-' + Math.floor((Math.random() * 10000));
            ol.append(
                '<li>' +
                '   <div data-id="' + newId + '" class="menuItem">' +
                '       <span class="btn-group btn-group-xs small">' + btnAddHtml +
                '           <a class="btn btn-info btnSortMenuItem btn-xs" href="#">' +
                '               <span class="fa fa-sort small"></span>' +
                '           </a>' +
                '           <a class="btn btn-primary btnEditMenuItem btn-xs" href="#">' +
                '               <span class="fa fa-pencil small"></span>' +
                '           </a>' +
                '       </span>' +
                '       <span class="menuItemIcon"><i class=""></i></span>' +
                '       <span class="menuItemText">Enter text</span>' +
                '   </div>' +
                '   <ol class="menuList" data-id="' + newId + '"></ol>' +
                '</li>'
            );

            try {
                tree.sortable('destroy');
            } catch (e) {
            }
            tree.sortable({
                handle: '.btnSortMenuItem',
                items: '> li',
                axis: 'y',
                tolerance: 'pointer'
            });
        });

        form.on('click', '.btnEditMenuItem', function (e) {
            e.preventDefault();

            var btn = $(this);
            var menuItem = btn.closest('.menuItem');
            editItem = menuItem;

            var id = menuItem.attr('data-id');
            var text = menuItem.find('.menuItemText').text().trim();
            var cssClass = menuItem.find('.menuItemIcon i').attr('class') || '';
            cssClass = cssClass.replace('fa', '').trim();
            var href = menuItem.attr('data-href');
            var hidden = menuItem.attr('data-hidden') || 'false';

            menuItemEditor.find('input[name=href]').val(href);
            menuItemEditor.find('input[name=text]').val(text);
            var btnIcon = menuItemEditor.find('.btn-menu-icon');
            btnIcon.iconpicker('setIcon', cssClass || 'fa-');
            if (!cssClass) {
                btnIcon.find('i').attr('class', '');
                btnIcon.find('input').val('');
            }
            menuItemEditor.find('[name=hidden]').val(hidden)

            var deleteBtn = menuItemEditor.find('.editMenuItemDelete');
            if (id.startsWith('menu-custom-')) {
                deleteBtn.show();
            } else {
                deleteBtn.hide();
            }

            menuItemEditor.fshow();
            menuEditor.fhide();
        });

        form.on('click', '.editMenuItemOk', function (e) {
            e.preventDefault();

            var href = menuItemEditor.find('input[name=href]').val();
            var text = menuItemEditor.find('input[name=text]').val();
            text = text.trim();
            var hidden = menuItemEditor.find('[name=hidden]').val();
            var icon = menuItemEditor.find('.btn-menu-icon i').attr('class') || '';

            editItem.attr('data-href', href);
            editItem.attr('data-hidden', hidden);
            editItem.find('.menuItemText').text(text);
            editItem.find('.menuItemIcon i').attr('class', icon);
            editItem = null;

            menuItemEditor.fhide();
            menuEditor.fshow();
        });

        form.on('click', '.editMenuItemDelete', function (e) {
            e.preventDefault();

            editItem.closest('li').remove();

            menuItemEditor.fhide();
            menuEditor.fshow();
        });

        form.on('click', '.editMenuItemCancel', function (e) {
            e.preventDefault();
            editItem = null;
            menuItemEditor.fhide();
            menuEditor.fshow();
        });

        form.on('click', '.saveMenu', function (e) {
            e.preventDefault();

            var topOl = $('.menuTree ol.rootMenuList');
            var list = [];
            contentEditor.toMenuData(topOl, list);
            var menuJson = JSON.stringify({
                items: list
            }, null, 4);


            $.ajax({
                url: '/theme/menu.json',
                type: 'PUT',
                data: menuJson,
                success: function () {
                    Msg.info('Saved menu');
                    var component = keditor.getSettingComponent();
                    var dynamicElement = component.find('[data-dynamic-href]');
                    keditor.initDynamicContent(dynamicElement);
                },
                error: function (e) {
                    Msg.error(e.status + ': ' + e.statusText);
                }
            });
        });
    };

    contentEditor.initDefaultMenuControls = function (form, keditor) {
        flog('[jquery.contentEditor] initDefaultMenuControls', form, keditor);

        form.find('.menuList .menuList .menuList .btnAddMenuItem').remove();

        form.find('.navbar-layout').on('change', function () {
            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-navbar-layout', this.value);
            keditor.initDynamicContent(dynamicElement);
        });

        form.find('.navbar-style').on('change', function () {
            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-navbar-style', this.value);
            keditor.initDynamicContent(dynamicElement);
        });

        form.find('.logo-padding').on('change', function () {
            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-logopadding', this.value);
            keditor.initDynamicContent(dynamicElement);
        });

        initMSelectImage(form.find('.logo-edit'), keditor, function (url, relativeUrl, fileType, hash, isAsset) {
            var imageUrl = isAsset ? url : '/_hashes/files/' + hash;
            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-logo', imageUrl);
            keditor.initDynamicContent(dynamicElement);
            form.find('.logo-previewer').attr('src', imageUrl);
        });
        form.find('.logo-delete').on('click', function (e) {
            e.preventDefault();

            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-logo', this.value);
            keditor.initDynamicContent(dynamicElement);
            form.find('.logo-previewer').attr('src', '/static/images/photo_holder.png');
        });

        form.on('change', '.cbb-display-menu-item', function () {
            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-display-menu-item', this.value);
            keditor.initDynamicContent(dynamicElement);
        });

        form.on('click', '.chk-show-user-menu', function () {
            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-show-user-menu', this.checked);
            keditor.initDynamicContent(dynamicElement);
        });

        form.on('click', '.chk-show-org-selector', function () {
            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-show-org-selector', this.checked);
            keditor.initDynamicContent(dynamicElement);
        });

        form.on('click', '.chk-show-lang-selector', function () {
            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-show-lang-selector', this.checked);
            keditor.initDynamicContent(dynamicElement);
        });

        form.on('click', '.chk-show-search', function () {
            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-show-search', this.checked);
            keditor.initDynamicContent(dynamicElement);
        });

        form.on('click', '.chk-inverse-menu', function () {
            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-inverse-menu', this.checked);
            keditor.initDynamicContent(dynamicElement);
        });

        form.on('click', '.chk-show-sub-menu-on-hover', function () {
            var component = keditor.getSettingComponent();
            var dynamicElement = component.find('[data-dynamic-href]');

            component.attr('data-show-sub-menu-on-hover', this.checked);
            keditor.initDynamicContent(dynamicElement);
        });

        var menuTemplate = $('<div />').html($('#menuTreeTemplate').html());
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/theme/menu.json',
            success: function (resp) {
                flog('[jquery.contentEditor] Menu item data', resp);

                var items = resp.items;
                items.splice(0, 1);
                for (var i = 0; i < items.length; i++) {
                    menuTemplate.find('[data-id="' + items[i].id + '"]').attr('data-hidden', items[i].hidden);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('[jquery.contentEditor] Error when getting menu data item', jqXHR, textStatus, errorThrown);
            },
            complete: function () {
                $('.menuList.rootMenuList').html(menuTemplate.html());
                contentEditor.initMenuEditor(form, keditor);
            }
        });
    };

    contentEditor.showDefaultMenuControls = function (form, component, keditor) {
        flog('[jquery.contentEditor] showDefaultMenuControls', form, component, keditor);

        var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
        var imageUrl = dataAttributes['data-logo'];
        form.find('.logo-previewer').attr('src', imageUrl ? imageUrl : '/static/images/photo_holder.png');
        form.find('[name=logo]').val(dataAttributes['data-logo']);

        form.find('.cbb-display-menu-item').val(dataAttributes['data-display-menu-item'] || 'text');

        form.find('.chk-show-user-menu').prop('checked', dataAttributes['data-show-user-menu'] === 'true');
        form.find('.chk-show-org-selector').prop('checked', dataAttributes['data-show-org-selector'] === 'true');
        form.find('.chk-show-lang-selector').prop('checked', dataAttributes['data-show-lang-selector'] === 'true');
        form.find('.chk-inverse-menu').prop('checked', dataAttributes['data-inverse-menu'] === 'true');
        form.find('.chk-show-search').prop('checked', dataAttributes['data-show-search'] === 'true');
        form.find('.chk-show-sub-menu-on-hover').prop('checked', dataAttributes['data-show-sub-menu-on-hover'] === 'true');

        form.find('.navbar-layout').val(dataAttributes['data-navbar-layout'] || 'container-fluid');
        form.find('.logo-padding').val(dataAttributes['data-logopadding'] || '');
        form.find('.navbar-style').val(dataAttributes['data-navbar-style'] || 'navbar-default');

        var tree = $('.menuTree ol.menuList').not('.rootMenuList');

        try {
            tree.sortable('destroy');
        } catch (e) {
        }
        tree.sortable({
            handle: '.btnSortMenuItem',
            items: '> li',
            axis: 'y',
            tolerance: 'pointer'
        });
    };

    contentEditor.rgb2Hex = function (value) {
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

    contentEditor.initSimpleColorPicker = function (target, onChange) {
        flog('[jquery.contentEditor] initSimpleColorPicker', target);

        target.wrap('<div class="input-group"></div>');

        var previewer = $('<span class="input-group-addon" style="color: transparent;"><i class="fa fa-stop"></i></span>');
        target.before(previewer);
        previewer.css('color', target.val() || 'transparent');

        var getColor = function (color) {
            if (color) {
                previewer.css('color', color);
                color = contentEditor.rgb2Hex(previewer.css('color'));
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

    contentEditor.initColorPicker = function (target, onChange) {
        flog('[jquery.contentEditor] initColorPicker', target);

        target.wrap('<div class="input-group"></div>');
        target.before('<span class="input-group-addon"><i class="fa fa-stop" style="color: transparent;"></i></span>');

        var previewer = target.prev().find('i');

        target.colorpicker({
            format: 'hex',
            container: target.parent(),
            component: '.input-group-addon',
            align: 'left',
            color: target.val(),
            colorSelectors: {
                'transparent': 'transparent'
            }
        }).on('changeColor.colorpicker', function (e) {
            var colorHex = e.color.toHex();

            if (!target.val() || target.val().trim().length === 0) {
                colorHex = '';
                previewer.css('color', 'transparent');
            } else {
                previewer.css('color', colorHex);
            }

            if (typeof onChange === 'function') {
                onChange.call(target, colorHex);
            }
        });
    };

    contentEditor.renderContainerForOldContent = function (content) {
        var newContainer = $(
            '<section>' +
            '    <div class="container-bg background-for">' +
            '        <div class="container-layout container-fluid">' +
            '            <div class="container-content-wrapper">' +
            '                <div class="row">' +
            '                    <div class="col-sm-12" data-type="container-content">' +
            '                        <section data-type="component-text">' +
            '                            <div class="keditor-component-text-content">' +
            '                                <div class="keditor-component-text-content-inner clearfix"></div>' +
            '                            </div>' +
            '                        </section>' +
            '                    </div>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</section>'
        );
        newContainer.find('.keditor-component-text-content-inner').html(content);

        return newContainer;
    };

    var methods = {
        init: function (options) {
            options = $.extend({}, contentEditor.DEFAULTS, options);

            return $(this).each(function () {
                var target = $(this);

                flog('[jquery.contentEditor] Initializing...', target, options);

                if (target.data('contentEditorOptions')) {
                    flog('[jquery.contentEditor] Content Editor is already initialized', target);
                    return target;
                }

                contentEditor.checkDependencies(options, function () {
                    CKEDITOR.dtd.$removeEmpty['span'] = false;
                    target.keditor({
                        niceScrollEnabled: false,
                        ckeditorOptions: {
                            skin: 'bootstrapck',
                            allowedContent: true,
                            bodyId: 'editor',
                            contentsCss: window.themeCssFiles,
                            templates_files: [templatesPath],
                            templates_replaceContent: false,
                            toolbarGroups: toolbarSets['Default'],
                            extraPlugins: 'widget,lineutils,fontawesome,embed_video,fuse-image,kcode,sourcedialog,modal,rating',
                            removePlugins: standardRemovePlugins + ',autogrow,magicline,showblocks',
                            removeButtons: 'Find,Replace,SelectAll,Scayt,FontSize,Font',
                            enterMode: CKEDITOR.ENTER_P,
                            forceEnterMode: true,
                            filebrowserBrowseUrl: '/static/fckfilemanager/browser/default/browser.html?Type=Image&Connector=/fck_connector.html',
                            filebrowserUploadUrl: '/uploader/upload',
                            format_tags: 'p;h1;h2;h3;h4;h5;h6', // removed p2
                            minimumChangeMilliseconds: 100,
                            stylesSet: 'myStyles:' + stylesPath,
                            basePath: options.basePath,
                            pagePath: options.pagePath
                        },
                        tabContainersText: '<i class="fa fa-columns"></i>',
                        tabComponentsText: '<i class="fa fa-files-o"></i>',
                        snippetsUrl: options.snippetsUrl,
                        tabTooltipEnabled: false,
                        snippetsTooltipEnabled: false,
                        onContentChanged: function (e, contentArea) {
                            var content = contentArea.html() || '';

                            if (content.trim() === '') {
                                contentArea.addClass('empty');
                            } else {
                                contentArea.removeClass('empty');
                            }

                            if (!$(document.body).hasClass('content-changed')) {
                                $(document.body).addClass('content-changed');
                            }
                        },
                        onBeforeInitContentArea: function (contentArea) {
                            // Fix html structure: https://github.com/Kademi/kademi-dev/issues/4241
                            contentArea.find('[data-type^=component]').each(function () {
                                var component = $(this);
                                var componentContent = component.find('.keditor-component-content');

                                if (componentContent.length > 1) {
                                    flog('Component has incorrect HTML structure. Prepare structure');
                                    component.html(componentContent.last().html());
                                }
                            });
                        },
                        onInitContentArea: function (contentArea) {
                            var content = contentArea.html() || '';

                            if (content === '') {
                                contentArea.addClass('empty');
                            }

                            var oldContent = contentArea.children().not('section');
                            var newContainers = [];
                            if (oldContent.length > 0) {
                                flog('Wrap all contents which are not container into a text component inside 1 col container');
                                var newContainer = contentEditor.renderContainerForOldContent(oldContent);
                                contentArea.append(newContainer);
                                newContainers.push(newContainer);
                            }

                            var textNodes = contentArea.contents().filter(function () {
                                return this.nodeType === 3 && (this.nodeValue || '').trim() !== '';
                            });
                            if (textNodes.length > 0) {
                                flog('Wrap all text nodes into a text component inside 1 col container');
                                var newContainer = contentEditor.renderContainerForOldContent(textNodes);
                                contentArea.append(newContainer);
                                newContainers.push(newContainer);
                            }

                            return newContainers;
                        },
                        containerSettingEnabled: true,
                        containerSettingInitFunction: contentEditor.initContainerSetting,
                        containerSettingShowFunction: contentEditor.showContainerSettings,
                        allGroups: options.allGroups,
                        iframeMode: options.iframeMode,
                        contentStyles: options.contentStyles,
                        basePath: options.basePath,
                        pagePath: options.pagePath,
                        onReady: function () {
                            if (typeof options.onReady === 'function') {
                                options.onReady.call(null);
                            }
                        },
                        onBeforeDynamicContentLoad: options.isCustomApp ? function (dynamicElement) {
                            flog('Force dynamic href begins with "/" for custom app pages');
                            var dynamicHref = dynamicElement.attr('data-dynamic-href');
                            if (dynamicHref.indexOf('/') !== 0) {
                                dynamicHref = '/' + dynamicHref;
                            }
                            dynamicElement.attr('data-dynamic-href', dynamicHref)
                        } : null,
                        onContainerChanged: function (event, changedContainer) {
                            changedContainer.find('[data-type="container-content"]').each(function () {
                                var containerContent = $(this);

                                var tileComponents = containerContent.find('.keditor-component').filter(function () {
                                    var type = $(this).attr('data-type');

                                    return type.indexOf('Tile') !== -1;
                                });

                                if (tileComponents.length > 0) {
                                    flog('Container content contains tile component', tileComponents);

                                    if (!containerContent.hasClass('row')) {
                                        flog('Add div.row');

                                        var colClasses = [];
                                        $.each(containerContent.attr('class').split(' '), function (i, className) {
                                            if (className && className.indexOf('col-') !== -1) {
                                                colClasses.push(className);
                                            }
                                        });

                                        colClasses = colClasses.join(' ');
                                        containerContent.removeClass(colClasses).addClass('row');
                                        containerContent.wrap('<div class="' + colClasses + '"></div>');
                                    }
                                } else {
                                    flog('Container content does not contains tile component');

                                    var parent = containerContent.parent();
                                    if (containerContent.hasClass('row')) {
                                        flog('Remove div.row');
                                        containerContent.addClass(parent.attr('class')).removeClass('row').unwrap();
                                    }
                                }
                            });
                        }
                    });
                });

                target.data('contentEditorOptions', options);
            });
        },

        getContent: function () {
            return $(this).keditor('getContent', false);
        }
    };

    $.contentEditor = contentEditor;

})(jQuery);