(function ($) {
    var MAIN_URL = '/manageSaleDataClaimer/';
    var RECORD_STATUS = {
        NEW: 0,
        APPROVED: 1,
        REJECTED: -1
    };

    $(function () {
        var components = $('.claims-list-component');

        if (components.length > 0) {
            initModalReviewClaim();
            initClaimsTable();
            initUpdateMapping();
            initSettingForm();
            initAddClaim();
            initEditClaim();
            initUploadImageClaim();
        }
    });

    function initSettingForm() {
        flog('initSettingForm');

        $('.form-settings-claim').each(function () {
            var form = $(this);
            var saveOnChange = form.find('.save-on-change');

            form.forms({
                onSuccess: function (resp) {
                    if (resp && resp.status) {
                        Msg.success('Settings are saved');
                        window.location.reload();
                    }
                }
            });

            if (saveOnChange.length > 0) {
                saveOnChange.on('change', function () {
                    form.trigger('submit');
                });
            }
        });
    }

    function initAddClaim() {
        var modal = $('#modal-add-claim');
        var form = modal.find('form');

        // Init form
        form.salesDataClaimForm({});

        // Reset
        form.salesDataClaimForm('reset');

        // Add an empty row
        form.salesDataClaimForm('addEmptyRow');

        modal.on('hidden.bs.modal', function () {
            // Reset form data
            form.salesDataClaimForm('reset');

            // Reset the modal
            form.trigger('reset');

            // Add a blank row
            form.salesDataClaimForm('addEmptyRow');
        });

        form.forms({
            onSuccess: function (resp) {
                reloadClaimsList(function () {
                    modal.modal('hide');
                });
            }
        });
    }

    function initEditClaim() {
        var modal = $('#modal-edit-claim');
        var form = modal.find('form');
        form.salesDataClaimForm({});

        modal.on('hidden.bs.modal', function () {
            // Reset form data
            form.salesDataClaimForm('reset');

            // Reset the modal
            form.trigger('reset');
        });

        form.forms({
            onSuccess: function (resp) {
                reloadClaimsList(function () {
                    modal.modal('hide');
                });
            }
        });

        $('body').on('click', '.btn-edit-claim', function (e) {
            e.preventDefault();

            var btn = $(this);
            var id = btn.data('id');

            var url = location.pathname + id + '/';

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status) {
                        form.attr('action', url);

                        form.salesDataClaimForm('populate', resp.data);

                        modal.modal('show');
                    } else {
                        alert('Error in getting claim data. Please contact your administrators to resolve this issue.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error in getting claim data: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                    flog('Error in getting claim data', jqXHR, textStatus, errorThrown);
                }
            });
        });
    }

    function initModalReviewClaim() {
        flog('initModalReviewClaim');

        var modal = $('#modal-review-claim');
        var form = modal.find('form');
        var action = modal.find('.modal-action');

        modal.find('.btn-approve-claim').on('click', function (e) {
            e.preventDefault();

            action.attr('name', 'approveClaims');
            form.trigger('submit');
        });

        modal.find('.btn-reject-claim').on('click', function (e) {
            e.preventDefault();

            action.attr('name', 'rejectClaims');
            form.trigger('submit');
        });

        modal.on('hidden.bs.modal', function () {
            modal.find('.form-control-static').html('');
            form.find('input').val('');
        });

        form.forms({
            onSuccess: function () {
                reloadClaimsList(function () {
                    Msg.success('Claim is ' + (action === 'rejectClaims' ? 'rejected' : 'approved') + '!');
                    modal.modal('hide');
                });
            }
        });
    }

    function initUpdateMapping() {
        var btnUpdateMapping = $('.btn-update-mapping');

        if (btnUpdateMapping.length > 0) {
            btnUpdateMapping.on('click', function (e) {
                e.preventDefault();

                btnUpdateMapping.prop('disabled', true);
                $.ajax({
                    url: '/updateMappingSaleDataClaimer',
                    type: 'POST',
                    dataType: 'JSON',
                    success: function (resp) {
                        if (resp && resp.status) {
                            Msg.success('Mapping is updated');
                        } else {
                            Msg.error('Error in updating mapping. Please contact your administrators to resolve this issue.');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Msg.error('Error in updating mapping: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                        flog('Error in updating mapping', jqXHR, textStatus, errorThrown);
                    },
                    complete: function () {

                        btnUpdateMapping.prop('disabled', false);
                    }
                });
            });
        }
    }

    function changeClaimsStatus(status) {
        var table = $('#table-claims');
        var tbody = $('#table-claims-body');

        var action;
        var actionCapitalize;
        var actionVing;
        switch (status) {
            case RECORD_STATUS.APPROVED:
                action = 'approve';
                actionCapitalize = 'Approve';
                actionVing = 'approving';
                break;

            case RECORD_STATUS.REJECTED:
                action = 'reject';
                actionCapitalize = 'Reject';
                actionVing = 'Rejecting';
                break;
        }

        var checked = tbody.find(':checkbox:checked');

        if (checked.length > 0) {
            var isConfirmed = confirm('Are you that you want to ' + action + ' ' + checked.length + ' selected ' + (checked.length > 1 ? 'claims' : 'claim') + '?');

            if (isConfirmed) {
                var ids = [];
                checked.each(function () {
                    ids.push(this.value);
                });

                var data = {
                    ids: ids.join(',')
                };
                data[action + 'Claims'] = true;

                $.ajax({
                    url: MAIN_URL,
                    type: 'POST',
                    dataType: 'JSON',
                    data: data,
                    success: function (resp) {
                        if (resp && resp.status) {
                            reloadClaimsList(function () {
                                Msg.success(actionCapitalize + ' succeed');
                            });
                        } else {
                            alert('Error in ' + actionVing + ' claims. Please contact your administrators to resolve this issue.');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('Error in ' + actionVing + ' claims: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                        flog('Error in ' + actionVing + ' claims', jqXHR, textStatus, errorThrown);
                    }
                });
            }
        } else {
            alert('Please select claims which you want to ' + action);
        }
    }

    function initUploadImageClaim() {
        var modal = $('#modal-upload-ocr-claim');
        var form = modal.find('form');

        var inputImage = form.find('[name=claimImage]');
        var thumbImg = form.find('.thumbnail img');
        var btnUpload = form.find('.btn-upload-image-claim');
        var salesTeamInput = form.find('[name="salesTeam"]');

        // Init Entity finder :-)
        salesTeamInput.entityFinder({
            type: 'organisation',
            onSelectSuggestion: function (elem, orgId, actualId, type) {
                salesTeamInput.val(orgId);
            }
        });

        modal.on('hidden.bs.modal', function () {
            form.trigger('reset');
            thumbImg.attr('src', '/static/images/photo_holder.png');
            form.find('.img-error').hide();
        });

        inputImage.on('change', function () {
            var file = this.files[0];
            var isImage = $.inArray(file['type'], ['image/gif', 'image/jpeg', 'image/png']) !== -1;

            if (isImage) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    thumbImg.attr('src', e.target.result);
                    btnUpload.find('i').attr('class', 'fa fa-check');
                };
                reader.readAsDataURL(file);
            }
        });

        btnUpload.on('click', function (e) {
            e.preventDefault();

            inputImage.trigger('click');
        });

        form.forms({
            onSuccess: function (resp) {
                flog("sales claim form resp", resp);

                reloadClaimsList(function () {
                    modal.modal('hide');
                    Msg.success(resp.messages || 'Image claim uploaded successfully');
                });
            }
        });
    }

    function initClaimsTable() {
        var table = $('#table-claims');
        var tbody = $('#table-claims-body');
        var modalAdd = $('#modal-add-claim');
        var formAdd = modalAdd.find('form');
        var modalReview = $('#modal-review-claim');
        var modalProcess = $('#modal-process-claim');

        table.find('.chk-all').on('click', function () {
            tbody.find(':checkbox').prop('checked', this.checked);
        });

        var uri = new URI(window.location.href);
        $('.select-status').on('change', function (e) {
            uri.removeSearch('status');

            if (this.value) {
                uri.addSearch('status', this.value);
            }

            window.history.pushState('', document.title, uri.toString());
            reloadClaimsList();
        });

        table.on('click', '.btn-view-claim, .btn-review-claim', function (e) {
            e.preventDefault();

            var btn = $(this);
            var id = btn.data('id');
            var url = MAIN_URL + id + '/';
            var isReview = btn.hasClass('btn-review-claim');

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status) {
                        var claimItemsBody = modalReview.find('#table-claim-items-body');

                        claimItemsBody.empty();

                        if (resp.data.salesTeamOrgId && resp.data.salesTeamOrgId.length > 0) {
                            modalReview.find('.sales-team').find('input').val(resp.data.salesTeamOrgId);
                            modalReview.find('.sales-team').show();
                        } else {
                            modalReview.find('.sales-team').find('input').val('');
                            modalReview.find('.sales-team').hide();
                        }

                        // Load Claim Items
                        if (resp.data && resp.data.claimItems) {
                            $.each(resp.data.claimItems, function (_, item) {
                                var claimItem = item;

                                var claimRow = '<tr>' +
                                        '<td>' + (claimItem.productSku && claimItem.productSku.length > 0 ? claimItem.productSku : '') + '</td>' +
                                        '<td>' + (claimItem.productSku && claimItem.productSku.length > 0 ? claimItem.productSku : '') + '</td>' +
                                        '<td>' + (claimItem.soldDate && claimItem.soldDate.length > 0 ? claimItem.soldDate : '') + '</td>' +
                                        '<td>' + (claimItem.soldBy && claimItem.soldBy.length > 0 ? claimItem.soldBy : '') + '</td>' +
                                        '<td>' + (claimItem.modifiedDate && claimItem.modifiedDate.length > 0 ? claimItem.modifiedDate : '') + '</td>' +
                                        '</tr>';

                                claimItemsBody.append(claimRow);
                            });
                        }

                        $.each(resp.data, function (key, value) {
                            var newValue = value;
                            if (key === 'soldDate') {
                                newValue = '<abbr class="timeago" title="' + value + '">' + value + '</abbr>';
                            }

                            modalReview.find('.' + key).html(newValue);
                        });

                        modalReview.find('.thumbnail img').attr('src', resp.data.receipt || '/static/images/photo_holder.png');

                        modalReview.find('.timeago').timeago();
                        modalReview.find('[name=ids]').val(id);
                        modalReview.find('.btn-approve-claim, .btn-reject-claim').css('display', isReview ? 'inline-block' : 'none');
                        modalReview.find('.modal-title').html(isReview ? 'Review claim' : 'View claim details');
                        modalReview.modal('show');
                    } else {
                        alert('Error in getting claim data. Please contact your administrators to resolve this issue.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error in getting claim data: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                    flog('Error in getting claim data', jqXHR, textStatus, errorThrown);
                }
            });
        });

        table.on('click', '.btn-process-claim', function (e) {
            e.preventDefault();

            var tableBody = modalProcess.find('#table-ocr-manager-body');
            var salesTeamDiv = modalProcess.find('.sales-team');
            var salesTeamInput = salesTeamDiv.find('input');

            salesTeamDiv.hide();
            salesTeamInput.val('');

            tableBody.empty();

            modalProcess.find('thead tr').html("");

            modalProcess.modal('show');

            // BM: Thats not what i meant by full screen!
            //modalProcess.find('.modal-dialog').fullscreen();

            var btn = $(this);
            var id = btn.attr('data-id');
            var url = MAIN_URL + 'ocrFile/' + id + '/?hash=' + btn.data('ocrfilehash');

            var receiptUrl = btn.data('receipt');

            $('.btn-save-image-claims').attr('data-ocrfilehash', btn.data('ocrfilehash'));
            $('.btn-save-image-claims').attr('data-id', btn.data('id'));

            $('.btn-approve-image-claims').attr('data-ocrfilehash', btn.data('ocrfilehash'));
            $('.btn-approve-image-claims').attr('data-id', btn.data('id'));

            $('.btn-process-image-claims').attr('data-ocrfilehash', btn.data('ocrfilehash'));
            $('.btn-process-image-claims').attr('data-id', btn.data('id'));

            $('.btn-reject-image-claims').attr('data-id', btn.data('id'));

            // Get Claim Data
            $.ajax({
                url: MAIN_URL + id  + '/',
                type: 'GET',
                dataType: 'JSON',
                success: function (resp) {
                    flog('OCR data', resp);
                    if( resp.status ) {
                        var fileName = resp.data.receiptFileName;
                        modalProcess.find('a[name="ocrFileHash"]').attr('download', fileName);

                        if ( resp.data && resp.data.salesTeamOrgId && resp.data.salesTeamOrgId.length > 0) {
                            salesTeamInput.val(resp.data.salesTeamOrgId);
                            salesTeamDiv.show();
                        } else {
                            salesTeamDiv.hide();
                            salesTeamInput.val('');
                        }
                    } else {
                        Msg.error("There was a problem retrieving claim data");
                    }
                }
            });

            // Get OCR file
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (resp) {
                    flog("Got receipt file data", resp);
                    if (resp && resp.status) {
                        modalProcess.find('[name=ids]').val(id);
                        modalProcess.find('img[name="ocrFileHash"]').attr('src', receiptUrl);
                        modalProcess.find('a[name="ocrFileHash"]').attr('href', receiptUrl);

                        var xmlDocument = $.parseXML(resp.OCRFileXML);
                        var $xml = $(xmlDocument);

                        var totalConfidence = (Math.round(Number($xml.find('rows').attr('totalConfidence')) * 100) / 100);
                        $('.totalConfidence span').html(totalConfidence);

                        var $rows = $xml.find("row");

                        modalProcess.find('thead tr').append('<th width="30"></th>');

                        var columns_amount = $($($rows[0]).find("cell")).length;

                        for (counter = 0; counter < $rows.length; counter++) {
                            var row_columns_amount = $($($rows[counter]).find("cell")).length;

                            if (row_columns_amount > columns_amount) {
                                columns_amount = row_columns_amount;
                            }
                        }

                        for (counter = 0; counter < columns_amount; counter++) {
                            var column_select = '';

                            column_select += '<th>';
                            column_select += '    <select></select>';
                            column_select += '</th>';

                            modalProcess.find('thead tr').append(column_select);
                        }

                        flog("rows", $rows.length);
                        for (counter = 0; counter < $rows.length; counter++) {
                            var row = '';
                            row += '<tr data-index="' + $($rows[counter]).attr('index') + '">';
                            row += '    <td><div style="width: 50px"> <button type="button" class="btn btn-danger btn-delete-row btn-xs" title="Delete Row"><i class="fa fa-trash"></i></button>' +
                                ' <button type="button" class="btn btn-primary btn-fill-user btn-xs" title="Fill down"><i class="fa fa-long-arrow-down"></i></button>' +
                                '</div></td>';

                            var $cells = $($rows[counter]).find("cell");
                            for (cells_counter = 0; cells_counter < $cells.length; cells_counter++) {
                                var $cell = $($cells[cells_counter]);

                                var confidence = (Math.round(Number($cell.find('confidence').text()) * 100) / 100);
                                var cell_background;

                                if (confidence >= lowConfidenceFrom && confidence <= lowConfidenceTo) { //low
                                    cell_background = '#d2a0a0';
                                } else if (confidence >= mediumConfidenceFrom && confidence <= mediumConfidenceTo) { //mid
                                    cell_background = '#d2c8a0';
                                } else if (confidence >= highConfidenceFrom && confidence <= highConfidenceTo) {
                                    cell_background = '#a0d2a2';
                                } else {
                                    cell_background = '';
                                }
                                flog("confidence", confidence, cell_background);

                                row += '    <td style="background: ' + cell_background + ';">';
                                row += '        <span>' + confidence + '</span>';
                                row += '        <input type="text" value="' + $cell.find(':first-child').text() + '" />';
                                row += '    </td>';
                            }

                            for (empty_cells_counter = 0; empty_cells_counter < (columns_amount - $cells.length); empty_cells_counter++) {
                                row += '    <td>';
                                row += '        <input type="text" value="" />';
                                row += '    </td>';
                            }

                            row += '</tr>';

                            $('#table-ocr-manager-body').append(row);
                        }

                        $.each(options, function () {
                            $('#modal-process-claim select').append('<option value="' + this.value + '">' + this.title + '</option>');
                        });

                        flog("defaultColumns", defaultColumns);
                        $('#modal-process-claim select').each(function () {
                            var index = $('#modal-process-claim').find('select').index(this);
                            $(this).val(defaultColumns[index]);
                            flog("col", defaultColumns[index]);
                        });
                    } else {
                        alert('Error in getting claim data. Please contact your administrators to resolve this issue.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error in getting claim data: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                    flog('Error in getting claim data', jqXHR, textStatus, errorThrown);
                }
            })
        });

        tbody.find('.timeago').timeago();

        $('.btn-approve-claims').on('click', function (e) {
            e.preventDefault();

            changeClaimsStatus(RECORD_STATUS.APPROVED);
        });

        $('.btn-reject-claims').on('click', function (e) {
            e.preventDefault();

            changeClaimsStatus(RECORD_STATUS.REJECTED);
        });

        $('.btn-delete-claims').on('click', function (e) {
            e.preventDefault();

            var checked = tbody.find(':checkbox:checked');

            if (checked.length > 0) {
                var isConfirmed = confirm('Are you that you want to delete ' + checked.length + ' selected ' + (checked.length > 1 ? 'claims' : 'claim') + '?');

                if (isConfirmed) {
                    var ids = [];
                    checked.each(function () {
                        ids.push(this.value);
                    });

                    $.ajax({
                        url: MAIN_URL,
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                            deleteClaims: true,
                            ids: ids.join(',')
                        },
                        success: function (resp) {
                            if (resp && resp.status) {
                                reloadClaimsList(function () {
                                    Msg.success('Deleted');
                                });
                            } else {
                                alert('Error in deleting. Please contact your administrators to resolve this issue.');
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            alert('Error in deleting: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                            flog('Error in deleting', jqXHR, textStatus, errorThrown);
                        }
                    });
                }
            } else {
                alert('Please select claims which you want to delete');
            }
        });

        $('span#ocrFile').zoom({magnify: 3, on: 'grab'});

        modalProcess.on('click', '.btn-delete-row', function (e) {
            e.preventDefault();

            var btn = $(this);
            var tr = btn.closest('tr');

            Kalert.confirm('You want to delete this row', function () {
                tr.remove();
            });
        });

        modalProcess.on('click', '.btn-fill-user', function (e) {
            e.preventDefault();

            var btn = $(this);
            var table = btn.closest('table');
            var thead = table.find('thead');
            var tbody = table.find('tbody');

            var columnIndex = -1;
            thead.find('select').each(function () {
                if (this.value == 'attributedTo'){
                    columnIndex = $(this).closest('th').index();
                }
            });

            if (columnIndex != -1){
                var currentRow = btn.closest('tr');
                var currentCell = $(currentRow.find('td')[columnIndex]);

                var currentRowIndex = currentRow.index();
                var currentUser = '';
                for (var i = currentRowIndex; i >= 0; i--){
                    var row = $(tbody.find('tr')[i]);
                    var cell = $(row.find('td')[columnIndex]);
                    var user = cell.find('input').val();
                    if (user){
                        currentCell.find('input').val(user);
                        currentUser = user;
                        break;
                    }
                }

                if (currentUser){
                    for (var i = currentRowIndex + 1; i < tbody.find('tr').length; i++){
                        var row = $(tbody.find('tr')[i]);
                        var cell = $(row.find('td')[columnIndex]);
                        var currentValue = cell.find('input').val();
                        if (!currentValue){
                            cell.find('input').val(currentUser);
                        } else break;
                    }
                }
            }

        });

        modalProcess.on('focus', 'input[type="text"]', function () {
            $(this).select();
        });

        modalProcess.on('click', '[data-dismiss="modal"]', function () {
            $.fullscreen.exit();
        });

        modalProcess.on('click', '.btn-process-image-claims', function (e) {
            e.preventDefault();

            var $btn = $(this);
            var ocrfilehash = $btn.data('ocrfilehash');
            var claimId = $btn.data('id');

            Kalert.confirm('You want to process these claim records', function () {
                saveImageDetails(modalProcess, ocrfilehash, claimId, function (err, rows) {
                    if (!err && rows) {
                        $.ajax({
                            url: MAIN_URL,
                            type: 'POST',
                            dataType: 'JSON',
                            data: {
                                processImageClaim: true,
                                id: claimId,
                                rows: JSON.stringify(rows)
                            },
                            success: function (resp) {
                                if (resp && resp.status) {
                                    Msg.success(resp.messages);
                                    modalProcess.modal('hide');
                                    reloadClaimsList(function () {

                                    });
                                } else {
                                    flog("saveImageDetails", resp, resp.messages);
                                    Msg.error(resp.messages || 'An unknown error processing the claims. Please contact your administrators to resolve this issue.');
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                Msg.error('Error in processing claims: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                                flog('Error in processing claims', jqXHR, textStatus, errorThrown);
                            }
                        });
                    }
                });
            });
        });

        modalProcess.on('click', '.btn-save-image-claims', function (e) {
            e.preventDefault();

            var $btn = $(this);
            var action;

            if ($btn.hasClass('btn-save-image-claims')) {
                action = 'save';
            }

            Kalert.confirm('You want to save this claim', function () {
                saveImageDetails(modalProcess, $btn.data('ocrfilehash'), $btn.data('id'), function (err, rows) {
                    if (!err) {
                        Msg.success("Claims save done successfully");
                    }
                });
            });
        });

        $('.btn-reject-image-claims').on('click', function (e) {
            if (!confirm('Are you that you want to reject the claim?')) {
                return;
            }

            $.ajax({
                url: MAIN_URL,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    rejectClaims: true,
                    ids: $('.btn-reject-image-claims').data('id')
                },
                success: function (resp) {
                    if (resp && resp.status) {
                        reloadClaimsList(function () {
                            Msg.success('Rejection succeed');
                        });
                        modalProcess.modal('hide');
                    } else {
                        alert('Error in rejecting claims. Please contact your administrators to resolve this issue.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error in rejecting claims: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                    flog('Error in rejecting claims', jqXHR, textStatus, errorThrown);
                }
            });
        });

        table.on('click', '.btn-review-claim', function () {
            var $this = $(this);

            var $tableClaimItemsBody = $('#table-claim-items-body');
            $tableClaimItemsBody.html("");

            $.get('/getSearchClaimItemsResult?claimRecordId=' + $this.data('id')).success(function (response) {
                response = JSON.parse(response);
                var html = '';

                if (!response.data.length) {
                    html += '<td colspan="99">No claim found</td>';
                } else {
                    for (counter = 0; counter < response.data.length; counter++) {
                        var record = response.data[counter];

                        html += '<tr>';
                        html += '   <td>' + record.amount + '</td>';
                        html += '   <td>' + record.productSku + '</td>';
                        html += '   <td><abbr class="timeago" title="' + record.soldDate.formatDateISO8601 + '">' + record.soldDate.formatTimeLong + '</abbr></td>';
                        html += '   <td><a href="/manageUsers/' + record.soldById + '/">' + record.soldBy + '</a></td>';
                        html += '   <td><abbr class="timeago" title="' + record.modifiedDate.formatDateISO8601 + '">' + record.modifiedDate.formatTimeLong + '</abbr></td>';
                        html += '</tr>';
                    }
                }

                $tableClaimItemsBody.html(html).find('.timeago').timeago();
            });
        });
    }

    function isBlank(v) {
        return (v === null || typeof v === 'undefined' || v.toString().trim().length < 1);
    }

    function saveImageDetails(modalProcess, ocrfilehash, claimId, cb) {
        var columns = [];
        var $columns_select = modalProcess.find('th select');
        $columns_select.each(function () {
            var thisVal = this.value;

            if (isBlank(thisVal)) {
                thisVal = 'doNotImport';
            }

            columns.push(thisVal);
        });

        var rows = [];
        var tableRows = modalProcess.find('tbody > tr');
        tableRows.each(function (_, item) {
            var tr = $(item);
            var inputs = tr.find('input[type="text"]');
            var row = {
                'cells': [],
                'index': tr.data('index')
            };

            inputs.each(function (i, n) {
                var $input = $(this);
                flog("process col", i, columns[i], $input.val());
                row.cells.push({column: columns[i], value: this.value, confidence: $.trim($input.closest('td').find('span').html())});
            });

            rows.push(row);
        });

        setTimeout(function () {
            $.ajax({
                url: MAIN_URL,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    processImageClaims: true,
                    action: 'save',
                    rows: JSON.stringify(rows),
                    old_hash: ocrfilehash,
                    id: claimId,
                    totalConfidence: modalProcess.find('.totalConfidence span').html()
                },
                async: false,
                success: function (resp) {
                    reloadClaimsList();

                    flog('RESP ', resp);

                    modalProcess.find('[name="select-all"]').prop('checked', false);
                    modalProcess.find('select').removeAttr('disabled');
                    modalProcess.find('input').removeAttr('disabled');

                    if (typeof cb === 'function') {
                        cb(null, rows);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('Error in checking address: ', jqXHR, textStatus, errorThrown);
                    Msg.error("Something went wrong !");

                    modalProcess.find('select').removeAttr('disabled');
                    modalProcess.find('input').removeAttr('disabled');

                    if (typeof cb === 'function') {
                        cb(true);
                    }
                }
            });
        }, 200);
    }

    function reloadClaimsList(callback) {
        $('#table-claims-body').reloadFragment({
            url: window.location.pathname + window.location.search,
            whenComplete: function () {
                $('.timeago').timeago();

                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
    }

})(jQuery);