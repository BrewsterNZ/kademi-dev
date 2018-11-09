/*$(function () {
 initLeadManEvents();
 });*/

function initLeadManEvents() {
    flog("leadman.js - init");

    window.Msg.iconMode = "fa";
    jQuery.timeago.settings.allowFuture = true;

    // initLeadsDashLoading();
    initNewLeadForm();
    initNewLeadFromEmail();
    initNewQuickLeadForm();
    initNewContactForm();
    initDeleteCust();
    initNewTaskForm();
    initNewQuoteForm();
    initNewNoteForm();
    initTakeTasks();
    initLeadActions();
    initOrgSelector();
    initDateTimePickers();
    initDateTimePikersForModal();
    initTasks();
    initImmediateUpdate();
    initExtraFieldFileUploads();
    initCloseDealModal();
    initCancelLeadModal();
    initCancelTaskModal();
    initTopNavSearch();
    initOrgSearch();
    initProfileSearchTable();
    initTagsInput();
    initAudioPlayer();
    initDeleteFile();
    initCreatedDateModal();
    initLeadmanModal();
    initDotdotdot();
    initSearchFilter();
    initNotesDotDotDot();
    initNoteMoreLess();
    initChangeLeadAvatar();
    initHideModalAndGoLinks();
    initStatsSummaryComponents();
    initOrgFinder();
    initReloadLeads();
    // init the login form
    $(".login").user({});

    // Clear down modals when closed
    $(document.body).on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
    });

    $(document.body).on('loaded.bs.modal', function (e) {
        flog("modal show");
        var modal = $(e.target).closest(".modal");
        jQuery.timeago.settings.allowFuture = true;
        modal.find('abbr.timeago').timeago();
        flog("date picker", modal, modal.find('.date-time'));
        modal.find('.date-time').datetimepicker({
            format: "d/m/Y H:m"
                    //,startDate: date
        });
        var form = modal.find(".completeTaskForm");
        flog("complete task form", form);
        if (form.length > 0) {
            form.forms({
                validate: function (form, config) {
                    var outcomes = form.find('#lead-task-outcomes');
                    if (outcomes.length){
                        var selected = outcomes.find('.outcome:checked').length;
                        if (selected < 1){
                            return {
                                error: 1,
                                errorFields: [outcomes.find('[name="outcome"]')],
                                errorMessages: ["Outcome must be selected"]
                            }
                        }
                    }

                    return true;
                },
                onSuccess: function (resp) {
                    flog("onSuccess", resp, modal);
                    form.closest(".modal").modal("hide");
                    flog("done");
                    Msg.info("Done");
                    reloadTasks();
                }
            });
        }
        if (modal.hasClass("modalInitForm")) {
            modal.find("form").forms({
                onSuccess: function (resp) {
                    flog("onSuccess", resp, modal);
                    Msg.info("Done");
                    form.closest(".modal").modal("hide");
                    flog("done");
                    window.location.reload();
                }
            });
        }
    });
    $(document.body).on("click", ".autoFillText", function (e) {
        e.preventDefault();
        var target = $(e.target).closest("a");
        var text = target.text();
        var inp = target.closest(".input-group").find("input[type=text]");
        flog("autofill", text, inp);
        inp.val(text);
    });
    $('abbr.timeago').timeago();
}

function initOrgFinder() {
        var orgFinders = $(".entity-finder-org");
        flog("initLeadManPage", orgFinders);
        if( orgFinders.length > 0 ) {
            orgFinders.entityFinder({
                type: 'organisation',
                useActualId: true,
                url : '/leads/'
            });
        }

        $("#newOrgModal form").forms({
            onSuccess : function(resp) {
                if( resp.status ) {
                    reloadProfileCompanies()
                    $("#newOrgModal").modal('hide');
                } else {
                    Msg.error("An error occured adding the company " + resp.messages);
                }
            }
        });
}

function initLeadsDashLoading() {
    var div = $("#all_contacts");
    var start = 0;
    var limit = 10;
    if (div.length == 0) {
        return;
    }

    var btn = $('.btn-load-more-lead');
    var loadLeadsDash = function () {
        btn.prop('disabled', true).html('Loading...');

        $.ajax({
            url: '/leads/',
            data: {
                dash: true,
                start: start,
                limit: limit
            },
            dataType: 'html',
            success: function (resp) {
                var leads = $(resp).children();

                if (start === 0) {
                    div.prepend(resp);
                } else {
                    div.find('#dashLeadsList').append(leads);
                }

                div.find('.timeago').timeago();

                if (leads.length < limit) {
                    btn.remove();
                } else {
                    start += limit;
                    btn.prop('disabled', false).html('Load more');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('Error', textStatus, errorThrown);
                btn.prop('disabled', false).html('Load more');
            }
        });
    }

    btn.on('click', function (e) {
        e.preventDefault();

        var btn = $(this);
        if (!btn.hasClass('disabled')) {
            loadLeadsDash();
        }
    });
    setTimeout(loadLeadsDash, 500);
}

function initNewLeadFromEmail() {
    $('.menu-item-menuLeadFromEmail a, .nav-menuLeadFromEmail').on('click', function () {
        $('#modalLeadFromEmail').modal('show');
    });
}

function initCloseDealModal() {
    var closeDealModal = $("#closeDealModal");
    closeDealModal.find("form").forms({
        onSuccess: function (resp) {
            Msg.info('Deal marked as closed');
            if ($('#leadDetailTabs').length) {
                $('#leadDetailTabs').reloadFragment({
                    whenComplete: function () {
                        $('abbr.timeago').timeago();
                        $('#leadDetailTabs').find('#firstTab a').trigger('click');
                    }
                });
            }
            if ($('#all_contacts').length) {
                $('#all_contacts').html('');
                // setTimeout(initLeadsDashLoading, 400);
            }
            // anh
            setTimeout(reloadDashboard, 400);
            closeDealModal.modal('hide');
            $(document).trigger('leadClosed');
        }
    });
}

function initCancelLeadModal() {
    var cancelLeadModal = $("#modalCancelLead");

    cancelLeadModal.on('loaded.bs.modal', function () {
        cancelLeadModal.find("form").forms({
            onSuccess: function (resp) {
                Msg.info('Cancelled!');
                reloadTasks();
                if ($('#all_contacts').length) {
                    $('#all_contacts').html('');
                    // initLeadsDashLoading();
                }

                if ($('#leadDetailTabs').length) {
                    $('#leadDetailTabs').reloadFragment({
                        whenComplete: function () {
                            $('abbr.timeago').timeago();
                            $('#leadDetailTabs').find('#firstTab a').trigger('click')
                        }
                    });
                }
                cancelLeadModal.modal("hide");
                $(document).trigger('leadsRefresh');
            }
        });
    });

    $(document.body).on("click", ".btnLeadCancelLead", function (e) {
        e.preventDefault();
        var href = $(e.target).attr("href");
        cancelLeadModal.find("form").attr("action", href);
        cancelLeadModal.modal("show");
    });
}

function initCancelTaskModal() {
    var cancelTaskModal = $("#cancelTaskModal");
    cancelTaskModal.find("form").forms({
        onSuccess: function (resp) {
            Msg.info('Task cancelled');
            reloadTasks();
            cancelTaskModal.modal("hide");
            $(document).trigger('taskChanged');
        }
    });

    $(document.body).on("click", ".btnCancelTask", function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        flog("set href", href);
        cancelTaskModal.find("form").attr("action", href);
        cancelTaskModal.modal("show");
    });
}


