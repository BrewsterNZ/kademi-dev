var searchOptions = {
    startDate: null,
    endDate: null
};

function initManagePointsSystem() {
    flog("initManagePointsSystem");

    showHidePointsOrgType();
    initGroupEditing();
    initFormPointsSystem();
    initRemovePoints();
    initExpireAllPoints();
    initClearAllPoints();
    initDeleteDebits();
    initClearAllDebits();
    initLeaderboardSearch();
    initDebitsPjax();
    initExpireFields();
    initReconcile();
    initTabs();

    $("select.pointsType").click(function () {
        showHidePointsOrgType();
    });

    $(document.body).on('click', '.btn-remove-group', function (e) {
        e.preventDefault();
        var btn = $(this);
        var name = btn.attr("href");
        setGroupRecipient(name, "", false);
        btn.closest('span').remove();
        $("#modalGroup input[name=" + name + "]").check(false);
    });

    $(document.body).on('keypress', '#data-query', function (e) {
        typewatch(function () {
            flog('initSearchPoints: do search');
            doHistorySearch();
        }, 500);
    });

    $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
        searchOptions.startDate = startDate;
        searchOptions.endDate = endDate;
        if (window.location.hash.indexOf('#points') != -1 || window.location.hash.indexOf('#debits') != -1) {
            doHistorySearch();
        } else if (window.location.hash.indexOf('#leaderboard') != -1) {
            doLeaderboardSearch();
        }
    });
}

function initTabs() {
    $('.TabNav a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var href = $(this).attr('href');
        var clicked = $(this).hasClass('clicked');
        if (!clicked) {
            $(this).addClass('clicked');
            if (href == "#points") {
                doHistorySearch();
            }
            if (href == "#leaderboard") {
                doLeaderboardSearch();
            }
        }
    });
}

function initExpireFields() {
    $('[name=validForDays]').on('input', function () {
        if (this.value) {
            $('[name=expiryDate]').prop('disabled', true).val('');
        } else {
            $('[name=expiryDate]').prop('disabled', false);
        }
    }).trigger('input');
}
function initExpireAllPoints() {
    $(document.body).on('click', '.btnExpireAll', function (e) {
        e.preventDefault();
        var dataQuery = $('#data-query').val();

        var uri = URI(location.search);
        uri.setSearch('startDate', searchOptions.startDate);
        uri.setSearch('finishDate', searchOptions.endDate);
        uri.setSearch('dataQuery', dataQuery);
        uri.setSearch('startPos', 0);


        if (confirm("Are you sure you want to expire all records? This can not be undone! All points records in this points system will be marked as expired and not available for redemptions.")) {
            $.ajax({
                type: 'POST',
                data: {
                    expireAll: true
                },
                dataType: "json",
                url: uri,
                success: function (data) {
                    flog("success", data);
                    if (data.status) {
                        $('#tablePointsBody').reloadFragment();
                        Msg.success("All points have been expired", "managePointsSystem");
                    } else {
                        Msg.error("There was a problem expiring points. Please try again and contact the administrator if you still have problems", "managePointsSystem");
                    }
                },
                error: function (resp) {
                    Msg.error("An error occurred removing points. You might not have permission to do this", "managePointsSystem");
                }
            });
        }
    });
}

function initGroupEditing() {
    $("#modalGroup input[type=checkbox]").click(function () {
        var $chk = $(this);
        flog("checkbox click", $chk, $chk.is(":checked"));
        var isRecip = $chk.is(":checked");
        var groupType = $chk.closest('label').data("grouptype");
        setGroupRecipient($chk.attr("name"), groupType, isRecip);
    });
}

function initFormPointsSystem() {
    flog('initFormPointsSystem');

    $("form.managePointsSystem").forms({
        onSuccess: function (resp) {
            flog("done");
            if (resp.status) {
                Msg.info("Saved", "managePointsSystem");
                if( resp.nextHref ) {
                    window.location = resp.nextHref;
                }
            } else {
                Msg.error("Sorry, couldnt save", "managePointsSystem");
            }

        }
    });
}

