$(function () {
    flog("leadman.js - init");

    window.Msg.iconMode = "fa";
    jQuery.timeago.settings.allowFuture = true;

    initNewLeadForm();
    initNewQuickLeadForm();
    initNewContactForm();
    initNewNoteForm();
    initTakeTasks();
    initLeadActions();
    initOrgSelector();
    initDateTimePickers();
    initTasks();
    initImmediateUpdate();
    initCloseDealModal();
    initCancelLeadModal();
    initCancelTaskModal();
    initTopNavSearch();
    initOrgSearch();
    initProfileSearch();
    initAudioPlayer();
    initDeleteFile();
    initCreatedDateModal();

    // init the login form
    $(".login").user({});


    // Clear down modals when closed
    $('body').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
    });
    $('body').on('shown.bs.modal', function (e) {
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
                onSuccess: function (resp) {
                    flog("onSuccess", resp, modal);
                    form.closest(".modal").modal("hide");
                    flog("done");
                    reloadTasks();
                }
            });
        }
        if( modal.hasClass("modalInitForm")) {
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
    })
    $("body").on("click", ".autoFillText", function (e) {
        e.preventDefault();
        var target = $(e.target).closest("a");
        var text = target.text();
        var inp = target.closest(".input-group").find("input[type=text]");
        flog("autofill", text, inp);
        inp.val(text);
    });
    $('abbr.timeago').timeago();
});

function initCloseDealModal() {
    var closeDealModal = $("#closeDealModal");
    closeDealModal.find("form").forms({
        callback: function (resp) {
            Msg.info('Deal marked as closed');
            closeDealModal.modal('hide');
        }
    });
}

function initCancelLeadModal() {
    var cancelDealModal = $("#cancelDealModal");
    cancelDealModal.find("form").forms({
        callback: function (resp) {
            Msg.info('Lead cancelled');
            reloadTasks();
            cancelDealModal.modal("hide");
        }
    });

    $("body").on("click", ".btnLeadCancelLead", function (e) {
        e.preventDefault();
        var href = $(e.target).attr("href");
        cancelDealModal.find("form").attr("action", href);
        cancelDealModal.modal("show");
    });
}

function initCancelTaskModal() {
    var cancelDealModal = $("#cancelTaskModal");
    cancelDealModal.find("form").forms({
        callback: function (resp) {
            Msg.info('Task cancelled');
            reloadTasks();
            cancelDealModal.modal("hide");
        }
    });

    $("body").on("click", ".btnCancelTask", function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        flog("set href", href);
        cancelDealModal.find("form").attr("action", href);
        cancelDealModal.modal("show");
    });
}


function initImmediateUpdate() {
    var onchange = function (e) {
        flog("field changed", e);
        var target = $(e.target);
        var href = target.data("href");
        var name = target.attr("name");
        var value = target.val();
        var oldValue = target.data("original-value");
        if (value != oldValue) {
            updateField(href, name, value);
        }
    };
    $("body").on("change", ".immediateUpdate", function (e) {
        onchange(e);
    });
    $("body").on("dp.change", ".immediateUpdate", function (e) {
        onchange(e);
    });
}

function initTasks() {
    $("body").on("click", "#assignToMenu a", function (e) {
        e.preventDefault();
        var name = $(e.target).attr("href");
        var href = $(this).closest('ul').data('href');
        assignTo(name, href);
    });
    $("body").on("click", ".btnTaskDelete", function (e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var href = link.attr("href");
        var name = getFileName(href);
        confirmDelete(href, name, function () {
            var modal = link.closest(".modal");
            modal.modal("hide");
            $("a[href='" + href + "']").closest(".task").remove();
        });
    });
    $("body").on("click", ".btnTaskDone", function (e) {
        flog("click");
        e.preventDefault();
        $(".completeTaskDiv").show(300);
        $(".hideOnComplete").hide(300);
    });
}

