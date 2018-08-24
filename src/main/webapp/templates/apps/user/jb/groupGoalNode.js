JBNodes['groupGoal'] = {
    icon: 'fa fa-users',
    title: 'Group goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/user/jb/groupGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nodeIdAccepted: {
            label: 'accepted',
            title: 'When accepted',
            maxConnections: 1
        },
        nodeIdRejected: {
            label: 'rejected',
            title: 'When rejected',
            maxConnections: 1
        },
        nodeIdPending: {
            label: 'pending',
            title: 'When pending',
            maxConnections: 1
        },
        pastTimeNode: {
            label: 'past time',
            title: 'When entered while timeout has passed',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Group name</label>' +
            '        <select class="form-control groupName"></select>' +
            '    </div>' +
            '</div>' + JBApp.standardGoalSettingControls
        );

        $.ajax({
            url: '/groups/?asJson',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var groups = resp.data;
                flog("got groups", groups);
                var optionsStr = '<option value="">[No group selected]</option>';
                for( var groupName in groups) {
                    flog("group", groupName);
                    optionsStr += '<option value="' + groupName + '">' + groups[groupName] + '</option>';
                }

                form.find('.groupName').html(optionsStr);
            }
        });

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var groupName = form.find('.groupName').val();
                JBApp.currentSettingNode.groupName = groupName || null;
                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.groupName').val(node.groupName !== null ? node.groupName : '');
        JBApp.showSettingPanel(node);
    }
};
