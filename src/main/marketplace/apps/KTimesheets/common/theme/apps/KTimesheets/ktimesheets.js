$(function () {

    flog("init submit forms", $(".timesheet-submit-form"));

    var forms = $(".timesheet-submit-form");
    if (forms.length > 0) {
        $(".timesheet-submit-form").forms({
            onSuccess: function (resp) {
                if (resp && resp.status) {
                    Msg.info("Submitted ok. Reloading page..");
                    window.location.reload();
                } else {
                    Msg.error("Sorry, something didnt work");
                }
            }
        });
    }


    flog("init hiding");
    $("body").on("click", ".hide-ts-item", function(e) {
        e.preventDefault();
        flog("click hide");
        var link = $(e.target).closest("a");
        var tr = link.closest("tr");
        var id = link.data("hide-id");

        if (typeof(window.localStorage) !== "undefined") {
            var hideTsIds = localStorage.getItem("hideTsIds");
            hideTsIds = hideTsIds + " " + id;
            localStorage.setItem("hideTsIds", hideTsIds);
            tr.hide(500);
        } else {
            alert("Sorry, no local storage");
        }
    });

    $("body").on("click", ".ts-unhide", function(e) {
        e.preventDefault();
        if (typeof(window.localStorage) !== "undefined") {
            flog("unhide");
            localStorage.removeItem("hideTsIds");
            $(".hide-ts-item").closest("tr").show();
            Msg.info("Done un-hide");
        } else {
            alert("Sorry, no local storage");
        }
    });

    $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
        var reloadItems = $("#timesheets-review");
        reloadItems.reloadFragment();
    });


    $(".timesheet-table").each(function (i, n) {
        var table = $(n);
        updateTotals(table);

        $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
            table.reloadFragment({
                whenComplete: function (newDom, resp, status, xhr) {
                    updateTotals(table);
                    hideHiddenRows();
                    var newSubmitForm = newDom.find(".timesheet-dates");
                    var form = table.closest(".timesheet").find(".timesheet-dates");
                    flog("update form", form, newSubmitForm);
                    form.html(newSubmitForm);
                }
            });
        });

        table.on("change", ".timesheet-item", function (e) {
            try {
                flog("item changed");
                var node = $(e.target);
                var tr = node.closest("tr");
                tr.find("input").prop("disabled", false);
            } catch (e) {
                flog("Error: ", e);
            }
        });

        table.on("change", ".timesheet-hours", function (e) {
            var node = $(e.target);

            flog("Changed node2", node, node.data("day"));
            var hours = node.val();
            var date = node.data("day");
            var item = node.closest("tr").find(".timesheet-item").val();
            updateTotals(table);
            $.ajax({
                url: '/timesheets/',
                type: 'post',
                data: {
                    item: item,
                    hours: hours,
                    date: date
                },
                dataType: 'json',
                success: function (resp) {
                    flog("success");
                    if (resp && resp.status) {
                        Msg.info("Saved");
                    } else {
                        Msg.error(resp.messages.join('\n'));
                    }
                },
                error: function (resp) {
                    Msg.error("Sorry, couldnt save the times");
                }
            });
        })
    });
});

function hideHiddenRows() {
    var hideTsIds = localStorage.getItem("hideTsIds");
    flog("hideHiddenRows: hideTsIds", hideTsIds);
    if( hideTsIds != null) {
        var arr = hideTsIds.split(" ");
        for( var i=0; i<arr.length; i++ ) {
            var id = arr[i];
            var sel = ".hide-ts-item-" + id;
            var link = $(sel);
            var tr = link.closest("tr");
            tr.hide();
        }
    }

}

function updateTotals(table) {
    var bodyRows = table.find("tbody tr");
    var tr = table.find(".totals");
    var grandTotal = 0;
    tr.find("th").each(function (i, n) {
        if (i > 0) {
            var td = $(n);
            var total = calcTotal(bodyRows, i);
            td.text(total.toFixed(2));
            grandTotal += total;
        }
    });
    grandTotal = grandTotal.toFixed(2);
    table.find(".grand-total").text(grandTotal);
}

function calcTotal(bodyRows, i) {
    var total = 0;
    bodyRows.each(function (rowNum, n) {
        var tr = $(n);
        var td = $(tr.find("td")[i]);
        var inp = td.find("input");
        //flog("calcTotal td=", td, td.text());
        var v = inp.val();
        if( v ) {
            v = v.trim();
            var v2 = parseFloat(v);
            if (!isNaN(v2)) {
                total += v2;
            }
        }
    });
    return total;
}
