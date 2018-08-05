$(function () {
    var panels = $('.panel-pending-applications');
    var isEditorPage = $(document.body).hasClass('content-editor-page');

    if (panels.length > 0 && !isEditorPage) {
        panels.find('abbr.timeago').timeago();

        panels.find('button.accept, button.reject').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var isEnabled = btn.hasClass('accept');

            if (confirm('Are you sure you want to ' + (isEnabled ? 'accept' : 'reject') + ' this application?')) {
                var tbody = btn.closest('tbody');
                var appId = tbody.find('input[name=appId]').val();
                var userName = tbody.find('input[name=userName]').val();
                var fields = tbody.find(':input');
                var ajaxData = {
                    applicationId: appId,
                    enable: isEnabled
                };
                fields.each(function () {
                    if (this.name) {
                        ajaxData[this.name] = this.value;
                    }
                });

                flog('Set status of application="' + appId + '" enabled=' + isEnabled);

                $.ajax({
                    type: 'POST',
                    url: '/pendingApps', // Post to orgfolder/pendingApps
                    dataType: 'json',
                    data: ajaxData,
                    success: function (data) {
                        log('response', data);
                        if (!data.status) {
                            Msg.error('An error occurred processing the request. Please refresh the page and try again: ' + data.messages);
                            return;
                        }

                        if (isEnabled) {
                            Msg.success('Accepted');
                            tbody.find('button.accept, button.reject').remove();
                            tbody.find('.btn-show-more').after(
                                '<a href="/custs/' + tbody.find('input[name=userName]').val() + '" class="btn btn-success" title="Go to profile page"><i class="fa fa-arrow-right"></i></a>'
                            );
                        } else {
                            Msg.success('Rejected');
                            tbody.remove();
                            $('.det-' + appId).remove();
                        }
                    },
                    error: function (resp) {
                        log('error', resp);
                        Msg.error('An error occurred processing the request. Please refresh the page and try again');
                    }
                });
            }
        });

        panels.find('.collapse').on({
            'hidden.bs.collapse': function (e) {
                var target = $(this);
                target.closest('tr').hide();
                $('[data-target="#' + target.attr('id') + '"]').attr('title', 'Show more details').find('.fa').attr('class', 'fa fa-arrow-down');
            },
            'show.bs.collapse': function (e) {
                var target = $(this);
                target.closest('tr').show();
                $('[data-target="#' + target.attr('id') + '"]').attr('title', 'Hide details').find('.fa').attr('class', 'fa fa-arrow-up');
            }
        });
    }
});