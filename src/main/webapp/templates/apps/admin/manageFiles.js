function initManageFiles() {
    initPublishingMenu('');
    initFiles();
    initImport();
    initCRUDFiles();
    initCopyCutPaste();
    if (typeof Dropzone === 'undefined') {
        $.getStyleOnce('/static/dropzone/4.3.0/downloads/css/dropzone.css');
        $.getScriptOnce('/static/dropzone/4.3.0/downloads/dropzone.min.js', function () {
            initUpload();
            initUploadZip();
            initFilesPjax();
        });
    } else {
        initUpload();
        initUploadZip();
        initFilesPjax();
    }
    Msg.singletonForCategory = true;
}

function initFilesPjax() {
    var filesContainer = $("#filesContainer");
    var files = $("#files");
    flog("initFilesPjax", files);
    filesContainer.on("click", "a.pjax", function (e) {
        flog("click pjax");
        e.preventDefault();

        var a = $(this);
        var href = a.attr("href");
        var name = a.text();

        files.reloadFragment({
            url: href,
            whenComplete: function (response, status, xhr) {
                flog("done", response, status, xhr);
                document.title = name;
                window.history.pushState("", href, href);
                var formAction = window.location.pathname + "_DAV/PUT?overwrite=true";
                var zipFormAction = window.location.pathname;
                $("#modal-upload form").attr("action", formAction);
                var dz = Dropzone.forElement("#uploadFileDropzone");
                dz.options.url = formAction;
                $("#modal-upload-zip form").attr("action", zipFormAction);
                var dz2 = Dropzone.forElement("#uploadZipDropzone");
                dz2.options.url = zipFormAction;
                setRecentItem(window.location.pathname, window.location.pathname);
                var dom = $(response);
                var pages = $("#pages");
                flog("update pages", pages);
                pages.html(dom.find("#pages > *"));
                initFilesLayout();
                initCopyCutPaste();
            }
        });
    });
}

function initUpload() {
    Dropzone.autoDiscover = false;
    $('#modal-upload .dropzone').dropzone({
        paramName: 'file', // The name that will be used to transfer the file
        maxFilesize: 2000.0, // MB
        addRemoveLinks: true,
        parallelUploads: 1,
        uploadMultiple: false,
        init: function () {
            this.on('success', function (file) {
                flog('added file', file);
                reloadFileList();
            });
            this.on('error', function (file, errorMessage) {
                Msg.error('An error occured uploading: ' + file.name + ' because: ' + errorMessage);
            });
        }
    });

}

function initUploadZip() {
    Dropzone.autoDiscover = false;
    $('#modal-upload-zip .dropzone').dropzone({
        paramName: 'zip', // The name that will be used to transfer the file
        maxFilesize: 2000.0, // MB
        addRemoveLinks: true,
        parallelUploads: 1,
        uploadMultiple: false,
        acceptedFiles: 'application/zip,application/x-compressed,application/x-zip-compressed,multipart/x-zip',
        init: function () {
            this.on('success', function (file) {
                flog('added file', file);
                reloadFileList();
            });
            this.on('error', function (file, errorMessage) {
                Msg.error('An error occured uploading: ' + file.name + ' because: ' + errorMessage);
            });
        }
    });
}

function initCopyCutPaste() {
    $('#files').cutcopy();
}

function initImport() {
    var modal = $('#modal-import');

    $('.btn-show-import').on('click', function (e) {
        e.preventDefault();

        modal.modal('show');
    });

    modal.find('form').forms({
        onSuccess: function (resp) {
            flog('resp', resp);
            Msg.info('The importer is running')
        }
    });

    $('.btn-import-status').on('click', function (e) {
        e.preventDefault();

        $.getJSON(window.location.pathname + '?importStatus', function (data) {
            $('#import-status-result').val(data.messages).show(300);
        });
    });
}

function initCRUDFiles() {
    var container = $('#filesContainer');

    container.on('click', '.btn-create-folder', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var parentHref = window.location.pathname;
        showCreateFolder(parentHref, 'New folder', 'Please enter a name for the new folder', function () {
            reloadFileList();
        });
    });

    container.on('click', '.btn-upload-file', function (e) {
        e.stopPropagation();
        e.preventDefault();

        $('#modal-upload').modal('show');
    });

    container.on('click', '.btn-upload-zip', function (e) {
        e.stopPropagation();
        e.preventDefault();

        $('#modal-upload-zip').modal('show');
    });

    container.on('click', '.btn-set-dir-hash', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var newHash = prompt("Plese enter the new hash");
        if( newHash ) {
            if (confirm("Are you sure you want to change the contents of this directory to the hash you provided?")) {
                setDirHash(window.location.pathname, newHash);
            } else {
                // guess not
            }
        }

    });

    container.on('click', '.btn-new-text-file', function (e) {
        e.stopPropagation();
        e.preventDefault();

        var name = prompt('Please enter a name for the new file');
        if (name !== null) {
            putEmptyFile(name);
        }
    });

    $('#importFromUrl').click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        flog('click');

        showImportFromUrl();
    });
}

