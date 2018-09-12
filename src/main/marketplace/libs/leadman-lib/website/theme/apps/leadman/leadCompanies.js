$(function () {
    initLeadCompaniesTable();
    initSearchCompanies();
    initDeleteCompanies();
    initAddNewCompany();
});
function initLeadCompaniesTable() {
    if ($('#leadCompaniesTable').length){
        var dataTable = $('#leadCompaniesTable').DataTable({
            paging: false,
            searching: false,
            destroy: true,
            ordering: false,
            ordering: false,
            info: false,
            initComplete: function(settings, json) {
                $('#leadCompaniesTable').closest('.row').siblings('.row').remove();
            }
        });
    }
}

function initDeleteCompanies() {
    $(document).on('click', '.select-all-companies', function () {
        $('#searchResults').find('[name=companyId]').prop('checked', this.checked);
    });

    $('#btnDeleteCompanies').click(function (e) {
        e.preventDefault();

        var checkeds = $('#searchResults').find('[name=companyId]:checked');
        if (checkeds.length){
            var arr = [];
            checkeds.each(function () {
                arr.push(this.value);
            });
            var c = confirm('Are you sure you want to delete '+ arr.length + ' companies');
            if (!c) return;
            Msg.info('Processing..');
            $.ajax({
                url: window.location.pathname,
                data: {
                    deleteCompany: "true",
                    companyId: arr
                },
                type: 'post',
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status){

                        setTimeout(function () {
                            $("#lead-companies-query").val('').trigger('change');
                            Msg.success('Deleted');
                        }, 100);
                    }
                }, error: function (err) {
                    Msg.error("Error when deleting companies. Please try again");
                }
            })
        } else {
            Msg.warning('Please select company to delete');
        }
    })
}

function initSearchCompanies() {
    $("#lead-companies-query").on({
        input: function () {
            typewatch(function () {
                flog("initSearchOrg: do search");
                doSearch();
            }, 500);
        },
        change: function () {
            flog("do search");
            doSearch();
        }
    });
}

function doSearch() {
    flog("doSearch");
    var newUrl = window.location.pathname + "?q=" + $("#lead-companies-query").val();
    $.ajax({
        type: 'GET',
        url: newUrl,
        success: function (data) {
            window.history.pushState("", document.title, newUrl);
            var $fragment = $(data).find("#searchResults");
            $("#searchResults").replaceWith($fragment);
            initLeadCompaniesTable()
        },
        error: function (resp) {
            Msg.error("err");
        }
    });
}

function initAddNewCompany() {
    $('#modal-add-company form').forms({
        onSuccess: function (resp) {
            if (resp && resp.status){
                Msg.info('Processing...');
                setTimeout(function () {
                    Msg.success('Done');
                    $("#lead-companies-query").val('').trigger('change');
                    $('#modal-add-company').modal('hide');
                }, 1000);
            }
        }
    })
}