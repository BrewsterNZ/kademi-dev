(function (window, $) {
    var searchOptions = {
        aggr: 'source',
        filters: null,
        stage: null
    };

    function initFunnel() {
        flog('initFunnel');

        if ($('.pageDatePicker').length > 0) {
            $(document).on('pageDateChanged', function () {
                var uri = URI(window.location.href);
                var filters = uri.query(true).filters;
                var stage = uri.query(true).stage;
                if (filters) {
                    searchOptions.filters = filters;
                    var arr = filters.split('=');
                    if (arr.length > 1) {
                        searchOptions.aggr = arr[0];
                    }
                }
                if (stage) {
                    searchOptions.stage = stage;
                }
                loadFunnel();
            });
        } else {
            loadFunnel();
        }

        $(window).bind('popstate', function (event) {
            var uri = new URI(window.location.pathname + window.location.search);
            uri.addQuery('asJson');

            flog('popstate', uri.toString());
            loadFunnel(uri.toString());
        });
    }

    var loadFunnel = function (url) {
        var data_url = url || window.location.pathname + '?asJson&' + $.param(searchOptions);

        flog('data_url', data_url);

        $('#kfvWrapper').funnel({
            url: data_url,
            stageHeight: '120px',
            stageNameFontSize: '14px',
            legendNameFontSize: '14px',
            stageNameBackgroundColor: 'gray',
            width: 480,
            height: 260,
            marginLeft: 0,
            onData: function (resp) {
                initHistogram(resp);
                initPies(resp);
                initFunnelSource($('#kfvWrapper'));
                initSourceFilters();
            },
            onBubbleClick: function (data, stage) {
                flog('onBubbleClick', data, stage.name);
                var name = data.name;
                if (data.id > 0) {
                    name = data.id;
                }
                var uri = URI(window.location.href);
                searchOptions.stage = stage.name;
                uri.setSearch('stage', stage.name);
                // history.pushState(null, null, uri.toString());
                $('#leadsContainer').reloadFragment({
                    url: uri.toString(),
                    whenComplete: function () {
                        initDataTable();
                    }
                });
            },
            onGroupClick: function (data, value) {
                flog('onGroupClick', data, value);
                var name = data.name;
                if (data.id > 0) {
                    name = data.id;
                }
                searchOptions.filters = (searchOptions.aggr + '=' + name);

                // Select an aggregation other then the selected filter
                var aggs = $('.btn-select-aggr');
                flog('aggs', aggs, 'filter out', searchOptions.aggr);
                var nextAgg = aggs.not('[href="' + searchOptions.aggr + '"]').first();
                var newAggName = nextAgg.attr('href');
                flog('newAggName', newAggName);
                //searchOptions.aggr = newAggName;
                var uri = URI(window.location.href);
                var filters = searchOptions.aggr + '=' + name;
                uri.setSearch('filters', filters);
                // history.pushState(null, null, uri.toString());
                $('#leadsContainer').reloadFragment({
                    url: uri.toString(),
                    whenComplete: function () {
                        initDataTable();
                    }
                });
            }
        });
    }

    function initHistogram(resp) {
        flog('initHistogram', resp.summary);
        $('#histo svg').empty();
        var closedSalesColor = $('#histo').attr('data-closedSales') || '#ee145b';
        var cancelledSalesColor = $('#histo').attr('data-cancelledSales') || '#3e3e3e';
        var closedBuckets = resp.summary.aggregations.closed.bydate.buckets;
        var cancelledBuckets = resp.summary.aggregations.cancelled.bydate.buckets;

        var myData = [];
        var closedSales = {
            key: 'Closed sales',
            color: closedSalesColor,
            values: []
        };
        myData.push(closedSales);

        $.each(closedBuckets, function (b, dateBucket) {
            var v = dateBucket.doc_count;
            if (v == null) {
                v = 0;
            }
            closedSales.values.push({x: dateBucket.key, y: v});
        });

        var cancelledSales = {
            key: 'Cancelled sales',
            color: cancelledSalesColor,
            values: []
        };
        myData.push(cancelledSales);
        $.each(cancelledBuckets, function (b, dateBucket) {
            var v = dateBucket.doc_count;
            if (v == null) {
                v = 0;
            }
            cancelledSales.values.push({x: dateBucket.key, y: v});
        });


        nv.addGraph(function () {
            var chart = nv.models.multiBarChart()
                    .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(45)      //Angle to rotate x-axis labels.
                    .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.1)    //Distance between each group of bars.
                    ;

            chart.xAxis.tickFormat(function (d) {
                return d3.time.format('%x')(new Date(d))
            });

            chart.yAxis.tickFormat(d3.format(','));


            d3.select('#histo svg')
                    .datum(myData)
                    .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
    }

    function initAggrSelect() {
        $(document.body).on('click', '.btn-select-aggr', function (e) {
            e.preventDefault();

            flog('clicked on', e.target);
            var btn = $(this);
            var title = btn.html();
            searchOptions.aggr = btn.attr('href');
            searchOptions.filters = '';
            var uri = URI(window.location.pathname);
            uri.setSearch('filters', '');
            uri.setSearch('stage', '');
            history.pushState(null, null, uri.toString());
            btn.closest('div').find('.aggr-title').html(title);
            $('#funnel-wrap').attr('aggr-title', title);
            loadFunnel();
        });
    }

    function initDataTable() {
        flog('initDataTable', $('#leadTable'));
        var dataTable = $('#leadTable').DataTable({
            paging: false,
            ordering: false
        });

        $('#funnel-lead-query').on({
            input: function () {
                typewatch(function () {
                    var text = $('#funnel-lead-query').val().trim();

                    dataTable.search(text).draw();
                }, 500);
            }
        });

    }

    function appendTextToSVG(svgSelector, width, height, text) {
        var svg = d3.select('#' + svgSelector);
        svg.attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + $(svg[0]).parent().width() / 2 + "," + height / 2 + ")")
            .append("text")
            .attr("style", "font-size:35px")
            .attr("text-anchor", "middle")
            .text(text);
    }

    function initPies(aggs) {
        var reasonsAgg = aggs.summary.aggregations.cancelledReasons.buckets;
        var closedByOrgAgg = aggs.summary.aggregations.closedByOrg.orgId.buckets;
        var lostByOrgAgg = aggs.summary.aggregations.lostByOrg.orgId.buckets;
        var newLeadsgAgg = [aggs.summary.aggregations.newLeads];
        var cancelledAgg = aggs.summary.aggregations.cancelledReasons.buckets;
        var closedAgg = [aggs.summary.aggregations.closed];

        var colors = ['#ee145b', '#3e3e3e', '#4d9acc', '#60b87e', '#FF1493', '#FF4500', '#EE82EE', '#ADFF2F', '#FFDEAD', '#F0FFFF', '#FFF0F5', '#DC143C', '#FFC0CB'];
        flog('initPies', newLeadsgAgg);
        nv.addGraph(function () {
            var chartLost = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count
                    })
                    .valueFormat(d3.format(','))
                    .donut(true)
                    .color(colors)
                    .showLabels(false);

            d3.select('#lostReasonsPie svg')
                    .datum(reasonsAgg)
                    .transition().duration(1200)
                    .call(chartLost);

            var chartComponent = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .valueFormat(d3.format(','))
                    .donut(true)
                    .color(colors)
                    .showLabels(false)
                    .showLegend(false);

            d3.select('#newLeadsCreated svg').selectAll("*").remove();
            d3.select('#newLeadsCreated svg')
                    .datum(newLeadsgAgg)
                    .transition().duration(1200)
                    .call(chartComponent);

            appendTextToSVG("newLeadsCreated svg", 250, 281, newLeadsgAgg[0].doc_count);

            d3.select('#leadsLost svg').selectAll("*").remove();
            d3.select('#leadsLost svg').datum(cancelledAgg)
                    .transition().duration(1200)
                    .call(chartLost);
            var total = 0;
            for(var i = 0; i < cancelledAgg.length; i++){
                total += cancelledAgg[i].doc_count;
            }
            appendTextToSVG("leadsLost svg", 250, 281, total);

            d3.select('#leadsClosed svg').selectAll("*").remove();
            d3.select('#leadsClosed svg')
                    .datum(closedAgg)
                    .transition().duration(1200)
                    .call(chartComponent);

            appendTextToSVG("leadsClosed svg", 250, 281, closedAgg[0].doc_count);


            var chartClosedByOrg = nv.models.pieChart()
                    .x(function (d) {
                        return d.orgTitle.hits.hits[0]._source.assignedToOrg.title;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .valueFormat(d3.format(','))
                    .donut(true)
                    .color(colors)
                    .showLabels(false);

            d3.select('#closedByOrgPie svg').selectAll("*").remove();
            d3.select('#closedByOrgPie svg')
                    .datum(closedByOrgAgg)
                    .transition().duration(1200)
                    .call(chartClosedByOrg);

            var chartLostByOrg = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .valueFormat(d3.format(','))
                    .donut(true)
                    .color(colors)
                    .showLabels(false);

            d3.select('#conversionRatePie svg').selectAll("*").remove();
            d3.select('#conversionRatePie svg')
                    .datum(lostByOrgAgg)
                    .transition().duration(1200)
                    .call(chartLostByOrg);

            return chartLost;
        });
    }

    function initFunnelSource(div) {
        var fnSource = $('.funnel-source').clone().removeClass('hide');
        div.find('.funnel-labels').prepend(fnSource);
        var text = fnSource.find('.btn-select-aggr[href="' + searchOptions.aggr + '"]').text();
        fnSource.find('.aggr-title').text(text);
    }

    function initSourceFilters() {
        var uri = URI(window.location.href);
        var filters = uri.query(true).filters;
        var arr = filters && filters.split('=');
        if (arr && arr.length > 1 && arr[1]) {
            $('#funnelStages').append('<a href="#" class="btnClearFilters"><i class="fa fa-filter"></i> Clear all filters</a>');
        } else {
            $('#funnelStages').find('.btnClearFilters').remove();
        }
    }

    function initClearFilters() {
        $(document).on('click', '.btnClearFilters', function (e) {
            e.preventDefault();
            searchOptions.filters = '';
            var uri = URI(window.location.pathname);
            uri.setSearch('filters', '');
            uri.setSearch('stage', searchOptions.stage);
            history.pushState(null, null, uri.toString());
            loadFunnel();
            $('#leadsContainer').reloadFragment({
                url: uri.toString(),
                whenComplete: function () {
                    initDataTable();
                }
            });
        });
    }
    
    function initClearLeadsTableFilter() {
        $(document).on('click', '.btnClearFunnelLeadFilter', function () {
            $('#leadsContainer').reloadFragment({
                url: window.location.pathname,
                whenComplete: function () {
                    initDataTable();
                }
            });
        });
    }

    function initLeadManAnalytics() {
        initAggrSelect();
        initDataTable();
        initClearFilters();
        initFunnel()
        initClearLeadsTableFilter();
    }

    $(document).ready(function () {
        if ($('.lead-analytics-funnel-component').length > 0) {
            initLeadManAnalytics();
        }
    });

})(this, jQuery);