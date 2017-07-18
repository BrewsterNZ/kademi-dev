(function (w) {

    var searchOptions = {
        team: [],
        query: '',
        leadType: null,
        tags: [],
        assignedTo: [],
        sources: []
    };

    var dataTable = null;
    var editor = null;
    var stages = [];

    function initDataTable(hits) {
        if (dataTable !== null) {
            dataTable.clear(false);
        }

        $('#leadBody').empty();

        editor = new $.fn.dataTable.Editor({
            ajax: {
                url: '/leads/?updateLead&leadId=_id_'
            },
            table: '#leadTable',
            idSrc: 'leadId',
            fields: [{
                label: 'Deal Amount',
                name: 'dealAmount'
            },
                {
                    label: 'Stage',
                    name: 'stageName',
                    type: 'select'
                },
                {
                    label: 'Source',
                    name: 'source',
                    type: 'select'
                },
                {
                    label: 'Assigned To',
                    name: 'assignedToProfile',
                    type: 'select',
                    data: 'assignedToProfile',
                    placeholder: 'Select an assignment',
                    optionsPair: {
                        label: 'name',
                        value: 'userId'
                    },
                    def: 'NONE'
                }
            ]
        });

        dataTable = $('#leadTable').DataTable({
            paging: false,
            searching: false,
            destroy: true,
            info: false,
            select: true,
            order: [
                [7, 'desc']
            ],
            columns: [
                {
                    data: 'organisation.title',
                    name: 'orgTitle',
                    defaultContent: ""
                },
                {
                    data: 'profile.firstName',
                    defaultContent: ""
                },
                {
                    data: 'profile.surName',
                    defaultContent: ""
                },
                {
                    data: 'profile.email',
                    defaultContent: ""
                },
                {
                    data: 'stageName',
                    defaultContent: "",
                    className: 'editable'
                },
                {
                    data: 'source',
                    defaultContent: "",
                    className: 'editable'
                },
                {
                    data: 'dealAmount',
                    defaultContent: "",
                    className: 'editable'
                },
                {
                    data: 'assignedToProfile',
                    defaultContent: "",
                    className: 'editable',
                    render: function (d, type) {
                        flog('Render Profile', d, type);
                        if (typeof d !== 'undefined' && d !== null) {
                            switch (type) {
                                case "type":
                                case "sort":
                                {
                                    return d.userId;
                                    break;
                                }
                                case "display":
                                {
                                    if (d.firstName && d.firstName.trim().length > 0) {
                                        var f = d.firstName || '';
                                        var s = d.surName || '';
                                        return (f + ' ' + s).trim();
                                    } else if (d.nickName) {
                                        return d.nickName.trim();
                                    }
                                }
                                default:
                                    return d.name;
                            }
                        }
                        return d;
                    }
                },
                {
                    data: 'createdDate',
                    defaultContent: "",
                    render: function (d) {
                        if (typeof d !== 'undefined' && d !== null) {
                            return moment(d).format('DD/MM/YYYY') + '<br/>' + moment(d).format('h:mm:ss a');
                        }
                        return '';
                    }
                },
                {
                    data: 'leadId',
                    "orderable": false,
                    render: function (data, type, full, meta) {
                        flog(data, type, full, meta);
                        return '<a class="btn btn-info" href="' + data + '"><i class="fa fa-eye"></i></a>';
                    }
                }
            ]
        });

        $('#leadTable').on('focus', 'tbody td select[id^=DTE_Field_]', function () {
            var field = $(this);
            var td = field.closest('td');
            var fieldName = field.attr('id');

            if (fieldName !== null && typeof fieldName !== 'undefined') {
                fieldName = field.attr('id').replace('DTE_Field_', '');
                var row = dataTable.row(td[0]);
                var leadId = row.data().leadId;
                switch (fieldName) {
                    case "stageName":
                        loadStageNames(leadId);
                        break;
                    case "source":
                        loadSources(leadId);
                        break;
                }
            }
        });

        $('#leadTable').on('click', 'tbody td', function (e) {

            editor.inline(this, {
                submitOnBlur: true
            });
        });

        for (var i = 0; i < hits.hits.length; i++) {
            var hit = hits.hits[i];
            var _source = hit._source;
            dataTable.row.add(_source);
        }

        $.ajax({
            url: '/leads/?teamUsers',
            dataType: 'json'
        }).done(function (data) {
            if (data.status) {
                data.data.push({
                    name: "Clear assignment",
                    userId: 0
                });
                editor.field('assignedToProfile').update(data.data);
            }
        });

        editor.on('submitComplete', function (e, json, data) {
            doSearch();
        });

        dataTable.draw();
    }


    function loadStageNames(leadId) {
        $.ajax({
            url: '/leads/?stageNames=' + leadId,
            dataType: 'json'
        }).done(function (data) {
            if (data.status) {
                var stages = [];
                $.each(data.data, function (i, el) {
                    if ($.inArray(el.name, stages) === -1) {
                        stages.push(el.name);
                    }
                });
                flog('Stages', stages);
                editor.field('stageName').update(stages);
            }
        });
    }

    function loadSources(leadId) {
        $.ajax({
            url: '/leads/?sourceNames=' + leadId,
            dataType: 'json'
        }).done(function (data) {
            if (data.status) {
                var sources = [];
                $.each(data.data, function (i, el) {
                    if ($.inArray(el, stages) === -1) {
                        sources.push(el);
                    }
                });
                flog('Sources', sources);
                editor.field('source').update(sources);
            }
        });
    }

    function initOrgSelect() {
        $('body').on('click', '.btn-select-org', function (e) {
            e.preventDefault();

            var btn = $(this);
            var b = btn.closest('div').find('.aggr-title');
            b.html(btn.html());

            var href = btn.attr('href');
            if (href === '#') {
                searchOptions.team = null;
            } else {
                searchOptions.team = href;
            }

            doSearch();
        });
    }

    function initDropdownFilter() {
        $('.leadDropFilter ul li').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var filterName = $(this).find('a').attr('data-filter');
            $(this).find('a').toggleClass('filterSelected');
            $(this).find('i').toggleClass('hide');
            var groupId = $(this).find('a').attr('href');
            if (searchOptions.hasOwnProperty(filterName) && Array.isArray(searchOptions[filterName])) {
                var index = searchOptions[filterName].indexOf(groupId);
                if ($(this).find('a').hasClass('filterSelected')) {
                    if (index === -1) {
                        searchOptions[filterName].push(groupId);
                    }
                } else {
                    if (index !== -1) {
                        searchOptions[filterName].splice(index, 1);
                    }
                }
                doSearch();
            }

        });
    }

    function initSearchFromQuery() {
        if (w.searchOptions) {
            searchOptions.query = w.searchOptions.query;
            if (w.searchOptions.tags) {
                searchOptions.tags = w.searchOptions.tags.split(',');
            }
            if (w.searchOptions.sources) {
                searchOptions.sources = w.searchOptions.sources.split(',');
            }
            if (w.searchOptions.team) {
                searchOptions.team = w.searchOptions.team.split(',');
            }
            if (w.searchOptions.assignedTo) {
                searchOptions.assignedTo = w.searchOptions.assignedTo.split(',');
            }
            if (w.searchOptions.leadType) {
                searchOptions.leadType = w.searchOptions.leadType;
            } else {
                searchOptions.leadType = 'active';
            }
        }
    }

    function updateUrl() {
        var uri = URI(w.location);
        for (var key in searchOptions) {
            uri.setSearch(key, searchOptions[key]);
        }

        history.pushState(null, null, uri.toString());
    }

    function initSearchField() {

        var txt = $('#leadQuery');
        txt.on({
            input: function () {
                typewatch(function () {
                    var text = txt.val().trim();

                    searchOptions.query = text;
                    doSearch();

                }, 500);
            }
        });

        var clearBtn = $('#lead-query-clear');
        clearBtn.on('click', function (e) {
            e.preventDefault();
            txt.val('');
            searchOptions.query = '';
            doSearch();
        });
    }

    function initLeadTypeSelect() {
        $('body').on('change', 'input[name=leadType]', function (e) {
            var btn = $(this);
            var type = btn.attr('id');
            searchOptions.leadType = type;

            doSearch();
        });
    }

    function doSearch() {
        $.ajax({
            url: window.location.pathname + '?sLead&' + $.param(searchOptions),
            dataType: 'JSON',
            success: function (resp, textStatus, jqXHR) {
                if (resp.data.aggrs && resp.data.aggrs.aggregations.states.buckets) {
                    var states = resp.data.aggrs.aggregations.states.buckets;
                    var activeCount = 0; // Active
                    var closedCount = 0; // Won
                    var cancelledCount = 0; // Lost
                    for (var i = 0; i < states.length; i++) {
                        if (states[i].key === 'Active') {
                            activeCount = states[i].doc_count;
                        }
                        if (states[i].key === 'Won') {
                            closedCount = states[i].doc_count;
                        }
                        if (states[i].key === 'Lost') {
                            cancelledCount = states[i].doc_count;
                        }
                    }
                    $('#closedLeadTotal').html(closedCount);
                    $('#activeLeadTotal').html(activeCount);
                    $('#cancelledLeadTotal').html(cancelledCount);
                }
                //$('#LeadSumValue').html(data.aggregations.dealAmountTotal.value || 0);
                //var avgAmount = data.aggregations.dealAmountAvg.value || 0;
                //if (avgAmount > 0) {
                //    avgAmount = new Number(avgAmount).toFixed(0);
                //}
                //$('#leadAvgValue').html(avgAmount);

                //updateSourcesPie(data.aggregations.sources.buckets);
                //updateStagesPie(data.aggregations.stages.buckets);
                initDataTable(resp.data.results.hits);
                updateUrl();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('error', jqXHR, textStatus, errorThrown);
            }
        });
    }

    function updateSourcesPie(buckets) {
        $('#sourcesPie svg').empty();

        nv.addGraph(function () {
            var chart = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .showLabels(false)
                    .showLegend(false)
                    .margin({
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    })
                    .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                    .labelType("value")   //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                    .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                ;

            d3.select("#sourcesPie svg")
                .datum(buckets)
                .transition().duration(350)
                .call(chart);

            return chart;
        });
    }

    function updateStagesPie(buckets) {
        $('#stagesPie svg').empty();
        //Donut chart
        nv.addGraph(function () {
            var chart = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .showLabels(false)
                    .showLegend(false)
                    .margin({
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    })
                    .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                    .labelType("value")   //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                    .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                ;

            d3.select("#stagesPie svg")
                .datum(buckets)
                .transition().duration(350)
                .call(chart);

            return chart;
        });
    }

    w.initLeadManPage = function () {
        Handlebars.registerHelper('NotEmpty', function (conditional, options) {
            if (typeof conditional !== 'undefined' && typeof conditional.length !== 'undefined') {
                if (conditional.length > 0) {
                    return options.fn(this);
                }
            }
            return options.inverse(this);
        });

        Handlebars.registerHelper('formatTime', function (object) {
            var d = new moment(object);

            return d.format('MMMM Do YYYY, h:mm:ss a');
        });

        initSearchField();
        initLeadTypeSelect();
        initDropdownFilter();
        initSearchFromQuery();
        doSearch();
    };

    w.doSearchLeadmanPage = function () {
        searchOptions.query = '';
        doSearch();
    };

})(this);