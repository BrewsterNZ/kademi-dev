function initManageEmail() {
    initModalAddEmail();
    initModalAddTemplate();
    initDeleteEmail();

    $("body").on("click", ".btn-dup-email", function (e) {
        e.preventDefault();
        var name = $(e.target).attr("href");
        duplicate(name);
    });
    $("body").on("click", ".btn-dup-temp-email", function (e) {
        e.preventDefault();
        var name = $(e.target).attr("href");
        duplicate(name, true);
    });
    $('body').on('click', '.btn-dup-template', function (e) {
        e.preventDefault();
        var name = $(e.target).attr("href");
        duplicate(name, true);
    });
}


function initSendTest() {
    flog("initSendTest");
    $('.btn-sent-test').click(function (e) {
        flog("test");
        e.preventDefault();
        doSendTest();

    });
    $(".btn-sent-test-choose").click(function (e) {
        e.preventDefault();
        $("#modal-send-test").modal();
    });
    flog("send test", $(".btn-sent-test-choose"));
    $("#modal-send-test").find("form").forms({
        onSuccess: function (resp) {
            flog("resp", resp);
            onTestMultipleResponse(resp);
        }
    });
}

function onTestMultipleResponse(resp) {
    flog("onTestMultipleResponse", resp);
    if (resp.status) {
        if (resp.messages.length == 1) {
            var modal = $("#modal-send-test-progress");
            modal.modal();
            var target = modal.find(".modal-body");
            loadEmailItemContent(target, "/emails/" + resp.messages[0]);
        } else {
            var modal = $("#modal-multiple-send-test-progress");
            modal.modal();
            var target = modal.find(".modal-body");
            loadMultipleEmailItemContent(target, resp.messages);
        }

    } else {
        Msg.info("Couldnt not send test email: " + resp.messages);
    }
}

function loadMultipleEmailItemContent(target, ids) {
    flog("loadMultipleEmailItemContent", ids);
    setInterval(function () {

        var tbody = document.createElement("tbody");
        for (i = 0; i < ids.length; i++) {
            var id = ids[i];
            $(tbody).append(loadEmailItemDetails(target, id));
        }
        $(target).find("tbody").replaceWith(tbody);

    }, 3000);
}

function loadEmailItemDetails(target, id) {
    flog("loadEmailItemDetails", id);
    var template = $("#row-email-template").html();
    var emailRow = Handlebars.compile(template);

    Handlebars.registerHelper("debug", function (optionalValue) {
        flog("Current Context");
        flog("====================");
        flog(this);

        if (optionalValue) {
            flog("Value");
            flog("====================");
            flog(optionalValue);
        }
    });
    var myRow;

    $.ajax({
        type: 'GET',
        url: "/emails/" + id,
        datatype: 'json',
        async: false,
        data: {
            asJson: true,
            status: true,
            id: id
        },
        success: function (resp) {
            var json = JSON.parse(resp);
            row = emailRow(json);
            myRow = row;
        }
    });

    return myRow;
}

function doSendTest() {
    flog("doSendTest", window.location.pathname);
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        datatype: 'json',
        data: {
            sendTest: true
        },
        success: function (resp) {
            Msg.success('A test has been sent to your email address');
            onTestMultipleResponse(resp);
        },
        error: function (resp) {
            Msg.error('Sorry, we couldnt send the test. Please contact the administator to help find the problem.');
        }
    });
}

function onTestResponse(resp) {
    flog("onTestResponse", resp);
    if (resp.status) {
        var url = resp.nextHref;
        //var win = window.open(url, "_blank");
        var modal = $("#modal-send-test-progress");
        modal.modal();
        var target = modal.find(".modal-body");
        loadEmailItemContent(target, url);
    } else {
        Msg.info("Couldnt not send test email: " + resp.messages);
    }
}

function loadEmailItemContent(target, url) {
    flog("loadEmailItemContent", url);
    target.load(url + ' #email-item-info > *', function (response, status, xhr) {
        setTimeout(function () {
            var complete = target.find(".status-c");
            flog("reload", complete);
            if (complete.length == 0) {
                loadEmailItemContent(target, url);
            }
        }, 3000);
    });
}


function initModalAddEmail() {
    flog("initModalAddEmail");
    var modal = $('#modal-add-email');

    modal.find('form').forms({
        onSuccess: function (data) {
            flog('saved ok', data);
            modal.modal('hide');
            Msg.success($('#name').val() + ' is created!');
            $('#email-trigger-wrapper').reloadFragment();
        }
    });
}

function initModalAddTemplate() {
    flog("initModalAddTemplate");
    var modal = $('#modal-add-template');
    var form = modal.find('form');

    form.forms({
        onSuccess: function (data) {
            flog('saved ok', data);
            Msg.success(form.find('#templateName').val() + ' is created!');
            modal.modal('hide');
            form.trigger('reset');
            $('#email-template-table').reloadFragment();
            $('#modal-add-email-templates').reloadFragment();
        }
    });
}

