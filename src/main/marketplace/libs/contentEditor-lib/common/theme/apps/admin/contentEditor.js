var win = $(window);
var postMessageUrl;
var postMessageData;

$(document).on({
    'show.bs.modal': function () {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    },
    'hidden.bs.modal': function () {
        $('.modal:visible').length && $(document.body).addClass('modal-open');
    }
}, '.modal');

function initContentEditorPage(options) {
    flog('initContentEditorPage fileName=' + options.fileName);

    initKEditor(options);
    initSaving(options.fileName, options.originalUrl);
    initPropertiesModal();
    initPageBgModal();
    initNavbar();

    // Confirm before closed tab or window
    window.onbeforeunload = function (e) {
        if ($(document.body).hasClass('content-changed')) {
            e.returnValue = 'Are you sure you would like to leave the editor? You will lose any unsaved changes';
        }
    };

    if (options.originalUrl) {
        initIframeMode(options);
    }
}

function initNavbar() {
    var nav = $('.content-editor-nav');

    $('.content-editor-toggle').on('click', function (e) {
        e.preventDefault();

        nav.toggleClass('closed');
        this.setAttribute('title', nav.hasClass('closed') ? 'Open navbar' : 'Close navbar');
    });
}

function initPropertiesModal() {
    var modal = $('#modal-page-properties');

    modal.find('form').forms({
        onSuccess: function () {
            $('#file-title').reloadFragment({
                url: window.location.href,
                whenComplete: function () {
                    modal.modal('hide');
                    Msg.success('Properties are saved');
                }
            });
        }
    });

    // Load metas
    addMetaTags(metas);
    // Load data/param
    addParams(params);

    modal.find('.btn-add-meta').on('click', function (e) {
        e.preventDefault();

        addMetaTag('', '');
    });

    modal.on('click', '.btn-remove-meta', function (e) {
        e.preventDefault();

        $(this).closest('.meta').remove();
    });

    modal.find('.btn-add-param').on('click', function (e) {
        e.preventDefault();

        addParam('', '');
    });

    modal.on('click', '.btn-remove-param', function (e) {
        e.preventDefault();

        $(this).closest('.param').remove();
    });
}

function initPageBgModal() {
    flog(params);
    var modal = $('#modal-page-bg');

    modal.on('show.bs.modal', function () {
        if (!modal.find('.pageBgColor').data('colorpicker')) {
            $.contentEditor.initColorPicker(modal.find('.pageBgColor'));
        }
    });

    modal.find('.bgColorEnabled').on('click', function () {
        if (this.checked) {
            modal.find('.pageBgColor').prop('readonly', false);
        } else {
            modal.find('.pageBgColor').val('').prop('readonly', true);
            modal.find('.input-group-addon i').css('color', 'transparent');
        }
    });

    for (var key in params) {
        if (params.hasOwnProperty(key) && key.indexOf('pageBg') == 0) {
            modal.find('.' + key).val(params[key]);
            if (key.indexOf('pageBgImage') == 0) {
                modal.find('.pageBgImagePreview img').attr('src', params[key]);
                if (!params[key]) {
                    modal.find('.pageBgImagePreview img').attr('src', '/static/images/photo_holder.png');
                }
            }
            if (key.indexOf('pageBgColor') == 0) {
                if (params[key]) {
                    modal.find('.bgColorEnabled').prop('checked', true);
                } else {
                    modal.find('.bgColorEnabled').prop('checked', false);
                    modal.find('.pageBgColor').val('').prop('readonly', true);
                    modal.find('.input-group-addon i').css('color', 'transparent');
                }
            }
        }
    }

    modal.find('#pageBgImagePicker').mselect({
        contentType: 'image',
        onSelectFile: function (url, relUrl, fileType, hash, isAsset) {

            var hashUrl = '/_hashes/files/' + hash;
            if (isAsset){
                hashUrl = url;
            }
            modal.find('.pageBgImagePreview img').attr('src', hashUrl);
            modal.find('.pageBgImage').val(hashUrl)
        }
    });

    modal.find('#pageBgImagePickerRemove').on('click', function (e) {
        e.preventDefault();
        modal.find('.pageBgImagePreview img').attr('src', '/static/images/photo_holder.png');
        modal.find('.pageBgImage').val('')
    });

    modal.find('form').forms({
        onSuccess: function () {
            $('#file-jsparams').reloadFragment({
                url: window.location.href,
                whenComplete: function (resp) {
                    Msg.success('Page background properties are saved');
                    var style = $(resp).find('code').text();
                    $(document.body).attr('style', style)
                }
            });
            modal.modal('hide');
        }
    });
}

function initKEditor(options) {
    var themeCss = $('head link[href^="/--theme--less--bootstrap.less"]');
    if (typeof themeCssFiles !== 'undefined') {

        if (themeCss.length > 0) {
            themeCssFiles.push(themeCss.attr('href'));
        }
        themeCssFiles.push('/static/bootstrap/ckeditor/bootstrap-ckeditor.css');
    }

    var timer;
    win.on('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            var paddingTop = $(document.body).css('padding-top');
            if (paddingTop) {
                paddingTop = paddingTop.replace('px', '');
                $('#content-area .keditor-content-area').css('min-height', win.height() - paddingTop);
            }
        }, 100);
    }); 

    var basePath = window.location.pathname.replace('contenteditor', '');
    var allGroups;
    $.ajax({
        url: '/contentEditor-lib/getAllGroups',
        type: 'get',
        dataType: 'json',
        success: function (resp) {
            if (resp && resp.status) {
                allGroups = resp.data;
            }
        },
        error: function (jqXhr, statusText, errorThrown) {
            flog('Error when getting all groups', jqXhr, statusText, errorThrown);
        },
        complete: function () {
            $('#content-area').contentEditor({
                snippetsUrl: options.snippetsUrl,
                snippetsHandlersUrl: options.snippetsHandlersUrl,
                allGroups: allGroups,
                basePath: options.basePath,
                pagePath: basePath,
                onReady: function () {
                    win.trigger('resize');
                    setTimeout(function () {
                        hideLoadingIcon();
                        $('#editor-loading').addClass('loading').find('.loading-text').html('Saving...');
                    }, 150);
                },
                isCustomApp: options.isCustomApp
            });
        }
    });

    // Stop prevent reloading page or redirecting to other pages
    $(document.body).on('click', '.keditor-component-content a', function (e) {
        var a = $(this);

        if (a.is('[data-slide]') || a.is('[data-slide-to]')) {

        } else {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        }
    });
}

