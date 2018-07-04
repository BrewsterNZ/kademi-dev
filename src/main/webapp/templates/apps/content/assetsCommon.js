$(function () {
    var mainAssetContainer = $('#main-asset');

    // these need to be loaded for each asset, eg when modals are opened
    initAssetContainer(mainAssetContainer);

    // These only need to be initialised once
    $(document.body).on('click', '.btn-edit-type', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var modal = $('#modal-edit-type');
        modal.find('a.btn-info').attr('href', '/content-types/' + link.attr('href'));
        modal.find('a.remove-type').attr('href', link.attr('href'));
        modal.modal('show');
    });

    flog('init: add type');
    $(document.body).on('click', '.add-type', function (e) {
        flog('click');
        e.preventDefault();

        var link = $(e.target).closest('a');
        var contentTypeName = link.attr('href');
        $.ajax({
            url: window.location.pathname,
            type: 'post',
            dataType: 'json',
            data: {
                'assetType': contentTypeName
            },
            success: function (resp) {
                Msg.info('Added');
                $('#asset-types').reloadFragment();
            }
        });
    });

    $(document.body).on('click', '.remove-type', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var modal = $('#modal-edit-type');
        var contentTypeName = link.attr('href');
        modal.modal('hide');

        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            dataType: 'json',
            data: {
                removeAssetType: contentTypeName
            },
            success: function (resp) {
                if (resp.status) {
                    Msg.info('Removed content type');
                    $('#asset-types').reloadFragment();
                } else {
                    Msg.error('Sorry, an error occured removing the content type');
                }
            },
            error: function () {
                Msg.error('Sorry, an error occured removing the content type');
            }
        });
    });

    $(document.body).on('click', '.create-translation', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var langCode = link.attr("href");

        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            dataType: 'json',
            data: {
                createLangCode: langCode
            },
            success: function (resp) {
                if (resp.status) {
                    Msg.info('Created translation');
                    window.location = resp.nextHref;
                } else {
                    Msg.error('Sorry, an error occured creating the translation');
                }
            },
            error: function () {
                Msg.error('Sorry, an error occured creating the translation');
            }
        });
    });

});

/**
 *
 * @param {type} container
 * @returns {undefined}This will be called for the main page when editing an asset, but can also be
 * called when an asset is loaded into a modal
 */
function initAssetContainer(container) {
    var isAddModal = container.is('#modal-add-relation');
    var isModal = container.hasClass('modal');
    flog('initAssetContainer', container, 'isAddModal=' + isAddModal);

    var edmEditor = container.find('.edmeditor');
    var contentEditor = container.find('.contenteditor');
    if (edmEditor.length){
        initIframeEDMEditor(edmEditor)
    } else if (contentEditor.length){
        initIframeContentEditor(contentEditor);
    }


    container.find('.form-edit').forms({
        onValid: function (form) {
            form.find('.contenteditor').each(function () {
                var contentEditor = $(this);

                contentEditor.val(contentEditor.contentEditor('getContent') || '');
            });
        },
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info(resp.messages[0]);

                if (isModal) {
                    container.modal('hide');
                }

                if (isAddModal) {
                    var realInput = $('[name="' + container.attr('data-name') + '"]');
                    var fakeInput = realInput.siblings('.twitter-typeahead').find('.tt-input');
                    var inputGroup = realInput.closest('.input-group');
                    var btnView = inputGroup.find('.btn-view-relation');
                    var btnEdit = inputGroup.find('.btn-edit-relation');

                    btnView.attr('href', '/assets/' + resp.data.assetUniqueName);
                    btnEdit.attr('href', '/asset-manager/' + resp.data.assetUniqueName);

                    realInput.val(resp.data.assetUniqueName);
                    fakeInput.val(resp.data.assetName);
                }
            }
        }
    });

    container.find('.form-asset-main').forms({
        onValid: function (form) {
            if (edmEditor.length){
                edmEditor.val(edmEditor.edmEditor('getContent') || "");
            } else if (contentEditor.length){
                contentEditor.val(contentEditor.contentEditor('getContent') || '');
            }
        },
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info(resp.messages[0]);

                if (isModal) {
                    container.modal('hide');
                }

                if (isAddModal) {
                    var realInput = $('[name="' + container.attr('data-name') + '"]');
                    var fakeInput = realInput.siblings('.twitter-typeahead').find('.tt-input');
                    var inputGroup = realInput.closest('.input-group');
                    var btnView = inputGroup.find('.btn-view-relation');
                    var btnEdit = inputGroup.find('.btn-edit-relation');

                    btnView.attr('href', '/assets/' + resp.data.assetUniqueName);
                    btnEdit.attr('href', '/asset-manager/' + resp.data.assetUniqueName);

                    realInput.val(resp.data.assetUniqueName);
                    fakeInput.val(resp.data.assetName);
                } else {
                    if (resp.nextHref) {
                        window.location = resp.nextHref;
                    }
                }
            }
        }
    });


    var formUpload = container.find('.frmUpload');
    var uploadProgress = formUpload.find('.progress');
    formUpload.forms({
        onValid: function () {
            uploadProgress.show();
        },
        onSuccess: function (resp) {
            if (resp && resp.status) {
                var img = $('#asset-previewer img');
                var newUrl = new URI(img.attr('src'));
                newUrl.removeSearch('v');
                newUrl.addSearch('v', (new Date().getTime()));
                img.attr('src', newUrl.toString());

                $('#asset-info').reloadFragment({
                    whenComplete: function () {
                        uploadProgress.hide();
                        Msg.info(resp.messages[0] || 'Uploaded');
                    }
                });
            }
        }
    });
}


