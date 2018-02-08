(function ($) {
    var isAddFormInitialized = false;
    var isEditFormInitialized = false;
    
    $(function () {
        var eventManager = $('.event-manager[data-editable="true"]');
        if (eventManager.length > 0) {
            eventManager.find('.btn-add-event').on('click', function (e) {
                e.preventDefault();
                
                if (!isAddFormInitialized) {
                    $.getStyleOnce('/static/daterangepicker/2.0.11/daterangepicker.css');
                    $.getScriptOnce('/static/daterangepicker/2.0.11/daterangepicker.js', function () {
                        initAddEventForm();
                    });
                    isAddFormInitialized = true;
                }
            });
            
            var eventForm = $('#event-manager-form');
            var btnEdit = eventManager.find('.btn-edit-event');
            var btnSave = eventManager.find('.btn-save-edit-event');
            var btnClose = eventManager.find('.btn-cancel-edit-event');
            
            btnSave.on('click', function (e) {
                e.preventDefault();
                
                eventForm.find('form').trigger('submit');
            });
            
            btnEdit.on('click', function (e) {
                e.preventDefault();
                
                if (!isEditFormInitialized) {
                    $.getStyleOnce('/static/daterangepicker/2.0.11/daterangepicker.css');
                    $.getStyleOnce('/static/bootstrap-switch/3.3.4/dist/css/bootstrap3/bootstrap-switch.min.css');
                    $.getScriptOnce('/static/daterangepicker/2.0.11/daterangepicker.js', function () {
                        $.getScriptOnce('/static/bootstrap-switch/3.3.4/dist/js/bootstrap-switch.min.js', function () {
                            initEditEventForm(eventForm);
                        });
                    });
                    
                    isEditFormInitialized = true;
                }
                
                eventForm.show();
                btnEdit.hide();
                btnSave.show();
                btnClose.show();
            });
            
            btnClose.on('click', function (e) {
                e.preventDefault();
                
                eventForm.hide();
                btnEdit.show();
                btnSave.hide();
                btnClose.hide();
            });
        }
    });
    
    function initEditEventForm(container) {
        flog('initEditEventForm');
        
        var form = container.find('form');
        
        var emailConfirmTemplate = container.find('[name=emailConfirmTemplate]');
        emailConfirmTemplate.html(emailConfirmTemplate.next().html());
        initHtmlEditors(emailConfirmTemplate);

        makeSwitch(form);
        initConfirmationTab(container);
        initDetailsTab(form);
        initReminder(form);
        initReminderModal(form);
        $.getScriptOnce('/theme/apps/contentEditor-lib/jquery.contentEditor.js', function () {
            initFullscreenEditorModal($('[name=description]'), true, false, []);
        });

    }
    
    function makeSwitch(form) {
        form.find(".make-switch input[type=checkbox], input.make-switch").each(function () {
            var target = $(this);
            var dataHolder = target.is('.make-switch') ? target : target.closest('.make-switch');
            
            target.bootstrapSwitch({
                onColor: dataHolder.attr('data-on-color') || 'info',
                offColor: dataHolder.attr('data-off-color') || 'default',
                size: dataHolder.attr('data-size') || 'normal',
                onText: dataHolder.attr('data-on-text') || 'ON',
                offText: dataHolder.attr('data-off-text') || 'OFF',
                labelText: dataHolder.attr('data-label-text') || '&nbsp;',
                handleWidth: +dataHolder.attr('data-handle-width') || 'auto',
                labelWidth: +dataHolder.attr('data-label-width') || 'auto'
            });
        });
    }
    
    function initReminder(form) {
        flog('initReminder', form);
        
        var reminderModal = $('#reminderDetails');
        var reminderForm = reminderModal.find('form');
        var tbody = $('tbody.reminders');
        
        tbody.on('click', 'a.edit', function (e) {
            e.preventDefault();
            form.addClass('dirty');
            var tr = $(e.target).closest('tr');
            var ordinal = tbody.children().index(tr);
            flog('editing row', tr, 'of', tbody, 'ordinal=', ordinal);
            reminderForm.find('input[name=reminderId]').val(ordinal + '');
            
            reminderForm.find('input[name=timerMultiple]').val(tr.find('.timerMultiple').val());
            reminderForm.find('.timer-unit').text(tr.find('.timerUnit').val());
            reminderForm.find('input[name=subject]').val(tr.find('.subject').val());
            reminderForm.find('select[name=themeSite]').val(tr.find('.themeSite').val());
            var html = tr.find('.html').text();
            reminderForm.find('.reminder-content').val(html);
            
            reminderModal.modal('show');
        });
        
        tbody.on('click', 'a.delete', function (e) {
            e.preventDefault();
            form.addClass('dirty');
            var tr = $(e.target).closest('tr');
            tr.remove();
        });
        
        // Reset the form when add reminder is clicked
        $('.add-reminder').click(function (e) {
            form.addClass('dirty');
            reminderForm.find('input,select').val('');
            reminderForm.find('.reminder-content').html('');
        });
    }
    
    // This is when the user saves the reminder modal
    function initReminderModal(form) {
        flog('initReminderModal');
        
        var reminderModal = $('#reminderDetails');
        var reminderForm = reminderModal.find('form');
        var tbody = $('tbody.reminders');
        
        reminderForm.submit(function (e) {
            e.preventDefault();
            
            form.addClass('dirty');
            
            var timerMultiple = reminderForm.find('input[name=timerMultiple]').val();
            var timerUnit = reminderForm.find('.timer-unit').text();
            var subject = reminderForm.find('input[name=subject]').val();
            var themeSite = reminderForm.find('select[name=themeSite]').val();
            var themeSiteName = reminderForm.find('select[name=themeSite] option:selected').text();
            var html = reminderForm.find('.reminder-content').val();
            
            if (timerUnit === '') {
                Msg.error('Please select the time units, like how many days, hours, etc');
                return;
            }
            
            if (timerMultiple === '') {
                Msg.error('Please select the number of ' + timerUnit);
                return;
            }
            
            if (subject === '') {
                Msg.error('Please enter a subject for the reminder email');
                return;
            }
            
            if (html.length < 5) {
                Msg.error('Please check your email message, it looks a bit short');
                return;
            }
            
            var ordinal = reminderForm.find('input[name=reminderId]').val();
            var tr;
            if (ordinal === '') {
                tr = $('#reminder-row-template tr').clone();
                tr.find('input[type=checkbox]').val('true').bootstrapSwitch();
                tbody.append(tr);
            } else {
                tr = tbody.children().eq(ordinal);
            }
            var b = reminderForm.find('input[name=enabled]').prop('checked');
            var status = tr.find('.reminder-status');
            status.removeClass('fa-play').removeClass('fa-exclamation-circle');
            if (b) {
                status.addClass('fa-play');
            } else {
                status.addClass('fa-exclamation-circle');
            }
            
            tr.find('.timerMultiple').val(timerMultiple).not('input').text(timerMultiple);
            tr.find('.timerUnit').val(timerUnit).text(timerUnit);
            tr.find('.subject').val(subject).text(subject);
            tr.find('.themeSite').val(themeSite).text(themeSiteName);
            tr.find('.html').text(html);
            
            reminderModal.modal('hide');
        });
        
        $('.timer-units li').click(function (e) {
            e.preventDefault();
            var unit = $(e.target).text();
            $('.timer-unit').text(unit);
        });
    }
    
    function initDetailsTab(form) {
        flog('initDetailsTab');
        
        form.forms({
            onValid: function (form) {
                // Renumber reminder inputs
                form.find('.reminders tr').each(function (i, n) {
                    var tr = $(n);
                    tr.find('input.enabled').attr('name', 'reminder.' + i + '.enabled');
                    tr.find('input.timerMultiple').attr('name', 'reminder.' + i + '.timerMultiple');
                    tr.find('input.timerUnit').attr('name', 'reminder.' + i + '.timerUnit');
                    tr.find('input.subject').attr('name', 'reminder.' + i + '.subject');
                    tr.find('input.themeSite').attr('name', 'reminder.' + i + '.themeSite');
                    tr.find('textarea.html').attr('name', 'reminder.' + i + '.html');
                });
            },
            onSuccess: function (resp) {
                Msg.success('Event is saved');
            }
        });
        
        form.find('.event-range').daterangepicker({
                format: 'DD/MM/YYYY HH:mm',
                timePicker: true,
                timePickerIncrement: 15,
                timePicker12Hour: false,
                opens: 'left',
                locale: {
                    format: 'DD/MM/YYYY HH:mm'
                }
            },
            function (start, end) {
                flog('onChange', start, end);
                form.find('[name=startDate]').val(formatDateTime(start));
                form.find('[name=endDate]').val(formatDateTime(end));
            }
        );
    }
    
    function initConfirmationTab(container) {
        flog('initConfirmationTab');
        
        container.find('#allowRegistration, #emailConfirm, #allowGuests').click(function () {
            checkConfirmation(container);
        });
        
        checkConfirmation(container);
    }
    
    function checkConfirmation(container) {
        flog('checkConfirmation');
        
        if (container.find('#allowRegistration').is(':checked')) {
            // Show everythign, hide anything not applicable
            container.find('.allowReg, .allowGuests, .emailReg').show();
            
            if (container.find('#allowGuests').is(':checked')) {
                
            } else {
                container.find('.allowGuests').hide();
            }
            
            if (container.find('#emailConfirm').is(':checked')) {
                
            } else {
                container.find('.emailReg').hide();
            }
        } else {
            container.find('.allowReg').hide();
        }
    }
    
    function initAddEventForm() {
        flog('initAddEventForm');
        
        var modal = $('#modal-add-event');
        var form = modal.find('form');
        
        form.forms({
            onSuccess: function (resp) {
                if (resp.nextHref) {
                    Msg.success('Event is created. Redirecting to event page...');
                    window.location.href = resp.nextHref;
                } else {
                    Msg.success('Event is created. Reloading...');
                    window.location.reload();
                }
                
                modal.modal('hide');
            }
        });
        
        form.find('.event-range').daterangepicker({
                format: 'DD/MM/YYYY HH:mm',
                timePicker: true,
                timePickerIncrement: 15,
                timePicker12Hour: false,
                opens: 'left',
                locale: {
                    format: 'DD/MM/YYYY HH:mm'
                }
            },
            function (start, end) {
                flog('onChange', start, end);
                form.find('[name=startDate]').val(formatDateTime(start));
                form.find('[name=endDate]').val(formatDateTime(end));
            }
        );
        
        modal.on('hidden.bs.modal', function () {
            form.trigger('reset');
        });
    }


    function initFullscreenEditorModal(target, isContentEditor, isEdmEditor, allGroups) {
        var content = target.html() || '';
        var id = target.attr('id');
        if (!id) {
            id = 'editor-' + (new Date()).getTime();
            target.attr('id', id);
        }
        var modalId = 'modal-fullscreen-' + id;
        var modal = $(
            '<div id="' + modalId + '" class="modal ' + (isContentEditor || isEdmEditor ? 'modal-full' : '') + ' fullscreen-editor-modal fade" tabindex="-1">' +
            '    <div class="modal-dialog modal-lg">' +
            '        <div class="modal-content">' +
            '            <div class="modal-body">' +
            '                <div class="editor-wrapper">' +
            '                    <div class="editor-loading">' +
            '                        <span>' +
            '                            <span class="loading-icon">' +
            '                                <i class="fa fa-spinner fa-spin fa-4x fa-fw"></i>' +
            '                            </span>' +
            '                            <span class="loading-text">Initializing editor...</span>' +
            '                        </span>' +
            '                    </div>' +
            '                    <textarea autocomplete="off" class="form-control">' + content + '</textarea>' +
            '                </div>' +
            '            </div>' +
            '            <div class="modal-footer">' +
            '                <button type="button" data-dismiss="modal" class="btn btn-sm btn-default">Close</button>' +
            '                <button type="button" class="btn btn-sm btn-info fullscreen-editor-save">Save</button>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>'
        );
        modal.appendTo(document.body);

        var textarea = modal.find('textarea');
        var textareaId = 'modal-fullscreen-textarea-' + id;
        textarea.attr('id', textareaId);

        var ckeditor;
        var editorLoading = modal.find('.editor-loading');
        if (isContentEditor || isEdmEditor) {
            var pageName = getFileName(window.location.href);
            var pagePath = target.attr('data-page-path') || '';
            var basePath = target.attr('data-base-path') || '';

            textarea[isContentEditor ? 'contentEditor' : 'edmEditor']({
                iframeMode: true,
                snippetsUrl: './_components?fileName=' + pageName,
                snippetsHandlersUrl: './_components?handlers&fileName=' + pageName,
                basePath: basePath,
                pagePath: pagePath,
                allGroups: allGroups,
                contentStyles: [
                    {href: '/static/bootstrap/3.3.7/css/bootstrap.css'},
                    {href: '/theme/apps/keditor-lib/dist/css/keditor-0.0.0.min.css'},
                    {href: '/theme/apps/keditor-lib/dist/css/keditor-components-0.0.0.min.css'}
                ],
                onReady: function () {
                    editorLoading.hide();
                }
            });
        } else {
            initHtmlEditors(textarea, 500, null, null, null, function (editor) {
                ckeditor = editor;
                editorLoading.hide();
            });
        }

        var btnEdit = $('<button type="button" class="btn btn-sm btn-info fullscreen-editor-edit">Edit content</button>');
        target.before(btnEdit);
        btnEdit.wrap('<p class="fullscreen-editor-actions"></p>');

        btnEdit.on('click', function (e) {
            e.preventDefault();

            modal.modal('show');
        });

        modal.find('.fullscreen-editor-save').on('click', function (e) {
            e.preventDefault();

            var content;
            if (isContentEditor || isEdmEditor) {
                content = textarea[isContentEditor ? 'contentEditor' : 'edmEditor']('getContent');
            } else {
                content = ckeditor.getData();
            }

            target.val(content);
            target.closest('form').trigger('submit');
            modal.modal('hide');

            // var iframe = target.siblings('.fullscreen-editor-preview');
            // if (iframe.hasClass('fullscreen-editor-preview-inline')) {
            //     loadFullscreenEditorInlinePreview(target);
            // }
        });
    }
    
})(jQuery);
