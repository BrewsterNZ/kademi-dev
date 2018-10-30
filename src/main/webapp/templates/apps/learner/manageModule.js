var win = $(window);
var iframeUrl;

function initManageModule(baseHref, themePath) {
    flog("initManageModule", baseHref, themePath);
    flog('Is Bootstrap335: ' + isKEditor);

    window.request_url = function () {
        var str = '';
        var p = getSelectedProgram();
        if (p) {
            str += p.name + '/';
        }
        if (selectedCourse) {
            str += selectedCourse.name + '/'; // TODO: branches
        }
        flog('str', str);
        var s = baseHref + '/' + str + '_DAV/PROPFIND?fields=href,name,milton:title,iscollection&where=iscollection';
        flog('request_url', s);
        return s;
    };

    if (isKEditor) {
        initPostMessage();
    }

    initDropdownMix();
    initImagePicker($('#thumb'), window.location.pathname, '');
    initCRUDModulePages();
    initModuleList();
    initPublishingMenu('manageModules');
    initAddQuizModal();
    initFormDetails();
    initQuizBuilder();
    initScormUpload();
    initFrequencyGroup();
    initResultsSearch();
    initCalendarStuff();
    checkTab();

    window.onbeforeunload = isModalOpen;
}

function checkTab() {
    var url = window.location.href;
    if (url.indexOf("#activity-tab") > 0 || url.indexOf("pageSize") > 0) {
        $('.tabbable .nav-tabs a[href="#activity"]').trigger('click');
    }
}

function initCalendarStuff() {
    flog("initCalendarStuff");
    var btn = $(".addEvent");
    var modal = $("#modal-add-event");
    var form = modal.find('form');
    form.forms({
        onSuccess: function (resp) {
            flog('Module details saved', resp);
            Msg.info("Saved");
            modal.modal("hide");
            reloadEvents();
        }
    });
    btn.click(function (e) {
        e.preventDefault();
        modal.modal("show");
    });

    $("body").on("click", ".deleteEvent", function (e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var id = link.attr("href");
        if (confirm("Are you sure you want to completely delete this event and attendees?")) {
            $.ajax({
                type: 'POST',
                url: window.location.pathname + "?deleteEventId=" + id,
                dataType: 'json',
                success: function (resp) {
                    reloadEvents();
                },
                error: function (resp) {
                    flog('error', resp);
                    Msg.error('err: couldnt load page data');
                }
            });
        }

    });
    $("abbr.timeago").timeago();
}

function reloadEvents() {
    $("#modCalEventsBody").reloadFragment({
        whenComplete: function () {
            $("abbr.timeago").timeago();
        }
    });
}

function initResultsSearch() {
    $(document.body).on('pageDateChanged', function (e, startDate, endDate, text, trigger, initial) {
        flog("initResultsSearch: pageDateChanged", initial);
        if (initial) {
            flog("Ignore initial");
            return;
        }
        $("#activityBody").reloadFragment();
    });
}

function initFrequencyGroup() {
    flog('initFrequencyGroup');

    var group = $('#frequency-group');
    var btnText = group.find('.btn .btn-text');
    var lis = group.find('.dropdown-menu li');
    var txt = $('#sFrequency');

    lis.each(function () {
        var li = $(this);

        li.on('click', function (e) {
            e.preventDefault();

            var a = li.find('a');
            var value = a.attr('data-value');

            txt.val(value);
            btnText.html(value);
        });
    });
}

function initPostMessage() {
    flog('initPostMessage');

    win.on('message', function (e) {
        var data = $.parseJSON(e.originalEvent.data);
        flog('On got message', e);

        if (data.from === 'keditor') {
            if (data.isSaved) {
                Msg.success('Saved!');

                if (data.willClose) {
                    $('#modal-add-page').modal('hide');
                }
            } else {
                iframeUrl = data.url;
            }
        }
    });
}

function getSelectedProgram() {
    var a = $('#programs-wrapper').find('.active');
    flog('getSelectedProgram', a);
    if (a.length === 0) {
        return null;
    } else {
        return {
            name: a.html()
        };
    }
}

