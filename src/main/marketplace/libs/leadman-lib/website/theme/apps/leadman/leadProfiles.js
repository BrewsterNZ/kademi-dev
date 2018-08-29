// function initLeadUploads() {
//     var importTotalCount = 0;
//     importWizardStarted = false;
//
//     var form = $("#leadsImporterWizard form");
//
//     $("#leadImporterFunnelName").on("change", function () {
//         var funnelName = $(this).val();
//         flog("Selected funnel ", funnelName);
//         $('#uploadWrapper').html("<div id='btn-upload' class='pull-left'></div>");
//         if (funnelName !== undefined && funnelName !== "") {
//             var href = window.location.pathname + "?funnelName=" + funnelName;
//             flog("Upload href ", href);
//             $('#btn-upload').mupload({
//                 url: href,
//                 acceptedFiles: '.csv',
//                 useJsonPut: false,
//                 buttonText: '<i class="clip-folder"></i> Upload CSV',
//                 oncomplete: function (resp, name, href) {
//                     flog("oncomplete", resp, name, href);
//
//                     var data = resp.result.data;
//                     flog("got data", data);
//                     var table = data.table;
//                     form.find("input[name=fileHash]").val(table.hash);
//                     var fields = data.destFields;
//                     var thead = $("#importerHead");
//                     thead.html("");
//                     flog("headers:", data.numCols);
//                     thead.append("<th>#</th>");
//                     for (var col = 0; col < data.numCols; col++) {
//                         var td = $("<th>");
//                         thead.append(td);
//                         var select = $("<select class='form-control' name='col" + col + "'>");
//                         select.append("<option value=''>[Do not import]</option>");
//
//                         for (var field in fields) {
//                             select.append("<option value='" + field + "'>" + fields[field] + "</option>");
//                         }
//
//                         td.append(select);
//                     }
//                     flog("done head", thead);
//
//                     var tbody = $("#importerBody");
//                     tbody.html("");
//                     var numRows = 0;
//                     $.each(table.rows, function (i, row) {
//                         if (numRows < 50) {
//                             numRows++;
//                             var tr = $("<tr>");
//                             tbody.append(tr);
//                             var td = $("<td>" + i + "</td>");
//                             tr.append(td);
//                             $.each(row, function (i, cell) {
//                                 var td = $("<td>");
//                                 td.html(cell);
//                                 tr.append(td);
//                             });
//                         }
//                     });
//
//                     $('#liWizard').wizard("next");
//                 }
//             });
//         }
//     });
//
//     $('#liWizard').wizard();
//     $('#leadsImporterWizard').on('show.bs.collapse', function () {
//         var curStep = $('#liWizard').wizard('selectedItem');
//         if (!form.find('input[name=fileHash]').val()) {
//             curStep = {step: 1};
//         }
//         $('#liWizard').wizard('selectedItem', curStep);
//     });
//     $('#liWizard').on('finished.fu.wizard', function (evt, data) {
//         $('.leadsImporterWizard').trigger('click');
//         $('#liWizard').wizard('selectedItem', {step: 1});
//         $('#liWizard').find('form').trigger('reset');
//         form.find("input[name=fileHash]").val('')
//     });
//
//     $('#liWizard').on('changed.fu.wizard', function (evt, data) {
//         if (data.step === 1) {
//             // IE 11 fix
//             var ul = $('#leadsImporterWizard').find('ul.steps');
//             if (ul.css('margin-left') !== '0') {
//                 ul.css('margin-left', '0');
//             }
//         }
//
//         if (data.step === 3) {
//             var fileHash = form.find('[name=fileHash]').val();
//             var startRow = form.find('[name=startRow]').val();
//             var formData = {beforeImport: 'beforeImport', fileHash: fileHash, startRow: startRow};
//             form.find('select').each(function () {
//                 if (this.value) {
//                     formData[this.name] = this.value;
//                 }
//             });
//
//             form.find('[type=submit]').addClass('hide');
//             form.find("#result").hide();
//             form.find('#noValidRow').addClass('hide');
//             $('#toManyErrors').hide();
//
//             form.find('.beforeImportInfo').html('<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>');
//
//             $.ajax({
//                 url: window.location.pathname,
//                 data: formData,
//                 type: 'post',
//                 dataType: 'json',
//                 success: function (resp) {
//                     if (resp.status && resp.data) {
//                         form.find('[type=submit]').removeClass('hide');
//                         var invalidRows = resp.data.invalidRows.length;
//                         if (resp.data.invalidRows.length != 0) {
//                             invalidRows--;
//                         }
//
//                         form.find(".beforeImportInfo").text(
//                                 'Data status: New profiles found: ' + resp.data.newImportsCount
//                                 + ', existing profiles found: ' + resp.data.existingImportsCount
//                                 + ', invalid records: ' + invalidRows);
//
//                         var invalidRowsBody = form.find(".beforeImportInvalidRows");
//                         invalidRowsBody.html("");
//                         if (resp.data.invalidRows) {
//                             form.find("#result").show();
//                             for (var i = 0; i < resp.data.invalidRows.length; i++) {
//                                 var row = resp.data.invalidRows[i];
//                                 flog("row", row);
//                                 var tr = $("<tr>");
//                                 for (var col = 0; col < row.length; col++) {
//                                     var colText = row[col];
//                                     tr.append("<td>" + colText + "</td>");
//                                 }
//                                 invalidRowsBody.append(tr);
//                             }
//                         }
//
//                         importTotalCount = resp.data.newImportsCount + resp.data.existingImportsCount
//
//                         $('#result').show();
//                         $('#processing').hide();
//                         if (importTotalCount == 0 || resp.data.toManyErrors) {
//                             form.find('[type=submit]').attr('disabled', true);
//
//                             if (resp.data.toManyErrors) {
//                                 $('#toManyErrors').show();
//                             } else {
//                                 form.find('#noValidRow').removeClass('hide');
//                             }
//                         } else {
//                             form.find('#noValidRow').addClass('hide');
//                             form.find('[type=submit]').attr('disabled', false);
//                         }
//                     } else {
//                         form.find(".beforeImportInfo").text('Cannot verify data to import');
//                     }
//                 },
//                 error: function (err) {
//                     form.find(".beforeImportInfo").text('Cannot verify data to import');
//                 }
//             });
//         }
//     });
//
//     $('#liWizard').on('actionclicked.fu.wizard', function (evt, data) {
//         if (data.step === 1 && $('#leadsImporterWizard').attr('aria-expanded') == 'true') {
//             if (form.find("input[name=fileHash]").val() == "") {
//                 if ($('#btn-upload').length) {
//                     alert("Please select a file to upload");
//                     evt.preventDefault();
//                 }
//             }
//         }
//
//         if (data.step === 2) {
//             var startRow = $('#startRow').val();
//             if (!startRow) {
//                 alert('Please enter start row value');
//                 $('#startRow').trigger('focus').parents('.form-group').addClass('has-error');
//                 evt.preventDefault();
//                 return false;
//             } else {
//                 $('#startRow').parents('.form-group').removeClass('has-error');
//             }
//
//             var importerHead = $('#importerHead');
//             var selectedCols = [];
//             importerHead.find('select').each(function () {
//                 if (this.value === 'leadProfileEmail') {
//                     selectedCols.push(this.value);
//                 }
//             });
//
//             if (selectedCols.length < 1) {
//                 alert('Please select column data that contains the lead email to continue');
//                 importerHead.find('select').first().trigger('focus');
//                 evt.preventDefault();
//             }
//         }
//     });
//
//     flog("Init importer form", form);
//     form.forms({
//         validate: function () {
//             if (importWizardStarted) {
//                 $('#liWizard').wizard("next");
//
//                 var resultCustomValidate = {
//                     error: 1,
//                     errorMessages: [" That task is already in progress. Please cancel it or wait until it finishes"]
//                 };
//
//                 return resultCustomValidate;
//             }
//         },
//         onError: function (resp, form, config) {
//             Msg.error(resp.messages[0]);
//             flog("doLeadCheckProcessStatus");
//             doLeadCheckProcessStatus();
//             $('#liWizard').wizard("next");
//         },
//         beforePostForm: function (form, config, data) {
//             importWizardStarted = true;
//             return data;
//         },
//         onSuccess: function (resp, form, config) {
//             $('#liWizard').wizard("next");
//             flog("doLeadCheckProcessStatus");
//             doLeadCheckProcessStatus();
//         }
//     });
//
//     $('#btn-cancel-lead-import').on('click', function (e) {
//         e.preventDefault();
//         $.ajax({
//             type: 'post',
//             url: '/leads',
//             data: {cancel: 'cancel'},
//             success: function (data) {
//                 Msg.success('Import task cancelled');
//             },
//             error: function () {
//
//             }
//         });
//     });
// }

