function initProfile() {
    $('#maincontentContainer form.profile-panel').not('.form-unsubscribe').forms({
        onSuccess: function (resp, form) {
            flog('done');
            Msg.info('Saved ok');
        }
    });

    $('.profile-add-membership form').forms({
        onSuccess: function (resp, form) {
            $('#profile-memberships, #profileMembershipApplications').reloadFragment();
        },
        confirmMessage: 'Submitted membership'
    });


    $('.form-unsubscribe').forms({
        validate: function () {
            return confirm('Are you sure you want to unsubscribe? You will no longer be able to access this site');
        },
        onSuccess: function (resp, form) {
            flog('done, now logout');
            doLogout();
        },
        confirmMessage: 'You have been unsubscribed'
    });

    $('#myModal button.btn-save').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(e.target).closest('.modal').find('form').trigger('submit');
    });

    $(document).on('click', '.membership-remove', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var target = $(e.target).closest('a');

        if ($('form.memberships li').length === 1) {
            if (!confirm('WARNING: If you delete this membership you will not be able to access this site. Are you sure you want to delete this membership?')) {
                return;
            }
        }
        var li = target.closest('li');

        if( confirm('Are you sure you want to remove this membership?') ) {
            deleteMembership(li, target.attr('href'));
        }
    });

    $('.well-opt-int input[name=optins][type=checkbox]').change(function (e) {
        e.preventDefault();
        e.stopPropagation();
        var target = $(e.target);
        updateOptin(target.is(':checked'), target.attr('value'));
    });

    $('#btn-change-ava').upcropImage({
        url: window.location.pathname, // this is actually the default value anyway
        onCropComplete: function (resp) {
            flog('onCropComplete:', resp, resp.nextHref);
            $('.profile-photo img, img.avatar').attr('src', resp.nextHref);
            $('#profile-avatar').css('background-image', 'url("' + resp.nextHref + '")');
            $('.modal').modal('hide');
        },
        onContinue: function (resp) {
            flog('onContinue:', resp, resp.result.nextHref);
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
                        $('.profile-photo img, img.avatar').attr('src', resp.nextHref);
                        $('#profile-avatar').css('background-image', 'url("' + resp.nextHref + '")');
                        $('.modal').modal('hide');
                    } else {
                        alert('Sorry, an error occured updating your profile image');
                    }
                },
                error: function () {
                    alert('Sorry, we couldn\'t save your profile image.');
                }
            });
        }
    });
}

function deleteMembership(row, id) {
    var form = row.closest('form');
    form.addClass('ajax-processing');
    $.ajax({
        type: 'POST',
        url: window.location.pathname + '?removeMembership=' + id,
        dataType: 'json',
        success: function (data) {
            flog('success', data);
            form.removeClass('ajax-processing');
            row.remove();
        },
        error: function (resp, textStatus, errorThrown) {
            form.removeClass('ajax-processing');
            flog('error', resp, textStatus, errorThrown);
            alert('Error deleting the membership');
        }
    });
}
function updateOptin(on, group) {
    var form = $('form.optins');
    form.addClass('ajax-processing');
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        data: {
            enableOptin: on,
            group: group
        },
        dataType: 'json',
        success: function (data) {
            flog('success', data);
            form.removeClass('ajax-processing');
        },
        error: function (resp, textStatus, errorThrown) {
            flog('error', resp, textStatus, errorThrown);
            form.removeClass('ajax-processing');
            Msg.error('Error updating the optin');
        }
    });
}

function initUserPanel() {
    $('.panel-user-wrapper .profile-avatar, .panel-user-wrapper .profile-welcome-name').on('click', function (e) {
        e.preventDefault();

        window.location.pathname = '/profile';
    })
}

$(function () {
    initUserPanel();
});