function getSelectedCourse() {
    var a = $('#courses-wrapper').find('.active');
    flog('getSelectedCourse', a);
    if (a.length === 0) {
        return null;
    } else {
        return {
            name: a.html()
        };
    }
}

function getSelectedModule() {
    var a = $('#modules-wrapper').find('.active');
    flog('getSelectedModule', a);
    if (a.length === 0) {
        return null;
    } else {
        return {
            name: a.html()
        };
    }
}

function uploadCurrentModule(mixWrapper) {
    var str = getSelectedProgram().name;
    var c = getSelectedCourse();
    if (c) {
        str += ' / ' + c.name;
    }
    var m = getSelectedModule();
    if (m) {
        str += ' / ' + m.name;
    }
    mixWrapper.find('span.current-module').html(str);
}

function propfindHref(href) {
    return href + '_DAV/PROPFIND?fields=href,name,milton:title,iscollection&where=iscollection';
}

function initDropdownMix() {
    flog('initDropDown');

    var mixWrapper = $('.program-course-module-mix');
    var dropdown = mixWrapper.find('.dropdown-menu');
    var mainContent = $('.main-content').children('.container');
    var btnShowMix = $('.btn-show-mix');

    var adjustDropdownWidth = function () {
        dropdown.css('width', mainContent.width());
    };

    adjustDropdownWidth();

    $(window).resize(function () {
        adjustDropdownWidth();
    });

    $(document.body).on('click', function (e) {
        var target = $(e.target);

        if (!target.is(btnShowMix) && !target.parents().is(btnShowMix) && !target.parents().is(dropdown)) {
            mixWrapper.removeClass('open');
        }
    });

    btnShowMix.on('click', function (e) {
        e.preventDefault();

        mixWrapper[mixWrapper.hasClass('open') ? 'removeClass' : 'addClass']('open');
    });

    var programsList = $('#programs-wrapper').find('.programs-list');
    var coursesList = $('#courses-wrapper').find('.courses-list');
    var modulesList = $('#modules-wrapper').find('.modules-list');

    // Add event for item of Program list
    programsList.on('click', 'a', function (e) {
        e.preventDefault();

        var a = $(this);
        flog('program click', a);

        if (!a.hasClass('active')) {
            a.siblings('.active').removeClass('active');
            a.addClass('active');

            modulesList.html('');
            coursesList.html('').addClass('loading');

            uploadCurrentModule(mixWrapper);

            var url = propfindHref(a.attr('href'));
            $.getJSON(url, function (data) {
                var courseStr = '';

                for (var i = 1; i < data.length; i++) {
                    var name = data[i]['name'];
                    if (!name.startsWith('.')) {
                        courseStr += '<a class="course" href="' + data[i]['href'] + '">' + data[i]['title'] + '</a>';
                    }
                }

                coursesList.append(courseStr).removeClass('loading');
            });
        }
    });

    // Add event for item of Course list
    coursesList.on('click', 'a', function (e) {
        e.preventDefault();

        var a = $(this);

        if (!a.hasClass('active')) {
            a.siblings('.active').removeClass('active');
            a.addClass('active');

            modulesList.html('').addClass('loading');

            uploadCurrentModule(mixWrapper);

            var url = propfindHref(a.attr('href'));
            $.getJSON(url, function (data) {
                var moduleStr = '';
                for (var i = 1; i < data.length; i++) {
                    flog('module', data[i]);
                    var name = data[i]['name'];
                    if (!name.startsWith('.')) {
                        moduleStr += '<a class="module" href="' + data[i]['href'] + '">' + data[i]['title'] + '</a>';
                    }
                }

                modulesList.append(moduleStr).removeClass('loading');
            });
        }
    });

    // Add event for item of Module list
    modulesList.on('click', 'a', function (e) {
        var a = $(this);

        if (!a.hasClass('active')) {
            a.siblings('.active').removeClass('active');
            a.addClass('active');

            mixWrapper.removeClass('open');
            uploadCurrentModule(mixWrapper);
        } else {
            e.preventDefault();
        }
    });
}

