(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['dateHistogram'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "dateHistogram component', contentArea, container, component, keditor);

            var self = this;

            if ($('[href="/static/nvd3/1.8.2/nv.d3.min.css"]').length === 0) {
                $('head').append('<link href="/static/nvd3/1.8.2/nv.d3.min.css" rel="stylesheet" type="text/css" />');
            }

            $.getScriptOnce('/static/nvd3/1.8.2/d3.min.js', function () {
                $.getScriptOnce('/static/nvd3/1.8.2/nv.d3.min.js', function () {
                    $.getScriptOnce('/theme/apps/reporting/jquery.dateAgg.js', function () {
                        self.initDateAgg();
                    });
                });
            });
        },
        initDateAgg: function () {
            flog('initDateAgg');

            $('.panel-date-histogram').each(function () {
                var queryData = $(this);

                if (!queryData.hasClass('initialized-dateAgg')) {
                    queryData.addClass('initialized-dateAgg');
                    queryData.dateAgg();
                }
            });
            flog("initDateAgg: trigger date changed");
            $(document.body).trigger('pageDateChanged', ["1/1/2016", "1/1/2017", "This year", null]);
        },
        settingEnabled: true,
        settingTitle: 'Date Histogram Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "dateHistogram" component');

            var self = this;

            return $.ajax({
                url: '_components/dateHistogram?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-query').on('change', function () {
                        var selectedQuery = this.value;
                        flog("selected", selectedQuery);
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (selectedQuery) {
                            component.attr('data-query', selectedQuery);
                            var aggsSelect = form.find(".select-agg");
                            self.initSelect(aggsSelect, selectedQuery, null);

                            keditor.initDynamicContent(dynamicElement).done(function () {
                                self.initDateAgg();
                            });
                        } else {
                            dynamicElement.html('<p>Please select Query</p>');
                        }
                    });

                    form.find('.select-agg').on('change', function () {
                        var selectedAgg = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (selectedAgg) {
                            component.attr('data-agg', selectedAgg);
                            keditor.initDynamicContent(dynamicElement).done(function () {
                                self.initDateAgg();
                            });
                        } else {
                            dynamicElement.html('<p>Please select a data histogram aggregation</p>');
                        }
                    });

                    form.find('.sub-agg').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-sub-agg', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });

                    form.find('.chart-type').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-chart-type', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });

                    form.find('.show-stacked').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this);
                        component.attr('data-stacked', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });

                    form.find('.show-controls').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this);
                        component.attr('data-controls', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });

                    form.find('.show-legend').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this);
                        component.attr('data-legend', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });


                    form.find('.query-height').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (isNaN(number) || number < 200) {
                            number = 200;
                            this.value = number;
                        }

                        component.attr('data-height', number);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });

                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-title', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });
                }
            });
        },
        initSelect: function (aggsSelect, selectedQuery, selectedAgg) {
            flog("initSelect", selectedQuery, selectedAgg);

            $.ajax({
                url: "/queries/" + selectedQuery + "?run",
                type: 'GET',
                dataType: 'json',
                success: function (resp) {
                    flog('initSelect resp', resp);

                    var aggsHtml = '<option value""> - None - </option>';
                    var aggs = resp.aggregations;
                    for (var key in aggs) {
                        aggsHtml += '<option value="' + key + '">' + key + '</option>';
                    }
                    aggsSelect.html(aggsHtml);

                    if (selectedAgg) {
                        aggsSelect.val(selectedAgg);
                    }
                },
                error: function (e) {
                    Msg.error(e.status + ': ' + e.statusText);
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "dateHistogram" component');

            var self = this;
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var selectedQuery = dataAttributes['data-query'];
            var selectedAgg = dataAttributes['data-agg'];

            form.find('.select-query').val(selectedQuery);
            form.find('.select-agg').val(dataAttributes['data-agg']);
            form.find('.sub-agg').val(dataAttributes['data-sub-agg']);
            form.find('.chart-type').val(dataAttributes['data-chart-type']);

            form.find('.show-stacked').prop("checked", toBool(dataAttributes['data-stacked']));
            form.find('.show-controls').prop("checked", toBool(dataAttributes['data-controls']));
            form.find('.show-legend').prop("checked", toBool(dataAttributes['data-legend']));

            form.find('.query-height').val(dataAttributes['data-height']);
            form.find('.txt-title').val(dataAttributes['data-title']);

            var aggsSelect = form.find(".select-agg");
            self.initSelect(aggsSelect, selectedQuery, selectedAgg);
        }
    };

    function toBool(v) {
        if (v === true) {
            return true;
        }
        var b = (v === 'true');
        return b;
    }
})(jQuery);
