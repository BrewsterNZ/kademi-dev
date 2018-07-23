JBNodes['claimProcessedGoal'] = {
    icon: 'fa fa-trophy',
    title: 'Sales Claim Processed',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/salesDataClaimer/salesDataClaimer-processed-goal.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nodeIdRejected: {
            label: 'then',
            title: 'When Rejected',
            maxConnections: 1
        },
        nodeIdApproved: {
            label: 'then',
            title: 'When approved',
            maxConnections: 1
        }
    },

    nodeTypeClass: 'customGoal',

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(JBApp.standardGoalSettingControls);

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        JBApp.showSettingPanel(node);
    }
};