function initOrgSelector() {
    flog("initOrgSelector", $(".selectOrg a"));
    $.cookie("org", $(".selectOrg a").attr('href'), {path: '/'});
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

    $("body").on("click", ".closeLead", function (e) {
        flog("initLeadActions click - close");
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        closeLead(href);
    });

    $("body").on("click", ".updateCreatedDate", function (e) {
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
    $("body").on("click", ".takeTask", function (e) {
        flog("click");
        e.preventDefault();
        var href = $(e.target).attr("href");
        takeTask(href);
    });
}

function initNewLeadForm() {
    flog("initNewLeadForm");
    var modal = $('#newLeadModal');
    var form = modal.find('form');

    modal.on('hidden.bs.modal', function () {
        form.trigger('reset');
        $('input[name=newOrgId]', form).val('');
    });

    $('#newOrgTitle', form).on('change', function () {
        var inp = $(this);

        if (inp.val().length < 1) {
            $('input[name=newOrgId]', form).val('');
        }
    });

    $(".createLead").click(function (e) {
        flog("initNewLeadForm - click");
        e.preventDefault();
        var funnelName = $(e.target).closest("a").attr("href");
        form.find("select[name=funnel]").val(funnelName).change();
        modal.modal("show");

    });

    $('select[name=funnel]', form).on('change', function (e) {
        var s = $(this);

        $('#source-frm').reloadFragment({
            url: window.location.href + '?leadName=' + s.val(),
            whenComplete: function () {

            }
        });

        $('#newLeadStage').reloadFragment({
            url: window.location.href + '?leadName=' + s.val(),
        });
    });

    $('#source-frm', form).select2({
        tags: "true"
    });

    form.forms({
        beforePostForm: function (form, config, data) {
            flog('beforePost', data);
            data += '&assignedToOrgId=' + $.cookie('org');
            flog('beforePost', data);
            return data;
        },
        onSuccess: function (resp, form, config, event) {
            flog('done new lead', resp, event);
            var btn = form.find(".clicked");
            //flog("btn", btn, btn.hasClass("btnCreateAndClose"));

            if (btn.hasClass("btnCreateAndClose")) {
                Msg.info('Saved new lead');
                modal.modal("hide");
                $('#all_contacts').reloadFragment({
                    whenComplete: function () {
                        $('abbr.timeago').timeago();
                    }
                });
            } else {
                Msg.info('Saved, going to the new lead');
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

function initNewQuickLeadForm() {
    var modal = $('#newQuickLeadModal');
    var form = modal.find('form');
    var formData = null;

    $('body').on('click', '.createQuickLead', function (e) {
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
    var audio_context = new AudioContext();
    var recorder = null;

    if (!navigator.getUserMedia) {
        $('.voiceMemo', form).remove();
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
            xhr: function ()
            {
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
;

function initNewContactForm() {
    var modal = $('#newContactModal');
    var form = modal.find('form');

    $(".createContact").click(function (e) {
        flog("click");
        e.preventDefault();
        modal.modal("show");
    });

    form.forms({
        callback: function (resp) {
            if (resp.nextHref) {
                window.location.href = resp.nextHref;
            }
            Msg.info('Created contact');
            modal.modal("hide");
        }
    });
}

function initNewNoteForm() {
    var modal = $('#newNoteModal');
    var form = modal.find('form');
    form.find('.newLeadForm').hide();

    $(".createNote").click(function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        form.attr("action", href);
        modal.modal("show");
    });

    form.forms({
        callback: function (resp) {
            if (resp.nextHref) {
                window.location.href = resp.nextHref;
            }
            Msg.info('Created note');
            modal.modal("hide");
            $('#leadNotesBody').reloadFragment();
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

    $('body').on('click', '.note-edit', function (e) {
        e.preventDefault();

        var btn = $(this);
        var noteId = btn.attr('href');
        var type = btn.data('type');
        var notes = btn.data('notes');

        editModal.find('[name=action]').val(type);
        editModal.find('[name=note]').val(notes);
        editModal.find('[name=editNote]').val(noteId);

        editModal.modal('show');
    });

    editForm.forms({
        callback: function (resp) {
            if (resp.nextHref) {
                window.location.href = resp.nextHref;
            }
            Msg.info('Updated Note');
            editModal.modal("hide");
            $('#notes').reloadFragment({
                whenComplete: function () {
                    $('abbr.timeago').timeago();
                }
            });
        }
    });
}


function reloadTasks() {
    $("#tasksList").reloadFragment({
        whenComplete: function (doc) {
            flog("doc", doc);
            var newLeads = doc.find("#dashLeadsList");
            flog("newLeads", newLeads);
            $("#dashLeadsList").html(newLeads.html());
            flog("Done", $("#dashLeadsList"));
            $('abbr.timeago').timeago();
        }
    });
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
    var date = new Date();
    date.setDate(date.getDate() - 1);

    var pickers = $('.date-time');
    flog("pickers", pickers);
    pickers.datetimepicker({
        format: "d/m/Y H:i"
        , startDate: date
    });
}


function assignTo(name, href) {
    $.ajax({
        type: 'POST',
        url: href || window.location.pathname,
        data: {
            assignToName: name
        },
        dataType: 'json',
        success: function (resp) {
            if (resp && resp.status) {
                Msg.info("Assigned");
                $("#assignedBlock").reloadFragment({
                    url: href || window.location.pathname
                });
            } else {
                Msg.error("Sorry, we couldnt change the assignment");
            }
        },
        error: function (resp) {
            flog('error', resp);
            Msg.error('Sorry couldnt set the visibility ' + resp);
        }
    });
}

function updateField(href, fieldName, fieldValue) {
    var data = {};
    data[fieldName] = fieldValue;
    flog("updateField", href, data, fieldName, fieldValue);
    $.ajax({
        type: 'POST',
        url: href,
        data: data,
        dataType: 'json',
        success: function (resp) {
            Msg.info("Saved " + fieldName);
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

                if (text.length > 0) {
                    doTopNavSearch(text, suggestionsWrapper, backdrop);
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

function doTopNavSearch(query, suggestionsWrapper, backdrop) {
    flog('doTopNavSearch', query, suggestionsWrapper, backdrop);

    $.ajax({
        url: '/leads',
        type: 'GET',
        data: {
            q: query
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
    $('#files').on('click', '.btn-delete-file', function (e) {
        e.preventDefault();

        var btn = $(this);
        var tr = btn.closest('tr');
        var fname = btn.data('fname');
        confirmDelete(fname, fname, function () {
            tr.remove();
        });
    });
}
