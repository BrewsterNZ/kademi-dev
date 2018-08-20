JBNodes['shoppingCartGoal'] = {
    icon: 'fa fa-shopping-cart',
    title: 'Shopping Cart Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/ecommerce/jb/shoppingCartGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nodeIdAddedToCart: {
            label: 'added to cart',
            title: 'When item added to cart',
            maxConnections: 1
        },
        nodeIdCheckoutComplete: {
            label: 'checkout complete',
            title: 'When checkout complete',
            maxConnections: 1
        },
        nodeIdPaymentPending: {
            label: 'payment pending',
            title: 'When payment pending',
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
            '        <div class="checkbox">' +
            '           <label>' +
            '               <input type="checkbox" name="auction" class="auction">' +
            '               Support auctions' +
            '           </label>' +
            '        </div>' +
            '        <small class="text-muted help-block">If set, goal will be triggered when a user wins an auction</small>' +
            '    </div>' +
            '</div>' + JBApp.standardGoalSettingControls
        );
        form.append(JBApp.standardGoalSettingControls);

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var auction = form.find('.auction').prop("checked");
                JBApp.currentSettingNode.auction = auction || null;
                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.auction').prop("checked", node.auction != null ? node.auction : false);
        JBApp.showSettingPanel(node);
    }
};