function initCRUDModulePages() {
    var modal = $('#modal-add-page');
    var form = modal.find('form');

    form.find('[name=pageTitle]').tooltip({
        title: 'This field cannot be blank. Please enter a page title',
        trigger: 'manual',
        template: '<div class="tooltip tooltip-error" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        placement: 'bottom'
    });

    if (isKEditor) {
        modal.on('hidden.bs.modal', function () {
            $('#editor-frame').attr('src', '');
        });
    } else {
        initFuseModal(modal, function () {
            initHtmlEditors(modal.find('.htmleditor'), getStandardEditorHeight(), null, null, standardRemovePlugins + ',autogrow', function (editor) {
                editor.config.pagePath = window.location.pathname;
            }); // disable autogrow
        });
    }

    modal.on('click', '.btn-save', function () {
        modal.removeClass('save-and-close');
    });

    modal.on('click', '.btn-save-close', function () {
        modal.addClass('save-and-close');
    });

    $('.btn-add-page').click(function (e) {
        e.preventDefault();
        flog('initAddPageModal: click');
        // Make sure inputs are cleared
        modal.find('input[type=text], textarea, input[name=pageName]').val('');

        // Find highest order value and increment for new page
        var lastOrder = $("#pages-list input[type=hidden]").last().val();
        flog("lastOrder", lastOrder);
        if (lastOrder === null || lastOrder === "") {
            lastOrder = 0;
        }

        lastOrder = Number(lastOrder);
        var newOrderVal = lastOrder + 1;

        flog("newOrderVal", newOrderVal);
        form.find("input[name=order]").val(newOrderVal);

        modalFormHandle(form, null, false);

        if (isKEditor) {
            //openEditorFrame('newPage.html');
            openEditorFrame('');
        }

        openFuseModal(modal);
    });
}

function openEditorFrame(pageName) {
    var href = window.location.href.split('#')[0];

    $('#editor-frame').attr('src', window.location.pathname + '?contenteditor=' + pageName + '&url=' + encodeURIComponent(href));
}

function initModuleList() {
    var pagesList = $('#pages-list');

    // Draggable row
    var cont = $('div.Content');
    pagesList.sortable({
        items: 'article',
        sort: function () {
            if (cont.hasClass('ajax-loading')) {
                return false;
            }
            $(this).removeClass('ui-state-default');
        },
        update: function () {
            flog('module page change order');
            saveModulePages();
        }
    });

    pagesList.on('click', '.btn-edit-page', function (e) {
        e.preventDefault();

        flog('click edit', e, this);

        var a = $(this);
        var name = a.attr('href');
        var article = a.closest('article');
        showEditModal(name, article);
    });

    // Delete button
    pagesList.on('click', 'a.btn-delete-page', function (e) {
        e.preventDefault();

        flog('Delete page', $(this));

        var a = $(this);
        var parent = a.closest('article');
        var href = a.attr('href');
        var name = parent.find('> span.article-name').text();

        confirmDelete(href, name, function () {
            flog('remove', parent);
            parent.remove();
        });
    });
}

function checkFormControlState(type, afterRemoveLastOne) {
    flog('checkFormControlState', type);
    var allWrappers = {
        reward: $('.rewards-wrapper'),
        certificate: $('.certificates-wrapper')
    };

    allWrappers.all = allWrappers.reward.add(allWrappers.certificates);

    var wrappers;

    if (type) {
        wrappers = allWrappers[type];
    } else {
        wrappers = allWrappers.all;
    }

    wrappers.each(function () {
        var wrapper = $(this);
        var btnAdd = wrapper.prev();
        var contents = wrapper.children('div');

        if (type && !afterRemoveLastOne) {
            wrapper[contents.length === 0 ? 'addClass' : 'removeClass']('hide');
            btnAdd[contents.length === 0 ? 'addClass' : 'removeClass']('btn-add-first');
        }

        contents.each(function (i) {
            var content = $(this);

            if (type === 'reward') {
                var numRewards = 'numRewards' + i;

                content.find('input:text').attr({
                    name: numRewards,
                    id: numRewards
                });
                content.find('label').attr('for', numRewards);

                content.find('select[data-basename="reward"]').attr('name', 'reward' + i);
                content.find('select[data-basename="pointTag"]').attr('name', 'pointTag' + i);
            } else if (type === 'certificate') {
                var points = 'points' + i;
                var pointsInp = content.find('input');
                flog('points', pointsInp);
                pointsInp.attr({
                    name: points,
                    id: points
                });
                content.find('label').attr('for', points);
                content.find('select').attr('name', 'certificate' + i);
            }
        });
    });
}