function initImmediateUpdate() {
    var onchange = function (e) {
        flog("field changed", e);
        var target = $(e.target);
        var href = target.data("href");
        var name = target.attr("name");
        var id = href + ':' + name;
        if (timers.hasOwnProperty(id)) {
            var t = timers[id];
            t = clearTimeout(t);
            timers[id] = null;
        }

        var value = target.val();
        var form = target.parents('.form-horizontal');
        var oldValue = target.data("original-value");
        if (value != oldValue) {
            updateField(href, name, value, form);
        }
    };

    var timers = {};

    $(document.body).on("keyup", ".immediateUpdate", function (e) {
        var target = $(e.target);
        var href = target.data("href");
        var name = target.attr("name");
        var id = href + ':' + name;
        if (timers.hasOwnProperty(id)) {
            var t = timers[id];
            t = clearTimeout(t);
            timers[id] = null;
        }

        timers[id] = setTimeout(function () {
            onchange(e);
        }, 1000);
    });
    $(document.body).on("change", ".immediateUpdate", function (e) {

        onchange(e);
    });
    $(document.body).on("dp.change", ".immediateUpdate", function (e) {
        onchange(e);
    });
}

function initExtraFieldFileUploads() {
    var modal = $('#uploadExtraFieldFileModal');
    var form = modal.find('form');

    $('body').on('click', '.btn-upload-file', function (e) {
        e.preventDefault();
        var name = $(this).data("name");
        if (name === undefined) {
            name = $(e.target).data("name");
        }
        flog("Extra field name: ", name);
        if (name !== undefined) {
            modal.find("#extraField").val(name);
            modal.modal('show');
        } else {
            Msg.error('There was a problem. Please refresh the page.');
        }
    });

    $('body').on('click', '.btn-delete-file', function (e) {
        e.preventDefault();
        var btn = $(this);
        var name = btn.data('name');
        var fname = btn.data('fname');
        if (confirm("Are you sure you want to delete " + fname + "?")) {

            var data = {
                deleteExtraFieldFile: true,
                extraField: name,
                name: fname
            };
            flog(data);
            $.ajax({
                url: window.location.href,
                method: "POST",
                dataType: "json",
                data: data,
                success: function (data) {
                    Msg.info('File deleted');
                    reloadFileList();
                    $(".extraFieldsUploadDetails").reloadFragment();
                }
            });
        }
    });

    function reloadFileList() {
        var body = $('#files-body');
        if (body !== undefined) {
            $('#files-body').reloadFragment({
                whenComplete: function () {
                    $('#files-body abbr.timeago').timeago();
                }
            });
        }
    }

    form.forms({
        onSuccess: function (resp) {
            Msg.info('Files Uploaded');
            reloadFileList();
            $(".extraFieldsUploadDetails").reloadFragment();
            modal.modal('hide');
        }
    });
}

function initTasks() {
    $(document.body).on("click", "#assignToMenu a", function (e) {
        e.preventDefault();
        var name = $(e.target).attr("href");
        var href = $(this).closest('ul').data('href');
        mAssignTo(name, href, "assignedBlock");
    });

    $(document.body).on("click", "#assignToMenuTask a", function (e) {
        e.preventDefault();
        var name = $(e.target).attr("href");
        var href = $(this).closest('ul').data('href');
        mAssignTo(name, href, "assignedBlockTask");
    });

    $(document.body).on("click", ".btnTaskDelete", function (e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var href = link.attr("href");
        var name = getFileName(href);

        var c = confirm('Are you sure to cancel this task?');
        if (!c)
            return;
        $.ajax({
            url: href,
            data: {cancelTask: ''},
            dataType: 'text',
            type: 'post',
            success: function () {
                Msg.info('Task cancelled');
                var modal = link.closest(".modal");
                modal.modal("hide");
                reloadTasks();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('Error', textStatus, errorThrown);
            }
        });
    });
    $(document.body).on("click", ".btnTaskDone", function (e) {
        flog("click");
        e.preventDefault();
        $(".completeTaskDiv").show(300);
        $(".hideOnComplete").hide(300);
    });
}

function initOrgSelector() {
    flog("initOrgSelector", $(".selectOrg a"));
    if ($.cookie('org') === null || typeof $.cookie('org') === 'undefined' || $('.selectOrg a[href="' + $.cookie('org') + '"]').length < 1) {
        if ($(".selectOrg a").length) {
            $.cookie("org", $(".selectOrg a").attr('href'), {path: '/'});
            window.location.reload();
        }
    }

    $(".selectOrg").on("click", "a", function (e) {
        e.preventDefault();
        var orgId = $(e.target).closest("a").attr("href");
        flog("initOrgSelector - click", orgId);
        $.cookie("org", orgId, {path: '/'});
        window.location.reload();
    });
}

function initLeadActions() {
    flog("initLeadActions");

    $(document.body).on("click", ".closeLead", function (e) {
        flog("initLeadActions click - close");
        e.preventDefault();
        var href = $(this).attr('href');
        var closeDealModal = $("#closeDealModal");
        closeDealModal.reloadFragment({
            url: href,
            whenComplete: function (resp) {
                closeDealModal.html($(resp).find('#closeDealModal').html());
                var pickers = closeDealModal.find('.date-time');
                flog("pickers", pickers);
                pickers.datetimepicker({
                    format: 'DD/MM/YYYY HH:mm'
                });
                initCloseDealModal();
            }
        });
        closeDealModal.modal();
    });

    $(document.body).on("click", ".updateCreatedDate", function (e) {
        flog("initLeadActions click - updateCreatedDate");
        e.preventDefault();

        var a = $(this);
        var href = a.attr("href");

        showCreatedDateModal(href, a);
    });
}

function initCreatedDateModal() {
    flog('initCreatedDateModal');

    var modal = $('#updateCreatedDateModal');
    var form = modal.find('form');

    form.forms({
        onSuccess: function () {
            var targetId = form.find('[name=leadId]').val();
            var target = $('#' + targetId);
            var createdDate = $('#createDate').val();
            var createdDateISO = moment(createdDate, 'DD/MM/YYYY hh:mm').toISOString();

            flog('Update createdDate', target.find('.timeago'), createdDate, createdDateISO);

            target.find('.timeago').attr({
                title: createdDateISO,
                'data-iso': createdDateISO
            }).timeago("update", createdDateISO);
            Msg.success('Created date is saved!');
            modal.modal('hide');
        }
    });
}

function showCreatedDateModal(href, link) {
    flog('showCreatedDateModal', href, link);

    var modal = $('#updateCreatedDateModal');
    var form = modal.find('form');

    var media = link.closest('.media');
    var id = media.attr('id');
    var createDate = media.find('.timeago').attr('data-iso');

    form.attr('action', href);
    form.find('[name=leadId]').val(id);
    form.find('[name=createDate]').val(moment(createDate).format('DD/MM/YYYY hh:mm'));

    modal.modal('show');
}

