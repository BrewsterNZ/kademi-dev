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

    $(function () {
        initGroupSelect();

        $("#teamSettingsForm").forms({
            onSuccess : function() {
                Msg.info("Saved");
            }
        });
    });
})(jQuery);