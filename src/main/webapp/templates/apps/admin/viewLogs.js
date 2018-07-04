(function ($) {
    var itemsToAppend = [];
    var ajaxTimer = null;
    var maxLimit;

    var filterOptions = {
        since: 0,
        logLevel: null,
        user: null,
        keyword: null
    };

    function loadNewLogs() {
        clearTimeout(ajaxTimer);
        ajaxTimer = null;

        filterOptions.user = $('#user-query').val();
        filterOptions.keyword = $('#message-query').val();

        flog(filterOptions);

        var doTail = $('#doTail').prop('checked');
        if (!doTail) {
            ajaxTimer = window.setTimeout(loadNewLogs, 1000);
            return;
        }

        $.ajax({
            type: 'GET',
            url: window.location.pathname,
            dataType: 'json',
            data: filterOptions,
            success: function (data) {
                filterOptions.since = data.serverTimeMillis;
                var hits = data.hits.hits;

                flog('lastLogDate', filterOptions);
                $.each(hits, function (i, n) {
                    if (n.fields) {
                        processReceivedLog(n.fields);
                    }
                });
                appendItems();

                var logsBody = $('#logsBody');
                if ($('#autoScroll').is(':checked')) {
                    logsBody.animate({
                        scrollTop: logsBody.prop('scrollHeight')
                    }, 1000);
                }

                ajaxTimer = window.setTimeout(loadNewLogs, 1000);
            },
            error: function (resp) {
                flog("exception parsing server response", resp);
                ajaxTimer = window.setTimeout(loadNewLogs, 1000);
                //Msg.error('An error occured. Please check your internet connection');
            }
        });

    }

    function appendItems() {
        $('#logsBody').append(itemsToAppend);
        trimTable(maxLimit);

        while (itemsToAppend.length > 0) {
            itemsToAppend.pop();
        }
    }

    function processReceivedLog(c) {
        var dt = moment(c.date[0]);
        var labelType = c.level[0].toLowerCase();

        if (labelType == 'error') {
            labelType = 'danger';
        } else if (labelType == 'warn') {
            labelType = 'warning';
        } else if (labelType == 'trace') {
            labelType = 'default';
        }

        var row = $(
                '<div class="' + labelType + ' col-row clearfix">' +
                '    <div class="col-lvl"><span class="label label-' + labelType + '">' + c.level + '</span></div>' +
                '    <div class="col-user"><a target="_blank" class="userName" href="' + c.userHref + '">' + c.userName + '</a></div>' +
                '    <div class="col-msg"></div>' +
                '    <div class="col-date">' + dt.format('HH:mm:ss') + '</div>' +
                '</div>'
                );
        row.find('.col-msg').text(c.message);

        itemsToAppend.push(row);

        if (c.stackTrace && c.stackTrace !== null && c.stackTrace.length > 0) {
            row = $(
                    '<div class="col-row clearfix no-bordered">' +
                    '   <div class="causes"></div>' +
                    '</div>'
                    );

            var ul = $('<ul />');
            $.each(c.stackTrace, function (i, n) {
                $('<li>').text(n).appendTo(ul);
            });
            row.find('.causes').append(ul);

            itemsToAppend.push(row);
        }
    }

    function trimTable(limit) {
        if (limit === null) {
            limit = 50;
        }

        var logBody = $('#logsBody');
        var logTable = logBody.find('.col-row');
        flog('Table Size', logTable.length, 'Limit', limit)

        if (logTable.length > limit) {
            logBody.find('.col-row:lt(' + (logTable.length - limit) + ')').remove()
        }
        logTable = logBody.find('.col-row');
        flog('New Table Size', logTable.length, 'Limit', limit)
    }

    window.initViewLogs = function (options) {
        clearTimeout(ajaxTimer);
        ajaxTimer = null;

        enableLogging();

        maxLimit = options.maxLimit;
        filterOptions.size = maxLimit;
        var logsBody = $('#logsBody');
        var txtQueryUser = $('#user-query');
        var txtQueryMessage = $('#message-query');
        var sizeLimit = $('#size-limit');

        var logsBodyMaxHeight = $(window).height() - 329;
        if (logsBodyMaxHeight < 300) {
            logsBodyMaxHeight = 300;
        }
        logsBody.css('max-height', logsBodyMaxHeight);

        $('.logs-clear').click(function (e) {
            e.preventDefault();

            logsBody.html('');
        });

        txtQueryUser.on('change', function () {
            var val = txtQueryUser.val();
            flog('user-query change', val);

            filterOptions.user = val;
            filterOptions.since = 0;

            trimTable(0);
            loadNewLogs();
        });

        txtQueryMessage.on('change', function () {
            var val = txtQueryMessage.val();
            flog('message-query change', val);

            filterOptions.keyword = val;
            filterOptions.since = 0;

            trimTable(0);
            loadNewLogs();
        });

        sizeLimit.on('change', function () {
            var val = sizeLimit.val();

            if (val.trim() == '') {
                val = 500;
                sizeLimit.val(500);
            }

            if (val < 0) {
                val = 0;
            }
            if (val > 5000) {
                val = 5000;
            }


            maxLimit = val;
            filterOptions.size = val;
            trimTable(val);
        });

        $('#level-filter').val('').on('change', function () {
            var classLevel = this.value;

            switch (classLevel) {
                case 'info-only' :
                    filterOptions.logLevel = 'INFO';
                    break;
                case 'danger-only' :
                    filterOptions.logLevel = 'ERROR';
                    break;
                case 'warning-only' :
                    filterOptions.logLevel = 'WARN';
                    break;
                case 'default-only' :
                    filterOptions.logLevel = 'TRACE';
                    break;
                default:
                    filterOptions.logLevel = null;
            }

            filterOptions.since = 0;
            trimTable(0);
            loadNewLogs();
        });

        ajaxTimer = window.setTimeout(loadNewLogs, 1000);
    }

})(jQuery);

function enableLogging() {
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: 'json',
        data: {
            startLogging : true
        },
        success: function (data) {
            Msg.info("Logging enabled for this account");
        },
        error: function (resp) {
            flog(arguments);
            Msg.error('An error occured. Please check your internet connection');
        }
    });
}