function initFormControl(name) {
    var wrapper = $('.' + name + 's-wrapper');
    var btnAdd = wrapper.prev();
    var template = wrapper.children().eq(0).clone();

    checkFormControlState();

    btnAdd.on('click', function (e) {
        e.preventDefault();

        if (btnAdd.hasClass('btn-add-first')) {
            btnAdd.removeClass('btn-add-first');
            wrapper.removeClass('hide');
        } else {
            var cloned = template.clone();
            flog('cloned', cloned);
            cloned.find('input, select').val('');
            wrapper.append(cloned);
        }

        checkFormControlState(name);
    });

    wrapper.on('click', '.btn-delete-' + name, function (e) {
        e.preventDefault();

        var btn = $(this);
        var parent = btn.closest('.' + name);
        var remain = wrapper.find('.' + name).length;

        if (remain == 1) {
            btnAdd.addClass('btn-add-first');
            wrapper.addClass('hide');
            parent.find('input, select').val('');
        } else {
            parent.remove();
        }

        checkFormControlState(name, remain === 1);
    });
}

// Event for Add and Edit Certificate and Reward button in Module details panel
function initFormDetails() {
    checkFormControlState();

    var detailsWrapper = $('#details');
    var formDetails = detailsWrapper.find('form');

    var addFirst = $('.addFirst');
    addFirst.click(function (e) {
        e.preventDefault();
        var btn = $(e.target);
        var editList = btn.closest('.editList');
        editList.find('.editRow').show().find('input').val(1);
        btn.hide();
        flog('hide', btn);
    });

    initFormControl('certificate');
    initFormControl('reward');

    $('.certificates-wrapper').on('click', 'a.btn-preview-certificate', function (e) {
        e.preventDefault();

        var btn = $(this);
        var certId = btn.closest('.certificate').find('select').val();

        if (certId === '') {
            Msg.error('Please select a certificate');
        } else {
            var href = 'cert_' + certId + '/certificatePreview.pdf';
            window.open(href, '_bank');
        }
    });

    var chkEmailConfirm = $('#emailConfirm');
    var contentEmailConfirm = $('#email-confirm-content');
    var checkEmailConfirm = function () {
        contentEmailConfirm[chkEmailConfirm.is(':checked') ? 'removeClass' : 'addClass']('hide');
    };
    checkEmailConfirm();

    // For email
    chkEmailConfirm.on('click', function () {
        checkEmailConfirm();
    });

    $('#moduleDetailsForm').forms({
        validate: function (form) {
            return checkEditListsValid();
        },
        onSuccess: function (resp) {
            flog('Module details saved', resp);
            Msg.info("Saved");
            if (resp.nextHref && resp.nextHref !== decodeURIComponent(window.location.pathname)) {
                window.location.href = resp.nextHref;
            }
        }
    });

    initHtmlEditors(formDetails.find('.htmleditor'), getStandardEditorHeight() + 'px', null, null, 'autogrow', function (editor) {
        editor.config.pagePath = window.location.pathname;
    });
}

function checkEditListsValid() {
    flog('checkEditListsValid');
    var isOk = true;

    $('.certificates-wrapper, .rewards-wrapper').each(function (i) {
        var wrapper = $(this);
        var values = [];

        if (!wrapper.hasClass('hide')) {
            wrapper.children().each(function (rowIndex) {
                var item = $(this);

                item.find('select.requiredIf, input.requiredIf').each(function () {
                    var input = $(this);
                    var val = input.val().trim();
                    flog("check", input, val);

                    if (val === '') {
                        isOk = false;

                        item.addClass('has-error');
                    }
                });
                item.find('select.requiredIf').each(function () {
                    var input = $(this);
                    var val = input.val().trim();
                    flog("check", input, val);

                    if (val === '') {
                    } else {
                        flog('val', val, values);

                        if (values.indexOf(val) !== -1) {
                            showErrorField(input);
                            Msg.error('Duplicate ' + input.attr('data-basename') + ' on row ' + rowIndex);
                            isOk = false;
                        } else {
                            values.push(val);
                            flog('val2', val, values);
                        }
                    }
                });
            });
        }
    });

    return isOk;
}

