function initManageExtraField() {
    flog("initManageExtraField");
    initCRUDExtraField();
    initExtraFieldModal();
    initExtraField();
}

function initExtraField() {
    var table = $('#table-extra-field');
    var tbody = table.find('tbody');

    tbody.find('tr').each(function () {
        var tr = $(this);
        var key = tr.find('input[name=key]').val();
        var value = tr.find('input[name=value]').val();

        tr.html(buildExtraField(key, value));
    });
}

function initCRUDExtraField() {
    // Add extra field
    $('.btn-add-extra-field').on('click', function (e) {
        e.preventDefault();
        flog("initCRUDExtraField - add field");
        openExtraFieldModal();
    });

    var tableField = $('#table-extra-field');

    // Edit extra field
    tableField.on('click', '.btn-edit-extra-field', function (e) {
        e.preventDefault();

        var btn = $(this);
        var tr = btn.closest('tr');
        var key = tr.find('input[name=key]').val();
        var value = tr.find('input[name=value]').val();

        tr.addClass('editing');

        openExtraFieldModal(key, value);
    });

    // Delete extra field
    tableField.on('click', '.btn-delete-extra-field', function (e) {
        e.preventDefault();

        if (confirm('Do you want to remove this field?')) {
            var btn = $(this);
            var fieldName = btn.attr('href');
            var fieldWrapper = btn.closest('tr');
            var groupHref = fieldWrapper.closest('table').attr('data-group-href');

            flog('removeField', groupHref, fieldName, fieldWrapper);
            try {
                $.ajax({
                    type: "POST",
                    url: groupHref,
                    data: {
                        removeFieldName: fieldName
                    },
                    success: function(data) {
                        flog('saved ok', data);
                        fieldWrapper.remove();
                    },
                    error: function(resp) {
                        flog('error', resp);
                        Msg.error('There was an error removing the field. Please check your internet connection');
                    }
                });
            } catch (e) {
                flog('exception in removeField', e);
            }
        }
    });
}

function openExtraFieldModal(key, value) {
    flog("openExtraFieldModal");
    var modal = $('#modal-extra-field');

    if (key && value) {
        var txtName = $('#extra-field-name');
        var chkRequire = $('#extra-field-required');
        var chkIndexed = $('#extra-field-indexed');
        var txtText = $('#extra-field-text');
        var optionWrapper = $('#options-wrapper');
        var orgSel = $('#org-sel');

        txtName.val(key);

        var values = getValue(value, key);

        chkRequire.prop('checked', values.require);
        flog("indexed", chkIndexed, values.indexed);
        chkIndexed.prop('checked', values.indexed);
    	orgSel.prop('checked', values.orgSel);
        txtText.val(values.text);

        var optionString = '';
        if (values.options) {
            var options = values.options.split(',');
            $.each(options, function (i, item) {
                optionString += renderOption(item);
            });
        }

        optionWrapper.html(optionString);
        modal.addClass('edit');
    }

    modal.modal('show');
    modal.on('hidden.bs.modal', function () {
        modal.removeClass('edit');
        modal.find('input').val('');
        modal.find('input:checkbox').attr('checked', false);
        $('#table-extra-field').find('tr.editing').removeClass('editing');
        $('#options-wrapper').html('');
    });
}