function initTakeTasks() {
    $(document.body).on("click", ".takeTask", function (e) {
        flog("click");
        e.preventDefault();
        var href = $(this).attr("href");
        takeTask(href);
    });
}

function initNewLeadForm() {
    flog("initNewLeadForm");
    var modal = $('#newLeadModal');

    modal.on('hidden.bs.modal', function () {
        modal.find('form').trigger('reset');
        $('input[name=newOrgId]', modal).val('');
    });

    $('#newOrgTitle', modal).on('change', function () {
        var inp = $(this);

        if (inp.val().length < 1) {
            $('input[name=newOrgId]', modal).val('');
        }
    });

    $(document).on('click', '.dropdown-menu li:not(.nav-menuLeadFromEmail-wrapper) > [class*="nav-menuAddLead"]', function (e) {
        e.preventDefault();
        var funnelName = $(e.target).closest("a").attr("href");
        flog("initNewLeadForm - click. funnelName=", funnelName, e.target);
        modal.find("select[name=funnel]").val(funnelName).trigger('change');
    });

    $(document).on('change', '#newLeadModal select[name=funnel]', function (e) {
        var s = $(this);
        flog("funnel change", s.val(), s);
        modal.reloadFragment({
            url: window.location.pathname + '?leadName=' + s.val(),
            whenComplete: function () {
                modal.modal("show");
                initOrgSearch();
                initProfileSearchTable();
                initLeadForm();
                initTagsInput();
                modal.find('.selectpicker').selectpicker({
                    maxOptions: 5,
                    liveSearch: true,
                    liveSearchNormalize: true
                });
            }
        });
    });

    function initLeadForm() {
        var form = modal.find('form');
        form.forms({
            validate: function (form, config) {
                flog('validating ... ', form);
                var ret = {
                    error: 0,
                    errorFields: [],
                    errorMessages: []
                };

                // https://github.com/Kademi/kademi-dev/issues/3565
                var taskDescription = form.find('textarea[name=taskDescription]').val();
                if (taskDescription && taskDescription.length > 0 ) {
                    var title = form.find("#newLeadTaskTitle").val();
                    if (!title) {
                        ret.error ++;
                        ret.errorFields.push(form.find("#newLeadTaskTitle"));
                        ret.errorMessages.push("Please complete the task title.");
                    }
                }

                flog("ret ok ", ret);
                return ret;
            },
            beforePostForm: function (form, config, data) {
                flog('beforePost', data);
                data += '&assignedToOrgId=' + $.cookie('org');
                flog('beforePost', data);
                return data;
            },
            onSuccess: function (resp, form, config, event) {
                flog('done new lead', resp, event);
                var btn = form.find(".clicked");

                if (btn.hasClass("btnCreateAndClose")) {
                    Msg.info('Saved');
                    modal.modal("hide");

                    $('#source-frm').val('').trigger("change");
                    $('#newLeadStage').val('').trigger("change");
                    form.trigger('reset');

                    if ($('#all_contacts').length) {
                        $('#all_contacts').html('');
                        // initLeadsDashLoading();
                    }
                    var leadContacts = $('.lead-contacts-wrap');
                    if (leadContacts.length) {
                        leadContacts.reloadFragment({
                            whenComplete: function () {
                            }
                        });
                    }

                    if ($('#leadTable').length) {
                        if (typeof doSearchLeadmanPage === 'function') {
                            doSearchLeadmanPage();
                        }
                    }

                    if ($('#leadAnalyticsPage').length) {
                        if (typeof loadFunnel === 'function') {
                            loadFunnel();
                        }
                    }

                    $(document).trigger('leadsRefresh');
                } else {
                    Msg.info('Saved, going to its details page');
                    if (resp.nextHref) {
                        window.location.href = resp.nextHref;
                    }
                    modal.modal("hide");
                }

            }
        });
        form.find("button").click(function (e) {
            form.find(".clicked").removeClass("clicked");
            $(e.target).closest("a, button").addClass("clicked");
        });
    }
}

function initNewQuickLeadForm() {
    var modal = $('#newQuickLeadModal');
    var form = modal.find('form');
    var formData = null;

    $(document.body).on('click', '.dropdown-menu [class*="nav-menuQuickLead"]', function (e) {
        e.preventDefault();
        var funnelName = $(this).attr("href");

        modal.find('input[name=quickLead]').val(funnelName);
        formData = new FormData();

        modal.modal('show');

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function (position) {
                var geoTag = position.coords.latitude + ":" + position.coords.longitude;
                flog('Got location', geoTag);
                form.find('input[name=geoLocation]').val(geoTag);
            }, function (err) {
                flog('ERROR: ', err.code, err.message);
            });
        } else {
            flog('GeoLocation not supported');
        }
    });

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
    window.URL = window.URL || window.webkitURL;
    var audio_context;
    var recorder = null;

    if (!navigator.getUserMedia) {
        // IE 11 doesnt support this API for now
        form.find('.voiceMemo').remove();
    }

    modal.on('click', '#recordMemo', function (e) {
        e.preventDefault();

        var btn = $(this);
        if (btn.hasClass('btn-success')) { // Not Recording
            audio_context = new AudioContext();
            navigator.getUserMedia({audio: true}, function (stream) {
                var input = audio_context.createMediaStreamSource(stream);
                recorder = new Recorder(input);

                recorder && recorder.record();
                btn.removeClass('btn-success').addClass('btn-danger');
                formData = null;
                $('.audio-rec', form).empty();
                $('.audio-rec', form).hide();
                $('.recording', modal).show();
            }, function (e) {
                flog('No live audio input: ' + e, e);
                $('.voiceMemo', form).remove();
            });
        } else { // Recording
            recorder && recorder.stop();
            recorder && recorder.exportWAV(function (blob) {
                var url = URL.createObjectURL(blob);

                $('.audio-rec', form).html('<audio controls="true" src="' + url + '"></audio>');
                $('.audio-rec', form).show();
                flog('Audio URL', url);
                recorder.clear();
                formData = new FormData();
                formData && formData.append('recording', blob, 'recording_' + (new Date()).getTime() + '.wav');

                recorder = null;
                audio_context.close();
            });
            btn.removeClass('btn-danger').addClass('btn-success');
            $('.recording', modal).hide();
        }
    });

    modal.on('hidden.bs.modal', function (e) {
        form.trigger('reset');
        $('.audio-rec', form).empty();
        $('.audio-rec', form).hide();
        $('.progress', form).hide();
        $('.capture-msg', form).empty();
    });

    $('#quickInputFile', form).on('change', function (e) {
        var msg = $('.capture-msg', form);

        var files = this.files;
        if (files.length > 0) {
            var f = files[0];
            var fname = f.name;
            if (fname.length > 20) {
                fname = fname.substr(0, 17) + '...';
            }

            msg.html(fname + ' | ' + bytesToSize(f.size));

        } else {
            msg.empty();
        }
    });

    form.on('submit', function (e) {
        e.preventDefault();
        form.find('button[type=submit]').html('<i class="fa fa-spin fa-refresh"></i> Upload').attr('disabled', true);

        if (formData == null) {
            formData = new FormData();
        }

        var images = $('input[name=image]', form)[0];
        $.each(images.files, function (i, file) {
            formData.append(images.name, file);
        });

        formData.append('notes', $('[name=notes]', form).val());
        formData.append('quickLead', $('[name=quickLead]', form).val());
        formData.append('geoLocation', $('[name=geoLocation]', form).val());
        formData.append('assignedToOrgId', $.cookie('org'));

        $.ajax({
            type: 'POST',
            url: '/leads/',
            dataType: 'json',
            data: formData,
            processData: false,
            contentType: false,
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                //Upload progress
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = (evt.loaded / evt.total) * 100;
                        $('.progress-bar', form)
                                .html(round(percentComplete, 1) + '%')
                                .css('width', percentComplete + '%');
                        $('.progress', form).show();
                    }
                }, false);
                return xhr;
            },
            success: function (data, textStatus) {
                flog('Success', data, textStatus);
                form.find('button[type=submit]').html('Upload').attr('disabled', false);
                if (data.status) {
                    Msg.info('Saved new lead');
                    modal.modal("hide");
                    $('#all_contacts').reloadFragment({
                        whenComplete: function () {
                            $('abbr.timeago').timeago();
                        }
                    });
                } else {

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('Error', textStatus, errorThrown);
                form.find('button[type=submit]').html('Upload').attr('disabled', false);
            },
        });
    });
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0)
        return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function initNewContactForm() {
    var modal = $('#newContactModal');
    var form = modal.find('form');

    $(".menu-item-menuAddContact, .nav-menuAddContact, .createContact").click(function (e) {
        flog("click");
        e.preventDefault();
        modal.modal("show");
    });

    form.forms({
        onSuccess: function (resp) {
            var btn = form.find('.clicked');
            if (!btn.hasClass('btnCreateClose')) {
                if (resp.nextHref) {
                    window.location.href = resp.nextHref;
                }
            }

            Msg.info('Created contact');
            modal.modal("hide");
            $(document).trigger('leadContactCreated');
        }
    });

    form.find("button").on('click', function (e) {
        form.find(".clicked").removeClass("clicked");
        $(this).addClass("clicked");
    });
}