function initDeleteEmail() {
    //Bind event for Delete email
    $('body').on('click', 'a.btn-delete-email', function (e) {
        e.preventDefault();

        var btn = $(this);
        flog('do it', btn);

        var href = btn.attr('href');
        var name = btn.attr('data-title');

        confirmDelete(href, name, function () {
            flog('remove', btn);
            btn.closest('tr').remove();
            Msg.success(name + ' is deleted!');
            $('#modal-add-email-templates').reloadFragment();
        });
    });
}

function initChooseGroup() {
    initChooseGroupModal();
    initRemoveRecipientGroup();
}

function initChooseOrganisation() {
    initChooseOrganisationModal();
    initRemoveRecipientOrganisation();
}

function initChooseOrganisationModal() {
    var modal = $('#modal-choose-orgs');

    modal.find('input:radio').on('click', function () {
        var radioBtn = $(this);
        flog(radioBtn);
        flog("radiobutton click", radioBtn, radioBtn.is(":checked"));
        setOrganisationRecipient(radioBtn.attr('name'), radioBtn.val());
    });
}

function initRemoveRecipientOrganisation() {
    var blockWrapper = $('#recipients');
    flog('initRemoveRecipientOrganisation');

    blockWrapper.on('click', '.btn-remove-org', function (e) {
        flog('click', this);
        e.preventDefault();
        e.stopPropagation();

        if (confirm('Are you sure you want to remove this organisation?')) {
            var btn = $(this);
            flog('do it', btn);

            var href = btn.attr('href');
            setOrganisationRecipient(href, "none");
            $('#modal-choose-orgs').find('input:radio').filter('[name=' + href + ']').removeAttr('checked');
        }
    });
}

function setOrganisationRecipient(name, orgType) {
    flog("setOrganisationRecipient", name, orgType);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                organisation: name,
                organisationType: orgType
            },
            success: function (data) {
                flog("saved ok", name);

                //var blockWrapper = $('#orgsRecipients').find('.recipient');
                flog("add to list", orgType);
                flog('.block.' + name);
                flog($('#orgsRecipients').find('.block.' + name));
                $('#orgsRecipients').find('.block.' + name).remove();


                $('#orgsRecipients').find('.' + orgType).append(
                        '<span class="block ' + name + '">' +
                        '<span class="block-name">' + name + '</span>' +
                        '<a class="btn btn-xs btn-danger btn-remove-org" href="' + name + '" title="Remove this org"><i class="clip-minus-circle "></i></a>' +
                        '</span>'
                        );
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error('err');
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}

function initChooseGroupModal() {
    var modal = $('#modal-choose-group');

    modal.find('input:radio').on('click', function () {
        var radioBtn = $(this);

        flog('a');

        flog("radiobutton click", radioBtn, radioBtn.is(":checked"));
        setGroupRecipient(radioBtn.attr('name'), radioBtn.val());
    });
}


