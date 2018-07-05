JBNodes['emailAction'] = {
    icon: 'fa fa-envelope',
    title: 'Send Email',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/email/jb/sendEmailNode.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'When completed',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        var self = this;

        form.forms({
            onSuccess: function () {
                JBApp.reloadFunnelJson();
                JBApp.hideSettingPanel();
            }
        });

        form.on('change', '.assetQueryId', function () {
            self.loadFields(form);
        });

        form.on('change', '.select-asset-field', function () {
            if ($(this).val() === "") {
                $(this).nextAll().show();
            } else {
                $(this).nextAll().hide();
            }
        });
    },
    loadFields: function (form, callback) {
        var selectQuery = form.find('#assetQueryId');
        var targetType = selectQuery.find('option[value="' + selectQuery.val() + '"]').attr('data-target-type');

        if (targetType == undefined) {
            var optionsStr = '<option value="">[Manual entry]</option>';
            form.find('.select-asset-field').html(optionsStr).hide().nextAll().show();

            if (typeof callback === 'function') {
                callback();
            }

            return;
        }

        $.ajax({
            url: '/content-types/' + targetType,
            dataType: 'json',
            type: 'get',
            data: {
                asJson: true
            },
            success: function (resp) {
                var optionsStr = '<option value="">[Manual entry]</option>';
                if (resp && resp.status && resp.data && resp.data && resp.data.fields) {
                    $.each(resp.data.fields, function (index, item) {
                        var itemTitle = item.name;
                        if (item.title) {
                            itemTitle = item.title;
                        }
                        optionsStr += '<option value="' + item.name + '">' + itemTitle + '</option>';
                    });
                }

                form.find('.select-asset-field').html(optionsStr).show();

                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function (jqXHR, textStatus, errorText) {
                flog('Error in loading fields', jqXHR, textStatus, errorText);
                var optionsStr = '<option value="">[Manual entry]</option>';
                form.find('.select-asset-field').html(optionsStr);

                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
    },
    showSettingForm: function (form, node) {
        var self = this;

        var href = window.location.pathname;

        if (!href.endsWith('/')) {
            href += '/';
        }
        href = href + node.nodeId + '?mode=settings';

        form.load(href + ' #frmDetails > *', function () {
            form.attr('action', href);

            form.find('[name = "assetQueryId" ]').val(node.assetQueryId !== null ? node.assetQueryId : '');

            self.loadFields(form, function () {
                JBApp.showSettingPanel(node);

                form.find('[name = "fromAssetField" ]').val(node.fromAssetField !== null ? node.fromAssetField : '').change();
                form.find('[name = "toAssetField" ]').val(node.toAssetField !== null ? node.toAssetField : '').change();
                form.find('[name = "replyToAssetField" ]').val(node.replyToAssetField !== null ? node.replyToAssetField : '').change();
                form.find('[name = "subjectAssetField" ]').val(node.subjectAssetField !== null ? node.subjectAssetField : '').change();
            });
        });
    }
};