function initReconcile() {
    $(".btnReconcile").click(function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to reconcile debits? This will look for debit records which have not been reconciled, and attempt to link them to credit records")) {
            $.ajax({
                type: 'POST',
                data: {
                    reconcile: true
                },
                dataType: "json",
                url: "",
                success: function (data) {
                    flog("success", data);
                    if (data.status) {
                        $('#tablePointsBody').reloadFragment();
                        Msg.success(data.messages, "managePointsSystem");
                    } else {
                        Msg.error("There was a problem doing reconciliation. Please try again and contact the administrator if you still have problems", "managePointsSystem");
                    }
                    updateReconcileStatus();
                },
                error: function (resp) {
                    Msg.error("An error occurred removing points. You might not have permission to do this", "managePointsSystem");
                    updateReconcileStatus();
                }
            });
        }
    });

    updateReconcileStatus();
}

var reconcileCheckTimer = null;
function updateReconcileStatus() {
    if (reconcileCheckTimer != null) {
        clearTimeout(reconcileCheckTimer);
        reconcileCheckTimer = null;
    }

    var btn = $('.btnReconcile');

    $.ajax({
        type: 'GET',
        url: window.location.pathname + "?pointsReconcileProcessor",
        dataType: 'json',
        success: function (resp) {
            if (resp.status) {
                if (resp.data.statusInfo.complete) {
                    btn.prop('disabled', false);
                    btn.html('<i class="fa fa-exclamation-circle"></i> Reconcile');
                } else {
                    btn.prop('disabled', true);
                    btn.html('<i class="fa fa-exclamation-circle"></i> Reconcile Running: ' + resp.data.status);
                    reconcileCheckTimer = setTimeout(function () {
                        updateReconcileStatus()
                    }, 2000);
                }
            } else {
                btn.prop('disabled', false);
                btn.html('<i class="fa fa-exclamation-circle"></i> Reconcile');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            btn.prop('disabled', false);
            btn.html('<i class="fa fa-exclamation-circle"></i> Reconcile');
        }
    });
}

function setGroupRecipient(name, groupType, isRecip) {
    flog("setGroupRecipient", name, groupType, isRecip);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                group: name,
                isRecip: isRecip
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    flog("saved ok", data);
                    if (isRecip) {
                        var groupClass = "";
                        var groupIcon = "";
                        if (groupType === "P" || groupType === "") {
                            groupClass = "alert alert-success";
                            groupIcon = "clip-users";
                        } else if (groupType === "S") {
                            groupClass = "alert alert-info";
                            groupIcon = "fa fa-trophy";
                        } else if (groupType === "M") {
                            groupClass = "alert alert-info";
                            groupIcon = "fa fa-envelope";
                        }
                        var newBtn = $('<span id="group_' + name + '" class="group-list ' + groupClass + '">'
                                + '<i class="' + groupIcon + '"></i>'
                                + '<span class="block-name" title="' + name + '"> ' + name + '</span>'
                                + ' <a href="' + name + '" class="btn btn-xs btn-danger btn-remove-group" title="Delete access for group ' + name + '"><i class="fa fa-times"></i></a>'
                                + '</span>');
                        $(".GroupList").append(newBtn);
                        flog("appended to", $(".GroupList"));
                    } else {
                        var toRemove = $("#group_" + name);
                        toRemove.remove();
                    }
                } else {
                    flog("error", data);
                    Msg.error("Sorry, couldnt save " + data, "managePointsSystem");
                }
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error("Sorry, couldnt save - " + resp, "managePointsSystem");
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}

function initDebitsPjax() {
    $(document).pjax2('.debitsTableWrap', {
        selector: '.debitsPaginator a',
        fragment: '.debitsTableWrap',
        success: function () {
            flog('Pjax success!');
            window.location.hash = '#debits-tab';
        },
        debug: true
    });
}

