(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['precalculatedSalesLeaderboard'] = {
        settingEnabled: true,

        settingTitle: 'Sales Leaderboard (Precalculated)',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "precalculatedSalesLeaderboard" component', form, keditor);

            return $.ajax({
                url: '_components/precalculatedSalesLeaderboard?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-series').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-series', this.value);
                        component.attr('data-extra-fields', "");
                        var value = this.value;
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            form.find('.extraFieldsSeries').addClass('hide');
                            form.find('.extraFieldsSeries[data-series='+value+']').removeClass('hide');
                        });
                    });


                    form.find('.num-users').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-num-users', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.hide-names').on('change', function () {
                        var number = $(this).prop("checked");
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-hide-names', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.hidden-text').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-hidden-text', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.participants-text').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-participants-text', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txt-height').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-row-height', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.show-sales').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-show-points', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.use-date-range').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        if (this.checked){
                            form.find('.customDate').addClass('hide')
                        } else {
                            form.find('.customDate').removeClass('hide')
                        }
                        component.attr('data-use-date-range', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.extraFields').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var arr = [];
                        form.find('.extraFields:checked').each(function () {
                            arr.push(this.value);
                        });
                        component.attr('data-extra-fields', arr.join(','));
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "precalculatedSalesLeaderboard" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-series').val(dataAttributes['data-series']);

            form.find('input.start-date').val(dataAttributes['data-start-date']);
            form.find('input.end-date').val(dataAttributes['data-end-date']);

            form.find('input.num-users').val(dataAttributes['data-num-users'] || 5);
            form.find('input.hide-names').prop("checked", dataAttributes['data-hide-names']  == 'true');
            form.find('input.hidden-text').val(dataAttributes['data-hidden-text']);
            form.find('input.participants-text').val(dataAttributes['data-participants-text'] || 'Participants');

            form.find('input.txt-height').val(dataAttributes['data-row-height'] || 25);
            form.find('input.show-sales').prop("checked", dataAttributes['data-show-sales'] !== 'false');
            form.find('input.use-date-range').prop("checked", dataAttributes['data-use-date-range'] !== 'false');
            if (dataAttributes['data-use-date-range'] !== 'false'){
                form.find('.customDate').addClass('hide');
            } else {
                form.find('.customDate').removeClass('hide');
            }

            form.find('.extraFieldsSeries').addClass('hide');
            if (dataAttributes['data-series']){
                form.find('.extraFieldsSeries[data-series='+dataAttributes['data-series']+']').removeClass('hide');
            }

            var arr = dataAttributes['data-extra-fields'] ? dataAttributes['data-extra-fields'].split(',') : [];
            form.find('.extraFields').each(function () {
                this.checked = arr.indexOf(this.value) != -1;
            });
        }
    };

})(jQuery);