function saveModulePages() {
    var order = 0;

    flog('saveModulePages');
    $('#pages-list').find('article.page').each(function (i, node) {
        var page = $(node);
        order++;
        $('input', page).attr('value', order);
    });

    $.ajax({
        type: 'POST',
        url: '',
        data: $('form.modulePages').serialize(),
        dataType: 'json',
        success: function (resp) {
            flog('saved module', resp);
        },
        error: function (resp) {
            Msg.error('Sorry couldnt update module');
        }
    });
}

function initAddQuizModal() {
    var modal = $('#modal-add-quiz');
    var form = modal.find('form');

    modal.find('.modal-body').css('min-height', getStandardModalHeight());

    $('.btn-quiz-page').click(function (e) {
        e.preventDefault();

        modal.find('input[type=text], textarea,input[name=pageName]').val('');
        modal.find('#quiz-questions').html('<ol class="quiz"></ol>');

        // Find highest order value and increment for new page
        var lastOrder = $("#pages-list input[type=hidden]").last().val();
        flog("lastOrder", lastOrder);
        if (lastOrder === null || lastOrder === "") {
            lastOrder = 0;
        }

        lastOrder = Number(lastOrder);
        var newOrderVal = lastOrder + 1;

        flog("newOrderVal", newOrderVal);
        form.find("input[name=order]").val(newOrderVal);

        modalFormHandle(form, null, true);

        modal.modal('show');
    });
}

function modalFormHandle(form, pageArticle, isQuiz) {
    form.unbind().submit(function (e) {
        e.preventDefault();
        e.stopPropagation();

        var txtTitle = form.find('[name=pageTitle]');
        var titleWrapper = txtTitle.parent();
        var title = txtTitle.val() || '';
        titleWrapper.removeClass('has-error');
        txtTitle.tooltip('hide');

        if (title.trim() === '') {
            titleWrapper.addClass('has-error');
            setTimeout(function () {
                txtTitle.tooltip('show');
            }, 200);
        } else {
            doSavePage(form, pageArticle, isQuiz);
        }
    });
}

function showEditModal(name, pageArticle) {
    flog('showEditModal', name, pageArticle);

    var editModal;
    var isQuiz = pageArticle.hasClass('quiz');
    if (isQuiz) {
        editModal = $('#modal-add-quiz');
    } else {
        editModal = $('#modal-add-page');
    }

    var form = editModal.find('form');
    editModal.find('input[name=pageName]').val(name);
    editModal.find('input:text, textarea').val('');

    openFuseModal(editModal);
    modalFormHandle(form, pageArticle, isQuiz);

    editModal.find('.btn-history').unbind().history({
        pageUrl: name,
        showPreview: false,
        afterRevertFn: function () {
            loadModalEditorContent(editModal, name, isQuiz);
        }
    });

    loadModalEditorContent(editModal, name, isQuiz);
}

function isModalOpen() {
    flog('isModalOpen');
    if ($('#modal-add-quiz').is(':visible') || $('#modal-add-page').is(':visible')) {
        return 'Please close the edit modal before leaving this page';
    }
}

function loadModalEditorContent(modal, name, isQuiz) {
    $.ajax({
        type: 'GET',
        url: name + '?type=json',
        dataType: 'json',
        success: function (resp) {
            var data = resp.data;
            flog('set into', modal, modal.find('input[name=pageTitle]'));
            modal.find('input[name=pageTitle]').val(data.title);
            if (isQuiz) {
                loadQuizEditor(modal, data);
            } else {
                if (isKEditor) {
                    openEditorFrame(name);
                } else {
                    //CKEDITOR.instances["body"].setData(data.body)
                    modal.find('textarea').val(data.body);
                    flog("set values", data.title, data.body, CKEDITOR.instances["body"]);
                }
            }
        },
        error: function (resp) {
            flog('error', resp);
            Msg.error('err: couldnt load page data');
        }
    });
}

