
function initManageShoppingCarts() {
    initCartSearch();
    initButtons();
    $("abbr.timeago").timeago();
    initUploadOrdersCsv();

    initAddNewOrder();
}

function initUploadOrdersCsv() {
    $("#doUploadCsv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
        url: "carts.csv",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            log("oncomplete:", data.result.data, name, href);
            if (data.result.status) {
                $(".results .numUpdated").text(data.result.data.numUpdated);
                $(".results .numInserted").text(data.result.data.numInserted);
                $(".results .numUnmatched").text(data.result.data.unmatched.length);
                showUnmatched(data.result.data.unmatched);
                $(".results").show();
                Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of members");
            } else {
                Msg.error("Uploading failed: " + data.result.messages);
            }
        }
    });
}

function showUnmatched(unmatched) {
    var unmatchedTable = $(".results table");
    var tbody = unmatchedTable.find("tbody");
    tbody.html("");
    $.each(unmatched, function (i, row) {
        log("unmatched", row);
        var tr = $("<tr>");
        $.each(row, function (ii, field) {
            tr.append("<td>" + field + "</td>");
        });
        tbody.append(tr);
    });
    unmatchedTable.show();
}

function initButtons() {
    $(document.body).on('click', '.cartLink', function (e) {
        e.preventDefault();
    });
    $(document.body).on('click', '.clickable', function (e) {
        var btn = $(this);
        var href = btn.data('href');
        window.location = href;
    });
    $(document.body).on('change', '.check-all', function (e) {
        var checkedStatus = this.checked;
        $(document.body).find(':checkbox.cart-check').prop('checked', checkedStatus);
    });
    $(document.body).on('click', '.deleteCart', function (e) {
        e.preventDefault();
        var listToDelete = [];
        $(document.body).find(':checkbox.cart-check:checked').each(function () {
            listToDelete.push($(this).data("carthref"));
        });
        if (listToDelete.length > 0 && confirm("Are you sure you want to delete " + listToDelete.length + " shopping carts?")) {
            $(document.body).find('.check-all').check(false).change();
            flog(listToDelete.join(','));
            deleteCarts(listToDelete);
        }
    });
    $(document.body).on('click', '.markFulfilled', function (e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        flog("Clicked", link);
        var linkText = link.text();
        var statusCode = link.data("status");
        var listToFulfill = [];
        $(document.body).find(':checkbox.cart-check:checked').each(function () {
            var href = $(this).data("cartid");
            listToFulfill.push(href);
        });
        if (listToFulfill.length > 0 && confirm("Are you sure you want to mark " + listToFulfill.length + " shopping carts as " + linkText + "?")) {
            $(document.body).find('.check-all').check(false).change();
            flog(listToFulfill.join(','));
            markFulfilled(listToFulfill.join(','), statusCode);
        }
    });
}


function deleteCarts(listToDelete) {
    for (var i = 0; i < listToDelete.length; i++) {
        deleteFile(listToDelete[i]);
        $("input[data-carthref=\"" + listToDelete[i] + "\"]").closest("tr").remove()
    }
    Msg.info("Successfully deleted " + listToDelete.length + " carts");
}

function markFulfilled(listToFulfill, statusCode) {
    $.ajax({
        type: "POST",
        url: window.location.pathname,
        data: {
            fulfill: listToFulfill,
            status: statusCode
        },
        success: function (content) {
            flog('response', content);
            doSearch();
        }
    });
}

function initCartSearch() {
    $(document.body).on('change', '#searchFulfillmentState,#searchCartState', function (e) {
        e.preventDefault();
        doSearch()
    });

    $(document.body).on('pageDateChanged', function (e, startDate, endDate, text, trigger, initial) {
        if (initial) {
            flog("Ignore initial");
            return;
        }

        doSearch();
    });
}


function doSearch() {
    var f = $("#searchFulfillmentState").val();
    var cartState = $("#searchCartState").val();
    flog("doSearch: f=", f, "cartstate=", cartState );

    var thisUri = new URI(window.location);
    thisUri.setSearch("fulfillment", f);
    thisUri.setSearch("cartState", cartState);
    var newThisHref = thisUri.toString();

    var csvUri = new URI("carts.csv");
    csvUri.setSearch("fulfillment", f);
    csvUri.setSearch("cartState", cartState);
    var newCsvHref = csvUri.toString();

    $("#cartCSV").attr("href", newCsvHref);
    history.pushState(null, null, newThisHref);


    $("#shoppingCartList").reloadFragment({
        url : newThisHref,
        whenComplete : function() {
            $("abbr.timeago").timeago();
        }
    });
}

