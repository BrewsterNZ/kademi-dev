function initManageDatabase() {
    flog('initManageDatabase');

    var body = $(document.body);
    
    initCsvModal();
    prettyPrintJson();
    initReindexTab(body);
    initDetailsForm();
    initRecordsTab(body);
    initQueryTab();
    initMappingsTab();
}

function initReindexTab(body) {
    flog('initReindexTab');

    initBackgroundJobStatus();

    body.on("click", ".reindexBtn", function(e){
        e.preventDefault();
        $.ajax({
            url: window.location.pathname,
            method: "POST",
            data: {
                reindex : ""
            },
            success: function (resp) {
                Msg.info("Job submitted");
                initBackgroundJobStatus();
            }
        });
    });
}

function initDetailsForm() {
    flog('initDetailsForm');

    $(".database-form").forms({
        callback: function (resp) {
            if (resp.status) {
                if (resp.nextHref !== getFileName(window.location.pathname)) {
                    Msg.info("Renamed db, redirecting..");
                    window.location.href = "../" + resp.nextHref;
                } else {
                    Msg.info("Updated db");
                }
            } else {
                Msg.error("Failed to update db");
            }
        }
    });
}

function initRecordsTab(body) {
    flog('initRecordsTab');
    
    body.on('click', '.deleteDocsBtn', function (e) {
        e.preventDefault();
        var checkBoxes = $('.deleteDoc:checked');
        if (checkBoxes.length == 0) {
            Msg.error('Please select the records you want to remove by clicking the checkboxs to the right');
        } else {
            if (confirm('Are you sure you want to remove ' + checkBoxes.length + ' records?')) {
                doRemoveDocs(checkBoxes);
            }
        }
    });

    $('#addRecordForm').forms({
        callback: function () {
            Msg.info('Done');
            $('#records-body').reloadFragment();
        }
    });
}

function initMappingsTab() {
    flog('initMappingsTab');
    
    var mappingsWrapper = $('#mappings');

    mappingsWrapper.on('click', '.btnEditMapping', function (e) {
        e.preventDefault();
        
        var btn = $(e.target).closest('button');
        btn.hide();
        
        var cont = btn.closest('.mappingContainer');
        cont.find('.btnSaveMapping').show();
        
        var pre = cont.find('pre');
        var height = pre.css('height');
        var source = pre.text();
        var newDiv = $('<textarea class="form-control form-control-code">');
        
        newDiv.val(source);
        pre.replaceWith(newDiv);
        newDiv.css('height', height);
    });

    mappingsWrapper.on('click', '.btnSaveMapping', function (e) {
        e.preventDefault();
        
        var btn = $(e.target).closest('button');
        var cont = btn.closest('.mappingContainer');
        var name = cont.find('h3').text();
        var textarea = cont.find('textarea');
        var source = textarea.val();
        
        saveMapping(name, source);
    });

    $('#addMappingForm').forms({
        callback: function () {
            Msg.info('Done');
            
            $('#mappings').reloadFragment({
                whenComplete: function () {
                    prettyPrintJson();
                }
            });
        }
    });
}

function initQueryTab() {
    flog('initQueryTab');

    $('#queryBtn').click(function (e) {
        e.preventDefault();
        
        var q = $('#queryText').val();
        flog('query', q, $('#query'));
        
        $.ajax({
            url: window.location.pathname,
            method: 'POST',
            data: {
                source: q
            },
            success: function (resp) {
                flog('resp', resp);
                
                var html = $(resp);
                $('#searchResults').html(html.find('#searchResults > *'));
            }
        });
    });
}

function doRemoveDocs(checkBoxes) {
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: 'json',
        url: '',
        success: function (data) {
            flog('success', data);
            if (data.status) {
                $('#records-body').reloadFragment();
                Msg.success('Removed records ok');
            } else {
                Msg.error('There was a problem removing records. Please try again and contact the administrator if you still have problems');
            }
        },
        error: function (resp) {
            Msg.error('An error occurred removing records. You might not have permission to do this');
        }
    });
}

function saveMapping(name, source) {
    $.ajax({
        type: 'POST',
        data: {
            mappingName: name,
            json : source
        },
        dataType: 'json',
        url: '',
        success: function (data) {
            flog('success', data);
            if (data.status) {
                $('#mapping').reloadFragment({
                    whenComplete: function () {
                        prettyPrintJson();
                    }
                });
                Msg.success('Saved mapping');
            } else {
                Msg.error('There was a problem saving the mapping');
            }
        },
        error: function (resp) {
            Msg.error('There was a problem saving the mapping');
        }
    });
}

function prettyPrintJson() {
    flog('prettyPrintJson');

    $('.prettyPrintJson pre').each(function (i, n) {
        var target = $(n);
        var json = target.text();
        var obj = JSON.parse(json);
        var str = JSON.stringify(obj, null, 2);
        target.text(str);
        flog('set json', target, str);
    });
}

function showErrors(result, errors) {
    flog('showErrors', result, errors);

    var table = result.find('table');
    var tbody = table.find('tbody');

    tbody.html('');

    $.each(errors, function (i, row) {
        log('error:', row);

        var tr = $('<tr>');

        tr.append('<td>' + row + '</td>');
        tbody.append(tr);
    });

    result.show();
}

function initCsvModal() {
    flog('initCsvModal');
    
    var modalUploadCsv = $('#csvModal');
    var resultUploadCsv = modalUploadCsv.find('.upload-results');
    
    $('#do-upload-csv').mupload({
        buttonText: '<i class="clip-folder"></i> Upload CSV file',
        url: 'upload.csv',
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            log('oncomplete:', data.result, name, href);

            if (data.result.status) {
                resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
                resultUploadCsv.find('.num-errors').text(data.result.data.errors.length);

                showErrors(resultUploadCsv, data.result.data.errors);
                Msg.success('Upload completed.');
            } else {
                Msg.error('There was a problem uploading the data: ' + data.result.messages);
            }
            $('#records-body').reloadFragment();
        }
    });
}
