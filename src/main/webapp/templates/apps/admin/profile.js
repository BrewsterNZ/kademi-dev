function initProfile() {
    flog("initProfile - profile.js");
    initProfileLoginAs();
    initNewMembershipForm();
    initEnableDisable();
    initTabLazyLoading();
    initAddressEditing();


    $(".initProfileForm").forms({
        onSuccess: function (resp, form) {
            Msg.info("Done");
            $('#pwdState').reloadFragment();
        }
    });

    $(".secondFactorForm").forms({
        onSuccess: function (resp, form) {
            Msg.info("Done");
            $('#secondFactorQR').reloadFragment();
        }
    });

    flog("init delete membersip");
    $(document).on("click", ".btn-delete-membership", function (e) {
        var a = $(this);
        e.preventDefault();
        e.stopPropagation();

        Kalert.confirm("Are you sure you want to delete this group membership?", function () {
            var href = a.attr("href");
            deleteFile(href, function () {
                reloadMemberships();
                $('#modal-edit-membership').modal('hide');
            });
        });
    });

    $(".memberships-wrapper").on("click", ".addGroup a", function (e) {
        flog("click", this);
        e.preventDefault();
        e.stopPropagation();
        var groupName = $(e.target).closest("a").attr("href");
        doAddToGroup(groupName);
    });


    $(".form-unsubscribe button").on('click', function (e) {
        e.preventDefault();
        Kalert.confirm("Are you sure you want to unsubscribe this user? They will no longer be able to access this site", function () {
            $(".form-unsubscribe").trigger('submit');
        });
    });

    $(".form-unsubscribe").forms({
        onSuccess: function (resp, form) {
            Msg.info("Unsubscribed. Now going to manage users page");
            window.location = "/manageUsers";
        },
        confirmMessage: "The user has been unsubscribed"
    });

    $(".form-addnote").forms({
        onSuccess: function (resp, form) {
            if( resp.status ) {
                form.find("textarea").val("");
                Msg.info("Added note");
                $("#profile-notes").reloadFragment();
            } else {
                Msg.error("Error: " + resp.messages);
            }
        }
    });

    $('#btn-change-ava').upcropImage({
        buttonContinueText: 'Save',
        isCameraEnabled: true,
        url: window.location.pathname, // this is actually the default value anyway
        onCropComplete: function (resp) {
            flog("onCropComplete:", resp, resp.nextHref);
            $(".profile-photo img").attr("src", resp.nextHref);
        },
        onContinue: function (resp) {
            flog("onContinue:", resp, resp.result.nextHref);
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    uploadedHref: resp.result.nextHref,
                    applyImage: true
                },
                success: function (resp) {
                    if (resp.status) {
                        $(".profile-photo img").attr("src", resp.nextHref);
                        $(".main-profile-photo img").attr("src", resp.nextHref);
                    } else {
                        Msg.error("Sorry, an error occured updating your profile image");
                    }
                },
                error: function () {
                    Msg.error('Sorry, we couldn\'t save your profile image.');
                }
            });
        }
    });

    $('body').on('click', '#btn-remove-ava', function (e) {
        e.preventDefault();

        Kalert.confirm('Are you sure you want to clear the avatar?', function () {
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    clearAvatar: true
                },
                success: function (resp) {
                    if (resp.status) {
                        $(".profile-photo img").attr("src", "pic");
                        $(".main-profile-photo img").attr("src", "pic");
                    } else {
                        Msg.error("Sorry, an error occured updating your profile image");
                    }
                },
                error: function () {
                    Msg.error('Sorry, we couldn\'t save your profile image.');
                }
            });
        });
    });
}

function initAddressEditing() {
    var modal = $("#addressModal");
    modal.find("form").forms({
        onSuccess : function(resp) {
            if( resp.status ) {
                Msg.info("Saved address");
                modal.modal("hide");
                $("#addresses-table-body").reloadFragment();
            } else {
                Msg.error("Errors occured: " + resp.messages);
            }
        }
    });

    $("body").on("click", ".edit-address", function(e) {
        e.preventDefault();
        var id = $(e.target).closest("a").attr("href");
        $("#editAddressContent").reloadFragment({
            url: window.location.pathname + "?editAddress=" + id
        });
        modal.modal("show");
    });
}

