(function ($) {

    function initGroupSelect() {
        $('body').on('change', '.checkbox-inline [type=checkbox]', function () {
            var chk = $(this);

            changeGroupState(chk.attr('name'), chk.is(':checked'));
        });
    }

    function changeGroupState(name, selected) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                groupSelected: selected,
                groupName: name
            },
            success: function (data, textStatus, jqXHR) {
                $('#group-list').reloadFragment();
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }

    function initRemoveOrgs() {
        var $body = $(document.body);

        $body.off('click', '.btn-delete-org').on('click', '.btn-delete-org', function (e) {
            e.preventDefault();
            var href = $(this).attr('href');

            confirmDelete(href, getFileName(href), function (resp) {
                $("#stores-table").reloadFragment();
            });
        });
    }

    $(function () {
        initGroupSelect();
        initRemoveOrgs();

        $("#teamSettingsForm").forms({
            onSuccess : function() {
                Msg.info("Saved");
            }
        });
    });
})(jQuery);