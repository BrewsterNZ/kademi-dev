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
                }
            }, 50);
        });

        orgTitleSearch.bind('typeahead:select', function (ev, sug) {
            form.find('input[name=email]').val(sug.email);
            form.find('input[name=phone]').val(sug.phone);
            form.find('input[name=address]').val(sug.address);
            form.find('input[name=addressLine2]').val(sug.addressLine2);
            form.find('input[name=addressState]').val(sug.state);
            form.find('input[name=postcode]').val(sug.postcode);
            form.find('input[name=leadOrgId]').val(sug.orgId);
            form.find('[name=country]').val(sug.country);
            $('.selectpicker').selectpicker('refresh')
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
                    form.find('input[name=postcode]').val('');
                    form.find('input[name=leadOrgId]').val('');
                    form.find('[name=country]').val('');
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

        var leadOrgDetailsForm = $('#leadOrgDetails');
        leadOrgDetailsForm.forms({
            onSuccess: function (resp) {
                var btnSaveCompany = $('.btn-save-company');
                $('#companyTabButtons').reloadFragment({
                    url: window.location.href,
                    whenComplete: function () {
                        Msg.success('Updated');
                    }
                });
                // $('#leadOrgDetailsPreview, #btn-company-details-wrapper').reloadFragment({
                //     whenComplete: function () {
                //         if (btnSaveCompany.text().trim() === 'Create new company') {
                //             btnSaveCompany.html('Save details');
                //             Msg.success('New company is created');
                //         } else {
                //             if (leadOrgDetailsForm.find('[name=title]').val() === '') {
                //                 Msg.success('Company is unlinked');
                //             } else {
                //                 Msg.success('Company details is saved')
                //             }
                //         }
                //
                //         if (leadOrgDetailsForm.find('[name=title]').val() === '') {
                //             form.find('.btn-unlink-company').css('display', 'none');
                //         }
                //     }
                // });
            }
        });

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

            var form = $(this).closest('form');
            form.find('input[name=title]').val('');
            form.find('input[name=email]').val('');
            form.find('input[name=phone]').val('');
            form.find('input[name=address]').val('');
            form.find('input[name=addressLine2]').val('');
            form.find('input[name=addressState]').val('');
            form.find('input[name=postcode]').val('');
            form.find('input[name=leadOrgId]').val('');
            form.find('[name=country]').val('');
            form.find('.btn-unlink-company').css('display', 'none');
            form.trigger('submit');
        });
    }

    function initLeadActivity() {
        $(document).on('onLeadTimelineUpdate', function () {
            $('#leadDetailActivities').reloadFragment({
                whenComplete: function () {
                    $('abbr.timeago').timeago();
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

    function initSelectPicker() {
        var sp = $('.selectpicker');
        if( sp.length > 0){
            $('.selectpicker').selectpicker({
                maxOptions: 5
            });
        }
    }

    function initLeadDetailActivities() {
        $(document).on('click', '.btnActivity', function (e) {
            e.preventDefault();
            var activity = $(this).attr('data-activity');

            if (activity) {
                $('.btnActivity, .btnActivityGroup').removeClass('active');
                if (activity == "newNote"){
                    $(this).closest('ul').siblings('.btnActivityGroup').addClass('active');
                    var action = $(this).attr('data-action');
                    $('.detailActivitiesBody').find('.panel[data-activity='+activity+']').find('input[name=action]').val(action);
                } else {
                    $(this).addClass('active');
                }

                $('.detailActivitiesBody').find('.panel').addClass('hide');
                $('.detailActivitiesBody').find('.panel[data-activity='+activity+']').removeClass('hide').stop().fadeIn();

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
            }
        });
    }
    
    function initFilterActivities() {
        $('#filterActivities').on('change', function (e) {
            if (this.value){
                $('#leadDetailActivities').find('li[data-action-type]').addClass('hide');
                $('#leadDetailActivities').find('li[data-action-type='+this.value+']').removeClass('hide');
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
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/leads/?asJson&tags&q=%QUERY',
                wildcard: '%QUERY'
            }
        });

        tagsSearch.initialize();

        viewLeadTagsInput.typeahead({
            highlight: true
        },{
            name: tagsSearch.name,
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
                            title: newTag
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
                        viewLeadTagsInput.typeahead('val','');
                    })
                }
            }
        });

        function doAddTag(tagId) {
            if (!assignedTags.find('[data-tag-id='+tagId+']').length){
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
            } else {
                Msg.info('Tag already added');
            }
        }

        viewLeadTagsInput.on('typeahead:select', function (ev, tag) {
            viewLeadTagsInput.typeahead('val','');
            doAddTag(tag.id);
        });

        assignedTags.on('click', '[data-role=removetag]', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var tagId = $(this).parent().attr('data-tag-id');
            if (tagId){
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
        })
    }

    function reloadTags() {
        $('#assignedTags').reloadFragment({
            whenComplete: function () {
                Msg.success('Tags updated');
            }
        });
    }
    
    function initSendEmail() {
        $('.panel[data-activity="newEmail"] form').forms({
            onSuccess: function (resp) {
                if (resp && resp.status){
                    Msg.success('Your email has been sent');
                } else {
                    Msg.error(resp.messages.join("\n"));
                }
            }
        })
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
    }
})();