// var importTotalCount = 0;
// importWizardStarted = false;

// function initUploads() {
//     var form = $("#importerWizard form");
//
//     $('#myWizard').wizard();
//     $('#importerWizard').on('show.bs.collapse', function () {
//         var curStep = $('#myWizard').wizard('selectedItem');
//         if (!form.find('input[name=fileHash]').val()) {
//             curStep = {step: 1};
//         }
//         $('#myWizard').wizard('selectedItem', curStep);
//     });
//     $('#myWizard').on('finished.fu.wizard', function (evt, data) {
//         $('.importerWizard').trigger('click');
//         $('#myWizard').wizard('selectedItem', {step: 1});
//         $('#myWizard').find('form').trigger('reset');
//         form.find("input[name=fileHash]").val('')
//     });
//
//     $('#myWizard').on('changed.fu.wizard', function (evt, data) {
//         if (data.step === 1) {
//             // IE 11 fix
//             var ul = $('#myWizard').find('ul.steps');
//             if (ul.css('margin-left') !== '0') {
//                 ul.css('margin-left', '0');
//             }
//         }
//
//         if (data.step === 3) {
//             var fileHash = form.find('[name=fileHash]').val();
//             var startRow = form.find('[name=startRow]').val();
//             var formData = {beforeImport: 'beforeImport', fileHash: fileHash, startRow: startRow};
//             form.find('select').each(function () {
//                 if (this.value) {
//                     formData[this.name] = this.value;
//                 }
//             });
//
//             form.find('[type=submit]').addClass('hide');
//             form.find("#result").hide();
//             form.find('#noValidRow').addClass('hide');
//             $('#toManyErrors').hide();
//
//             form.find('.beforeImportInfo').html('<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>');
//
//             $.ajax({
//                 url: window.location.pathname,
//                 data: formData,
//                 type: 'post',
//                 dataType: 'json',
//                 success: function (resp) {
//                     if (resp.status && resp.data) {
//                         form.find('[type=submit]').removeClass('hide');
//                         var invalidRows = resp.data.invalidRows.length;
//                         if (resp.data.invalidRows.length != 0) {
//                             invalidRows--;
//                         }
//
//                         form.find(".beforeImportInfo").text(
//                                 'Data status: New profiles found: ' + resp.data.newImportsCount
//                                 + ', existing profiles found: ' + resp.data.existingImportsCount
//                                 + ', invalid records: ' + invalidRows);
//
//                         var invalidRowsBody = form.find(".beforeImportInvalidRows");
//                         invalidRowsBody.html("");
//                         if (resp.data.invalidRows) {
//                             form.find("#result").show();
//                             for (var i = 0; i < resp.data.invalidRows.length; i++) {
//                                 var row = resp.data.invalidRows[i];
//                                 flog("row", row);
//                                 var tr = $("<tr>");
//                                 for (var col = 0; col < row.length; col++) {
//                                     var colText = row[col];
//                                     tr.append("<td>" + colText + "</td>");
//                                 }
//                                 invalidRowsBody.append(tr);
//                             }
//                         }
//
//                         importTotalCount = resp.data.newImportsCount + resp.data.existingImportsCount
//
//                         $('#result').show();
//                         $('#processing').hide();
//                         if (importTotalCount == 0 || resp.data.toManyErrors) {
//                             form.find('[type=submit]').attr('disabled', true);
//
//                             if (resp.data.toManyErrors) {
//                                 $('#toManyErrors').show();
//                             } else {
//                                 form.find('#noValidRow').removeClass('hide');
//                             }
//                         } else {
//                             form.find('#noValidRow').addClass('hide');
//                             form.find('[type=submit]').attr('disabled', false);
//                         }
//                     } else {
//                         form.find(".beforeImportInfo").text('Cannot verify data to import');
//                     }
//                 },
//                 error: function (err) {
//                     form.find(".beforeImportInfo").text('Cannot verify data to import');
//                 }
//             });
//         }
//     });
//
//     $('#myWizard').on('actionclicked.fu.wizard', function (evt, data) {
//         if (data.step === 1 && $('#importerWizard').attr('aria-expanded') == 'true') {
//             if (form.find("input[name=fileHash]").val() == "") {
//                 if ($('#btn-upload').length) {
//                     alert("Please select a file to upload");
//                 } else {
//                     alert("Sale Group hasn't been set. Please contact administrator for assistant.");
//                 }
//                 evt.preventDefault();
//             }
//         }
//
//         if (data.step === 2) {
//             var startRow = $('#startRow').val();
//             if (!startRow) {
//                 alert('Please enter start row value');
//                 $('#startRow').trigger('focus').parents('.form-group').addClass('has-error');
//                 evt.preventDefault();
//                 return false;
//             } else {
//                 $('#startRow').parents('.form-group').removeClass('has-error');
//             }
//
//             var importerHead = $('#importerHead');
//             var selectedCols = [];
//             importerHead.find('select').each(function () {
//                 if (this.value === 'email') {
//                     selectedCols.push(this.value);
//                 }
//             });
//
//             if (selectedCols.length < 1) {
//                 alert('Please select column data that contains email to continue');
//                 importerHead.find('select').first().trigger('focus');
//                 evt.preventDefault();
//             }
//         }
//     });
//
//     flog("Init importer form", form);
//     form.forms({
//         validate: function () {
//             if (importWizardStarted) {
//                 $('#myWizard').wizard("next");
//
//                 var resultCustomValidate = {
//                     error: 1,
//                     errorMessages: [" That task is already in progress. Please cancel it or wait until it finishes"]
//                 };
//
//                 return resultCustomValidate;
//             }
//         },
//         onError: function (resp, form, config) {
//             Msg.error(resp.messages[0]);
//             doCheckProcessStatus();
//             $('#myWizard').wizard("next");
//         },
//         beforePostForm: function (form, config, data) {
//             importWizardStarted = true;
//             return data;
//         },
//         onSuccess: function (resp, form, config) {
//             $('#myWizard').wizard("next");
//             doCheckProcessStatus();
//         }
//     });
//
//     $('#btn-upload').mupload({
//         acceptedFiles: '.csv',
//         url: window.location.pathname,
//         useJsonPut: false,
//         buttonText: '<i class="clip-folder"></i> Upload CSV',
//         oncomplete: function (resp, name, href) {
//             flog("oncomplete", resp, name, href);
//
//             var data = resp.result.data;
//             flog("got data", data);
//             var table = data.table;
//             form.find("input[name=fileHash]").val(table.hash);
//             var fields = data.destFields;
//             var thead = $("#importerHead");
//             thead.html("");
//             flog("headers:", data.numCols);
//             thead.append("<th>#</th>");
//             for (var col = 0; col < data.numCols; col++) {
//                 var td = $("<th>");
//                 thead.append(td);
//                 var select = $("<select class='form-control' name='col" + col + "'>");
//                 select.append("<option value=''>[Do not import]</option>");
//
//                 for (var field in fields) {
//                     select.append("<option value='" + field + "'>" + fields[field] + "</option>");
//                 }
//
//                 td.append(select);
//             }
//             flog("done head", thead);
//
//             var tbody = $("#importerBody");
//             tbody.html("");
//             var numRows = 0;
//             $.each(table.rows, function (i, row) {
//                 if (numRows < 50) {
//                     numRows++;
//                     var tr = $("<tr>");
//                     tbody.append(tr);
//                     var td = $("<td>" + i + "</td>");
//                     tr.append(td);
//                     $.each(row, function (i, cell) {
//                         var td = $("<td>");
//                         td.html(cell);
//                         tr.append(td);
//                     });
//                 }
//             });
//
//             $('#myWizard').wizard("next");
//         }
//     });
//
//     $('#btn-cancel-import').on('click', function (e) {
//         e.preventDefault();
//
//         $.ajax({
//             type: 'post',
//             url: '/custs',
//             data: {cancel: 'cancel'},
//             success: function (data) {
//                 Msg.success('Import task cancelled');
//             },
//             error: function () {
//
//             }
//         });
//     });
// }