function initDeleteCust() {
    function showSweetAlert(option) {
        swal({
            title: option.title || 'Are you sure?',
            text: option.message,
            type: option.type || 'warning',
            showCancelButton: true,
            confirmButtonClass: option.btnClass,
            confirmButtonText: option.btnText,
            closeOnConfirm: true,
            showLoaderOnConfirm: false
        }, typeof option.callback === 'function' ? option.callback : null);
    }

    $(".select-all-cust").click(function (e) {
        var checked = this.checked;
        $("#searchResults").find("input[type=checkbox][name=custId]").each(function (index) {
            $(this).prop("checked", checked);
        });
    });

    function removeCustomers() {
        var checkBoxes = $('#searchResults').find('input[type=checkbox][name=custId]:checked');
        var ids = [];
        checkBoxes.each(function (a, item) {
            ids.push($(item).val());
        });
        flog("Going to remove: ", ids);
        $.ajax({
            url: "/custs",
            method: "POST",
            dataType: "json",
            data: {
                deleteContacts: ids.join(',')
            },
            success: function (data) {
                if (data.status) {
                    Msg.info('Processing...');
                    setTimeout(function () {
                        $("#searchResults").reloadFragment();
                        Msg.success('Customers removed successfully');
                    }, 1200);
                } else {
                    if (data.messages.length > 0) {
                        Msg.error(data.messages[0]);
                    } else {
                        Msg.error('Could not remove customers');
                    }
                }
            }
        });
    }

    $(".deleteCust").click(function (e) {
        var checkBoxes = $('#searchResults').find('input[type=checkbox][name=custId]:checked');
        if (checkBoxes.length === 0) {
            Msg.error("Please select the customers you want to remove by clicking the checkboxs to the right", 'no-cust-selected');
        } else {
            var option = {
                title: "Are you sure you want to remove " + checkBoxes.length + " customers?",
                message: "",
                type: 'warning',
                btnClass: 'btn-danger',
                btnText: "Remove",
                callback: removeCustomers
            };
            showSweetAlert(option);
        }
    });
}


function initNewTaskForm() {
    var modal = $('#quickTaskModal');
    var form = modal.find('form');

    $(".menu-item-menuAddTask, .nav-menuAddTask, .createTask").click(function (e) {
        flog("click");
        e.preventDefault();
        modal.modal("show");
    });

    form.forms({
        onSuccess: function (resp) {
            var btn = form.find('.clicked');
            if (!btn.hasClass('btnCreateClose')) {
                if (resp.nextHref) {
                    window.location.href = resp.nextHref;
                }
            }

            Msg.info('Created task');
            reloadTasks()
            modal.modal("hide");
        }
    });

    form.find("button").on('click', function (e) {
        form.find(".clicked").removeClass("clicked");
        $(this).addClass("clicked");
    });
}

function initNewQuoteForm() {
    var modal = $('#addQuoteLeadModal');
    var form = modal.find('form');

    var date = new Date();
    date.setDate(date.getDate() - 1);
    $('body').css('position', 'relative');
    var opts = {
        widgetParent: 'body',
        format: "DD/MM/YYYY HH:mm",
        minDate: moment()
    };

    $('#quoteExpiryDate').datetimepicker(opts);

    $('#quoteExpiryDate').on('dp.show', function () {
        var datepicker = $('body').find('.bootstrap-datetimepicker-widget:last');
        if (datepicker.hasClass('bottom')) {
            var top = $(this).offset().top - $(this).outerHeight();
            var left = $(this).offset().left;
            datepicker.css({
                'top': top + 'px',
                'bottom': 'auto',
                'left': left + 'px',
                'z-index': 9999
            });
        } else if (datepicker.hasClass('top')) {
            var top = $(this).offset().top - datepicker.outerHeight() - 40;
            var left = $(this).offset().left;
            datepicker.css({
                'top': top + 'px',
                'bottom': 'auto',
                'left': left + 'px',
                'z-index': 9999
            });
        }
    });

    $(document.body).on('click', '.createQuote', function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        form.attr("action", href);

        var leadId = $(e.target).closest("a").data("lead-id");

        $("#createQuoteLeadId").val(leadId);

        modal.modal("show");
    });

    $(document.body).on('click', '.createProposal', function (e) {
        e.preventDefault();

        if ($('input[ name = "quote-for-proposal" ]:checked').length === 0) {
            alert("You Must at least pick up one quotation for a proposal!");

            return;
        }

        var proposalData = {
            "selectedQuotes[]": [],
            createProposalFolder: true
        };

        $('input[ name = "quote-for-proposal" ]:checked').each(function () {
            proposalData['selectedQuotes[]'].push($(this).val());
        });

        $.ajax({
            url: "/proposals/",
            method: "POST",
            dataType: "json",
            data: proposalData,
            success: function (data) {
                if (data.status) {
                    Msg.success('Proposal Added Successfully');
                } else {
                    if (data.messages.length > 0) {
                        Msg.error(data.messages[0]);
                    } else {
                        Msg.error('Could not create proposal');
                    }
                }
            }
        });
    });

    form.find('#supplier').entityFinder({
        url: '/custs/',
        useActualId: true
    });

    form.forms({
        onSuccess: function (resp) {
            if (resp.nextHref && !modal.hasClass('no-redirect')) {
                window.location.href = "/quotes/" + resp.nextHref;
            }

            $('#quotesTable').reloadFragment({
                whenComplete: function () {
                    Msg.info('Created quote');
                    modal.modal("hide");
                    form.find('input').not('[type=hidden]').val('');
                }
            });
        }
    });
}

