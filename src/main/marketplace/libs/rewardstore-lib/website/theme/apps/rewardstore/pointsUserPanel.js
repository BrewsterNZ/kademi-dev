$(function () {
    $('.pointsUserPanel .profile-avatar').upcropImage({
        url: '/profile', // this is actually the default value anyway
        onCropComplete: function (resp) {
            flog('onCropComplete:', resp, resp.nextHref);
            $('#profile-avatar').css('background-image', 'url("' + resp.nextHref + '")');
            $('.pointsUserPanel .profile-avatar').css('background-image', 'url("' + resp.nextHref + '")');
            $('.modal').modal('hide');
        },
        onContinue: function (resp) {
            flog('onContinue:', resp, resp.result.nextHref);
            $.ajax({
                url: '/profile',
                type: 'POST',
                dataType: 'json',
                data: {
                    uploadedHref: resp.result.nextHref,
                    applyImage: true
                },
                success: function (resp) {
                    if (resp.status) {
                        $('#profile-avatar').css('background-image', 'url("' + resp.nextHref + '")');
                        $('.pointsUserPanel .profile-avatar').css('background-image', 'url("' + resp.nextHref + '")');
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
})