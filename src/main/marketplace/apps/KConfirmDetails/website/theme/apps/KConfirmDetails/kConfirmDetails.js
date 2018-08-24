(function ($) {
    $(function () {
        var confirmDetailsModal = $("#modal-confirm-details");
        if (confirmDetailsModal !== undefined) {
            flog('init KConfirm :: ', confirmDetailsModal);
            confirmDetailsModal.modal("show");
            var autoreload = confirmDetailsModal.data('autoreload');

            $('#confirmDetailsForm').forms({
                onSuccess: function (resp) {
                    flog('kConfirm :: ', resp);
                    if (resp === undefined || resp.status === false) {
                        Msg.warning('There was an error updating your profile.', 'kconfirm');
                    } else {
                        var userName = confirmDetailsModal.find("#userName").val();
                        var groupName = confirmDetailsModal.find("#groupName").val();

                        $.ajax({
                            type: "POST",
                            url: '/confirm-details',
                            data: {userName: userName, groupName: groupName},
                            success: function (resp) {
                                if (resp.status) {
                                    if (autoreload) {
                                        var wd = window || document;
                                        wd.location.reload(true);
                                    } else {
                                        Msg.success('Your profile has been updated', 'kconfirm');
                                        confirmDetailsModal.modal('hide');
                                    }
                                } else {
                                    Msg.warning('There was an error updating your profile.', 'kconfirm');
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                flog('Error adding user to group', jqXHR, textStatus, errorThrown);
                                Msg.warning('There was an error updating your profile.', 'kconfirm');
                            }
                        });

                    }
                }
            });
        }
    });
})(jQuery);