(function ($) {
    /**
     */
    var defaultConfig = {
        clipboardName: "default",
        copyClass: ".btn-copy",
        copySelectedClass: ".btn-copy-list",
        cutClass: ".btn-cut",
        pasteClass: ".btn-paste",
        duplicateClass: ".btn-duplicate",
        reload: true, // will attempt to reload
        reloadId: null, // will look for an id on the container, and reload if present
        afterReload: null, // called after reload
        success: function (sourceHref, newUrl, isCut) {
            var msg = (isCut ? 'Cut' : 'Copied');
            msg += ' successfully'
            Msg.success(msg, "copy-notify");
        }
    };

    /**
     * See (http://jquery.com/).
     * @name $
     * @class
     * See the jQuery Library (http://jquery.com/) for full details. This just
     * documents the function and classes that are added to jQuery by this plug-in.
     */

    /**
     * See (http://jquery.com/)
     * @name fn
     * @class
     * See the jQuery Library (http://jquery.com/) for full details. This just
     * documents the function and classes that are added to jQuery by this plug-in.
     * @memberOf $
     */

    /**
     * Enabled cut/copy/paste functionality
     * @name cutcopy
     * @class
     * @memberOf $.fn
     * @version 1.0.0
     * @param {Config} options Configuration of comment
     */
    $.fn.cutcopy = function (options) {
        var container = this;
        var config = $.extend({}, defaultConfig, options);

        container.on('click', config.duplicateClass, function (e) {
            e.preventDefault();

            var link = $(this).closest('a');
            var href = link.attr("href");
            var folder = href.substring(0, href.lastIndexOf('/'));

            flog("cutcopy: Duplicate", href);

            setClipboard(config.clipboardName, href, false);
            doClipboardActionInList(0, href, folder, false, function () {
                clearClipboard(config.clipboardName);
                if (config.success) {
                    config.success(href, folder, false);
                }
                if (config.reload) {
                    var id = config.reloadId;
                    if (id === null) {
                        id = container.attr("id");
                    }
                    if (id !== null) {
                        $('#' + id).reloadFragment({
                            url: window.location.pathname,
                            whenComplete: function () {
                                checkRequiresClipboard(config.clipboardName);
                                if (config.afterReload) {
                                    config.afterReload(sourceHref, newHref, isCut);
                                }
                            }
                        });
                    } else {
                        checkRequiresClipboard(config.clipboardName);
                    }
                }
            });
        });

        container.on('click', config.copyClass, function (e) {
            e.preventDefault();

            var link = $(this).closest('a');
            var href = link.attr("href");

            setClipboard(config.clipboardName, href, false);
            flog("Placed on clipboard (copy)", href);
            checkRequiresClipboard(config.clipboardName);
        });

        container.on('click', config.copySelectedClass, function (e) {
            e.preventDefault();

            var checkBoxes = container.find("input[type=checkbox]:checked")
            if( checkBoxes.length == 0) {
                Msg.error("Please select the files you want to copy by clicking the checkboxes to the right");
                return;
            }

            var combinedHrefs = "";
            checkBoxes.each(function(i, n){
                var href = $(n).val();
                if( combinedHrefs.length > 0 ) {
                    combinedHrefs = combinedHrefs + ",";
                }
                combinedHrefs = combinedHrefs + href;
            });


            setClipboard(config.clipboardName, combinedHrefs, false);
            flog("Placed on clipboard (copy)", combinedHrefs);
            checkRequiresClipboard(config.clipboardName);
        });

        container.on('click', config.cutClass, function (e) {
            e.preventDefault();

            var link = $(this).closest('a');
            var href = link.attr("href");

            setClipboard(config.clipboardName, href, true);
            flog("Placed on clipboard (cut)", href);
            checkRequiresClipboard(config.clipboardName);
        });

        container.off('click', config.pasteClass).on('click', config.pasteClass, function (e) {
            e.preventDefault();
            var newHref = $(e.target).closest("a").attr("href");
            var sourceHref = getClipboardHref(config.clipboardName);
            var isCut = isClipboardCut(config.clipboardName);

            flog("Paste from clipboard source", sourceHref, isCut, "newHref=", newHref);

            doClipboardActionInList(0, sourceHref, newHref, isCut, function () {
                clearClipboard(config.clipboardName);
                if (config.success) {
                    config.success(sourceHref, newHref, isCut);
                }
                if (config.reload) {
                    var id = config.reloadId;
                    if (id === null) {
                        id = container.attr("id");
                    }
                    if (id !== null) {
                        $('#' + id).reloadFragment({
                            url: window.location.pathname,
                            whenComplete: function () {
                                checkRequiresClipboard(config.clipboardName);
                                if (config.afterReload) {
                                    config.afterReload(sourceHref, newHref, isCut);
                                }
                            }
                        });
                    } else {
                        checkRequiresClipboard(config.clipboardName);
                    }
                }
            });
        });
        checkRequiresClipboard(config.clipboardName);
    };

})(jQuery);