// function doCheckCallBack() {
//     doLeadSearch();
// }
// function doCheckProcessStatus() {
//     checkProcessStatus($('#myWizard'), doCheckCallBack);
// }

// function doLeadCheckCallBack() {
//     doLeadSearch();
// }
// function doLeadCheckProcessStatus() {
//     checkProcessStatus($('#liWizard'), doLeadCheckCallBack);
// }

// function checkProcessStatus(wizard, callback) {
//     flog("checkProcessStatus -- wizard ", wizard, callback);
//     var jobTitle = $(".job-title");
//     var resultStatus = $('#job-status');
//     $.ajax({
//         type: 'GET',
//         dataType: "json",
//         url: window.location.pathname + "?importStatus",
//         success: function (result) {
//             flog("checkProcessStatus success", result);
//             if (result.status) {
//                 resultStatus.text(result.messages[0]);
//                 if (result.data) {
//                     var state = result.data.state;
//                     flog("checkProcessStatus state", state);
//
//                     if (result.data.statusInfo.complete) {
//                         var dt = result.data.statusInfo.completedDate;
//                         flog("checkProcessStatus Process Completed", dt);
//                         jobTitle.text("Process finished at " + pad2(dt.hours) + ":" + pad2(dt.minutes));
//
//                         if (typeof state.updatedProfiles !== 'undefined') {
//                             wizard.find('.updatedProfiles').text(state.updatedProfiles)
//                         }
//                         if (typeof state.updatedCount !== 'undefined') {
//                             wizard.find('.updatedProfiles').text(state.updatedCount)
//                         }
//                         if (typeof state.createdProfiles !== 'undefined') {
//                             wizard.find('.createdProfiles').text(state.createdProfiles)
//                         }
//                         if (typeof state.createdCount !== 'undefined') {
//                             wizard.find('.createdProfiles').text(state.createdCount)
//                         }
//                         if (typeof state.errorProfiles !== 'undefined') {
//                             wizard.find('.errorProfiles').text(state.errorProfiles)
//                         }
//                         if (typeof state.errorCount !== 'undefined') {
//                             wizard.find('.errorProfiles').text(state.errorCount)
//                         }
//                         flog("checkProcessStatus finished state", state, state.resultHash);
//                         if (typeof state.resultHash !== 'undefined' && state.resultHash != null) {
//                             var href = "/_hashes/files/" + state.resultHash + ".csv";
//                             wizard.find('.errorRows').prop("href", href).closest("a").show();
//                         } else {
//                             wizard.find('.errorRows').closest("a").hide();
//                         }
//
//                         importWizardStarted = false;
//
//                         wizard.wizard("next");
//                         if (typeof callback !== 'undefined') {
//                             callback();
//                         }
//
//                         return; // dont poll again
//                     } else {
//
//                         flog("checkProcessStatus Message", result.messages[0]);
//                         resultStatus.text(result.messages[0]);
//                         var percentComplete;
//
//                         if (typeof state.totalRows !== 'undefined') {
//                             flog("checkProcessStatus rows ", state.totalRows, state.currentRow);
//                             percentComplete = (state.currentRow / state.totalRows) * 100;
//                         } else {
//                             flog("checkProcessStatus messages");
//                             var percentComplete = result.messages[0].split(' ').reverse()[0] / importTotalCount * 100;
//                         }
//
//                         if (isNaN(percentComplete)) {
//                             percentComplete = 0;
//                         }
//                         percentComplete = percentComplete * 0.9; // scale down to a max of 90% so the Org doesnt think they're finished when they're not.
//                         // running
//                         flog("checkProcessStatus percentComplete", percentComplete);
//                         $('#importProgressbar .progress-bar').attr('aria-valuenow', percentComplete).css('width', percentComplete + '%');
//
//                         jobTitle.text("Process running...");
//                     }
//
//                 } else {
//                     // waiting to start
//                     jobTitle.text("Waiting for process job to start ...");
//                 }
//                 window.setTimeout(function () {
//                     checkProcessStatus(wizard, callback);
//                 }, 2500);
//
//             } else {
//                 flog("No task");
//             }
//         },
//         error: function (resp) {
//             flog("weird..", resp);
//         }
//     });
// }

