JBNodes['testSplit'] = {
    title: '<i class="fa fa-flask"></i> <span class="node-type">Split Test</span>',
    previewUrl: '/theme/apps/funnels/jb/splitTestNode.png',
    ports: {
        nextNodeId: {
            label: 'normally',
            title: 'Normally',
            maxConnections: 1
        },
        testNextNodeId: {
            label: 'test',
            title: 'Test',
            maxConnections: 1
        }

    },
    settingEnabled: true,
    initSettingForm: function (form) {
        form.forms({
            onSuccess: function () {
                JBApp.reloadFunnelJson();
                JBApp.hideSettingPanel();
            }
        });
    },
    showSettingForm: function (form, node) {
        var href = window.location.pathname;
        if (!href.endsWith('/')) {
            href += '/';
        }
        href = href + node.nodeId + '?mode=settings';

        form.load(href + ' #frmDetails > *', function () {
            form.attr('action', href);

            JBApp.showSettingPanel(node);
        });
    }
};