function initAddNewOrder() {
    var modal = $('#modalAddNewOrder');
    var form = modal.find('form');

    $('#shoppingCartFindProfile').entityFinder({
        maxResults: 10,
        type: 'profile',
        renderSuggestions: function (data) {
            var suggestionsHtml = '';

            for (var i = 0; i < data.length; i++) {
                var item = data[i];

                var userName = item.fields.userName[0];
                var userId = item.fields.userId[0];
                var email;
                if (item.fields.email) {
                    email = item.fields.email[0];
                } else {
                    email = "";
                }
                var firstName = item.fields.firstName ? item.fields.firstName[0] : '';
                var surName = item.fields.surName ? item.fields.surName[0] : '';
                var displayText = (firstName || surName) ? firstName + ' ' + surName : '';
                displayText = displayText.trim();

                suggestionsHtml += '<li class="search-suggestion" data-id="' + userName + '" data-actual-id="' + userId + '" data-type="user" data-text="' + (displayText || userName) + '">';
                suggestionsHtml += '    <a href="javascript:void(0);">';
                suggestionsHtml += '        <span>' + userName + '</span> &ndash; <span class="text-info">' + email + '</span>';
                if (displayText) {
                    suggestionsHtml += '    <br /><small class="text-muted">' + displayText + '</small>';
                }
                suggestionsHtml += '    </a>';
                suggestionsHtml += '</li>';
            }

            return suggestionsHtml;
        },
        onSelectSuggestion: function (suggestion, id, actualId, type) {
            form.find('[name=profileId]').val(actualId);
        }
    });

    var storeType = "";
    form.on('change', '#storeType', function () {
        var inp = $(this);
        storeType = inp.val();
        form.find('.storeWrapper').hide();
        form.find('#storeWrapper_' + storeType).find("select").addClass("required");
        form.find('#storeWrapper_' + storeType).show();
    });

    var apiURL = "";
    form.on('change', '.storeSelect', function () {
        form.find('.productWrapper').show();
        var storeSelected = $(this).val();
        flog("storeType=", storeType + " storeSelected=", storeSelected);
        if (storeType == "rewardStore") {
            apiURL = "/reward-store/" + storeSelected;
        } else {
            apiURL = "/ecommerce/" + storeSelected;
        }
        apiURL = apiURL + "?searchProducts=true";
    });

    form.on('keyup keypress change', "#searchProduct", function () {
        $(".productsDropdown").show();
        var search = $(this).val();
        doProductSearch(search);
    });

    function doProductSearch(search) {
        if (search !== "" && search.length > 2) {
            $.ajax({
                type: "GET",
                url: apiURL + "&q=" + search,
                dataType: 'json',
                success: function (resp) {
                    flog('response', resp);
                    if (resp.status) {
                        $(".productsDropdown").html("");
                        var data = resp.data;
                        $.each(data, function () {
                            $(".productsDropdown").append($("<li data-id='" + this.productId + "'>" + this.title + "</li>"));
                        });
                    }
                }
            });
        }
    }

    $(".productsDropdown").on("click", "li", function () {
        $(".productsDropdown").hide();
        $("#searchProduct").val("");

        var title = $(this).text();
        var id = $(this).data("id");

        var append = $("#selectedProducts").find(".form-group").length > 0;

        var html = $.parseHTML(` < div class = 'form-group' id = 'product_` + id + `' >
                < div class = 'col-sm-9' >
                < select class = 'form-control' >
                < /select>
                < /div>
                < div class = 'col-sm-2' > < input type = 'number' data - id = '` + id + `' value = '1' class = 'form-control changeQuantity' > < /div>
                < div class = 'col-sm-1' style = 'padding-left:0px' > < button type = 'button' data - id = '` + id + `' class = 'btn btn-sm btn-danger removeSelectedProduct' > < i class = 'glyphicon glyphicon-trash' > < /i></button > < /div>
                < /div>`);

                $.ajax({
                    type: "GET",
                    url: '/products/' + id + '/?variants',
                    dataType: 'json',
                    success: function (resp) {
                        if (resp.status) {
                            var select = $(html).find("select");
                            var empty = true;
                            var data = resp.data;
                            flog('data', data);
                            $.map(data, function (val, key) {
                                flog(val, " ", key);
                                $(select).attr("name", "product_" + id + "-" + key);
                                $(select).append($('<option></option>').val(1).html(title + " - " + val));
                                empty = false;
                            });
                            if (empty) {
                                $(select).attr("name", "product_" + id);
                                $(select).append($('<option></option>').val(1).html(title));
                            }
                        }
                    }
                });

        if (append) {
            $("#selectedProducts").append(html);
        } else {
            $("#selectedProducts").html(html);
        }

    });

    form.on("click", ".removeSelectedProduct", function () {
        var id = $(this).data("id");
        $("#product_" + id).remove();
        var empty = $("#selectedProducts").find(".form-group").length == 0;
        if (empty) {
            $("#selectedProducts").append("<p>No products selected.</p>");
        }
    });

    form.on("keyup keypress change ", ".changeQuantity", function () {
        var newVal = $(this).val();
        var id = $(this).data("id");
        $.each($("#product_" + id).find("select option"), function () {
            $(this).val(newVal)
        });
    });


    modal.on('hidden.bs.modal', function (e) {
        form.trigger('reset');
        form.find('#storeType').val('').change();
    });

    form.forms({
        onSuccess: function (resp) {
            modal.modal('hide');
            Msg.success(resp.messages);
            $("#auction-wrapper").reloadFragment();
        }
    });
}