function initEditRelations() {
    $(document.body).on('click', '.btn-edit-relation', function (e) {
        e.preventDefault();

        var link = $(this);
        var inputGroup = link.closest('.input-group');
        var realInput = inputGroup.find('.select-asset');
        var modal = $(link.attr('data-target'));
        var href = link.attr('href');

        modal.find('.modal-body').load(href + ' .main-content-inner', function () {
            initAssetContainer(modal); // init js handlers
            modal.attr('data-name', realInput.attr('name'));
            modal.modal('show');
        });
    });

    $(document.body).on('click', '.btn-add-relation', function (e) {
        e.preventDefault();

        var link = $(this);
        var inputGroup = link.closest('.input-group');
        var realInput = inputGroup.find('.select-asset');
        var modal = $(link.attr('data-target'));
        var href = link.attr('href');

        modal.find('.modal-body').load(href + ' .main-content-inner', function () {
            initAssetContainer(modal); // init js handlers
            modal.attr('data-name', realInput.attr('name'));
            modal.modal('show');
        });
    });
}

function initForm(redirectOnCreated) {
    $('.form-edit').forms({
        onValid: function (form) {
            var edmEditor = form.find('.edmeditor');
            var contentEditor = form.find('.contenteditor');
            if (edmEditor.length){
                edmEditor.val(edmEditor.edmEditor('getContent') || "");
            } else if (contentEditor.length){
                contentEditor.val(contentEditor.contentEditor('getContent') || '');
            }
        },
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info(resp.messages[0]);
                if (redirectOnCreated) {
                    if (resp.nextHref) {
                        window.location = resp.nextHref;
                    }
                }
            }
        }
    });

    $('.form-edit').on("click", ".btn-remove-value", function(e) {
        e.preventDefault();
        $(e.target).closest("div").remove();
    });

    $('.form-asset-main').forms({
        onValid: function (form) {
            var edmEditor = form.find('.edmeditor');
            var contentEditor = form.find('.contenteditor');
            if (edmEditor.length){
                edmEditor.val(edmEditor.edmEditor('getContent') || "");
            } else if (contentEditor.length){
                contentEditor.val(contentEditor.contentEditor('getContent') || '');
            }
        },
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info(resp.messages[0]);
                if (resp.nextHref) {
                    window.location = resp.nextHref;
                }
            }
        }
    });
}

function initRelationFields() {
    $('.select-asset').on('change', function () {
        var input = $(this);
        var inputGroup = input.closest('.input-group');
        var btnView = inputGroup.find('.btn-view-relation');
        var btnEdit = inputGroup.find('.btn-edit-relation');

        btnView.attr('href', '/assets/' + this.value);
        btnEdit.attr('href', '/asset-manager/' + this.value);
    });

    $('.btn-upload-file').each(function () {
        var btn = $(this);
        var mupload = $('<div style="display: none;"></div>');
        var inputGroup = btn.closest('.input-group');
        var btnView = inputGroup.find('.btn-view-relation');
        var btnEdit = inputGroup.find('.btn-edit-relation');
        var acceptedFiles = '';

        if (btn.hasClass('btn-upload-image')) {
            acceptedFiles = 'image/*';
        }

        if (btn.hasClass('btn-upload-video')) {
            acceptedFiles = 'video/*';
        }

        mupload.mupload({
            url: '/assets/',
            buttonText: '<i class="fa fa-upload"></i> Upload',
            acceptedFiles: acceptedFiles,
            oncomplete: function (data, name, href) {
                flog('uploadcomplete', href);

                var uniqueId = data.result.href.replace('/assets/', '');
                var realInput = inputGroup.find('.select-asset');
                var fakeInput = inputGroup.find('.tt-input');

                realInput.val(uniqueId);
                fakeInput.val(data.name);
                btnView.attr('href', data.result.href);
                btnEdit.attr('href', '/asset-manager/' + uniqueId);

                flog('uploadcomplete2', data.name);
                flog('real inp', realInput[0]);
                flog('fake inp', fakeInput[0]);
            }
        });

        btn.on('click', function (e) {
            e.preventDefault();

            mupload.find('.btn').trigger('click');
        });
    });

    $('.btn-edit-text').each(function () {
        var btn = $(this);

        // TODO: Continue when contentType='text' works
    });
}