function initNotesDotDotDot() {
    function dotdotdotCallback(isTruncated, originalContent) {
        if (!isTruncated) {
            $("a.note-more", this).remove();
        }
    }

    $('.note-content').each(function () {
        $(this).dotdotdot({
            height: 100,
            callback: dotdotdotCallback,
            after: 'a.note-more'
        });
    })
}

function initNoteMoreLess() {
    $(document).on('click', 'a.note-more', function (e) {
        e.preventDefault();
        var btn = $(this);
        var div = btn.parents('.note-content');
        if (btn.hasClass('note-less')) {
            div.find('a.note-more').text('more').removeClass('note-less');
            div.dotdotdot({
                height: 100,
                callback: function (isTruncated, originalContent) {
                    if (!isTruncated) {
                        $("a.note-more", div).remove();
                    }
                },
                after: 'a.note-more'
            });
        } else {
            div.trigger('destroy').css('max-height', '');
            div.find('a.note-more').text('less').addClass('note-less');
        }

    });
}

function initChangeLeadAvatar() {
    var url = $('#btn-change-lead-ava').data("href");

    $('#btn-change-lead-ava, .change-lead-avatar').upcropImage({
        url: url,
        onCropComplete: function (resp) {
            flog("onCropComplete:", resp, resp.nextHref);
            $("span.avatar").css("background-image", "url(" + resp.nextHref + ")");
            $(".profile-avatar-img").attr("src", resp.nextHref);
            $(".modal").modal("hide");
        },
        onContinue: function (resp) {
            flog("onContinue:", resp, resp.result.nextHref);
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: {
                    uploadedHref: resp.result.nextHref,
                    applyImage: true
                },
                success: function (resp) {
                    if (resp.status) {
                        $("span.avatar").css("background-image", "url(" + resp.nextHref + ")");
                        $(".profile-avatar-img").attr("src", resp.nextHref);
                        $(".modal").modal("hide");
                    } else {
                        alert("Sorry, an error occured updating your profile image");
                    }
                },
                error: function () {
                    alert('Sorry, we couldn\'t save your profile image.');
                }
            });
        }
    });
}

function initHideModalAndGoLinks() {
    $(document.body).on('click', 'a.hide-modal-and-go', function (event) {
        window.location.hash = '';

        var $this = $(this);
        $($this.data("target")).on('hidden.bs.modal', function () {
            window.location.hash = $this.attr("href");
        }).modal('hide');

        event.preventDefault();
        return false;
    });
}

function initNewNoteForm() {
    var modal = $('#newNoteModal');
    var form = modal.find('form');
    form.find('.newLeadForm').hide();

    initClipboard();

    $(document.body).on('click', '.createNote', function (e) {
        e.preventDefault();
        var href = $(this).closest("a").attr("href");
        var leadName = $(this).attr('data-leadName'); // actually funnel name
        form.attr("action", href);
        $('#newNoteModalBody').reloadFragment({
            url: window.location.pathname + '?leadName='+leadName,
            whenComplete: function () {
                modal.modal("show");
            }
        });
    });

    form.forms({
        onSuccess: function (resp) {
            if (resp.nextHref) {
                window.location.href = resp.nextHref;
            }
            Msg.info('Created note');
            modal.modal("hide");

            var leadNotesBody = $('#leadNotesBody');
            var viewProfilePage = $('#view-profile-page');
            if (leadNotesBody.length) {
                $('#leadNotesBody').reloadFragment({
                    whenComplete: function () {
                        $(document).find('abbr.timeago').timeago();
                        initNotesDotDotDot()
                    }
                });
            }
            if (viewProfilePage.length) {
                viewProfilePage.reloadFragment({
                    whenComplete: function () {
                        $(document).find('abbr.timeago').timeago();
                        initNotesDotDotDot()
                    }
                });
            }
        }
    });

    form.find('#note_newTask').on('change', function (e) {
        var btn = $(this);
        var checked = btn.is(':checked');

        if (checked) {
            form.find('.newLeadForm').show();
            form.find('.required-if-shown').addClass('required');
        } else {
            form.find('.newLeadForm').hide();
            form.find('.required-if-shown').removeClass('required');
        }
    });

    var editModal = $('#editNoteModal');
    var editForm = editModal.find('form');

    $(document.body).on('click', '.note-edit', function (e) {
        e.preventDefault();

        var btn = $(this);
        var noteId = btn.attr('href');
        var type = btn.data('type');
        var notes = btn.closest('li.timeline-inverted').find('.timeline-body pre').html();
        var leadName = $(this).attr('data-leadName');
        $('#editNoteModalBody').reloadFragment({
            url: window.location.pathname + '?leadName='+leadName,
            whenComplete: function () {
                editModal.find('[name=action]').val(type);
                editModal.find('[name=note]').val(notes);
                editModal.find('[name=editNote]').val(noteId);
                editModal.modal("show");
            }
        });
    });

    $(document.body).on('click', '.note-delete', function (e) {
        e.preventDefault();

        var btn = $(this);
        var noteId = btn.attr('href');
        var c = confirm('Are you sure you want to delete this note?');
        if (!c) return;

        $.ajax({
            url: window.location.pathname,
            data: {
                deleteNoteId: noteId
            },
            dataType: 'json',
            type: 'post',
            success: function (resp) {
                if (resp && resp.status){
                    Msg.info('Deleted Note');
                    $('#leadDetailActivities').reloadFragment({
                        whenComplete: function () {
                            $(document).find('abbr.timeago').timeago();
                            initNotesDotDotDot();
                        }
                    });
                }
            },
            error: function () {
                Msg.error('Error when deleting note. Please try again');
            }
        })
    });

    editForm.forms({
        onSuccess: function (resp) {
            if (resp.nextHref) {
                window.location.href = resp.nextHref;
            }
            Msg.info('Updated Note');
            editModal.modal("hide");
            $('#leadDetailActivities').reloadFragment({
                whenComplete: function () {
                    $(document).find('abbr.timeago').timeago();
                    initNotesDotDotDot();
                }
            });
        }
    });
}

