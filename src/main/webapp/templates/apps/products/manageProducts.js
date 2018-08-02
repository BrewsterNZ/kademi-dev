$(function () {
    Msg.singletonForCategory = true;
    initTable();
    initSelectPicker();
    initAddCategories();

    $('#data-query').keyup(function () {
        typewatch(function () {
            flog('initSearchUser: do search');
            doHistorySearch();
        }, 500);
    });

    initSupplier();
    $(document).on('click', '#btnClearSupplier', function (e) {
        e.preventDefault();
        $('#supplierWrap').reloadFragment({
            url: window.location.pathname,
            whenComplete: function () {
                initSupplier();
                doHistorySearch();
            }
        })
    });

    $("#newProduct").click(function (event) {
        event.preventDefault();

        // Reset fields in the create product form
        $("#addProductModal").find("input[type=text], textarea,input[name=pageName]").val("");
    });

    $("#modalBulkDelete form").forms({
        onSuccess: function (resp) {
            flog("Done", resp);
            if (resp.status) {
                if (resp.data.numDeleted > 0) {
                    $("#productTableBody").reloadFragment();
                    alert("Deleted " + resp.data.numDeleted + " products");
                    $("#modalBulkDelete").modal("hide");
                    initTable();
                } else {
                    alert("Did not find any matching products. Nothing deleted");
                }
            } else {
                alert("There was a problem deleting products")
            }
        }
    });

    jQuery("form.createProduct").forms({
        onSuccess: function () {
            $.ajax({
                type: 'GET',
                url: window.location.href,
                dataType: "html",
                success: function (resp) {
                    var page = $(resp);
                    var table = page.find("#productsTableContainer table");
                    $("#productsTableContainer").html(table);

                    initTable();
                },
                error: function (resp) {
                    log('There was a problem logging you out', resp);
                },
                complete: function (jqXHR, textStatus) {
                    $("#addProductModal").modal('hide');
                }
            });
        }
    });
    initProductsCsv();
    initVariantsCsv();

    $('body').on('click', '.btn-delete-products', function (e) {
        e.preventDefault();
        var listToDelete = [];
        $('body').find(':checkbox.product-check:checked').each(function () {
            var p = $(this);
            flog(p.data("productname"));
            listToDelete.push(p.data("productname"));
        });
        if (listToDelete.length > 0 && confirm("Are you sure you want to delete " + listToDelete.length + " products?")) {
            $('body').find('.check-all').check(false).change();
            $("#data-query").val("");
            flog(listToDelete.join(','));
            deleteProducts(listToDelete.join(','));
        } else {
            Msg.error('Please select the products you want to remove by clicking the checkboxes on the right', 'deleteProduct');
        }
    });

    $('body').on('change', '.check-all', function (e) {
        flog($(this).is(":checked"));
        //$("body").find(":checkbox.product-check").check($(this).is(":checked"));
        var checkedStatus = this.checked;
        $('body').find(':checkbox.product-check').each(function () {
            $(this).prop('checked', checkedStatus);
        });
    });

    // BM: Do this last!
    initSearchProduct();
});

function initSupplier() {
    $(document).find('#supplierFinder').entityFinder({
        type: 'organisation',
        onSelectSuggestion: function () {
            doHistorySearch();
        }
    });
}
function initTable() {
    $("#pointsFooter a").on('click', function (e) {
        e.preventDefault();
        var uri = e.target.href;

        $.ajax({
            type: 'GET',
            url: uri,
            success: function (data) {
                flog('success', data);
                window.history.pushState('', document.title, uri.toString());

                var newDom = $(data);

                var $tableContent = newDom.find('#productsTableContainer');
                $('#productsTableContainer').replaceWith($tableContent);

                initTable();
            },
            error: function (resp) {
                Msg.error('err');
            }
        });
    });

    flog('initSort()');
    $('.sort-field').on('click', function (e) {
        e.preventDefault();
        var a = $(e.target);
        var uri = URI(window.location);
        var field = a.attr('id');

        var dir = 'asc';
        if (field == getSearchValue(window.location.search, 'sortfield')
                && 'asc' == getSearchValue(window.location.search, 'sortdir')) {
            dir = 'desc';
        }
        uri.setSearch('sortfield', field);
        uri.setSearch('sortdir', dir);

        $.ajax({
            type: 'GET',
            url: uri.toString(),
            success: function (data) {
                flog('success', data);
                window.history.pushState('', document.title, uri.toString());

                var newDom = $(data);

                var $tableContent = newDom.find('#productsTableContainer');
                $('#productsTableContainer').replaceWith($tableContent);

                initTable();
            },
            error: function (resp) {
                Msg.error('err');
            }
        });

    });

}

