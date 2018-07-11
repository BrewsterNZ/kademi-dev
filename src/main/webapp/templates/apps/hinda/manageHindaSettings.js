function hindaApp() {
    startSaveSettings();
    startImport();
    initControlButtons();
}

function startImport() {
    $("form.importForm").forms({
        confirmMessage: "Processing, Please Wait...",
        onSuccess: function (resp) {
            flog("The import process was started", resp);
            Msg.success("The import process was started");
        }
    });
}

function startSaveSettings() {
    $("#hindaForm").forms({
        confirmMessage: "Processing, Please Wait...",
        onSuccess: function (resp) {
            flog("The settings were updated", resp);
            Msg.success("The settings were updated");
            $('#settings-content').reloadFragment({
                whenComplete: function () {
                    hindaApp();
                }
            });
        }
    });
}

function initControlButtons() {
    $(".btn-run-orders").click(function (e) {
        e.preventDefault();
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            dataType: 'JSON',
            data: {
                runImportOrderStatus: "true"
            },
            success: function (data, textStatus, jqXHR) {
                if (data.status) {
                    Msg.info("Done");
                    window.location = data.nextHref;
                } else {
                    flog("err", data);
                    Msg.error('Oh No! Something went wrong!');
                }
            },
            error: function (data) {
                flog("err", data);
                Msg.error('Oh No! Something went wrong!');
            }
        });
    });

    $(".btn-run-products").click(function (e) {
        e.preventDefault();
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            dataType: 'JSON',
            data: {
                run: "true"
            },
            success: function (data, textStatus, jqXHR) {
                if (data.status) {
                    Msg.info("Done");
                    window.location = data.nextHref;
                } else {
                    flog("err", data);
                    Msg.error('Oh No! Something went wrong!');
                }
            },
            error: function (data) {
                flog("err", data);
                Msg.error('Oh No! Something went wrong!');
            }
        });
    });
}