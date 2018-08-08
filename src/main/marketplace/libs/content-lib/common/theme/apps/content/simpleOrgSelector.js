$(function () {
    $('.simple-navbar-org-selector').on('click', '.select-org', function (e) {
        e.preventDefault();
        var orgId = $(this).attr('href');

        if (orgId) {
            $.cookie('selectedOrg', orgId, {expires: 360, path: '/'});
        } else {
            $.cookie('selectedOrg', "", {expires: 360, path: '/'});
        }
        window.location.reload();
    });
})