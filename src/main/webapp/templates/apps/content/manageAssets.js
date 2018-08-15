(function ($) {
    $(function () {
        initSearchAsset();
        initDeleteAssets();
        initUploadModal();
        initSelectPicker();
        initRestore();
    });

    function initRestore() {
        var restoreForm = $('#frmRestore');
        restoreForm.forms({
            onSuccess : function(resp){
                if( resp.status) {
                    Msg.info("Restore process has been started");
                } else {
                    Msg.error("There was a problem starting the restore " + resp.messages);
                }
            }
        });
    }

    function initUploadModal() {
        flog('initUploadModal');

        var modal = $('#modal-upload-file');
        var form = modal.find('form');
        var progress = form.find('.progress');
        var progressBar = progress.find('.progress-bar');

        form.forms({
            onValid: function () {
                progress.show();
            },
            onProgress: function (percentage) {
                var percentageStr = Math.round(percentage) + '%';
                progressBar.html(percentageStr).css('width', percentageStr);
            },
            onSuccess: function (resp) {
                if (resp && resp.status) {
                    $('#table-assets').reloadFragment({
                        whenComplete: function () {
                            modal.modal('hide');
                            Msg.info('Uploaded ok');
                        }
                    })
                } else {
                    Msg.error('An error occured uploading the resource');
                }
            }
        });

        modal.on('hidden.bs.modal', function () {
            progress.hide();
            progressBar.html('0%').css('width', 0);
            form.find('input').val('');
        });
    }

    function initSearchAsset() {
        flog('initSearchAsset');

        var txtQuery = $('#query');
        txtQuery.keyup(function () {
            typewatch(function () {
                doSearchAsset();
            }, 500);
        });

        var cbbCategory = $('#searchContentType');
        cbbCategory.on('change', function (e) {
            var query = (txtQuery.val() || '').replace(/\s*([^\s]+\s?)\s*/g, '$1').trim();
            var newQuery = [];
            if (query) {
                query = query.split(' ');

                $.each(query, function (i, value) {
                    if (value.indexOf('category:') === -1) {
                        newQuery.push(value);
                    }
                });
            }

            var selectCategories = cbbCategory.val() || [];
            $.each(selectCategories, function (i, value) {
                newQuery.push('category:' + value);
            });

            txtQuery.val(newQuery.join(' '));

            doSearchAsset();
        });

    }

    function doSearchAsset() {
        var query = $('#query').val();
        flog('doSearchAsset query=' + query);

        var uri = URI(window.location);

        uri.setSearch('q', query );
        uri.setSearch('type', $("#searchContentType").val() );
        var newHref = uri.toString();

        window.history.pushState('', newHref, newHref);
        $("#table-body-assets").reloadFragment({
            url : newHref
        });

    }

    function initDeleteAssets() {
        $(document.body).on('click', '.btn-delete-assets', function (e) {
            e.preventDefault();
            var listToDelete = [];
            $(document.body).find(':checkbox.asset-check:checked').each(function () {
                var s = $(this);
                var id = s.data('id');
                listToDelete.push(id);
            });
            flog('List To Delete', listToDelete.join(','));

            if (listToDelete.length > 0) {
                Kalert.confirm('Are you sure you want to delete ' + listToDelete.length + ' assets?', function () {
                    deleteElements(listToDelete.join(','), function (data) {
                        flog(data);
                        if (data.status) {
                            $('#table-assets').reloadFragment({
                                whenComplete: function () {
                                    Msg.info(data.messages);
                                    $(document.body).find('.check-all').check(false).change();
                                }
                            });
                        } else {
                            Msg.error('An error occured deleting the assets. Please check your internet connection');
                        }
                    });
                });
            } else {
                Msg.error('Please select the assets you want to remove by clicking the checkboxes on the right');
            }
        });
    }

    function deleteElements(listToDelete, callback) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: window.location.pathname,
            data: {
                toDelete: listToDelete,
            },
            success: function (resp) {
                callback(resp);
            },
            error: function (resp) {
                Msg.error('An error occured on the delete.');
            }
        });
    }

    Dropzone.autoDiscover = false;
    $('.dropzone').dropzone({
        paramName: 'file', // The name that will be used to transfer the file
        maxFilesize: 500.0, // MB
        maxFiles: 100, // browser becomes unuseable for large numbers of files
        addRemoveLinks: true,
        parallelUploads: 1,
        uploadMultiple: false
    });

    var dz = Dropzone.forElement('#uploadFileDropzone');
    dz.on('success', function (file, response) {
        var resp = JSON.parse(response);

        flog('Upload success!', file, resp);

        if (resp.error) {
            flog();
            var ref = file.previewElement.querySelectorAll('[data-dz-errormessage]');
            var results = [];

            for (var i = 0; i < ref.length; i++) {
                var node = ref[i];
                var errorMsg = resp.error.replace('Bad Request:', '').trim();
                results.push(node.textContent = errorMsg);
                showDropZoneError(errorMsg);
            }

            file.previewElement.classList.add('dz-error');

            return results;
        } else {
            reloadImageList();
        }
    });

    dz.on('error', function (file, errorMessage) {
        showDropZoneError('An error occured uploading: ' + file.name + ' because: ' + errorMessage);
    });

    function showDropZoneError(message) {
        $('.alert-wrapper').append(
                '<p class="alert alert-danger"><button class="close" type="button" data-dismiss="alert">&times;</button><i class="fa fa-warning"></i> ' + message + '</p>'
                );
    }

    function reloadImageList() {
        $("#productsList").reloadFragment();
    }


    function initSelectPicker() {
        $('.selectpicker').each(function () {
            var selectpicker = $(this);

            selectpicker.selectpicker({
                noneSelectedText: "Type",
                style: 'btn btn-sm btn-default'
            });
        });
    }

})(jQuery);