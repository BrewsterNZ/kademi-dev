(function () {

    function initReopenTask() {
        $('body').on('click', '.btn-reopen-task', function (e) {
            e.preventDefault();

            var btn = $(this);
            var taskId = btn.data('taskid');

            $.ajax({
                type: 'POST',
                data: {
                    reopenTask: taskId
                },
                success: function () {
                    reloadTasks();
                }
            });
        });
    }

    function initFileNoteEdit() {
        var noteModal = $('#editFileNoteModal');
        var noteForm = noteModal.find('form');
        $('body').on('click', '.edit-file-note', function (e) {
            e.preventDefault();

            var btn = $(this);
            var span = btn.closest('td').find('span');
            var leadId = btn.attr('href');

            noteForm.attr('action', window.location.pathname + leadId);
            noteForm.find('textarea[name=updateNotes]').val(span.html());

            noteModal.modal('show');
        });

        noteForm.forms({
            onSuccess: function () {
                reloadFileList();
                noteModal.modal('hide');
            }
        });
    }

    function reloadFileList() {
        $('#files-body').reloadFragment({
            whenComplete: function () {
                $('#files-body abbr.timeago').timeago();
            }
        });
    }

    function initUpdateUserModal() {
        var profileSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/leads?profileSearch=%QUERY',
                wildcard: '%QUERY'
            }
        });

        var modal = $('#modal-change-profile');
        var form = modal.find('form');

        $('#updateUserFirstName', modal).typeahead({
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
                        + '<div>{{name}}</div>'
                        + '<div>{{phone}}</div>'
                        + '<div>{{email}}</div>'
                        + '</div><hr>')
            }
        });

        $('#updateUserFirstName', modal).bind('typeahead:select', function (ev, sug) {
            form.find('input[name=nickName]').val(sug.name);
            form.find('input[name=firstName]').val(sug.firstName);
            form.find('input[name=surName]').val(sug.surName);
            form.find('input[name=email]').val(sug.email);
            form.find('input[name=phone]').val(sug.phone);
        });

        form.forms({
            onSuccess: function (resp) {
                modal.modal('hide');
                Msg.success(resp.messages);
                $('#profile-body').reloadFragment();
            }
        });
    }

    function initUpload(modal) {
        if (typeof Dropzone !== 'undefined') {
            Dropzone.autoDiscover = false;
            modal.find('.dropzone').dropzone({
                paramName: 'files', // The name that will be used to transfer the file
                maxFilesize: 2000.0, // MB
                addRemoveLinks: true,
                parallelUploads: 1,
                uploadMultiple: true
            });
            var uploadFileDropzone = modal.find('#uploadFileDropzone');
            if (uploadFileDropzone.length) {
                var dz = Dropzone.forElement('#uploadFileDropzone');
                flog('dropz', Dropzone, dz, dz.options.url);
                dz.on('success', function (file) {
                    flog('added file', file);
                    reloadLeadActivities();
                });
                dz.on('error', function (file, errorMessage) {
                    Msg.error('An error occured uploading: ' + file.name + ' because: ' + errorMessage);
                });
            }
        }
    }

    function assignTo(name) {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                assignToName: name
            },
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    Msg.info("Assigned");
                    $("#assignedBlock").reloadFragment();
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

    function reloadTable() {
        $("#tasksTableBody").reloadFragment({
            whenComplete: function () {
                $('abbr.timeago').timeago();
            }
        });
    }

    function initNewTaskModal() {
        var modal = $('.panel[data-activity="newTask"]');
        var form = modal.find("form");
        form.forms({
            onSuccess: function (resp) {
                Msg.info('Created new task');
                reloadLeadActivities();
            }
        });
    }

    function setLeadDescription(val) {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                description: val
            },
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    Msg.info("Updated");
                } else {
                    Msg.error("Sorry, we couldnt change the description");
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Sorry couldnt set the visibility ' + resp);
            }
        });
    }

    function setDealAmount(val) {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                dealAmount: val
            },
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    Msg.info("Updated");
                } else {
                    Msg.error("Sorry, we couldnt change the deal amount");
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Sorry couldnt set the visibility ' + resp);
            }
        });
    }

    function initOrgSearchTab() {
        var orgSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/leads?orgSearch=%QUERY',
                wildcard: '%QUERY'
            }
        });
        var orgTitleSearch = $('#orgTitleSearch');
        var form = orgTitleSearch.closest('form');
        var btnSaveCompany = form.find('.btn-save-company');

        orgTitleSearch.typeahead({
            highlight: true,
            cache: false

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
                        + '<span>{{#if address}}{{address}}{{/if}} {{#if addressLine2}}{{#if address}},{{/if}}{{addressLine2}}{{/if}} {{#if addressState}}{{addressState}}{{/if}} {{#if postcode}}{{postcode}}{{/if}}</span>'
                        + '</div>')
            }
        });

        var timer;
        orgTitleSearch.bind('typeahead:render', function (ev) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var ttMenu = orgTitleSearch.siblings('.tt-menu');
                var isSuggestionAvailable = ttMenu.find('.empty-message').length === 0;

                flog('typeahead:render Is suggestion available: ' + isSuggestionAvailable, ttMenu.find('.empty-message'));

                if (!isSuggestionAvailable) {
                    form.find('.btn-save-company').html('Create new company');
                    form.find('.btn-company-details').css('display', 'none');
                    form.find('input[name=leadOrgId]').val('');
                    form.find('input[name=leadOrgDetails]').val('');
                }
            }, 50);
        });

        orgTitleSearch.bind('typeahead:select', function (ev, sug) {
            form.find('input[name=email]').val(sug.email);
            form.find('input[name=phone]').val(sug.phone);
            form.find('input[name=address]').val(sug.address);
            form.find('input[name=addressLine2]').val(sug.addressLine2);
            form.find('input[name=addressState]').val(sug.addressState);
            form.find('input[name=city]').val(sug.city);
            form.find('input[name=postcode]').val(sug.postcode);
            form.find('input[name=leadOrgId]').val(sug.orgId);
            form.find('input[name=leadOrgDetails]').val(sug.id);
            form.find('[name=country]').val(sug.country);
            $('.selectpicker').selectpicker('refresh');
            form.find('.btn-company-details').css('display', 'inline').attr('href', '/companies/' + sug.id);
            btnSaveCompany.html('Save details');
        });

        orgTitleSearch.on({
            input: function () {
                if (!this.value) {
                    form.find('input[name=email]').val('');
                    form.find('input[name=phone]').val('');
                    form.find('input[name=address]').val('');
                    form.find('input[name=addressLine2]').val('');
                    form.find('input[name=addressState]').val('');
                    form.find('input[name=city]').val('');
                    form.find('input[name=postcode]').val('');
                    form.find('input[name=leadOrgId]').val('');
                    form.find('input[name=leadOrgDetails]').val('');
                    form.find('[name=country]').val('');
                    $('.selectpicker').selectpicker('refresh')
                }
            }
        });
        orgTitleSearch.attr('autocomplete', 'nope');
    }

    function initJobTitleSearch() {
        var jobTitleSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: window.location.pathname + '?jobTitle&q=%QUERY',
                wildcard: '%QUERY',
                transform: function (resp) {
                    return resp.data;
                }
            }
        });

        $('#jobTitle').typeahead({
            highlight: true
        }, {
            limit: 10,
            source: jobTitleSearch,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No existing job title were found.',
                    '</div>'
                ].join('\n')
            }
        });
    }

    function initBodyForm() {
        var form = $("#leadDetails");
        var body = $('body.leadsPage');
        form.forms({
            onSuccess: function (resp) {
                Msg.info('Saved');
                // reloadTable();
            }
        });

        body.on('hide.bs.modal', '.modal', function () {
            $(this).find('input, select, textarea').not(':button, :image, :reset, :submit, :hidden').val('');
        });

        body.on("change", ".dealValue", function (e) {
            var val = $(e.target).val();
            setDealAmount(val);
        });

        var createDateTimer = null;
        body.on("dp.change", "#createDate", function (e) {
            var val = $(e.target).val();

            if (e.oldDate && e.date !== e.oldDate) {
                clearTimeout(createDateTimer);
                createDateTimer = setTimeout(function () {
                    $.ajax({
                        url: window.location.pathname,
                        data: {
                            createDate: val
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (resp) {
                            flog('Resp:', resp);

                            if (resp && resp.status) {
                                Msg.info('Saved');
                            } else {
                                if (resp.messages && resp.messages.length > 0) {
                                    Msg.error(resp.messages[0]);
                                } else {
                                    Msg.error('Error when saving created date. Please contact website administrators for resolving this problem!');
                                }
                            }
                        },
                        error: function (resp) {
                            flog('Error when saving created date', resp);
                            Msg.error('Error when saving created date. Please contact website administrators for resolving this problem!');
                        }
                    });
                }, 300);
            }
        });

        body.on("change", "#description", function (e) {
            var val = $(e.target).val();
            setLeadDescription(val);
        });

        initLeadOrgForms();

        $(document.body).off('click', '.btn-reopen').on('click', '.btn-reopen', function (e) {
            e.preventDefault();

            if (confirm('Are you sure you want to reopen this lead?')) {
                $.ajax({
                    type: 'POST',
                    data: {
                        reopenDeal: true
                    },
                    dataType: 'json',
                    success: function (resp) {
                        if (resp.status) {
                            $('#maincontentContainer').reloadFragment({
                                whenComplete: function () {
                                    $('abbr.timeago').timeago();
                                    initViewLeadsPage();
                                }
                            });
                        }
                    },
                    error: function () {
                        Msg.error('Oh no! Something went wrong!');
                    }
                });
            }
        });
    }

    function initAddTag() {
        $('body').on('click', '.addTag a', function (e) {
            e.preventDefault();

            var btn = $(this);
            var groupName = btn.attr('href');

            doAddToGroup(groupName);
        });


        var modal = $('#newTagModal');
        var form = modal.find('form');

        $('body').on('click', 'a.createTagModal', function (e) {
            flog("click");
            e.preventDefault();
            modal.modal("show");
        });

        form.forms({
            onSuccess: function (resp) {
                var btn = form.find('.clicked');

                if (resp.nextHref) {
                    window.location.href = resp.nextHref;
                }

                reloadTags();

                Msg.info('Created tag');
                modal.modal("hide");
            }
        });

        form.find("button").on('click', function (e) {
            form.find(".clicked").removeClass("clicked");
            $(this).addClass("clicked");
        });
    }

    function initLeadTimerControls() {
        flog("initLeadTimerControls");
        $(document.body).on("click", ".timer-btn-stop", function (e) {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    "timerCmd": "stop"
                },
                success: function () {
                    Msg.info("Stopped timer. Reloading page");
                    window.location.reload();
                },
                error: function () {
                    Msg.error('Oh No! Something went wrong');
                }
            });
        });


        $(document.body).on("click", ".timer-btn-do-resched", function (e) {
            e.preventDefault();
            var btn = $(e.target).closest("button");
            var modal = btn.closest(".modal");
            var dateControl = modal.find(".date-time");

            var timerDate = dateControl.val();
            flog("reschdule", dateControl, timerDate);
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    "timerCmd": "resched",
                    "timerDate": timerDate
                },
                success: function () {
                    Msg.info("Recheduled timer. Reloading page");
                    window.location.reload();
                },
                error: function () {
                    Msg.error('Oh No! Something went wrong');
                }
            });
        });

        $(document.body).on("click", ".timer-btn-go-next", function (e) {
            e.preventDefault();
            var btn = $(e.target).closest("a");
            var nextNodeId = btn.attr("href");
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    "timerCmd": "go",
                    "nextNodeId": nextNodeId
                },
                success: function () {
                    Msg.info("Done. Reloading page");
                    window.location.reload();
                },
                error: function () {
                    Msg.error('Oh No! Something went wrong');
                }
            });
        });
    }

    function initUnlinkCompany() {
        flog('initUnlinkCompany');

        $(document.body).on('click', '.btn-unlink-company', function (e) {
            e.preventDefault();

            var link = $(e.target).closest("button");
            var removeOrgId = link.data("remove-orgid");
            if (removeOrgId) {
                // this is a profile membership org, so need to remove all memberships with that orgid
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        removeOrgId: removeOrgId
                    },
                    success: function (resp) {
                        if (resp.status) {
                            reloadProfileCompanies();
                            $('.selectpicker').selectpicker('refresh');
                        } else {
                            Msg.error("Couldnt remove org: " + resp.messages);
                        }
                    },
                    error: function (e) {
                        Msg.error(e.status + ': ' + e.statusText);
                    }
                })
            } else {
                // this is the lead organisation, so just reset the form
                var form = $(this).closest('form');
                form.find('input[name=title]').val('');
                form.find('input[name=email]').val('');
                form.find('input[name=phone]').val('');
                form.find('input[name=address]').val('');
                form.find('input[name=addressLine2]').val('');
                form.find('input[name=addressState]').val('');
                form.find('input[name=postcode]').val('');
                form.find('input[name=city]').val('');
                form.find('input[name=leadOrgId]').val('');
                form.find('[name=country]').val('');
                form.find('.btn-unlink-company').css('display', 'none');
                $('.selectpicker').selectpicker('refresh');
                form.trigger('submit');
            }
        });
    }


    function initLeadActivity() {
        $(document).on('onLeadTimelineUpdate', function () {
            $('#leadDetailActivities').reloadFragment({
                whenComplete: function () {
                    $('abbr.timeago').timeago();
                    initNotesDotDotDot();
                }
            });
        })
    }

    function initClosingLead() {
        var closeDealModal = $("#closeDealModal");
        closeDealModal.on('show.bs.modal', function () {
            closeDealModal.find('form').html('<p style="padding: 15px">Loading...</p>');
            closeDealModal.reloadFragment({
                url: window.location.pathname,
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
        })
    }

    function initLeadDetailActivities() {
        $(document).on('click', '.btnActivity', function (e) {
            e.preventDefault();
            var activity = $(this).attr('data-activity');

            if (activity) {
                $('.btnActivity, .btnActivityGroup').removeClass('active');
                if (activity == "newNote") {
                    $(this).closest('ul').siblings('.btnActivityGroup').addClass('active');
                    var action = $(this).attr('data-action');
                    $('.detailActivitiesBody').find('.panel[data-activity=' + activity + ']').find('input[name=action]').val(action);
                } else {
                    $(this).addClass('active');
                }

                $('.detailActivitiesBody').find('.panel').addClass('hide');
                $('.detailActivitiesBody').find('.panel[data-activity=' + activity + ']').removeClass('hide').stop().fadeIn();
                if ($(this).attr('data-action')) {
                    $('.btnActivityGroup').find('span').text($(this).text());
                }
            }

        })
    }

    function initNewNotePanel() {
        var modal = $('.panel[data-activity="newNote"]');
        var form = modal.find("form");
        form.forms({
            onSuccess: function (resp) {
                Msg.info('Created new activity');
                reloadLeadActivities();
                form.trigger('reset');
            }
        });
    }

    function initFilterActivities() {
        $('#filterActivities').on('change', function (e) {
            if (this.value) {
                $('#leadDetailActivities').find('li[data-action-type]').addClass('hide');
                $('#leadDetailActivities').find('li[data-action-type=' + this.value + ']').removeClass('hide');
            } else {
                $('#leadDetailActivities').find('li[data-action-type]').removeClass('hide');
            }
        })
    }

    function reloadLeadActivities() {
        $('#leadDetailActivities').reloadFragment({
            whenComplete: function () {
                $('#filterActivities').trigger('change');
                $('.timeago').timeago();
                initNotesDotDotDot();
            }
        })
    }

    function initDeleteFile() {
        $(document).on('click', '.btn-delete-timeline-file', function (e) {
            e.preventDefault();

            var btn = $(this);
            var fname = btn.attr('href');
            confirmDelete(fname, fname, function () {
                Msg.info('File deleted');
                reloadLeadActivities()
            });
        });
    }

    function initLeadDetailTags() {
        var assignedTags = $('#assignedTags');
        var viewLeadTagsInput = $("#view-lead-tags");
        var tagsSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: '/leads/?asJson&tags',
                ttl: 0,
                cache: false
            }
        });

        tagsSearch.initialize();

        viewLeadTagsInput.typeahead({
            highlight: true,
        }, {
            displayKey: 'name',
            source: tagsSearch.ttAdapter(),
            templates: {
                empty: '<div class="text-danger" style="padding: 5px 10px;">No existing tags were found. Press enter to add</div>',
                suggestion: Handlebars.compile(
                        '<div>'
                        + '<div><i class="fa fa-tag"></i> {{name}}</div>'
                        + '</div><hr>')
            }
        }).on('keyup', function (event) {
            if (event.keyCode == 13) {
                var newTag = this.value;
                if (confirm('Are you sure you want to add this tag?')) {
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            addTag: newTag
                        },
                        success: function (resp) {
                            if (resp.status) {
                                reloadTags();
                            } else {
                                Msg.error("Couldnt add tag: " + resp.messages);
                            }
                        },
                        error: function (e) {
                            Msg.error(e.status + ': ' + e.statusText);
                        }
                    }).always(function () {
                        viewLeadTagsInput.typeahead('val', '');
                    })
                }
            }
        });

        function doAddTag(tagId) {
            flog("doAddTag", tagId);

            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    addTag: tagId
                },
                success: function (resp) {
                    reloadTags();
                },
                error: function (e) {
                    Msg.error('Could not add tag');
                }
            });

        }

        viewLeadTagsInput.on('typeahead:select', function (ev, tag) {
            viewLeadTagsInput.typeahead('val', '');
            doAddTag(tag.id);
        });

        assignedTags.on('click', '[data-role=removetag]', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var tagId = $(this).parent().attr('data-tag-id');
            if (tagId) {
                if (confirm('Are you sure you want to remove this tag?')) {
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            deleteTag: tagId
                        },
                        success: function (resp) {
                            if (resp.status) {
                                reloadTags();
                            } else {
                                Msg.error("Couldnt remove tag: " + resp.messages);
                            }
                        },
                        error: function (e) {
                            Msg.error(e.status + ': ' + e.statusText);
                        }
                    });
                }
            }
        });

        $("body").on("click", ".remove-membership", function (e) {
            e.preventDefault();
            var target = $(e.target).closest(".remove-membership");
            var memId = target.data("membership-id");
            var profileName = target.data("profile-name");
            $.ajax({
                url : '/custs/' + profileName,
                type: 'POST',
                dataType: 'json',
                data: {
                    removeMembership: true,
                    mId : memId
                },
                success: function (resp) {
                    if (resp.status) {
                        reloadTags();
                    } else {
                        Msg.error("Couldnt remove organisation: " + resp.messages);
                    }
                },
                error: function (e) {
                    Msg.error(e.status + ': ' + e.statusText);
                }
            });
        });
    }

    function reloadTags() {
        $('#assignedTags, #assignedCompanies').reloadFragment({
            whenComplete: function () {
                //Msg.success('Tags updated');
            }
        });
    }

    function initSendEmail() {
        $('.panel[data-activity="newEmail"] form').forms({
            onSuccess: function (resp) {
                if (resp && resp.status) {
                    Msg.success('Your email has been sent');
                } else {
                    Msg.error(resp.messages.join("\n"));
                }
            }
        })
    }

    function initPjax() {
        $('#pjax-container').length &&
                $(document).pjax2('#pjax-container', {
            selector: 'a.pjax',
            fragment: '#pjax-container',
            success: function (doc) {
                flog('Pjax success!', arguments);
                initBodyForm();
                initOrgSearchTab();
                $('#leadDetailTabs').html($(doc).find('#leadDetailTabs').html());
                initLeadCountryList();
                initSelectPicker();
                initJobTitleSearch();
            },
            debug: true
        });
    }

    // Run init functions
    $(function () {
        initViewLeadsPage();
    });

    function initViewLeadsPage() {
        initNewTaskModal();
        initFileNoteEdit();
        initUpdateUserModal();
        initOrgSearchTab();
        initReopenTask();
        initBodyForm();
        initAddTag();
        initJobTitleSearch();
        initLeadTimerControls();
        initUnlinkCompany();
        initLeadManEvents();
        initLeadActivity();
        initClosingLead();
        initSelectPicker();
        initLeadDetailActivities();
        initUpload($('.panel[data-activity="newFile"]'));
        initNewNotePanel();
        initFilterActivities();
        initDeleteFile();
        initLeadDetailTags();
        initSendEmail();
        initPjax();
        initLeadContactAddresses();
        initLeadCountryList();
        initAddProduct();
        initAddContactCompanies();
        initDeleteContactCompany();
        initLeadProducts();
    }
})();

