function initManageEmail() {
    initModalAddEmail();
    initDeleteEmail();
    flog("init dups");
    $("#email-trigger-wrapper").on("click", ".btn-dup-email", function (e) {
        e.preventDefault();
        var name = $(e.target).attr("href");
        duplicate(name);
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
        callback: function (resp) {
            flog("resp", resp);
            onTestResponse(resp);
        }
    });
}

function doSendTest() {
    flog("doSendTest");
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        datatype: 'json',
        data: {
            sendTest: true
        },
        success: function (resp) {
            Msg.success('A test has been sent to your email address');
            onTestResponse(resp);
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
        callback: function (data) {
            flog('saved ok', data);
            modal.modal('hide');
            Msg.success($('#name').val() + ' is created!');
            $('#email-trigger-wrapper').reloadFragment();
        }
    });
}

function initDeleteEmail() {
    //Bind event for Delete email
    $('body').on('click', 'a.btn-delete-email', function (e) {
        e.preventDefault();

        var btn = $(e.target);
        flog('do it', btn);

        var href = btn.attr('href');
        var name = getFileName(href);

        confirmDelete(href, name, function () {
            flog('remove', btn);
            btn.closest('tr').remove();
            Msg.success(href + ' is deleted!');
        });
    });
}

function initChooseGroup() {
    initChooseGroupModal();
    initRemoveRecipientGroup();
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


function duplicate(href) {
    flog("duplicate", href);
    try {
        $.ajax({
            type: 'POST',
            url: href,
            data: {
                duplicate: "true"
            },
            success: function (data) {
                if (data.status) {
                    flog("saved ok", data);
                    $("#email-trigger-wrapper").reloadFragment();
                } else {
                    Msg.error('An error occured duplicating the email. Please try again and contact support if its still broke.');
                }
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error('An error occured duplicating the email. Please try again and contact support if its still broke.');
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

                var blockWrapper = $('#recipients').find('.blocks-wrapper');
                blockWrapper.find('.block.' + name).remove();

                flog("add to list");
                blockWrapper.filter('.' + groupType).append(
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

function initAdvanceRecipients() {
    var showAdvanced = $('#showAdvanced');
    var scriptXml = $('textarea[name=filterScriptXml]');

    if (scriptXml.val().length > 0 && !showAdvanced.is(':checked')) {
        flog('show adv');
        showAdvanced.trigger('click');
    }
}

function initFormDetailEmail() {
    var form = $('form[name=frmDetails]');

    form.forms({
        valiationMessageSelector: ".page-validation",
        validate: function () {
            var error = 0;
            var fromAddress = $('#fromAddress');
            var fromAddressStr = fromAddress.val().trim();
            var replyToAddress = $('#replyToAddress');
            var replyToAddressStr = replyToAddress.val().trim();
            var emailEnabled = $('#emailEnabled');
            var isEmailEnabled = emailEnabled.length > 0 ? emailEnabled.is(':checked') : true;

            flog('isEmailEnabled: ' + isEmailEnabled);

            if (isEmailEnabled) {
                if (fromAddressStr) {
                    if (!validateFuseEmail(fromAddressStr)) {
                        error++;
                        showErrorField(fromAddress);
                    }

                    if (replyToAddressStr && (!/@{.*}/.test(replyToAddressStr) && !validateFuseEmail(replyToAddressStr))) {
                        error++;
                        showErrorField(replyToAddress);
                    }
                } else {
                    if (!validateFuseEmail(replyToAddressStr)) {
                        error++;
                        showErrorField(replyToAddress);
                    }
                }
            }

            if ($('#timerExpressionEditor').length > 0) {
                var editorVal = ace.edit('timerExpressionEditor').getValue();
                $('#timerExpression').val(editorVal);
            }

            if (error === 0) {
                return true;
            } else {
                showMessage('Email address is invalid!', form);

                return false;
            }
        },
        callback: function () {
            $('body').removeClass('dirty');
            Msg.success('Saved');
            $('#descriptionDiv').reloadFragment();
        }
    });
}