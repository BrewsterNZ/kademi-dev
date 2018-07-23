function initManageRepoHistory() {
    initEvents();
    initSetRemoteHash();
}

function doHistorySearch() {
    flog('doHistorySearch');
    Msg.info("Doing search...", 2000);

    var data = {
        dataQuery: $("#data-query").val(),
    };
    flog("data", data);

    var target = $("#commit-wrapper");
    target.load();

    var link = window.location.pathname + "?" + $.param(data);
    flog("new link", link);

    $.ajax({
        type: "GET",
        url: link,
        dataType: 'html',
        success: function (content) {
            flog('response', content);
            Msg.success("Search complete", 2000);
            var newBody = $(content).find("#commit-wrapper");
            target.replaceWith(newBody);
            history.pushState(null, null, link);
            $("abbr.timeago").timeago();
            $("#commit-wrapper").paginator();
        }
    });
}

function initEvents() {
    var wrapper = $('#commit-wrapper');

    $('abbr.timeago').timeago();

    wrapper.on('click', '.btn-restore-repo', function (e) {
        e.preventDefault();
        var node = $(e.target).closest("a");
        var hash = node.attr('rel');
        flog("hash: ", hash);
        var revertHref = ".history";
        confirmRevert(hash, null, {
            getPageUrl: function () {
                return '.'
            },
            afterRevertFn: function () {
                Msg.success('Reverted to ' + hash + '!');
                wrapper.reloadFragment({
                    whenComplete: function () {
                        $('abbr.timeago').timeago();
                    }
                });
            }
        }, revertHref);
    });

    var btnSetHash = $('.btn-set-hash');
    btnSetHash.attr('data-href', btnSetHash.attr('href'));
    btnSetHash.removeAttr('href');
    btnSetHash.click(function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var newHash = prompt('Please enter a new hash');
        if (newHash != null && newHash.trim().length > 0) {
            setHash(link, newHash);
        }
    });
}

function setHash(link, newHash) {
    log('setHash', link, newHash, link);
    $.ajax({
        type: 'POST',
        data: {newHash: newHash},
        url: link.attr('data-href'),
        dataType: 'json',
        success: function (data) {
            log('done', data);
            if (data.status) {
                Msg.success('Reverted to ' + newHash + '!');
                $('#commit-wrapper').reloadFragment();
            } else {
                Msg.error('An error occured updating the branch: ' + data.messages);
            }
        },
        error: function (resp) {
            Msg.error('Sorry, couldnt update public access: ' + resp);
        }
    });
}

function initSetRemoteHash() {
    var modal = $('#modal-upload-remotehash');
    var modal_form = modal.find('form');

    modal_form.forms({
        onSuccess: function (resp) {
            Msg.success(resp.messages);
            modal_form.trigger('reset');
            modal.modal('hide');
        }
    });

    modal.on('hidden.bs.modal', function (e) {
        modal_form.trigger('reset');
    });
}