function initSelectPicker() {
    var sp = $('.selectpicker');
    if (sp.length > 0) {
        $('.selectpicker').selectpicker({
            maxOptions: 5
        });
    }
}

function reloadProfileCompanies() {
    $("#profile-companies-div").reloadFragment({
        url: window.location.href,
        whenComplete: function () {
            flog("done");
            initLeadOrgForms();
            initSelectPicker();
        }
    });
}

function initLeadOrgForms() {
    var leadOrgDetailsForm = $('.leadOrgDetails');
    leadOrgDetailsForm.forms({
        onSuccess: function (resp, form, config) {
            form.find('.companyTabButtons').reloadFragment({
                url: window.location.href,
                whenComplete: function () {
                    Msg.success('Updated');
                }
            });
        }
    });
}

function initLeadContactAddresses() {
    $(document).on('change', '#leadDetails #addressType', function () {
        var uri = new URI(window.location.href);
        uri.setSearch('addressType', this.value);
        history.pushState(null, null, uri.toString());
        $('#profileAddressWrap').reloadFragment({
            url: uri.toString(),
            whenComplete: function () {
                initLeadCountryList()
            }
        })
    })
}

function initLeadCountryList() {
    var countriesBH = new Bloodhound({
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: getCountries() // From countries-state-lib
    });

    countriesBH.initialize();

    var profileAddressWrap = $('#profileAddressWrap');
    profileAddressWrap.find('#profileAddresscountry').typeahead(null, {
        displayKey: 'name',
        valueKey: "iso_code",
        source: countriesBH.ttAdapter()
    });

    var selectedCountry = profileAddressWrap.find('[name=country]').val();
    if (selectedCountry) {
        var sel = getCountries().filter(function (item) {
            return item.iso_code === selectedCountry;
        });
        if (sel.length) {
            profileAddressWrap.find('#profileAddresscountry').typeahead('val', sel[0].name);
        }
    }

    profileAddressWrap.find('#profileAddresscountry').on("typeahead:selected", function (e, datum) {
        profileAddressWrap.find('[name=country]').val(datum.iso_code);
    });
}