function showHidePointsOrgType() {
    if ($("select.pointsType").val() == "POINTS_ORG") {
        $(".pointsOrgType").show();
    } else {
        $(".pointsOrgType").hide();
    }
}


function initRemovePoints() {
    $(".btnRemovePoints").click(function (e) {
        e.preventDefault();
        var node = $(e.target);
        flog("initRemoveSalesData", node, node.is(":checked"));
        var checkBoxes = $('#tablePoints').find('tbody input[name=toRemoveId]:checked');
        if (checkBoxes.length === 0) {
            Msg.error("Please select the points you want to remove by clicking the checkboxes on the right", "managePointsSystem");
        } else {
            if (confirm("Are you sure you want to remove " + checkBoxes.length + " points?")) {
                doRemovePoints(checkBoxes);
            }
        }
    });
}

function initClearAllPoints() {
    // btn-clear-history
    $(document.body).on('click', '.btn-clear-history', function (e) {
        e.preventDefault();
        var dataQuery = $('#data-query').val();

        var uri = URI(location.search);
        uri.setSearch('startDate', searchOptions.startDate);
        uri.setSearch('finishDate', searchOptions.endDate);
        uri.setSearch('dataQuery', dataQuery);
        uri.setSearch('startPos', 0);

        if (confirm("Are you sure you want to clear all records? This can not be undone!")) {
            $.ajax({
                type: 'POST',
                data: {
                    clearHistory: true
                },
                dataType: "json",
                url: uri,
                success: function (data) {
                    flog("success", data);
                    if (data.status) {
                        Msg.success("Submitted", "managePointsSystem");
                        $("#points").reloadFragment();
                    } else {
                        Msg.error("There was a problem removing points. Please try again and contact the administrator if you still have problems.", "managePointsSystem");
                    }
                },
                error: function (resp) {
                    Msg.error("An error occurred removing points. You might not have permission to do this", "managePointsSystem");
                }
            });
        }
    });
}


function doRemovePoints(checkBoxes) {
    Msg.info("Deleting...", "managePointsSystem", 2000);
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: "json",
        url: "",
        success: function (data) {
            flog("success", data);
            if (data.status) {
                Msg.success("Removed points ok", "managePointsSystem");
                $("#tablePointsBody").reloadFragment();
            } else {
                Msg.error("There was a problem removing points. Please try again and contact the administrator if you still have problems", "managePointsSystem");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred removing points. You might not have permission to do this", "managePointsSystem");
        }
    });
}

function doHistorySearch() {
    flog('doHistorySearch');
    Msg.info("Doing search...", 'managePointsSystem', 1000);

    var dataQuery = $('#data-query').val();

    var uri = URI(location.search);
    uri.setSearch('startDate', searchOptions.startDate);
    uri.setSearch('finishDate', searchOptions.endDate);
    uri.setSearch('dataQuery', dataQuery);
    uri.setSearch('startPos', 0);

    var target = $("#tablePointsBody");
    var pointsFooter = $("#pointsFooter");
    var debitTarget = $("#debitsTableBody");
    var debitFooterTarget = $("#debitsPaginator");

    target.load();

    $.ajax({
        type: "GET",
        url: window.location.pathname + uri.search(),
        dataType: 'html',
        success: function (content) {
            flog('response', content);
            setTimeout(function () {
                Msg.success("Search completed", 'managePointsSystem', 1000);
            }, 1000);

            history.pushState(null, null, window.location.pathname + uri.search() + window.location.hash);

            var newBody = $(content).find("#tablePointsBody");
            target.replaceWith(newBody);
            var newFooter = $(content).find("#pointsFooter .pagination").html();
            var newRightFooter = $(content).find("#pointsFooter .pagination").parent().siblings().html();
            if (!newFooter)
                newFooter = '';
            if (!newRightFooter)
                newRightFooter = '';
            pointsFooter.find('.pagination').html(newFooter);
            pointsFooter.find('.pagination').parent().siblings().html(newRightFooter);

            var debitBody = $(content).find("#debitsTableBody");
            debitTarget.replaceWith(debitBody);
            var debitFooter = $(content).find("#debitsPaginator .pagination").html();
            var newRightDebitFooter = $(content).find("#debitsPaginator .pagination").parent().siblings().html();
            if (!newFooter)
                newFooter = '';
            if (!newRightFooter)
                newRightFooter = '';
            debitFooterTarget.find('.pagination').html(debitFooter);
            debitFooterTarget.find('.pagination').parent().siblings().html(newRightDebitFooter);

            $("abbr.timeago").timeago();
            flog("done insert and timeago", $("abbr.timeago"));
        }
    });
}

