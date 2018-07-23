/**
 *
 *  jquery.history.js
 *
 * Config:
 * pageUrl - url of the resource to show history for. For link tags will use the href by default
 * showPreview - whether or not to show a preview link in the history table
 *
 */

(function($) {
    $.fn.history = function(options) {
        var btn = this;
        var config = $.extend({
            "pageUrl": null,
            "showPreview": true,
            "afterRevertFn": function() {
                window.location.reload();
            },
            "getPageUrl": function(target) {
                if (target) {
                    var href = target.attr('href');
                    flog("getPageUrl: href", href);
                    if (href && href.length > 0 && href !== "#" ) {
                        return href;
                    }
                }
                if (this.pageUrl !== null) {
                    return this.pageUrl;
                } else {
                    return window.location.pathname;
                }
            }
        }, options);
        var modal = config.modal;
        btn.click(function(e) {
            var link = $(e.target).closest("a");
            flog('show history', link);
            e.preventDefault();
            btn.addClass("loading");
	        if (!modal) {
		        modal = buildModal();
	        }
            loadHistory(modal.find("tbody"), config, link);
            modal.modal("show");
            btn.removeClass("loading");
        });
    };
})(jQuery);

function buildModal() {
	var id = 'modal-history';

	$(document.body).append(
		'<div id="' + id + '" class="modal fade" aria-hidden="true" tabindex="-1">' +
            '<div class="modal-dialog modal-sm">' +
            '    <div class="modal-content">' +
            '        <div class="modal-header">' +
            '            <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
            '            <h4 class="modal-title">History</h4>' +
            '        </div>' +
            '        <div class="modal-body">' +
            '            <table class="table table-bordered table-striped table-hover table-condensed">' +
            '                <colgroup>' +
            '                    <col />' +
            '                    <col />' +
            '                    <col />' +
            '                    <col style="width: 70px" />' +
            '                </colgroup>' +
            '                <thead>' +
            '                    <tr>' +
            '                        <th>Description</th>' +
            '                        <th>User</th>' +
            '                        <th>Edited</th>' +
            '                        <th>Restore</th>' +
            '                    </tr>' +
            '                </thead>' +
            '                <tbody>' +
            '                </tbody>' +
            '            </table>' +
            '        </div>' +
            '        <div class="modal-footer">' +
            '            <button class="btn btn-default" data-dismiss="modal" type="button">Close</button>' +
            '        </div>' +
            '    </div>' +
            '</div>' +
		'</div>'
	);

	return $('#' + id);
}

function loadHistory(tbody, config, target) {
    flog('loadHistory', config);
    try {
        var pageHref = config.getPageUrl(target);
        flog("pageHref", pageHref);
        var href = suffixSlash(pageHref) + '.history';
        flog("href", href);
        $.ajax({
            type: "GET",
            url: href,
            dataType: 'json',
            success: function(resp) {
                ajaxLoadingOff();
                log('got history', resp);
                buildHistoryTable(resp.data, tbody, config, href);
            },
            error: function(resp) {
                ajaxLoadingOff();
                Msg.error('err');
            }
        });
    } catch (e) {
        flog('exception', e);
    }

}

function buildHistoryTable(data, tbody, config, href) {
    tbody.html('');
    var tbody_string = '';
    if (data.length === 0) {
        tbody_string = '<tr class="no-history"><td colspan="4">No history information is available</td></tr>';
    } else {
        $.each(data, function(i, n) {
            var date = new Date(n.modDate);
            var formattedDate = date.toISOString();

            var tdPreview = '';
            if (config.showPreview) {
                log('show preview', config.getPageUrl());
                tdPreview = '<a href="' + config.getPageUrl() + '.preview?version=' + n.hash + '" >Preview</a>';
            }

            tbody_string +=
                '<tr>' +
                    '<td>' + n.description + '</td>' +
                    '<td><abbr class="timeago" title="' + formattedDate + '">' + formattedDate + '</abbr></td>' +
                    '<td>' + n.user.name + '</td>' +
                    '<td style="text-align: center"><a href="' + href + '" class="btn btn-info btn-xs btn-restore-repo" title="Restore this version" rel="' + n.hash + '"><i class="fa fa-white fa-undo"></i></a></td>' +
                '</tr>';
        });
    }
    tbody.html(tbody_string);
    tbody.find('.btn-restore-repo').on('click', function (e) {
        e.preventDefault();

        confirmRevert($(this).attr('rel'), tbody, config, $(this).attr('href'));
    });
    tbody.find('abbr.timeago').timeago();
}

function confirmRevert(hash, tbody, config, href) {
    //alert('Rollback to: ' + hash);
    if (confirm('Are you sure you want to revert?')) {
        revert(hash, tbody, config, href);
    }

}

function revert(hash, tbody, config, href) {
    try {
        var pageHref = href;

        flog("revert: ", pageHref, hash);
        $.ajax({
            type: "POST",
            url: pageHref,
            data: {
                revertHash: hash
            },
            dataType: 'json',
            success: function(resp) {
                ajaxLoadingOff();
                log('got history after revert', resp);
                if (tbody) {
                    buildHistoryTable(resp.data, tbody, config);
                }
                if (config.afterRevertFn) {
                    config.afterRevertFn(resp.data, config);
                }
            },
            error: function(resp) {
                ajaxLoadingOff();
                log('error response', resp);
                Msg.error('Sorry, there was an error reverting to the previous version. Please check your internet connection');
            }
        });
    } catch (e) {
        log('exception', e);
        Msg.error('Sorry, there was an exception reverting to the previous version. Please check your internet connection');
    }
}