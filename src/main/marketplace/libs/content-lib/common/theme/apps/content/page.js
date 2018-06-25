(function ($) {
    flog("page.js init");
    var $content = $('.content-page');
    if ($content.length > 0) {
        if (!pageInitFunctions) {
            pageInitFunctions = new Array();
        }
        var $editMode = $content.data('editmode');
        pageInitFunctions.push(function () {
            if ($editMode) {
                edify($(".editableContent"), function (resp) {
                    log("page saved", resp);
                    if (resp.status) {
                        log("next href", resp.nextHref);
                        if (resp.nextHref) {
                            window.location = resp.nextHref;
                        } else {
                            window.location.href = window.location.pathname;
                        }
                    } else {
                        Msg.error("There was a problem saving the page");
                    }
                });
            }
        });
    }

    pageInitFunctions.push(function () {
        var assetForms = $(".asset-edit-form");
        flog("asset forms", assetForms, $("body"));
        if (assetForms.length > 0) {
            flog("Init asset forms: ", assetForms.length);
            assetForms.forms({
                onSuccess: function (resp) {
                    if (resp.status) {
                        if (resp.nextHref) {
                            Msg.info("Created, going to the next page");
                            window.location.href = resp.nextHref;
                        } else {
                            Msg.info("Saved");
                        }
                    } else {
                        Msg.error("Sorry, there was an error creating the new item");
                    }
                }
            });
        }
    });


}(jQuery));