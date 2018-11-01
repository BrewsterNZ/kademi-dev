(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['leadDashTasks'] = {
        settingEnabled: true,

        settingTitle: 'Lead Tasks',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "leadDashTasks" component');

            return $.ajax({
                url: '_components/leadDashTasks?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('#taskType').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-task-type', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#headingTitle').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-heading-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "leadDashTasks" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('#taskType').val(dataAttributes['data-task-type'] || 'dueTasks');
            form.find('#headingTitle').val(dataAttributes['data-heading-title']);
        }
    };

})(jQuery);