function initIframeMode(options) {
    postMessageUrl = options.originalUrl;

    doPostMessage({
        url: window.location.href.split('#')[0]
    });

    win.on('message', function (e) {

        var data = $.parseJSON(e.originalEvent.data);
        if (data.triggerSave) {
            flog('On got message', e);
            postMessageData = data;
            $('.btn-save-file').trigger('click');
        }
    });
}

function doPostMessage(data) {
    flog('doPostMessage', data);

    data.from = 'keditor';
    var dataStr = JSON.stringify(data);
    window.parent.postMessage(dataStr, postMessageUrl);
}

function initSaving(fileName, originalUrl) {
    flog('initSaving', fileName, originalUrl);

    var btnSaveFile = $('.btn-save-file');
    btnSaveFile.on('click', function (e) {
        e.preventDefault();

        $('[contenteditable]').blur();
        showLoadingIcon();
        var fileContent = $('#content-area').contentEditor('getContent');

        // Add a extra check for unwanted html ie toolbar
        var div = $('<div>').html(fileContent);
        div.find('.keditor-toolbar.keditor-toolbar-component').remove();
        fileContent = div.html();

        var saveUrl;
        if (fileName == "") {
            saveUrl = "./";
        } else {
            saveUrl = fileName;
        }
        if (postMessageData && postMessageData.pageName) {
            saveUrl = postMessageData.pageName;
        }

        $.ajax({
            url: saveUrl,
            type: 'POST',
            data: {
                body: fileContent
            },
            dataType: 'json',
            success: function () {
                $(document.body).removeClass('content-changed');
                hideLoadingIcon();
                if (originalUrl) {
                    postMessageData.isSaved = true;
                    doPostMessage(postMessageData);
                } else {
                    Msg.success('File is saved!');
                }
            },
            error: function (e) {
                Msg.error(e.status + ': ' + e.statusText);
                hideLoadingIcon();
            }
        })
    });

    win.on({
        keydown: function (e) {
            if (e.ctrlKey && e.keyCode === keymap.S) {
                e.preventDefault();
                btnSaveFile.trigger('click');
            }
        }
    });
}

// ============================================================
// Loading icon
// ============================================================
function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}

// ============================================================
// Meta and data/param functions
// ============================================================
function addParams(paramsData) {
    $('.param-wrapper').html('');

    $.each(paramsData, function (title, value) {
        if (paramsData.hasOwnProperty(title) && title.indexOf('pageBg') != 0) {
            if (title !== 'title' && title !== 'itemType' && title !== 'category' && title !== 'tags' && title !== 'metas' && title !== 'body' && title !== 'cssFiles' && title !== 'template') {
                addParam(title, value);
            }
        }
    });
}

function addMetaTags(metasData) {
    var hasKeywords = false;
    var hasDescription = false;

    $('.meta-wrapper').html('');

    $.each(metasData, function (i, meta) {
        addMetaTag(meta.name, meta.content);

        if (meta.name === 'keywords') {
            hasKeywords = true;
        }

        if (meta.name === 'description') {
            hasDescription = true;
        }
    });

    if (!hasKeywords) {
        addMetaTag('keywords', '');
    }
    if (!hasDescription) {
        addMetaTag('description', '');
    }
}

function addMetaTag(name, content) {
    var metaWrapper = $('.meta-wrapper');
    var id = (new Date()).getTime() + Math.round(Math.random() * 9876543210);
    var isSeoMeta = name === 'keywords' || name === 'description';

    metaWrapper.append(
        '<div class="input-group meta">' +
        '    <input type="text" class="form-control input-sm required" name="metaName.' + id + '" placeholder="Meta name" value="' + name + '" ' + (isSeoMeta ? 'readonly="readonly"' : '') + ' />' +
        '    <input type="text" class="form-control input-sm ' + (isSeoMeta ? '' : 'required') + '" name="metaContent.' + id + '" placeholder="Meta content" value="' + content + '" />' +
        '    <span class="input-group-btn">' +
        '        <button class="btn btn-sm btn-danger btn-remove-meta" type="button" ' + (isSeoMeta ? 'disabled="disabled"' : '') + '><i class="fa fa-remove"></i></button>' +
        '    </span>' +
        '</div>'
    );
}

function addParam(title, value) {
    var metaWrapper = $('.param-wrapper');
    var id = (new Date()).getTime() + Math.round(Math.random() * 9876543210);

    metaWrapper.append(
        '<div class="input-group param">' +
        '    <input type="text" class="form-control input-sm required" required="required" name="paramTitle.' + id + '" placeholder="Data/parameter title" value="' + title + '" />' +
        '    <input type="text" class="form-control input-sm required" required="required" name="paramValue.' + id + '" placeholder="Data/parameter value" value="' + value + '" />' +
        '    <span class="input-group-btn">' +
        '        <button class="btn btn-sm btn-danger btn-remove-param" type="button"><i class="fa fa-remove"></i></button>' +
        '    </span>' +
        '</div>'
    );
}