function initDelContacts() {
    $('body').on('click', '.btn-del-contacts', function (e) {
        e.preventDefault();

        var ids = [];
        var checkBoxes = $('[name=select-contact]:checked');

        checkBoxes.each(function (i, item) {
            var chk = $(item);
            ids.push(chk.data('userid'));
        });

        if (ids.length >= 1) {
            if (confirm('Are you sure you want to delete ' + ids.length + ' contacts and all the leads associated with each contact?')) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        deleteContacts: ids.join(',')
                    },
                    success: function () {
                        doLeadSearch(true);
                    },
                    error: function () {
                        Msg.error('Oh No! Something went wrong while trying to delete the contacts.');
                    }
                });
            }
        } else {
            Msg.info('Please select at least 1 contact to delete.');
        }

    });
}

function initSearchLead() {
    $('#user-query').on({
        input: function () {
            typewatch(function () {
                flog('do search');
                doLeadSearch();
            }, 500);
        },
        change: function () {
            typewatch(function () {
                flog('do search');
                doLeadSearch(true);
            }, 500);
        }
    });
    $('#search-group').change(function () {
        doLeadSearch();
    });

    $(document).on('leadContactCreated', function () {
        doLeadSearch(true);
    });

    $('#itemsPerPage').on('change', function () {
        doLeadSearch(true);
    })
}

