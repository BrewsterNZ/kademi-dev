$(document).ready(function(){
    function initOrgTypeAhead() {
        var modal = $('.profile-add-membership');
        if (!modal.length) return;
        modal.on('shown.bs.modal', function () {
           var groupName = modal.find('[name=groupName]').val();
            var orgSearch = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: '/'+groupName+'/signup?jsonQuery=%QUERY&th',
                    wildcard: '%QUERY'
                }
            });
            var orgTitleSearch = $('[name=orgTitleSearch]')
            orgTitleSearch.typeahead({
                highlight: true,
                cache: false
            }, {
                display: 'title',
                limit: 10,
                source: orgSearch,
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'No existing organisation were found.',
                        '</div>'
                    ].join('\n'),
                    suggestion: Handlebars.compile(
                        '<div>'
                        + '<strong>{{title}}</strong>'
                        + '</br>'
                        + '<span>{{phone}}</span>'
                        + '</br>'
                        + '<span>{{#if address}}{{address}}{{/if}} {{#if addressLine2}}{{#if address}},{{/if}}{{addressLine2}}{{/if}} {{#if addressState}}{{addressState}}{{/if}} {{#if postcode}}{{postcode}}{{/if}}</span>'
                        + '</div>')
                }
            });

            orgTitleSearch.bind('typeahead:select', function (ev, sug) {
                modal.find('input[name=orgId]').val(sug.orgId);
            });

            orgTitleSearch.attr('autocomplete', 'off');
        });
    }
    
    if($('.profile-details-component').length > 0) {
        initProfile();
        initOrgTypeAhead();
    }
});