function initTabLazyLoading() {
    $(document).on('shown.bs.tab', function (e) {
        var id = $(e.target).attr("href");
        if (id) {
            var tab = $(id);
            flog("shown", id, tab);
            var tabId = id.substring(1);
            loadTab(tabId);
        }
    });

    $(document).on('pageDateChanged', function (e, startDate, endDate) {
        flog("page date changed", startDate, endDate);
        reloadActiveTab();
    });


    // Better load the current tab if one is selected
    var uri = URI(window.location);
    var tabId = uri.fragment();
    // Need to strip off the -tab suffix
    tabId = tabId.substring(0, tabId.length - 4);

    loadTab(tabId);
}

function loadTab(tabId) {
    var tab = $("#" + tabId + ".lazy-load");
    flog("Selected tab", tab, tabId);

    if (tab.length > 0) {
        tab.reloadFragment({
            url: window.location.pathname + "?showTab=" + tabId,
            whenComplete: function () {
                runPageInitFunctions();
            }
        });
    }
}

function reloadActiveTab() {
    var tab = $(".lazy-load.active");
    if (tab.length > 0) {
        var tabId = tab.attr("id");
        tab.reloadFragment({
            url: window.location.pathname + "?showTab=" + tabId,
            whenComplete: function () {
                runPageInitFunctions();
            }
        });
    }
}

function initEnableDisable() {
    $("body").on("click", ".profileDisable", function (e) {
        e.preventDefault();
        e.stopPropagation();
        Kalert.confirm("Are you sure you want to disable this profile? This will remove the profile from user lists, but it can be re-enabled later", function () {
            setProfileEnabled(window.location.href, false);
        });
    });
    $("body").on("click", ".profileEnable", function (e) {
        e.preventDefault();
        e.stopPropagation();
        Kalert.confirm("Are you sure you want to enable this profile? This will include the profile in user lists", function () {
            setProfileEnabled(window.location.href, true);
        });
    });

}

function setProfileEnabled(profileHref, enabled) {
    $.ajax({
        url: profileHref,
        type: 'POST',
        data: {
            enabled: enabled
        },
        success: function (resp) {
            if (resp.status) {
                window.location.reload();
            } else {
                Msg.error("Couldnt change enabled status: " + resp.messages);
            }
        },
        error: function (e) {
            Msg.error(e.status + ': ' + e.statusText);
            hideLoadingIcon();
        }
    })
}

function initNewMembershipForm() {
    $("body").on("click", ".btn-add-group", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $("#modal-membership").modal('show');
    });

    $("#modal-membership").find('#orgIdGroupMembership').entityFinder({
        type: 'organisation',
        onSelectSuggestion: function (el, suggestion, id, actualId, type) {
            $("#modal-membership").find('#orgIdGroupMembership').val(id);
        }
    });

    $("#modal-membership").find("form").forms({
        validate: function (form) {
            var groupInputs = form.find('.radio input[name=group]');
            var arr = [];
            groupInputs.each(function () {
                if (this.checked){
                    arr.push(this.value);
                }
            });
            if (!arr.length){
                return {
                    error: 1,
                    errorFields: ['group'],
                    errorMessages: ['Please select a group']
                };
            }
            return true;
        },
        onSuccess: function (resp) {
            flog("done new membership", resp);
            $("#modal-membership").find(".radio input").trigger('reset');
            reloadMemberships();
            Msg.info("Saved membership");
        }
    });

    $("#modal-membership").on('input', '#groupFilter', function () {
        if (!this.value){
            $('#groupCheckboxesWrap').find('.membership').each(function () {
                $(this).parent().removeClass('hide');
            })
        } else {
            $('#groupCheckboxesWrap').find('.membership').each(function () {
                $(this).parent().addClass('hide');
            })
            var s = this.value;
            $('#groupCheckboxesWrap').find('.membership').each(function () {
                var m = $(this).parent();
                var groupName = m.find('input').val();
                var groupTitle = m.find('label').text().trim();
                if (groupName.indexOf(s) != -1 || groupTitle.indexOf(s) != -1){
                    m.removeClass('hide');
                }
            });
        }

    })
}

function reloadMemberships() {
    $("#membershipsContainer").reloadFragment();
}


function initProfileLoginAs() {
    flog("initLoginAs");
    $("body").on("click", ".btn-login-as", function (e) {
        e.preventDefault();
        flog("login as");
        showLoginAs(""); // on the current page
    });
}

