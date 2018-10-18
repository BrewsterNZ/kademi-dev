$(function () {
    initCheckAll();
    initForm();
    initDelete();
});

function initCheckAll() {
    $('.check-all').change(function (e) {
        var checkedStatus = this.checked;
        $(".chk-record").each(function () {
            this.checked = checkedStatus;
        });
    });
}

function initForm() {
    $('#redirect-form').forms({
        onSuccess: function () {
            Msg.success('Saved');
            $("#redirectsTableBody").reloadFragment();
            $('#redirect-form').trigger('reset');
        }
    });
}

function initDelete() {
    $('#btnDeleteR').click(function (e) {
        e.preventDefault();
        var arr = [];
        $(".chk-record:checked").each(function () {
            arr.push(this.value);
        });
        if (!arr.length) {
            return Msg.warning('Please select a record to delete');
        }
        if (confirm("Are you sure you want to delete " + arr.length + " record(s)?")) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: window.location.pathname,
                data: {
                    deleteRecord: arr.join(','),
                },
                success: function (resp) {
                    if (resp && resp.status) {
                        $("#redirectsTableBody").reloadFragment();
                    } else {
                        Msg.error("An error occurred. Please contact administrator for details");
                    }
                },
                error: function (resp) {
                    Msg.error("An error occurred. Please contact administrator for details");
                }
            });
        }
    })
}