function reloadTasks() {
    if ($('#lead-tasks-page').length) {
        setTimeout(function () {
            $(document).trigger('taskChanged');
        }, 1000);
    }

    if ($("#tasksList").length){
        $("#tasksList").reloadFragment({
            whenComplete: function (doc) {
                var newLeads = doc.find("#dashLeadsList");
                $("#dashLeadsList").html(newLeads.html());
                $('abbr.timeago').timeago();
            }
        });
    }

    if ($(".tasksDashList").length){
        setTimeout(function () {
            $(".tasksDashList").first().reloadFragment({
                whenComplete: function (doc) {
                    var tasksDashList = doc.find('.tasksDashList');
                    $(".tasksDashList").each(function (index) {
                        $(this).replaceWith(tasksDashList[index]);
                    });

                    $('.timeago').timeago();
                }
            })
        }, 800);
    }

    reloadTimeline();
    reloadDashboard();
}

function reloadTimeline() {
    $(document).trigger('onLeadTimelineUpdate');
}

function takeTask(href) {
    $.ajax({
        type: 'POST',
        url: href,
        data: {
            assignToName: "me" // special value
        },
        dataType: 'json',
        success: function (resp) {
            if (resp && resp.status) {
                Msg.info("Assigned task");
                reloadTasks();
            } else {
                Msg.error("Sorry, we couldnt assign the task");
            }
        },
        error: function (resp) {
            flog('error', resp);
            Msg.error('Sorry couldnt assign the task ' + resp);
        }
    });
}

function closeLead(href) {
    setLead(href, "closeDeal", "close this lead, ie sale has been completed");
}

function setLead(href, status, actionDescription) {
    flog("SetLead", href, status);
    if (confirm("Are you sure you want to " + actionDescription + "?")) {
        var data = {};
        data[status] = "";
        $.ajax({
            type: 'POST',
            url: href,
            data: data,
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    Msg.info(actionDescription + " ok");
                    $(".leadsList").each(function (i, n) {
                        $(n).reloadFragment({
                            whenComplete: function () {
                                $('abbr.timeago').timeago();
                            }
                        });
                    });
                } else {
                    Msg.error("Sorry, we couldnt " + actionDescription);
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Sorry couldnt ' + actionDescription + ' - ' + resp);
            }
        });
    }
}


function initDateTimePickers() {
    flog('initDateTimePickers');

    var pickers = $('.date-time');
    flog("pickers", pickers);
    pickers.datetimepicker({
        format: 'DD/MM/YYYY HH:mm'
    });
}

function initDateTimePikersForModal() {
    flog('initDateTimePikersForModal');

    $('.modal').on('shown.bs.modal loaded.bs.modal', function (e) {
        var pickers = $(this).find('.date-time');
        flog("pickers", pickers);
        pickers.datetimepicker({
            format: 'DD/MM/YYYY HH:mm'
        });
    });
}

function mAssignTo(name, href, blockId) {
    $.ajax({
        type: 'POST',
        url: href || window.location.pathname,
        data: {
            assignToName: name
        },
        dataType: 'json',
        success: function (resp) {
            if (resp && resp.status) {
                Msg.info("The assignment has been changed.");

                $("#" + blockId).reloadFragment({
                    url: href || window.location.pathname
                });

                var tasksList = $('#tasksList');
                if (tasksList.length){
                    tasksList.reloadFragment({
                        url: window.location.pathname
                    })
                }

                var dashboard = $('.dash-secondary');
                if (dashboard.length) {
                    reloadTasks();
                }
            } else {
                Msg.error("Sorry, we couldnt change the assignment");
            }
        },
        error: function (resp) {
            flog('error', resp);
            Msg.error('Sorry couldnt change the assigned person ' + resp);
        }
    });
}

function updateField(href, fieldName, fieldValue, form) {
    var data = {};
    data[fieldName] = fieldValue;
    flog("updateField", href, data, fieldName, fieldValue);
    $.ajax({
        type: 'POST',
        url: href,
        data: data,
        dataType: 'json',
        success: function (resp) {
            Msg.info("Saved");
            $('abbr.timeago').timeago();
            reloadTasks();
        },
        error: function (resp) {
            flog('error', resp);
            Msg.error('Sorry couldnt save field ' + fieldName);
        }
    });
}

function initTopNavSearch() {
    flog('initTopNavSearch');

    var txt = $('#lead-search-input');
    var suggestionsWrapper = $('#lead-search-suggestions');
    var backdrop = $('<div />', {
        id: 'lead-search-backdrop',
        class: 'hide'
    }).on('click', function () {
        backdrop.addClass('hide');
        suggestionsWrapper.addClass('hide');
    }).appendTo(document.body);

    txt.on({
        input: function () {
            typewatch(function () {
                var text = txt.val().trim();
                var status = $('#leadSearchFilterButton').find('span').text();

                if (text.length > 0) {
                    doTopNavSearch(text, status, suggestionsWrapper, backdrop);
                } else {
                    suggestionsWrapper.addClass('hide');
                    backdrop.addClass('hide');
                }
            }, 500);
        },
        keydown: function (e) {
            switch (e.keyCode) {
                case keymap.ESC:
                    flog('Pressed ESC button');

                    suggestionsWrapper.addClass('hide');
                    backdrop.addClass('hide');

                    e.preventDefault();
                    break;

                case keymap.UP:
                    flog('Pressed UP button');

                    var suggestions = suggestionsWrapper.find('.suggestion');
                    if (suggestions.length > 0) {
                        var actived = suggestions.filter('.active');
                        var prev = actived.prev();

                        actived.removeClass('active');
                        if (prev.length > 0) {
                            prev.addClass('active');
                        } else {
                            suggestions.last().addClass('active');
                        }
                    }

                    e.preventDefault();
                    break;

                case keymap.DOWN:
                    flog('Pressed DOWN button');

                    var suggestions = suggestionsWrapper.find('.suggestion');
                    if (suggestions.length > 0) {
                        var actived = suggestions.filter('.active');
                        var next = actived.next();

                        actived.removeClass('active');
                        if (next.length > 0) {
                            next.addClass('active');
                        } else {
                            suggestions.first().addClass('active');
                        }
                    }

                    e.preventDefault();
                    break;

                case keymap.ENTER:
                    flog('Pressed DOWN button');

                    var actived = suggestionsWrapper.find('.suggestion').filter('.active');
                    if (actived.length > 0) {
                        var link = actived.find('a').attr('href');

                        window.location.href = link;
                    }

                    e.preventDefault();
                    break;

                default:
                // Nothing
            }
        }
    });

    suggestionsWrapper.on({
        mouseenter: function () {
            suggestionsWrapper.find('.suggestion').removeClass('active');
            $(this).addClass('active');
        },
        mouseleave: function () {
            $(this).removeClass('active');
        }
    }, '.suggestion');
}

