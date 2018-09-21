var win = $(window);

function initEdmEditorPage(options) {
    flog('initEdmEditorPage', options.fileName);

    Msg.iconMode = 'fa';

    var basePath = window.location.pathname.replace('edmeditor', '');
    if (options.pagePath) {
        basePath = options.pagePath;
    }

    // Stop prevent reloading page or redirecting to other pages
    $(document.body).on('click', '.keditor-component-content a', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
    });

    var allGroups;
    $.ajax({
        url: '/edmEditor-lib/getAllGroups',
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
            initEdmEditor(options, allGroups, basePath);
        }
    });

    initSaveFile(options.fileName);
}

function initEdmEditor(options, allGroups, basePath) {
    $('#edm-editor').edmEditor({
        snippetsUrl: options.snippetsUrl,
        snippetsHandlersUrl: options.snippetsHandlersUrl,
        allGroups: allGroups,
        basePath: basePath,
        pagePath: basePath,
        externalUrl : options.externalUrl,
        onReady: function () {
            $('#editor-loading').addClass('loading').find('.loading-text').html('Saving...');
            hideLoadingIcon();
        }
    });
}

function initSaveFile(fileName) {
    flog('initSaveFile', fileName);

    var body = $(document.body);

    var btnSave = $('.btn-save-file');
    btnSave.on('click', function (e) {
        e.preventDefault();

        showLoadingIcon();

        $.ajax({
            url: fileName,
            type: 'POST',
            data: {
                body: $('#edm-editor').edmEditor('getContent')
            },
            success: function () {
                Msg.success('File is saved!');
                hideLoadingIcon();
                body.removeClass('content-changed');
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
                btnSave.trigger('click');
            }
        },
        beforeunload: function () {
            if (body.hasClass('content-changed')) {
                return '\n\nAre you sure you would like to leave the editor? You will lose any unsaved changes\n\n';
            }
        }
    });
}

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}
