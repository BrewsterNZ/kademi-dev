(function ($) {
    function initCreateMemberForm() {
        var modal = $('#modal-add-member');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                if (resp.status) {
                    modal.modal('hide');
                    $('#teamTable').reloadFragment();
                    Msg.success('Member added');
                } else {

                }
            }
        });

        $('body').on('hidden.bs.modal', '#modal-add-member', function () {
            form.trigger('reset');
        });
    }

    function initSelectPicker(){
        $('.selectpicker').selectpicker({

        });
    }

    $(function () {
        initCreateMemberForm();
        initSelectPicker();
    });

})(jQuery);