function renderOption(optionText) {
    return (
        '<div class="form-group">' +
            '<div class="col-md-offset-4 col-md-8">' +
                '<div class="option input-group input-group-sm">' +
                    '<input type="text" class="form-control required" value="' + (optionText || '') + '" />' +
                    '<span class="input-group-btn">' +
                        '<button class="btn btn-danger btn-delete-option" type="button"><i class="fa fa-times"></i></button>' +
                    '</span>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}

function initExtraFieldModal() {
    var modal = $('#modal-extra-field');
    var chkRequire = $('#extra-field-required');
    var chkIndex = $('#extra-field-indexed');
    var txtText = $('#extra-field-text');
    var optionWrapper = $('#options-wrapper');
    var btnAddOption = modal.find('.btn-add-option');
    var orgSel = $('#org-sel');

    // Add options
    btnAddOption.on('click', function (e) {
        e.preventDefault();
        if (!orgSel.prop('checked')) {
        	optionWrapper.append(
        		renderOption()
        	);
        }
    });

    // Add group selector
    orgSel.on('click', function (e) {
        if (orgSel.prop('checked')) {
        	optionWrapper.html('');
        	btnAddOption.addClass('disabled');
        } else {
        	btnAddOption.removeClass('disabled');
        }
    });

    // Delete options
    optionWrapper.on('click', '.btn-delete-option', function (e) {
        e.preventDefault();

        var btn = $(this);

        btn.closest('.option').remove();
    });


    var tbody = $('#table-extra-field').find('tbody');
    var form = modal.find('form');
    var txtName = form.find('input[name=addFieldName]');
    var txtValue = form.find('input[name=addFieldValue]');

    form.forms({
        confirmMessage: null,
        onValid: function () {
            var valueString = '';

            // Required
            if (chkRequire.is(':checked')) {
                valueString += 'required;';
            }

            if( chkIndex.is(":checked")) {
                valueString += 'indexed;';
            }

            // Options
            if (orgSel.prop('checked')) {
            	valueString += 'orgs();';
            } else {
            	valueString += 'options(';
            	var options = [];
            	optionWrapper.find('input:text').each(function () {
            		var input = $(this);
            		var optionText = input.val().trim();

            		options.push(optionText);
            	});
            	valueString += options.join(',');
            	valueString += ');';
            }

            // Text
            valueString += 'text=' + txtText.val().trim();

            txtValue.val(valueString);
        },
        callback: function(resp) {
            if (resp.status) {
                var isEdit = modal.hasClass('edit');
                var key = txtName.val();
                var value = txtValue.val();
                var newFieldString = buildExtraField(key, value);

                if (isEdit) {
                    tbody.find('.editing').html(newFieldString).removeClass('edit');
                } else {
                    tbody.append('<tr>' + newFieldString + '</tr>');
                }

                modal.modal('hide');
            } else {
                Msg.error('Could not add the field. Please check your input and try again');
            }
        }
    });
}

function getValue(value, key) {
    var values = value.split(';');
    var isRequired = false;
    var isOrgSel = false;
    var isIndexed = false;

    var text = key;
    var options = "";
    for( i=0; i<values.length; i++) {
        var s = values[i];
        if( s.startsWith("text=")) {
            text = s.substring(5);
        } else if (s.startsWith("options")) {
            options = s;
            options = options.replace(/^options\((.*)\)$/, '$1');
        } else if (s === "required") {
            isRequired = true;
        } else if (s === "indexed") {
            isIndexed = true;
        } else if (s.startsWith("orgs(")) {
        	isOrgSel = true;
        }
    }

    return {
        require: isRequired,
        text: text,
        options: options,
        orgSel: isOrgSel,
        indexed: isIndexed
    };
}

function buildExtraField(key, value) {
    var string = '';
    var values = getValue(value, key);
    var required = values.require ? '<i class="clip-notification-2 text-danger"></i>' : '';
    var indexed = values.indexed ? '<i class="clip-notification-2 text-danger"></i>' : '';
    var text = values.text;
    var options = values.options.replace(/,/g, ', ');

    // Key
    string += '<td>' + key;
    string += '<input type="hidden" value="' + key + '" name="key" />';
    string += '<input type="hidden" value="' + value + '" name="value" />';
    string += '</td>';

    // Text
    string += '<td>' + text + '</td>';

    // Required
    string += '<td>' + required + '</td>';

    string += '<td>' + indexed + '</td>';

    // Options
    string += '<td>' + options + '</td>';

    // Action
    string +=
        '<td class="action">' +
            '<div class="btn-group btn-group-sm">' +
                '<a href="" class="btn btn-sm btn-info btn-edit-extra-field">' +
                    '<i class="fa fa-edit"></i> Edit' +
                '</a>' +
                '<button class="btn btn-sm btn-info btn-sm dropdown-toggle" data-toggle="dropdown">' +
                    '<span class="caret"></span>' +
                '</button>' +
                '<ul class="dropdown-menu pull-right" role="menu">' +
                    '<li><a href="' + key + '" class="btn-delete-extra-field"><i class="fa fa-times"></i> Delete</a></li>' +
                '</ul>' +
            '</div>' +
        '</td>';

    return string;
}