function doAddToGroup(groupName) {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            group: groupName
        },
        success: function (resp) {
            if (resp.status) {
                reloadMemberships();
            } else {
                Msg.error("Couldnt add group: " + resp.messages);
            }
        },
        error: function (e) {
            Msg.error(e.status + ': ' + e.statusText);
            hideLoadingIcon();
        }
    })

}

function initEditMemberships() {
    var modal = $("#modal-edit-membership");

    modal.on('hide.bs.modal', function () {
        modal.find('.newOrgId').val('');
    });
    $(document).on('click', '.btn-edit-membership', function (e) {
        e.preventDefault();

        var groupHref = $(this).attr('data-group-href');
        modal.find('.modal-body').html('<p>Please wait...</p>');
        modal.modal('show');
        modal.reloadFragment({
            url: groupHref,
            whenComplete: function () {
            }
        })
    });

    modal.on('click', '.btn-change-org', function (e) {
        e.preventDefault();

        modal.find('#changeOrgFinder').entityFinder({
            type: 'organisation',
            onSelectSuggestion: function (el, suggestion, id, actualId, type) {
                modal.find('.newOrgId').val(id);
            }
        });

        modal.find('.btn-update-membership, .btn-change-org-cancel').removeClass('hide');
        modal.find('.btn-change-org, .btn-delete-membership').addClass('hide');
    });

    modal.on('click', '.btn-change-org-cancel', function (e) {
        e.preventDefault();
        modal.find('.modal-body').html('<p>Please wait...</p>');
        var groupHref = $(this).attr('data-group-href');
        modal.reloadFragment({
            url: groupHref,
            whenComplete: function () {
            }
        })
    });

    modal.on('click', '.btn-update-membership', function (e) {
        e.preventDefault();
        var a = $(this);
        var href = a.attr('href');
        deleteFile(href, function () {
            $.ajax({
                url: window.location.pathname,
                type: 'post',
                data: {
                    orgId: modal.find('.newOrgId').val(),
                    group: a.attr('data-group')
                },
                dataType: 'json',
                success: function (resp) {
                    if (resp.status) {
                        reloadMemberships();
                    } else {
                        Msg.error("Couldnt add group: " + resp.messages);
                    }
                    modal.modal('hide');
                },
                error: function (e) {
                    Msg.error(e.status + ': ' + e.statusText);
                    hideLoadingIcon();
                    modal.modal('hide');
                }
            })
        });
    })
}

function initProfileLeads() {
    var modal = $('#modalCreateLead');
    var form = $('#modalCreateLead form');

    function initProfileLeadForm() {
        modal.find('form').forms({
            postUrl: '/leads',
            validate: function (form, config) {
                flog('validating ... ', form);
                var ret = {
                    error: 0,
                    errorFields: [],
                    errorMessages: []
                };
                var taskDescription = form.find('textarea[name=taskDescription]').val();
                if (taskDescription !== undefined && taskDescription !== "") {
                    var title = $("#title").val();
                    if(title === undefined || title === ""){
                        ret.error = 1;
                        ret.errorFields.push($("#title"));
                        ret.errorMessages.push("Please complete the task title.");
                    }
                }
                flog("ret , ", ret);
                return ret;
            },
            onSuccess: function (resp) {
                if (resp.status){
                    Msg.success('lead created')
                    modal.modal('hide');
                    setTimeout(function () {
                        reloadActiveTab();
                        modal.find('[name=funnel]').trigger('change');
                    },100)
                }
            }
        });

        modal.find('[name=newOrgTitle]').entityFinder({
            useActualId: true,
            type: 'organisation'
        });

        modal.find('.btnCreateLead').click(function (e) {
            e.preventDefault();

            form.trigger('submit');
        });

        modal.find('#lead-fields-tab input[required]').each(function () {
            $(this).removeAttr('required');
        })
    }

    $(document).on('change','#modalCreateLead [name=funnel]', function () {
        modal.reloadFragment({
            url: window.location.pathname + '?showTab=funnelsTab&leadName='+this.value,
            whenComplete: function () {
                initProfileLeadForm()
            }
        })
    });



    modal.on('shown.bs.modal', function () {
        modal.find('[name=funnel]').trigger('change');
    })
}