$(function () {
    var editor;
    var dataTable;
    function initLeadTasksTable() {
        if ($('#leadTasksTable').length){
            editor = new $.fn.dataTable.Editor({
                table: '#leadTasksTable',
                ajax: {
                    url: '/tasks/_id_/'
                },
                idSrc: 'id',
                fields: [
                    {
                        label: "Due date",
                        name: "dueDate",
                        type: "datetime",
                        def:    function () { return new Date(); },
                        format:    'DD/MM/YYYY',
                    },
                    {
                        label: "Assigned to:",
                        name: "assignToName",
                        type: 'select',
                        data: 'assignedToProfile',
                        placeholder: 'Select an assignment',
                        optionsPair: {
                            label: 'name',
                            value: 'userName'
                        },
                        def: 'NONE'
                    }
                ]
            });
            dataTable = $('#leadTasksTable').DataTable({
                paging: false,
                searching: false,
                destroy: true,
                info: false,
                columns: [
                    { "data": "title" },
                    {
                        data: "relatedLead.leadOrgTitle",
                        render: function (data, type, full, meta) {
                            if (data){
                                return '<a href="/companies/'+full.relatedLead.leadOrgLongId+'">'+data+'</a>'
                            }
                            return '';
                        }
                    },
                    {
                        data: "relatedLead.title",
                        render: function (data, type, full, meta) {
                            if (data){
                                return '<a href="/leads/'+full.relatedLead.id+'">'+data+'</a>'
                            }
                            return '';
                        }
                    },
                    {
                        data: 'createdDate',
                        defaultContent: "",
                        render: function (d) {
                            if (d) {
                                return moment(d).format('DD/MM/YYYY');
                            }
                            return '';
                        }
                    },
                    {
                        data: 'dueDate',
                        className: 'editable',
                        render: function (d) {
                            if (typeof d === "object" && d.time) {
                                return moment(d.time).format('DD/MM/YYYY');
                            } else if (typeof d === "string"){
                                return d;
                            }
                            return '';
                        }
                    },
                    {
                        data: 'assignedToProfile',
                        defaultContent: "",
                        className: 'editable',
                        render: function (d, type) {
                            flog('Render Profile', d, type);
                            if (d) {
                                switch (type) {
                                    case "type":
                                    case "sort":
                                    {
                                        return d.userId;
                                        break;
                                    }
                                    case "display":
                                    {
                                        if (d.firstName && d.firstName.trim().length > 0) {
                                            var f = d.firstName || '';
                                            var s = d.surName || '';
                                            return (f + ' ' + s).trim();
                                        } else if (d.nickName) {
                                            return d.nickName.trim();
                                        }
                                    }
                                    default:
                                        return d.name;
                                }
                            }
                            return "";
                        }
                    },


                    {
                        data: 'id',
                        orderable: false,
                        className: 'text-center',
                        render: function (data, type, full, meta) {
                            return '<a class="btn-task-complete" href="/tasks/'+data+' .taskViewModal" data-target="#modalEditTask" data-toggle="modal"><i class="fa fa-2x fa-check-circle text-success"></i></a>\n' +
                                '<a href="/tasks/'+data+'" class="btnCancelTask"><i class="fa fa-2x fa-times-circle text-danger"></i></a>';
                        }
                    },
                ]
            });

            $.ajax({
                url: '/leads/?teamUsers',
                dataType: 'json'
            }).done(function (data) {
                if (data.status) {
                    data.data.push({
                        name: "Clear assignment",
                        userName: ''
                    });
                    editor.field('assignToName').update(data.data);
                }
            });

            $('#leadTasksTable')
                .off('click', 'tbody td.editable')
                .on('click', 'tbody td.editable', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).addClass('editing');
                    editor.inline(this, {
                        onBlur: 'submit'
                    });
                });

            editor.on('preSubmit', function (e, json, action) {
                var taskId;
                for (var key in json.data){
                    taskId = key;
                    var obj = json.data[key];
                    for (var j in obj){
                        json[j] = obj[j];
                    }
                }
            });

            editor.on('submitComplete', function (e, json, data) {
                $('#leadTasksTable').find('.editable.editing').removeClass('editing');
                Msg.success('Updated');
            });

            dataTable.draw();

            $('#leadTasksTable').on( 'draw.dt', function () {
                $('#leadTasksTable').closest('.row').siblings('.row').remove();
            });
        }
    }

    function loadTasks(url) {
        if (dataTable) {
            dataTable.clear(false);
        }
        $.ajax({
            url: url || window.location.href,
            data: {asJson: true},
            dataType: 'JSON',
            success: function (resp, textStatus, jqXHR) {
                var data = resp.data;
                if (data && data.results){
                    var hits = data.results.hits;
                    for (var i = 0; i < hits.hits.length; i++) {
                        var hit = hits.hits[i];
                        var _source = hit._source;
                        _source.dueDate = moment(_source.dueDate).format('DD/MM/YYYY');
                        dataTable.row.add(_source);
                    }
                }

                dataTable.draw();
            },
            error: function () {
                Msg.error('Could not load data');
            }
        });
    }

    function initReloadLeadTasksTable() {
        $(document).on('taskChanged', function () {
            loadTasks();
        })
    }

    function initTaskNav() {
        var nav = $('.taskAssigneeDropdown');
        if (nav.length) {
            var currentUser = nav.attr('data-current-user');
            var uri = new URI(window.location.search);
            var s = uri.search(true);
            if (!uri.hasSearch('assignedTo') || !s.assignedTo){
                uri = uri.addSearch('assignedTo', currentUser);
                loadTasks(uri.toString())
                history.pushState(null, null, uri.toString());
            }
        }
    }

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

        loadTasks(uri.toString())
        history.pushState(null, null, uri.toString());
    });

    $(document.body).on('click', '#lead-tasks-page .filter', function (e) {
        e.preventDefault();

        var btn = $(this);
        var name = btn.data('name');
        var value = btn.data('value');

        var uri = new URI(window.location.search);
        uri.removeSearch(name);
        uri = uri.addSearch(name, value);

        loadTasks(uri.toString());
        history.pushState(null, null, uri.toString());
    });

    $(document.body).on('submit', '#search-tasks-form', function (e) {
        e.preventDefault();

        var form = $(this);
        var searchField = form.find('input');
        var val = searchField.val();

        var uri = new URI(window.location.search);
        uri.removeSearch('q');
        uri = uri.addSearch('q', val);

        loadTasks(uri.toString());
        history.pushState(null, null, uri.toString());
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
    initLeadTasksTable();
    initReloadLeadTasksTable();
    loadTasks();
});

