(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['kpiStatus'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "kpiStatus" component');

            $.getScriptOnce('/static/jquery-knob/1.2.13/dist/jquery.knob.min.js', function () {
                var dynamicElement = component.find('[data-dynamic-href]');
                keditor.initDynamicContent(dynamicElement).done(function () {
                    initCircleSales(dynamicElement);
                });
            });
        },
        settingEnabled: true,
        settingTitle: 'KPI Status',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "kpiStatus" component');

            return $.ajax({
                url: '_components/kpiStatus?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-kpi').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-kpi', this.value);
                        cbbLevel.find('option').css('display', 'none').filter('[data-kpi="' + this.value + '"]').css('display', 'block');
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            initCircleSales(dynamicElement);
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "kpiStatus" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-kpi').val(dataAttributes['data-kpi']);
            var cbbLevel = form.find('.select-level');
            cbbLevel.find('option').css('display', 'none').filter('[data-kpi="' + dataAttributes['data-kpi'] + '"]').css('display', 'block');
            cbbLevel.val(dataAttributes['data-kpi-level']);

        }
    };

})(jQuery);