function doTopNavSearch(query, status, suggestionsWrapper, backdrop) {
    flog('doTopNavSearch', query, status, suggestionsWrapper, backdrop);

    $.ajax({
        url: '/leads',
        type: 'GET',
        data: {
            q: query,
            status: status
        },
        dataType: 'JSON',
        success: function (resp) {
            flog('Got search response from server', resp);

            var suggestionStr = '';

            if (resp && resp.hits && resp.hits.total > 0) {
                for (var i = 0; i < resp.hits.hits.length; i++) {
                    var suggestion = resp.hits.hits[i];
                    var leadId = suggestion.fields.leadId[0];
                    var email = suggestion.fields['profile.email'] ? suggestion.fields['profile.email'][0] : (suggestion.fields['organisation.email'] ? suggestion.fields['organisation.email'][0] : '');
                    var companyTitle = suggestion.fields['organisation.title'] ? suggestion.fields['organisation.title'][0] : '';
                    var firstName = suggestion.fields['profile.firstName'] ? suggestion.fields['profile.firstName'][0] : '';
                    var surName = suggestion.fields['profile.surName'] ? suggestion.fields['profile.surName'][0] : '';

                    var a = firstName + ' ' + surName;
                    if (a.trim().length < 1) {
                        a = companyTitle;
                    }

                    suggestionStr += '<li class="suggestion">';
                    suggestionStr += '    <a href="/leads/' + leadId + '">';
                    suggestionStr += '        <span class="email">' + email + '</span>';
                    if (a) {
                        suggestionStr += '    <br /><small class="text-muted">' + a + '</small>';
                    }
                    suggestionStr += '    </a>';
                    suggestionStr += '</li>';
                }
            } else {
                suggestionStr = '<li>No result.</li>';
            }

            suggestionsWrapper.html(suggestionStr).removeClass('hide');
            //backdrop.removeClass('hide');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            flog('Error when doTopNavSearch with query: ' + query, jqXHR, textStatus, errorThrown);
        }
    });
}

function initOrgSearch() {
    var orgSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/leads?orgSearch=%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#newOrgTitle').typeahead({
        highlight: true
    }, {
        display: 'title',
        limit: 10,
        source: orgSearch,
        templates: {
            empty: [
                '<div class="empty-message">',
                'No existing companies were found.',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile(
                    '<div>'
                    + '<strong>{{title}}</strong>'
                    + '</br>'
                    + '<span>{{phone}}</span>'
                    + '</br>'
                    + '<span>{{address}}, {{addressLine2}}, {{addressState}}, {{postcode}}</span>'
                    + '</div>')
        }
    });

    $('#newOrgTitle').bind('typeahead:select', function (ev, sug) {
        var inp = $(this);
        var form = inp.closest('form');

        form.find('input[name=newOrgId]').val(sug.orgId);
    });

    $('#newOrgTitle').attr('autocomplete', 'nopeorg'); // Chrome will disable autocomplete
}

function initProfileSearchTable() {

    var txt = $('.contact-finder');
    txt.on({
        input: function () {
            var text = this.value.trim();
            typewatch(function () {
                doSearchContact(text);
            }, 500);
        }
    });

    $(document.body).on('click', '#table-result tbody tr', function (e) {
        e.preventDefault();
        var jsonString = $(this).attr('data-json');
        jsonString = decodeURI(jsonString);
        try {
            var profile = JSON.parse(jsonString);
            var form = $(this).closest('form');
            form.find('input[name=firstName]').val(profile.firstName);
            form.find('input[name=surName]').val(profile.surName);
            form.find('input[name=email]').val(profile.email);
            form.find('input[name=phone]').val(profile.phone);
            $('#table-result table').addClass('hide');
        } catch (ex) {
            flog('json parsing error', ex);
        }
    });
}

function initTagsInput() {
    var tagsSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/leads/?asJson&tags&q=%QUERY',
            wildcard: '%QUERY'
        }
    });

    tagsSearch.initialize();

    $(".tag-finder").tagsinput({
        itemValue: 'id',
        itemText: 'name',
        typeaheadjs: {
            name: tagsSearch.name,
            displayKey: 'name',
            source: tagsSearch.ttAdapter()
        }
    });
}

function buildTable(resp) {
    var html = '';
    if (!resp.length) {
        html += '<tr><td class="text-center" colspan="5">No contact found. Please enter new contact info above</td></tr>';
    } else {
        for (var i = 0; i < resp.length; i++) {
            var profile = resp[i];
            var jsonString = JSON.stringify(profile);
            jsonString = encodeURI(jsonString);
            html += '<tr title="Click to select this contact" style="cursor: pointer" data-json="' + jsonString + '">';
            html += '<td>' + (profile.userName != null ? profile.userName : 'No value') + '</td>';
            html += '<td>' + (profile.email != null ? profile.email : 'No value') + '</td>';
            html += '<td>' + (profile.phone != null ? profile.phone : 'No value') + '</td>';
            html += '</tr>';
        }
    }

    $('#table-result').find('tbody').html(html);
    $('#table-result').find('table').removeClass('hide');
}

function doSearchContact(query) {
    if (!query) {
        $('#table-result').find('tbody').html('<tr><td class="text-center" colspan="5">No contact found. Please enter new contact info above</td></tr>');
        return;
    }
    $.ajax({
        url: '/leads?profileSearch=' + encodeURI(query),
        dataType: 'json',
        success: function (resp) {
            if (resp) {
                buildTable(resp);
            }
        },
        error: function (err) {
            $('#table-result').find('tbody').html('<tr><td class="text-center" colspan="5">No contact found. Please enter new contact info above</td></tr>');
        }
    });
}

function initProfileSearch() {
    var profileSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/leads?profileSearch=%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#newUserFirstName').typeahead({
        highlight: true
    }, {
        display: 'firstName',
        limit: 10,
        source: profileSearch,
        templates: {
            empty: [
                '<div class="empty-message">',
                'No existing contacts were found.',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile(
                    '<div>'
                    + '<strong>{{name}}</strong>'
                    + '</br>'
                    + '<span>{{phone}}</span>'
                    + '</br>'
                    + '<span>{{email}}</span>'
                    + '</div>')
        }
    });

    $('#newUserFirstName').bind('typeahead:select', function (ev, sug) {
        var inp = $(this);
        var form = inp.closest('form');

        form.find('input[name=firstName]').val(sug.firstName);
        form.find('input[name=surName]').val(sug.surName);
        form.find('input[name=email]').val(sug.email);
        form.find('input[name=phone]').val(sug.phone);
    });
}

function initAudioPlayer() {
    $('#files').on('click', '.play-audio', function (e) {
        e.preventDefault();

        var btn = $(this);
        var pId = btn.data('id');

        var player = $('#' + pId);
        var playerDom = player[0];

        if (playerDom.paused) {
            $('.lead-audio-file').trigger('pause');
            playerDom.play();
        } else {
            playerDom.pause();
        }
    });

    $('.lead-audio-file').on('playing', function (e) {
        var player = $(this);
        var td = player.closest('td');
        var btn = td.find('.play-audio');

        btn.find('i').removeClass('fa-play').addClass('fa-pause');
    });

    $('.lead-audio-file').on('pause', function (e) {
        var player = $(this);
        var td = player.closest('td');
        var btn = td.find('.play-audio');

        btn.find('i').removeClass('fa-pause').addClass('fa-play');
    });

    $('.lead-audio-file').on('timeupdate', function (e) {
        var player = $(this);
        var td = player.closest('td');
        var span = td.find('.lead-audio-duration');
        span.html(formatSecondsAsTime(this.currentTime) + '/' + formatSecondsAsTime(this.duration));
    });

    /* Populate all players with their time */
    var audioFiles = $('.lead-audio-file');
    audioFiles.on('loadedmetadata', function () {
        var player = $(this);
        var td = player.closest('td');
        var span = td.find('.lead-audio-duration');
        span.html(formatSecondsAsTime(this.currentTime) + '/' + formatSecondsAsTime(this.duration));
    });
}

