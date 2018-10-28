JBNodes['attachLeadFile'] = {
    icon: 'fa fa-file',
    title: 'Attach lead File',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/leadman/jb/copyLeadFileNode.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'When completed',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label for="expression">Source file name</label>' +
            '        <textarea name="mvelExpression" class="form-control file-name" rows="5"></textarea>' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>'
        );

        form.forms({
            allowPostForm: false,
            onValid: function () {    
                var mvelExpression = form.find('textarea[name=mvelExpression]').val();

                JBApp.currentSettingNode.mvelExpression = mvelExpression || null;
                
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        form.find('textarea[name=mvelExpression]').val(node.mvelExpression != null ? node.mvelExpression : '');
        
        JBApp.showSettingPanel(node);
    }
};