function initProductsCsv() {
    var modalUploadCsv = $("#modal-upload-csv");

    var resultUploadCsv = modalUploadCsv.find('.upload-results');
    $("#do-upload-csv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
        url: "products.csv",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            flog("oncomplete:", data.result.data, name, href);
            resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
            resultUploadCsv.find('.num-inserted').text(data.result.data.numInserted);
            resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
            showUnmatched(resultUploadCsv, data.result.data.unmatched);
            resultUploadCsv.show();
            Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of products");
            $("#productTableBody").reloadFragment();
            initTable();
        }
    });
}

function initVariantsCsv() {
    var modalUploadCsv = $("#modal-upload-variants-csv");

    var resultUploadCsv = modalUploadCsv.find('.upload-results');
    $("#do-upload-variants-csv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
        url: "variants.csv",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            flog("oncomplete:", data.result.data, name, href);
            resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
            resultUploadCsv.find('.num-inserted').text(data.result.data.numInserted);
            resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
            showUnmatched(resultUploadCsv, data.result.data.unmatched);
            resultUploadCsv.show();
            Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of products");
            $("#productsTableContainer").reloadFragment();
            initTable();
        }
    });
}

function showUnmatched(resultUploadCsv, unmatched) {
    var unmatchedTable = resultUploadCsv.find("table");
    var tbody = unmatchedTable.find("tbody");
    tbody.html("");
    $.each(unmatched, function (i, row) {
        flog("unmatched", row);
        var tr = $("<tr>");
        $.each(row, function (ii, field) {
            tr.append("<td>" + field + "</td>");
        });
        tbody.append(tr);
    });
}

function deleteProducts(listToDelete) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: window.location.pathname,
        data: {
            deleteProducts: listToDelete,
        },
        success: function (data) {
            if (data.status) {
                Msg.info(data.messages);
                $("#productTableBody").reloadFragment();
                initTable();
            } else {
                Msg.error("An error occured deleting the products. Please check your internet connection");
            }
        },
        error: function (resp) {
            Msg.error("An error occured deleting the products");
        }
    });
}

function getSearchValue(search, key) {
    if (search.charAt(0) == '?') {
        search = search.substr(1);
    }
    parts = search.split('&');
    if (parts) {
        for (var i = 0; i < parts.length; i++) {
            entry = parts[i].split('=');
            if (entry && key == entry[0]) {
                return entry[1];
            }
        }
    }
    return '';
}


function doHistorySearch() {
    flog('doHistorySearch');

    Msg.info("Doing search...", "manageProducts", 1000);

    var uri = URI(window.location);

    uri.setSearch('dataQuery', $("#data-query").val());
    uri.setSearch('supplier', $("#supplierFinder").val());
    uri.setSearch('searchOrg', $("#search-library").val());

    var data = {
        dataQuery: $("#data-query").val(),
        supplier: $("#supplierFinder").val()
    };
    flog("data", data);

    $('#btn-export-products').attr('href', 'products.csv?' + $.param(data));

    var target = $("#productsTableContainer");
    target.load();

    flog("new link", uri.toString());

    $.ajax({
        type: "GET",
        url: uri.toString(),
        dataType: 'html',
        success: function (content) {
            Msg.info("Search complete", "manageProducts", 1000);

            var newBody = $(content).find("#productsTableContainer");

            target.replaceWith(newBody);
            history.pushState(null, null, uri.toString());

            $("abbr.timeago").timeago();
            initTable();
        }
    });
}

function updateCategory() {
    var txtQuery = $('#data-query');
    var cbbCategory = $('select.category');
    console.trace();

    var query = (txtQuery.val() || '').replace(/\s*([^\s]+\s?)\s*/g, '$1').trim();
    if (query) {
        query = query.split(' ');

        var selectedCategories = [];
        $.each(query, function (i, value) {
            if (value.indexOf('category:') === 0) {
                selectedCategories.push(value.replace('category:', ''));
                cbbCategory.val(selectedCategories).selectpicker('refresh');
            }
        });
    }
}

function getSearchValue(search, key) {
    if (search.charAt(0) == '?') {
        search = search.substr(1);
    }
    parts = search.split('&');
    if (parts) {
        for (var i = 0; i < parts.length; i++) {
            entry = parts[i].split('=');
            if (entry && key == entry[0]) {
                return entry[1];
            }
        }
    }
    return '';
}