function doSavePage(form, pageArticle, isQuiz) {
    var modal = form.closest('.modal');
    flog('doSavePage', form, isQuiz);

    resetValidation(form);
    if (!checkRequiredFields(form)) {
        return;
    }

    var title = form.find('input[name=pageTitle]').val();
    var data;
    if (isQuiz) {
        data = prepareQuizForSave(form);
    } else {
        if (isKEditor) {
            // Do nothing
        } else {
            flog('check ck editors', CKEDITOR.instances);
            for (var key in CKEDITOR.instances) {
                var editor = CKEDITOR.instances[key];
                var content = editor.getData();
                flog('got ck content', key, content, editor);
                var inp = $('textarea[name=' + key + ']', form);
                if (inp) {
                    inp.html(content);
                    flog('updated', inp);
                }
            }
        }

        data = form.serialize();
    }

    var formAction = form.attr('action');
    flog('do ajax post', formAction, data);
    try {
        modal.find('button[data-type=form-submit]').attr('disabled', 'true');
        form.addClass('ajax-processing');

        $.ajax({
            type: 'POST',
            url: formAction,
            data: data,
            dataType: 'json',
            success: function (response) {
                form.removeClass('ajax-processing');
                modal.find('button[data-type=form-submit]').removeAttr('disabled');

                if (response.status) {
                    if (pageArticle === null) {
                        $("#pages-list").reloadFragment();
                    } else {
                        pageArticle.find('> span').text(title);
                    }

                    flog(response);

                    if (isQuiz) {
                        Msg.success('Saved!');
                        modal.modal('hide');
                    } else {
                        Msg.success('Saved!');
                        closeFuseModal(modal);

                        // if (isKEditor) {
                        //     var editorFrame = modal.find('iframe');
                        //     var pageName = modal.find('[name=pageName]').val();
                        //     if (!pageName) {
                        //         pageName = getFileName(response.nextHref);
                        //     }
                        //     var postData = {
                        //         url: window.location.href.split('#')[0],
                        //         triggerSave: true,
                        //         pageName: pageName,
                        //         willClose: modal.hasClass('save-and-close')
                        //     };
                        //
                        //     modal.find('[name=pageName]').val(pageName);
                        //
                        //     var postDataStr = JSON.stringify(postData);
                        //     flog('Post data: ' + postDataStr);
                        //
                        //     editorFrame[0].contentWindow.postMessage(postDataStr, iframeUrl);
                        // } else {
                        //     Msg.success('Saved!');
                        //     closeFuseModal(modal);
                        // }
                    }
                } else {
                    Msg.error('There was an error saving the page: ' + response.messages);
                }
            },
            error: function (resp) {
                form.removeClass('ajax-processing');
                flog('error', resp);
                Msg.error('Sorry, an error occured saving your changes. If you have entered editor content that you dont want to lose, please switch the editor to source view, then copy the content. Then refresh the page and re-open the editor and paste the content back in.');
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
    return false;
}

function initScormUpload() {
    Dropzone.autoDiscover = false;
    $("#uploadScormFileDropzone.dropzone").dropzone({
        paramName: "scormModule", // The name that will be used to transfer the file
        maxFilesize: 500.0, // MB
        addRemoveLinks: true,
        parallelUploads: 1,
        uploadMultiple: false,
        acceptedMimeTypes: 'application/zip,application/x-compressed,application/x-zip-compressed,multipart/x-zip'
    });
    var dz = Dropzone.forElement("#uploadScormFileDropzone");
    flog("dropz", Dropzone, dz, dz.options.url);
    dz.on("success", function (file) {
        flog("added file", file);
    });
    dz.on("error", function (file, errorMessage) {
        Msg.error("An error occured uploading: " + file.name + " because: " + errorMessage);
    });
}