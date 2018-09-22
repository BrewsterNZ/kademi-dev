$(function () {
    function initOrgSelector() {
        flog("initOrgSelector");

        $('.orgSelectorWrap').off('click', '.btn-reporting-clear-selected-org')
                .on('click', '.btn-reporting-clear-selected-org', function (e) {
                    e.preventDefault();

                    $.cookie('selectedOrg', "", {expires: 360, path: '/'});
                    orgTitle = "";

                    $(e.target).closest(".org-selector").find(".selectOrgSearch").val(orgTitle);
                    window.location.reload();
                });

        $('.orgSelectorWrap').on('click', 'a:not(.btn-reporting-clear-selected-org)', function (e) {
            e.preventDefault();
            var orgId = $(this).attr('data-orgId');
            var orgTitle;

            if (orgId) {
                orgTitle = $(this).find('small').text().trim();
                $.cookie('selectedOrg', orgId, {expires: 360, path: '/'});
            } else {
                $.cookie('selectedOrg', "", {expires: 360, path: '/'});
                orgTitle = "";
            }
            $(e.target).closest(".org-selector").find(".selectOrgSearch").val(orgTitle);
            window.location.reload();
        });

        $('.orgSelectorWrap').on('click', '.btn-select-org-selector', function (e) {
            var btn = $(this);

            var dropdownMenuOrgSelector = btn.next('.dropdownMenuOrgSelector');

            if (!dropdownMenuOrgSelector.data('loaded')) {
                dropdownMenuOrgSelector.data('loaded', true);

                var groupNames = dropdownMenuOrgSelector.data('groupnames');
                var numOrgs = btn.parents('.org-selector').attr('data-numOrgs');
                dropdownMenuOrgSelector.load('/queries?browseOrgs&numOrgs='+numOrgs+'&groupNames=' + encodeURIComponent(groupNames));
            }
        });
    }


    function initOrgSelectorSearch() {
        var orgSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/queries/?searchOrgs=%QUERY',
                wildcard: '%QUERY'
            }
        });

        $('.selectOrgSearch').typeahead({
            highlight: true
        }, {
            display: 'title',
            limit: 10,
            source: orgSearch,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No existing stores were found.',
                    '</div>'
                ].join('\n'),
                suggestion: Handlebars.compile(
                        '<div>'
                        + '<strong>{{title}}</strong>'
                        + '</div>')
            }
        });

        $('.selectOrgSearch').bind('typeahead:select', function (ev, sug) {
            $.cookie('selectedOrg', sug.orgId, {expires: 360, path: '/'});
            window.location.reload();
        });
    }

    try {
        initOrgSelector();
        initOrgSelectorSearch();
    } catch (e) {
        flog("EXCEPTION: initialising org selection " + e);
    }
});