function initAddProduct() {
    $("body").on("click", ".btn-add-lead-product", function (e) {
        e.preventDefault();
        var btn = $(e.target).closest("button");
        var leadId = btn.data("lead-id");
        var inp = btn.closest(".input-group").find("input");
        var productCode = inp.val();
        if (productCode.length > 0) {
            $.ajax({
                type: 'POST',
                url: "/leadProduct",
                data: {
                    leadId: leadId,
                    addProduct: productCode
                },
                success: function (resp) {
                    if (resp.status) {
                        $("#table-lead-products").reloadFragment();
                    } else {
                        alert("Sorry, we couldnt add that product. " + resp.messages);
                    }
                }
            });
        } else {
            alert("Please search for and select a product to add");
        }
    });
}

function initAddContactCompanies() {
    var input = $('#contactCompaniesSearch');
    var orgType = input.attr('data-company-org-type');
    var contactUrl = input.attr('data-contact-url');
    var url = '/leads/?';
    if (orgType){
        url += $.param({orgType: orgType});
    }
    input.entityFinder({
        type: 'organisation',
        useActualId: true,
        url : url,
        onSelectSuggestion: function (item, orgId) {
            assignContactCompany(orgId, contactUrl);
        }
    });
}

function initDeleteContactCompany() {
    $(document).on('click', '.contactMbsItem span', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var mId = $(this).closest('a').attr('data-mid');
        var contactUrl = $(this).closest('a').attr('data-contact-url');
        if (!mId || !contactUrl){
            return Msg.warning('Contact doesnt exist');
        }
        if (confirm('Are you sure you want to remove this company?')) {
            $.ajax({
                url: contactUrl,
                dataType: 'json',
                type: 'POST',
                data: {
                    removeMembership: true,
                    mId: mId
                },
                success: function (data, textStatus, jqXHR) {
                    setTimeout(function () {
                        $('#assignedCompanies').reloadFragment({
                            url: window.location.href,
                            whenComplete: function () {
                                initAddContactCompanies();
                            }
                        });
                    }, 500)
                }
            });
        }
    })
}
function assignContactCompany(orgId, contactUrl) {
    if (!orgId || !contactUrl){
        Msg.warning('Contact doesnt exist');
        return;
    }

    $.ajax({
        url: contactUrl,
        type: 'post',
        dataType: 'json',
        data: {
            assignOrgModal: true,
            orgId: orgId
        },
        success: function (resp) {
            if (resp && resp.status){
                Msg.success('Company Added');
                setTimeout(function () {
                    $('#assignedCompanies').reloadFragment({
                        url: window.location.href,
                        whenComplete: function () {
                            initAddContactCompanies();
                        }
                    });
                }, 500);
                $('#contactCompaniesSearch').closest('[data-current-value]').val('')
            } else {
                Msg.error('There was an error occurred. Please contact administrator for details');
            }
        },
        error: function () {
            Msg.error('There was an error occurred. Please contact administrator for details');
        }
    })
}