function initSearchProduct() {
    var txtQuery = $('#data-query');
    var cbbCategory = $('select.category');
    updateCategory();

    txtQuery.keyup(function () {
        typewatch(function () {
            updateCategory();
            doHistorySearch();
        }, 500);
    });

    cbbCategory.on('change', function (e) {
        var query = (txtQuery.val() || '').replace(/\s*([^\s]+\s?)\s*/g, '$1').trim();
        var newQuery = [];
        if (query) {
            query = query.split(' ');

            $.each(query, function (i, value) {
                if (value.indexOf('category:') === -1) {
                    newQuery.push(value);
                }
            });
        }

        var selectCategories = cbbCategory.val() || [];
        $.each(selectCategories, function (i, value) {
            newQuery.push('category:' + value);
        });

        txtQuery.val(newQuery.join(' '));

        doHistorySearch();
    });

    $(document.body).on('change', '#search-library', function (e) {
        doHistorySearch();
    });
}

function initSelectPicker() {
    $('.selectpicker').each(function () {
        var selectpicker = $(this);

        selectpicker.selectpicker({
            liveSearch: true,
            noneSelectedText: "Category",
            style: 'btn btn-sm btn-default'
        });

        if (selectpicker.hasClass('category') ) {
            selectpicker.ajaxSelectPicker({
                ajax: {
                    url: '/categories/',
                    type: 'POST',
                    dataType: 'json',
                    data: function () {
                        var params = {
                            search: '{{{q}}}'
                        };

                        return params;
                    }
                },
                cache: false,
                preserveSelected: true,
                preserveSelectedPosition : 'before',
                clearOnEmpty : false,
                minLength : 0,
                emptyRequest : true,

                preprocessData: function (resp) {
                    flog("preprocessData", resp);
                    var categories = [];
                    if (resp && resp.status) {
                        $.each(resp.data, function (i, n) {
                            categories.push({
                                'value': n.name,
                                'text': n.title,
                                'data': {'subtext': n.parentTitle},
                                'disabled': false
                            });
                        });
                    }
                    flog(categories);
                    return categories;
                },
                locale: {
                    statusInitialized: 'Search to see more...'
                }
            });

            //flog("do initial load")
            //selectpicker.$searchbox.trigger("keyup");
        }
    });
}

function initAddCategories() {
    flog("initAddCategories.1");
    $('body').on('click', '.btnAddCategories', function (e) {
        e.preventDefault();
        var listToAdd = [];
        $('body').find(':checkbox.product-check:checked').each(function () {
            var p = $(this);
            flog(p.data("productname"));
            listToAdd.push(p.data("productname"));
        });
        if (listToAdd.length > 0) {
            $("#modal-add-to-category").modal();
        } else {
            Msg.error('Please select the products you want to add by clicking the checkboxes on the right', 'categoryProduct');
        }
    });

    flog("initAddCategories.2");
    $('.selectPickerAddCategory').each(function () {
        var selectpicker = $(this);
        flog("initAddCategories.3");

        selectpicker.selectpicker({
            liveSearch: true,
            noneSelectedText: "Category",
            style: 'btn btn-sm btn-default'
        });


        selectpicker.ajaxSelectPicker({
            ajax: {
                url: '/categories/',
                type: 'POST',
                dataType: 'json',
                data: function () {
                    var params = {
                        search: '{{{q}}}'
                    };

                    return params;
                }
            },
            cache: false,
            preserveSelected: true,
            preserveSelectedPosition : 'before',
            log : 4,
            clearOnEmpty : false,
            minLength : 0,
            emptyRequest : true,

            preprocessData: function (resp) {
                flog(resp);
                var categories = [];
                if (resp && resp.status) {
                    $.each(resp.data, function (i, n) {
                        categories.push({
                            'value': n.name,
                            'text': n.title,
                            'data': {'subtext': n.parentTitle},
                            'disabled': false
                        });
                    });
                }
                flog(categories);
                return categories;
            },
            locale: {
                statusInitialized: 'Search to see more...'
            }
        });
    });

    $(".btnSaveCategories").on('click', function (e) {
        var listToAdd = [];
        $('body').find(':checkbox.product-check:checked').each(function () {
            var p = $(this);
            flog(p.data("productname"));
            listToAdd.push(p.data("productname"));
        });
        var categories = $("#addCategory").val();
        flog(categories);
        $.ajax({
            type: 'POST',
            data: {
                ids: listToAdd,
                categories: categories
            },
            success: function (data) {
                $("#modal-add-to-category").modal("hide");
                Msg.success("Products were added to the categories successfully.", 'manageAddProducts');
            },
            error: function (resp) {
                Msg.error('An error occured doing the search. Please check your internet connection and try again', 'manageAddProducts');
            }
        });

    });
}