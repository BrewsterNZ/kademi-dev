(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['blogArticleListEDM'] = {
        settingEnabled: true,

        settingTitle: 'Blog Article List Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "blogArticleListEDM" component');

            return $.ajax({
                url: '_components/blogArticleListEDM?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.number-of-articles').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-number-of-articles', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-blog').on('change', function () {
                        var selectedBlog = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-blog', selectedBlog);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-layout', this.value);
                        keditor.initDynamicContent(dynamicElement);

                        form.find('.items-per-row-wrapper').css('display', this.value === 'grid' ? 'block' : 'none');
                    });

                    form.find('.items-per-row').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-items-per-row', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "blogArticleListEDM" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.number-of-articles').val(dataAttributes['data-number-of-articles']);
            form.find('.select-blog').val(dataAttributes['data-blog']);
            form.find('.select-layout').val(dataAttributes['data-layout']).trigger('change');
            form.find('.items-per-row').val(dataAttributes['data-items-per-row'] || 3);
        }
    };

})(jQuery);