function checkRequiresClipboard(clipboardName) {
    var href = getClipboardHref(clipboardName);
    var items = $(".requires-clipboard").filter('[data-clipboard="' + clipboardName + '"]');
    flog("checkRequiresClipboard", items, "href", href);
    if (href && Array.isArray(href) && href.length > 0) {
        var arr = [];
        for (var i = 0; i < href.length; i++){
            if (href[i]){
                arr.push(href[i]);
            }
        }
        if (arr.length){
            flog("show");
            items.removeClass('hide');
        } else {
            flog("hide");
            items.addClass('hide');
        }
    } else {
        flog("hide");
        items.addClass('hide');
    }
}

function setClipboard(clipboardName, href, isCut) {
    flog("setClipboard: href=", href);
    var cookieName = 'clipboard-' + clipboardName;
    var val = href;
    if (isCut) {
        val += "|cut";
    }
    $.cookie(cookieName, val, {
        path: '/',
        expires: 30
    });
}

function clearClipboard(clipboardName) {
    var cookieName = 'clipboard-' + clipboardName;
    $.cookie(cookieName, "", {
        path: '/',
        expires: 30
    });
}

function getClipboardHref(clipboardName) {
    var cookieName = 'clipboard-' + clipboardName;
    var cookieVal = $.cookie(cookieName) || '';
    if (cookieVal.indexOf('|cut') !== -1) {
        cookieVal = cookieVal.split('|cut')[0];
    }
    return cookieVal.split(',');
}

function isClipboardCut(clipboardName) {
    var cookieName = 'clipboard-' + clipboardName;
    var cookieVal = $.cookie(cookieName) || '';
    return cookieVal.indexOf('|cut') !== -1;
}

function doClipboardActionInList(itemNum, hrefs, newUrl, isCut, onDone) {
    flog("doClipboardActionInList", itemNum, hrefs);
    if (itemNum >= hrefs.length) {
        typeof onDone == "function" && onDone();
    } else {
        var href = hrefs[itemNum];
        flog("doClipboardActionInList href=", href, "newUrl=", newUrl);
        doClipboardAction(href, newUrl, isCut, function (resp, sourceHref, destHref) {
            var filename = getFileName(href);
            var copy = isCut ? "Cut" : "Copied";
            Msg.info(copy + " " + filename, "copy-notify");
            doClipboardActionInList(itemNum + 1, hrefs, newUrl, isCut, onDone);
        });
    }
}

function doClipboardAction(oldUrl, newUrl, isCut, ondone) {
    // newUrl will always be a folder path, should always end with a slash
    if (!newUrl.endsWith("/")) {
        newUrl += "/";
    }

    // Check if the target resource exists, and if so rename
    var targetFileName = getFileName(oldUrl);
    flog("doClipboardAction. newUrl=", newUrl);
    doClipboardActionWithName(oldUrl, newUrl, targetFileName, isCut, ondone, 0);
}

function doClipboardActionWithName(oldUrl, destFolder, destName, isCut, ondone, cnt) {
    flog('doClipboardActionWithName', oldUrl, destFolder, destName, isCut, cnt);

    var candidateNewUrl = destFolder + destName;
    if (cnt > 0) {
        if (destName.indexOf('.') !== -1) {
            var lastDotIndex = candidateNewUrl.lastIndexOf('.');
            candidateNewUrl = candidateNewUrl.substring(0, lastDotIndex) + '.' + cnt + candidateNewUrl.substring(lastDotIndex, candidateNewUrl.length);
        } else {
            candidateNewUrl += "." + cnt;
        }
    }
    checkExists(candidateNewUrl, {
        exists: function () {
            flog("Target href does exist, so try with a different name", candidateNewUrl);
            doClipboardActionWithName(oldUrl, destFolder, destName, isCut, ondone, cnt + 1);
        },
        notExists: function () {
            flog("target href does not exist, so carry on", candidateNewUrl);
            if (isCut) {
                moveFolder(oldUrl, candidateNewUrl, ondone);
            } else {
                copyFolder(oldUrl, candidateNewUrl, ondone);
            }
        }
    });
}

function checkExists(href, config) {
    $.ajax({
        type: 'HEAD',
        url: href,
        success: function (resp) {
            flog("success", resp);
            config.exists();
        },
        error: function (resp) {
            flog("error", resp);
            config.notExists();
        }
    });
}
