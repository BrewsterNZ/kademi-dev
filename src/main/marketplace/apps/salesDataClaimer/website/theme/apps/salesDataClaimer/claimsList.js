(function ($) {
    var MAIN_URL = '/salesDataClaims/';
    
    $(function () {
        var components = $('.claims-list-component');
        
        if (components.length > 0) {
            initModalAddClaim();
            initModalViewClaim();
            initClaimsTable();
            
            $(document).on('submitted.salesDataClaimer', function () {
                reloadClaimsList();
            });
        }
        
        var formNewClaim = $('.form-new-claim');
        if (formNewClaim.length > 0) {
            formNewClaim.each(function () {
                initFormNewClaim($(this));
            });
        }
        
        var formNewImageClaim = $('.form-new-image-claim');
        if (formNewImageClaim.length > 0) {
            formNewImageClaim.each(function () {
                initFormNewImageClaim($(this));
            });
        }
    });
    
    function initClaimsTable() {
        var table = $('#table-claims');
        var tbody = $('#table-claims-body');
        var modalAdd = $('#modal-add-claim');
        var formAdd = modalAdd.find('form');
        
        table.find('.chk-all').on('click', function () {
            tbody.find(':checkbox:enabled').prop('checked', this.checked);
        });
        
        $('.btn-add-claim').on('click', function (e) {
            e.preventDefault();
            
            formAdd.attr('action', MAIN_URL);
            modalAdd.find('.modal-action').attr('name', 'createClaim');
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
        
        table.on('click', '.btn-view-claim', function (e) {
            e.preventDefault();
            
            var id = $(this).attr('data-id');
            var url = MAIN_URL + id + '/';
            
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status) {
                        var modal = $('#modal-view-claim');
                        
                        $.each(resp.data, function (key, value) {
                            var newValue = value;
                            if (key === 'soldDate') {
                                newValue = '<abbr class="timeago" title="' + value + '">' + value + '</abbr>';
                            }
                            
                            modal.find('.' + key).html(newValue);
                        });
                        
                        modal.find('.thumbnail img').attr('src', resp.data.receipt || '/static/images/photo_holder.png');
                        
                        modal.find('.timeago').timeago();
                        modal.modal('show');
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
        
        table.on('click', '.btn-edit-claim', function (e) {
            e.preventDefault();
            
            var id = $(this).attr('data-id');
            var url = MAIN_URL + id + '/';
            
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status) {
                        formAdd.attr('action', url);
                        modalAdd.find('.modal-action').attr('name', 'updateClaim');
                        
                        $.each(resp.data, function (key, value) {
                            var newValue = value;
                            if (key === 'soldDate') {
                                newValue = moment(value).format('DD/MM/YYYY HH:mm');
                            }
                            
                            modalAdd.find('[name=' + key + ']').val(newValue);
                        });
                        
                        if (resp.data.receipt) {
                            modalAdd.find('.thumbnail img').attr('src', resp.data.receipt);
                            modalAdd.find('.btn-upload-receipt span').html('Upload other receipt');
                            modalAdd.find('.btn-upload-receipt i').attr('class', 'fa fa-check');
                        }
                        
                        modalAdd.find('.thumbnail img').attr('src')
                        
                        modalAdd.modal('show');
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
                                })
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
    }
    
    function initModalViewClaim() {
        flog('initModalViewClaim');
        
        var modal = $('#modal-view-claim');
        
        modal.on('hidden.bs.modal', function () {
            modal.find('.form-control-static').html('');
        });
    }
    
    function initModalAddClaim() {
        flog('initModalAddClaim');
        
        var modal = $('#modal-add-claim');
        var form = modal.find('.form-new-claim');
        
        initFormNewClaim(form, modal);
        
        modal.modal({
            show: false,
            backdrop: 'static'
        });
        
        modal.on('hidden.bs.modal', function () {
            form.find('input').not('[name=soldBy], [name=soldById]').val('');
            form.find('.thumbnail img').attr('src', '/static/images/photo_holder.png');
            form.find('.btn-upload-receipt span').html('Upload receipt');
            form.find('.btn-upload-receipt i').attr('class', 'fa fa-file-picture-o');
        });
    }
    
    function initFormNewClaim(form, modal) {
        flog('initFormNewClaim', form, modal);
        
        if (!form.hasClass('initialized')) {
            form.addClass('initialized');
            
            var successDiv = form.siblings('.sale-claim-success');
            form.find('.date-time-picker').each(function () {
                var input = $(this);
                var format = input.attr('data-format') || 'DD/MM/YYYY';
                
                input.datetimepicker({
                    format: format
                });
            });
            
            form.find('[id^=field_]').each(function () {
                $(this).addClass(this.id);
            });
            
            var txtProductSku = form.find('[name=productSku]');
            var productSearcher = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: '/salesDataClaimsProducts/?q=%QUERY',
                    wildcard: '%QUERY'
                }
            });
            
            txtProductSku.typeahead({
                highlight: true
            }, {
                display: 'value',
                limit: 10,
                source: productSearcher,
                templates: {
                    empty: '<div class="empty-message" style="padding: 0 5px;">No products were <found></found></div>',
                    suggestion: function (data) {
                        return '<div>' + data.value + '<span class="text-muted">(' + data.tokens[1] + ')</span>' + '</div>';
                    }
                }
            });
            
            var inputImage = form.find('[name=receiptImage]');
            var thumbImg = form.find('.thumbnail img');
            var btnUpload = form.find('.btn-upload-receipt');
            inputImage.on('change', function () {
                var file = this.files[0];
                var isImage = $.inArray(file['type'], ['image/gif', 'image/jpeg', 'image/png']) !== -1;
                
                form.find('.img-error').css('display', isImage ? 'none' : 'block');
                
                if (isImage) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        thumbImg.attr('src', e.target.result);
                        btnUpload.find('span').html('Upload other receipt');
                        btnUpload.find('i').attr('class', 'fa fa-check');
                    }
                    reader.readAsDataURL(file);
                }
            });
            
            btnUpload.on('click', function (e) {
                e.preventDefault();
                
                inputImage.trigger('click');
            });
            
            form.forms({
                onSuccess: function () {
                    if (modal) {
                        reloadClaimsList(function () {
                            Msg.success('Your claim has been submitted.');
                            modal.modal('hide');
                        });
                    } else {
                        $(document).trigger('submitted.salesDataClaimer');
                        form.fhide();
                        successDiv.fshow();
                    }
                }
            });
            
            if (!modal) {
                successDiv.find('.btn-submit-other-claim').on('click', function (e) {
                    e.preventDefault();
                    
                    form.find('input').not('[name=soldBy], [name=soldById]').val('');
                    thumbImg.attr('src', '/static/images/photo_holder.png');
                    btnUpload.find('span').html('Upload receipt');
                    btnUpload.find('i').attr('class', 'fa fa-file-picture-o');
                    
                    form.fshow();
                    successDiv.fhide();
                });
            }
        }
    }
    
    function initFormNewImageClaim(form, modal) {
        flog('initFormNewImageClaim', form, modal);
        
        if (!form.hasClass('initialized')) {
            form.addClass('initialized');
            
            var successDiv = form.siblings('.sale-claim-success');
            var name = form.find('[name=name]');
            
            
            var inputImage = form.find('[name=claimImage]');
            var thumbImg = form.find('.thumbnail img');
            var btnUpload = form.find('.btn-upload-image-claim');
            
            inputImage.on('change', function () {
                var file = this.files[0];
                var isImage = $.inArray(file['type'], ['image/gif', 'image/jpeg', 'image/png']) !== -1;
                
                form.find('.img-error').css('display', isImage ? 'none' : 'block');
                
                if (isImage) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        thumbImg.attr('src', e.target.result);
                        btnUpload.find('i').attr('class', 'fa fa-check');
                    }
                    reader.readAsDataURL(file);
                }
            });
            
            btnUpload.on('click', function (e) {
                e.preventDefault();
                
                inputImage.trigger('click');
            });
            
            form.forms({
                onSuccess: function () {
                    if (modal) {
                        reloadClaimsList(function () {
                            Msg.success('Your claim image has been submitted.');
                            modal.modal('hide');
                        });
                    } else {
                        $(document).trigger('submitted.salesDataClaimer');
                        form.fhide();
                        successDiv.fshow();
                    }
                }
            });
            
            if (!modal) {
                successDiv.find('.btn-submit-other-claim').on('click', function (e) {
                    e.preventDefault();
                    
                    form.find('input').not('[name=name]').val('');
                    thumbImg.attr('src', '/static/images/photo_holder.png');
                    btnUpload.find('span').html('Upload claim image');
                    btnUpload.find('i').attr('class', 'fa fa-file-picture-o');
                    
                    form.fshow();
                    successDiv.fhide();
                });
            }
        }
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