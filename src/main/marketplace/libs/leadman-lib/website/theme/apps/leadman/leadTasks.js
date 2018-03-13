$(function () {
    $(document.body).on("click", ".task-outcome", function (e) {
        if ($(e.target).is("input")) {
            return;
        }

        flog("click");

        $(".outcome-options").slideUp(300).find(":input").prop("disabled", true).end().find(".required:input").each(function () {
            $(this).data("required", true).removeClass("required");
        });

        $("#outcome-options-" + $(this).data("outcome-id")).slideDown(300).find(":input").prop("disabled", false).each(function () {
            if ($(this).data("required") === true) {
                $(this).addClass("required");
            }
        });
    });

    $('#lead-tasks-page input[name=taskType]').on('change', function (e) {
        var t = $(this);
        var uri = new URI(window.location.search);
        uri.removeSearch('type');
        uri = uri.addSearch('type', t.val());

        window.location.search = uri.search();
    });

    $(document.body).on('click', '#lead-tasks-page .filter', function (e) {
        e.preventDefault();

        var btn = $(this);
        var name = btn.data('name');
        var value = btn.data('value');

        var uri = new URI(window.location.search);
        uri.removeSearch(name);
        uri = uri.addSearch(name, value);

        window.location.search = uri.search();
    });

    $(document.body).on('submit', '#search-tasks-form', function (e) {
        e.preventDefault();

        var form = $(this);
        var searchField = form.find('input');
        var val = searchField.val();

        var uri = new URI(window.location.search);
        uri.removeSearch('q');
        uri = uri.addSearch('q', val);

        window.location.search = uri.search();
    });

    window.doReloadTasksPage = function () {
        $(document.body).find('#search-tasks-form').trigger('submit');
    };

    $('#tasksCsv').attr('href', 'tasks.csv?' + window.location.search);

    var modalUpload = $('#modal-upload');
    if (modalUpload.length > 0) {
        if (typeof Dropzone !== 'undefined') {
            Dropzone.autoDiscover = false;

            modalUpload.find('.dropzone').dropzone({
                paramName: 'file', // The name that will be used to transfer the file
                maxFilesize: 2000.0, // MB
                addRemoveLinks: true,
                parallelUploads: 1,
                uploadMultiple: false,
                acceptedFiles: 'text/csv,.csv,.txt'
            });

            if ($('#uploadFileDropzone').length > 0) {
                var dz = Dropzone.forElement('#uploadFileDropzone');
                flog('dropz', Dropzone, dz, dz.options.url);
                dz.on('success', function (file) {
                    flog('added file', file);
                    doReloadTasksPage();
                });
                dz.on('error', function (file, errorMessage) {
                    Msg.error('An error occured uploading: ' + file.name + ' because: ' + errorMessage);
                });
            }
        }
    }

    initTaskNav();
});

function initTaskNav() {
    var nav = $('.taskAssigneeDropdown');
    if (nav.length) {
        var currentUser = nav.attr('data-current-user');
        var uri = new URI(window.location.search);
        var s = uri.search(true);
        if (!uri.hasSearch('assignedTo') || !s.assignedTo){
            uri = uri.addSearch('assignedTo', currentUser);
            window.location.search = uri.search();
        }
    }
}