function formatSecondsAsTime(secs, format) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }

    return min + ':' + sec;
}

function initDeleteFile() {
    $('#files').on('click', '.btn-delete-lead-file', function (e) {
        e.preventDefault();

        var btn = $(this);
        var tr = btn.closest('tr');
        var fname = btn.data('fname');
        confirmDelete(fname, fname, function () {
            tr.remove();
            Msg.info('File deleted');
        });
    });
}

// Minified version of isMobile included in the HTML since it's small
!function (a) {
    var b = /iPhone/i, c = /iPod/i, d = /iPad/i, e = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, f = /Android/i, g = /IEMobile/i, h = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
            i = /BlackBerry/i, j = /BB10/i, k = /Opera Mini/i, l = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, m = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"),
            n = function (a, b) {
                return a.test(b)
            }, o = function (a) {
        var o = a || navigator.userAgent, p = o.split("[FBAN");
        return "undefined" != typeof p[1] && (o = p[0]), this.apple = {
            phone: n(b, o),
            ipod: n(c, o),
            tablet: !n(b, o) && n(d, o),
            device: n(b, o) || n(c, o) || n(d, o)
        }, this.android = {phone: n(e, o), tablet: !n(e, o) && n(f, o), device: n(e, o) || n(f, o)}, this.windows = {
            phone: n(g, o),
            tablet: n(h, o),
            device: n(g, o) || n(h, o)
        }, this.other = {
            blackberry: n(i, o),
            blackberry10: n(j, o),
            opera: n(k, o),
            firefox: n(l, o),
            device: n(i, o) || n(j, o) || n(k, o) || n(l, o)
        }, this.seven_inch = n(m, o), this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch, this.phone = this.apple.phone || this.android.phone || this.windows.phone, this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet, "undefined" == typeof window ? this : void 0
    }, p = function () {
        var a = new o;
        return a.Class = o, a
    };
    "undefined" != typeof module && module.exports && "undefined" == typeof window ? module.exports = o : "undefined" != typeof module && module.exports && "undefined" != typeof window ? module.exports = p() : "function" == typeof define && define.amd ? define("isMobile", [], a.isMobile = p()) : a.isMobile = p()
}(this);

function initLeadmanModal() {
    $('.modal').on('show.bs.modal', function () {
        if (isMobile.phone && $('#nav-collapse').hasClass('in')) {
            $('.navbar-toggle').trigger('click')
        }
    });
}

function initDotdotdot() {
    if ($('.lead-desc .leadInner').length) {
        $('.lead-desc .leadInner').dotdotdot({height: 80});
    }
}

function initSearchFilter() {
    $('#leadSearchFilterButton').siblings('ul').find('a').on('click', function (e) {
        e.preventDefault();

        $('#leadSearchFilterButton').find('span').text(this.innerText);
        var status = this.innerText;
        var txt = $('#lead-search-input');
        var suggestionsWrapper = $('#lead-search-suggestions');
        var backdrop = $('#lead-search-backdrop');
        var text = txt.val().trim();
        if (text.length > 0) {
            doTopNavSearch(text, status, suggestionsWrapper, backdrop);
        } else {
            suggestionsWrapper.addClass('hide');
            backdrop.addClass('hide');
        }
    });
}

function reloadDashboard() {
    $('#teamStats').reloadFragment({
        whenComplete: function () {
            $(document).trigger('onLeadDashUpdate');
        }
    });
}

$(document).on('pageDateChanged', function (e, startDate, endDate) {
    initStatsSummaryComponents();
});

function initStatsSummaryComponents() {
    flog('initStatsSummaryComponents Count', $('.leadMan-statsSummaryComponent').length);

    $('.leadMan-statsSummaryComponent').each(function (i, item) {
        flog('initStatsSummaryComponents Item', item);

        var comp = $(item);
        var funnelName = comp.data('funnelname');

        comp.find('.leadMan-statsSummaryComponent-completedTasks').text('Loading...');
        comp.find('.leadMan-statsSummaryComponent-closedLeads').text('Loading...');
        comp.find('.leadMan-statsSummaryComponent-newLeads').text('Loading...');
        comp.find('.leadMan-statsSummaryComponent-totalClosedSales').text('Loading...');

        $.ajax({
            type: 'GET',
            url: '/_leadManStatsSummary?funnelName=' + funnelName,
            dataType: 'JSON',
            success: function (resp) {
                flog('initStatsSummaryComponents Resp', resp);

                if (resp.status) {
                    var completedTasksCount = (resp.data.tasks != null ? resp.data.tasks.completedTasks.doc_count : 0) || 0;
                    var dueTasksCount = (resp.data.tasks != null ? resp.data.tasks.completedTasks.doc_count : 0) || 0;
                    var closedLeads = (resp.data.leads != null ? resp.data.leads.closedLeads.doc_count : 0) || 0;
                    var salesAmount = (resp.data.leads != null ? resp.data.leads.closedLeads.salesAmount.value : 0) || 0;
                    var createdLeads = (resp.data.leads != null ? resp.data.leads.createdLeads.doc_count : 0) || 0;
                    var newContacts = (resp.data.newContacs != null ? resp.data.newContacs : 0) || 0;

                    var completedTasksPerc = Math.round(completedTasksCount / dueTasksCount * 100) || 0;
                    var closedLeadsPerc = Math.round(closedLeads / createdLeads * 100) || 0;
                    var acqRate = Math.round(createdLeads / newContacts * 100) || 0;

                    comp.find('.leadMan-statsSummaryComponent-completedTasks').text(completedTasksPerc + '%');
                    comp.find('.leadMan-statsSummaryComponent-closedLeads').text(closedLeadsPerc + '%');
                    comp.find('.leadMan-statsSummaryComponent-newLeads').text(acqRate + '%');
                    comp.find('.leadMan-statsSummaryComponent-totalClosedSales').text('$' + salesAmount);
                }
            }
        });
    });
}

function initClipboard() {

    $('[name=newNote], [name=note]').inlineattachment({
        uploadUrl: '/assets/',
        uploadMethod: "POST",
        jsonFieldName : "nextHref",
        urlText : function( nextHref, result) {
            flog("initClipboard:urlText", nextHref)
            return "<img class='img-responsive' src='" + nextHref + "'/>";
        }
    });
}

function initReloadLeads() {
    if (!$('#leadsList').length) return;
    function reloadLeads(){
        setTimeout(function () {
            $('#leadsList').reloadFragment();
        }, 800);
    }
    $(document).on('leadClosed', reloadLeads);
    $(document).on('leadsRefresh', reloadLeads);

}