function initLeadProducts() {
    var productSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/leadProduct?th&q=%QUERY',
            wildcard: '%QUERY',
            transform: function(response) {
                return response.data;
            }
        },

    });

    productSearch.initialize();
    var productSearchField = $('#lead-search-product');

    productSearchField.typeahead({
        highlight: true
    },{
        displayKey: 'title',
        source: productSearch.ttAdapter(),
        templates: {
            empty: '<div class="text-danger" style="padding: 5px 10px;">No matching products were found</div>',
            suggestion: Handlebars.compile(
                '<div>'
                + '<div>{{title}}</div>'
                + '</div><hr>')
        }
    });

    productSearchField.bind('typeahead:select', function (ev, sug) {
        var productId = sug.name;
        var leadId = $(this).attr('data-leadid');

        $.ajax({
            url: '/leadProduct',
            data: {
                leadId: leadId,
                addProduct: productId
            },
            type: 'post',
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status){
                    $('#table-lead-products').reloadFragment();
                    Msg.success('Done');
                } else {
                    Msg.warning(resp.messages.join("\n"));
                }
                productSearchField.typeahead('val', '');
            },
            error: function () {
                Msg.error('Something went wrong. Please contact administrator for details');
                productSearchField.typeahead('val', '');
            }
        })
    });

    $(document).on('click', '.leadRemoveProduct', function (e) {
        e.preventDefault();

        var productId = $(this).attr('href');
        var leadId = $(this).attr('data-leadid');
        if (!productId || !leadId){
            Msg.warning('Product or lead is not available');
            return;
        }
        $.ajax({
            url: '/leadProduct',
            data: {
                leadId: leadId,
                removeProduct: productId
            },
            type: 'post',
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status){
                    $('#table-lead-products').reloadFragment();
                    Msg.success('Done');
                } else {
                    Msg.warning(resp.messages.join("\n"));
                }
            },
            error: function () {
                Msg.error('Something went wrong. Please contact administrator for details');
            }
        })
    });

    $(document).on("click", ".btn-place-order", function(e) {
        var href = window.location.pathname + "?placeOrderModal";
        flog("place order click", window.location.pathname, href);

        $.ajax({
            url: href,
            type: 'get',
            dataType: 'html',
            success: function (resp) {
                $("#modal-place-order .modal-content").html(resp);
                $("#modal-place-order form").forms({
                    onSuccess : function() {
                        $("#modal-place-order").modal("hide");
                        Msg.info("Order placed");
                        window.location.reload();
                    }
                });
                $("#modal-place-order").modal("show");

            },
            error: function () {
                Msg.error('Something went wrong. Please contact administrator for details');
            }
        })
    });
}