function reloadFileList() {
    flog('reloadFileList');

    $('#table-files-body').reloadFragment({
        url: window.location.href,
        whenComplete: function () {
            //initPseudoClasses();
            initFilesLayout();
        }
    });
}

function initFilesLayout() {
    var tableFiles = $('#table-files');

    tableFiles.find('a.show-color-box').each(function (i, n) {
        var href = $(n).attr('href');
        $(n).attr('href', href + '/alt-640-360.png');
    });
    $('abbr.timeago').timeago();
}

function initFiles() {
    initFilesLayout();
    var container = $('#filesContainer');

    container.on('click', '.btn-delete-file', function (e) {
        e.preventDefault();

        var target = $(this);
        var href = target.attr('href');
        flog('click delete href: ', href);
        var name = getFileName(href);
        var tr = target.closest('tr');

        confirmDelete(href, name, function () {
            flog('deleted', tr);
            tr.remove();
            Msg.success('Deleted ' + name);
        });
    });

    container.on('click', '.btn-delete-list', function (e) {
        e.preventDefault();

        var checkBoxes = container.find("input[type=checkbox][name=file-chk]:checked")
        if (checkBoxes.length == 0) {
            Msg.error("Please select the files you want to remove by clicking the checkboxs to the right");
        } else {
            Kalert.confirm("Are you sure you want to remove " + checkBoxes.length + " files/folders?", function () {
                deleteItemInList(0, checkBoxes);
            });
        }
    });

    container.on('click', '.btn-rename-file', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var target = $(this);
        var href = target.attr('href');

        promptRenameModal("renameFileFolder", "", "Rename file or folder", "", "Enter new name", "newName", "Rename", "simpleChars", "Enter file or folder name", href, function (sourceHref, destHref) {
            var sourceName = getFileName(sourceHref);
            var destName = getFileName(destHref);
            reloadFileList();
            Msg.success(sourceName + ' is renamed to ' + destName);
        });
    });



    // Call history stuff directly, so we can reload
    var config = {
        'pageUrl': null,
        'showPreview': true,
        'afterRevertFn': function () {
            window.location.reload();
        },
        'getPageUrl': function (target) {
            if (target) {
                var href = target.attr('href');
                flog('getPageUrl: href', href);
                if (href && href.length > 0 && href !== '#') {
                    return href;
                }
            }
            if (this.pageUrl !== null) {
                return this.pageUrl;
            } else {
                return window.location.pathname;
            }
        }
    };

    container.on('click', '.btn-history-file', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var link = $(e.target).closest('a');
        flog('show history', link);
        link.addClass('loading');
        var modal = $('#modal-history');
        loadHistory(modal.find('tbody'), config, link);
        modal.modal('show');
        link.removeClass('loading');
    });
}

function showImportFromUrl() {
    var url = prompt('Please enter a url to import files from');
    if (url) {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            dataType: 'json',
            data: {
                importFromUrl: url
            },
            success: function (data) {
                flog('response', data);
                if (!data.status) {
                    Msg.error('Failed to import');
                    return;
                } else {
                    Msg.success('Importing has finished');
                    window.location.reload();
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('err');
            }
        });
    }
}

function setDirHash(dirHref, newHash) {

        $.ajax({
            type: 'POST',
            url: dirHref,
            dataType: 'json',
            data: {
                setNewHash : newHash
            },
            success: function (data) {
                if (data.status) {
                    Msg.success('Hash set successfully, reloading');
                    window.location.reload();
                } else {
                    Msg.error("An error occured setting the new hash " + data.messages);
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('err');
            }
        });
}

function putEmptyFile(name) {
    if (name.contains('/')) {
        Msg.error('File names may not contain forward slashes');
        return;
    }
    $.ajax({
        type: 'PUT',
        url: name,
        data: '',
        dataType: 'text',
        success: function (resp) {
            Msg.success('Created file ' + name);
            reloadFileList();
        },
        error: function (resp) {
            Msg.error('An error occured creating file ' + name + ' - ' + resp.messages);
        }
    });
}

function deleteItemInList(itemNum, checkBoxes) {
    flog("deleteItemInList", itemNum, checkBoxes);
    if (itemNum >= checkBoxes.length) {
        Msg.info("Finished", "delete-notify");
    } else {
        var chk = $(checkBoxes[itemNum]);
        var href = chk.val();
        flog("deleteItemInList", href);
        deleteFile(href, function (resp, href) {
            Msg.info("Deleted " + href, "delete-notify");
            chk.closest("tr").remove();
            deleteItemInList(itemNum + 1, checkBoxes);
        });
    }
}