function doLeadSearch(forceSearch) {
    var lastQuery = $('#user-query').attr('last-query');
    var query = $('#user-query').val();
    // fix the issue on IE that fire the search when focusing on input field
    if (!forceSearch && (lastQuery === query || (typeof lastQuery === 'undefined' && query === ''))) {
        return;
    }
    $('#user-query').attr('last-query', query);
    var groupName = $('#search-group').val();
    flog('doLeadSearch', query, groupName);
    var uri = URI(window.location);
    uri.setSearch('q', query);
    uri.setSearch('g', groupName);
    uri.setSearch('startPos', 0);
    uri.setSearch('pageSize', $('#itemsPerPage').val());
    flog('doLeadSearch', uri.toString());
    var newHref = uri.toString();
    window.history.pushState('', newHref, newHref);
    Msg.info('Searching...', 50000);
    $.ajax({
        type: 'GET',
        url: newHref,
        success: function (data) {
            Msg.info('Search complete', 2000);
            var newDom = $(data);
            var $fragment = newDom.find('#searchResults');
            var contactsPagination = newDom.find('#contactsPagination');

            $('#searchResults').replaceWith($fragment);
            $('#contactsPagination').replaceWith(contactsPagination);


            $('abbr.timeago').timeago();
            initLeadContactsTable();
        },
        error: function (resp) {
            Msg.error('An error occured doing the user search. Please check your internet connection and try again');
        }
    });
}

function initLeadContactsTable() {
    if ($('#leadContactsTable').length){
        var leadContactsTable = $('#leadContactsTable');
        if (leadContactsTable.find('td[colspan=99]').length) return;
        leadContactsTable.DataTable({
            paging: false,
            searching: false,
            destroy: true,
            info: false,
            initComplete: function(settings, json) {
                $('#leadContactsTable').closest('.row').siblings('.row').remove();
            }
        });
    }
}

$(function () {
    var leadContactsTable = $('#leadContactsTable');
    if (leadContactsTable.length > 0) {
        initSearchLead();
        initLeadContactsTable();
        // initUploads();
    }
});