function initDeleteDebits() {
    $("body").on('click', '.btnRemoveDebits', function (e) {
        e.preventDefault();
        var checkBoxes = $('#table-debits').find('tbody input[name=removeDebitsId]:checked');
        if (checkBoxes.length === 0) {
            Msg.error("Please select the debits you want to remove by clicking the checkboxs to the right", "managePointsSystem");
        } else {
            if (confirm("Are you sure you want to remove " + checkBoxes.length + " debits?")) {
                doRemoveDebits(checkBoxes);
            }
        }
    });
}

function doRemoveDebits(checkBoxes) {
    Msg.info("Deleting...", "managePointsSystem", 2000);
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: "json",
        success: function (data) {
            flog("success", data);
            if (data.status) {
                Msg.success("Removed debits ok", "managePointsSystem");
                $("#table-debits").reloadFragment();
            } else {
                Msg.error("There was a problem removing debits. Please try again and contact the administrator if you still have problems", "managePointsSystem");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred removing debits. You might not have permission to do this", "managePointsSystem");
        }
    });
}

function initClearAllDebits() {
    // btn-clear-history
    $(document.body).on('click', '.btn-clear-debits', function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to clear all records? This can not be undone!")) {
            $.ajax({
                type: 'POST',
                data: {
                    clearDebits: true
                },
                dataType: "json",
                url: "",
                success: function (data) {
                    flog("success", data);
                    if (data.status) {
                        $('#table-debits tbody').empty();
                        Msg.success("Removed points ok", "managePointsSystem");
                    } else {
                        Msg.error("There was a problem removing debits. Please try again and contact the administrator if you still have problems", "managePointsSystem");
                    }
                },
                error: function (resp) {
                    Msg.error("An error occurred removing debits. You might not have permission to do this", "managePointsSystem");
                }
            });
        }
    });
}


function initLeaderboardSearch() {
    $(document.body).on('keypress', '#leaderboard-limit', function (e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
            e.preventDefault();

            doLeaderboardSearch();

            return false;
        }
    });

    $(document.body).on('change', '#leaderboard-limit', function (e) {
        e.preventDefault();

        doLeaderboardSearch();
    });
}

function doLeaderboardSearch() {
    flog('doLeaderboardSearch');
    Msg.info("Doing search...", "managePointsSystem", 1000);

    var leaderboardLimit = parseInt($('#leaderboard-limit').val(), 10);
    if (Number.isNaN(leaderboardLimit)) {
        leaderboardLimit = 20;
    }

    var data = {
        lbStartDate: searchOptions.startDate,
        lbFinishDate: searchOptions.endDate,
        lbLimit: leaderboardLimit
    };
    flog("data", data);

    var target = $("#table-leaderboard");
    target.load();

    $.ajax({
        type: "GET",
        url: window.location.pathname,
        dataType: 'html',
        data: data,
        success: function (content) {
            flog('response', content);
            setTimeout(function () {
                Msg.success("Search completed", "managePointsSystem", 1000);
            }, 1000);
            var newBody = $(content).find("#table-leaderboard");
            target.replaceWith(newBody);
            $("abbr.timeago").timeago();
            flog("done insert and timeago", $("abbr.timeago"));
        }
    });
}