function duplicate(href, createTemplate) {
    flog("duplicate", href);
    try {

        var data = {};
        if (createTemplate) {
            data.createTemplate = true;
        } else {
            data.duplicate = true;
        }

        $.ajax({
            type: 'POST',
            url: href,
            data: data,
            success: function (data) {
                if (data.status) {
                    flog("saved ok", data);
                    if (createTemplate) {
                        if (data.nextHref) {
                            window.location.href = data.nextHref;
                        } else {
                            $("#email-template-table").reloadFragment();
                            $('#modal-add-email-templates').reloadFragment();
                        }
                    } else {
                        $("#email-trigger-wrapper").reloadFragment();
                    }
                } else {
                    Msg.error('An error occurred duplicating the email. Please try again and contact support if its still broke.');
                }
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error('An error occurred duplicating the email. Please try again and contact support if its still broke.');
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}


function setGroupRecipient(name, groupType) {
    flog("setGroupRecipient", name, groupType);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                group: name,
                groupType: groupType
            },
            success: function (data) {
                flog("saved ok", name);

                var blockWrapper = $('#groupRecipients').find('.' + groupType);
                $('#groupRecipients').find('.block.' + name).remove();

                flog("add to list");
                blockWrapper.append(
                        '<span class="block ' + name + '">' +
                        '    <span class="block-name">' + name + '</span>' +
                        '    <a class="btn btn-xs btn-danger btn-remove-role" href="' + name + '" title="Remove this role"><i class="clip-minus-circle "></i></a>' +
                        '</span>'
                        );
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error('err');
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}

function initRemoveRecipientGroup() {
    var blockWrapper = $('#recipients');
    flog('initRemoveRecipientGroup');

    blockWrapper.on('click', '.btn-remove-role', function (e) {
        flog('click', this);
        e.preventDefault();
        e.stopPropagation();

        if (confirm('Are you sure you want to remove this group?')) {
            var btn = $(this);
            flog('do it', btn);

            var href = btn.attr('href');
            deleteFile(href, function () {
                btn.closest('span.block').remove();
                $('#modal-choose-group').find('input:radio').filter('[name=' + href + ']').removeAttr('checked');
            });
        }
    });
}

function initRemoveRecipientOrganisation() {
    var blockWrapper = $('#recipients');
    flog('initRemoveRecipientOrganisation');

    blockWrapper.on('click', '.btn-remove-org', function (e) {
        flog('click', this);
        e.preventDefault();
        e.stopPropagation();

        if (confirm('Are you sure you want to remove this organisation?')) {
            var btn = $(this);
            flog('do it', btn);

            var href = btn.attr('href');
            deleteFile(href, function () {
                btn.closest('span.block').remove();
                $('#modal-choose-group').find('input:radio').filter('[name=' + href + ']').removeAttr('checked');
            });
        }
    });
}

function initAdvanceRecipients() {
    var showAdvanced = $('#showAdvanced');
    var scriptXml = $('textarea[name=filterScriptXml]');

    if (scriptXml.val().length > 0 && !showAdvanced.is(':checked')) {
        flog('show adv');
        showAdvanced.trigger('click');
    }
}

function getValidEmail(emailAddress) {
    var pattern = /^(("[\w-\s]+")|([\w-'']+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,66}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
    if (pattern.test(emailAddress)) {
        return emailAddress;
    } else {
        emailAddress = emailAddress.replace(/^.*\<(.*)\>$/, "$1");
        if (pattern.test(emailAddress)) {
            return emailAddress;
        }
    }
    return false;
}

function initFormDetailEmail() {
    var form = $('form[name=frmDetails]');

    form.forms({
        validate: function () {
            var error = 0;
            var fromAddress = $('#fromAddress');
            var fromAddressStr = fromAddress.val().trim();
            var replyToAddress = $('#replyToAddress');
            var replyToAddressStr = replyToAddress.val().trim();
            var emailEnabled = $('#emailEnabled');
            var subject = $('#subject');
            var subjectStr = subject.val();
            var isEmailEnabled = emailEnabled.length > 0 ? emailEnabled.is(':checked') : true;
            var availableDomainsStr = $("#availableDomains");
            var availableDomains = JSON.parse(availableDomainsStr.val().trim());
            var emailToCheck;
            var errorField;

            flog('manageEmail.js: isEmailEnabled: ' + isEmailEnabled);

            if (isEmailEnabled) {
                if (fromAddressStr) {
                    var errorEmail = 0;
                    if (!validateFuseEmail(fromAddressStr)) {
                        errorEmail++;
                        showErrorField(fromAddress);
                    }

                    if (replyToAddressStr && (!/@{.*}/.test(replyToAddressStr) && !validateFuseEmail(replyToAddressStr))) {
                        errorEmail++;
                        showErrorField(replyToAddress);
                    }

                    if (errorEmail > 0) {
                        error++;
                        showMessage('Email address is invalid!', form);
                    } else {
                        emailToCheck = getValidEmail(fromAddressStr);
                        errorField = fromAddress;
                    }

                } else {
                    if (replyToAddressStr != "") {
                        if (!/@{.*}/.test(replyToAddressStr) && !validateFuseEmail(replyToAddressStr)) {
                            flog("replyto invalid");
                            error++;
                            showErrorField(replyToAddress);
                        }
                        emailToCheck = getValidEmail(replyToAddressStr);
                        errorField = replyToAddress;
                    }
                }

                if (subjectStr.indexOf('\n') !== -1) {
                    error++;
                    showErrorField(subject);
                    showMessage('Subject should not contain newline', form);
                }

                flog("validating email: ", emailToCheck, " against domains: ", availableDomains);
                if (emailToCheck !== false && validateFuseEmail(emailToCheck)) {
                    var emailDomain = emailToCheck.replace(/.*@/, "");
                    var valid = false;
                    flog(availableDomains.length);
                    for (var prop in availableDomains) {
                        var rootDomain = availableDomains[prop];
                        flog("Email Domain: ", emailDomain, " Root Domain: ", rootDomain);
                        if (emailDomain === rootDomain) {
                            valid = true;
                            break;
                        }
                    }
                    if (!valid) {
                        error++;
                        showErrorField(errorField);
                        showMessage('The email address must have a domain name the same as the domain on the website selected.', form);
                    }

                }
            }



            if ($('#timerExpressionEditor').length > 0) {
                var editorVal = ace.edit('timerExpressionEditor').getValue();
                $('#timerExpression').val(editorVal);
            }

            if (error === 0) {
                flog("valid");
                return true;
            } else {
                flog("invalid");
                return false;
            }
        },
        onSuccess: function () {
            $('body').removeClass('dirty');
            Msg.success('Saved');
            $('#descriptionDiv').reloadFragment();
        }
    });
}