$(function () {
    initCheckAll();
    initForm();
    initDelete();
    initEdit();
    initNewForm();
});

function initCheckAll() {
    $('.check-all').change(function (e) {
        var checkedStatus = this.checked;
        $(".chk-record").each(function () {
            this.checked = checkedStatus;
        });
    });
}

function initNewForm() {
    $('#newRedirect').click(function (e) {
        e.preventDefault();

        $('#redirect-form').reloadFragment({
            url: window.location.href,
            whenComplete: function () {
                $('#addRedirectModal').modal('show');
            }
        });
    });
}

function initForm() {
    $('#redirect-form').forms({
        onSuccess: function () {
            Msg.success('Saved');
            $("#redirectsTableBody").reloadFragment();
            $('#addRedirectModal').modal('hide');
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

function initEdit() {
    $(document).on('click', '.btnEditR', function (e) {
        e.preventDefault();

        $('#redirect-form').reloadFragment({
            url: $(this).attr('href'),
            whenComplete: function () {
                $('#addRedirectModal').modal('show');
            }
        })
    })

    $(document).on('click', '.btnChangeStatus', function (e) {
        e.preventDefault();

        $.ajax({
            url: window.location.pathname,
            data: {
                changeStatus: $(this).attr('data-id')
            },
            dataType: 'json',
            type: 'post',
            success: function (resp) {
                if (resp && resp.status){
                    $("#redirectsTableBody").reloadFragment();
                } else {
                    Msg.error("An error occurred. Please contact administrator for details");
                }
            },
            error: function (resp) {
                Msg.error("An error occurred. Please contact administrator for details");
            }
        })
    })
}
